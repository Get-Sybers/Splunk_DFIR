"""Volatility 3 output renderer: flat JSON Lines for the DFIR pipeline.

`-r jsonl_dfir` — emits ONE JSON object per TreeGrid node, not per tree-root the
way the built-in `JSONL` (JsonLinesRenderer) does. The built-in keeps the tree
nesting (`__children`), so a `pstree` line is a whole subtree; this flattens it,
so every process / connection / handle / artifact is a single ingest-ready line
carrying its columns plus a `tree_depth` (0 = root). One row = one line, which is
exactly what the ingest wants.

Registration: Volatility 3 auto-discovers every `CLIRenderer` subclass that has
been imported (`framework.class_subclasses`), so importing this module before the
CLI runs adds `jsonl_dfir` to `-r` — no core patch. scripts/process-volatility.sh
loads it via a small import wrapper, the same pattern as the Plaso l2t_json_dfir
output module.

The pipeline wrapper — {SourceImage, Parser="volatility/<plugin>", Timestamp} —
is added at INGEST time (which knows the dump path and the plugin), not here: a
renderer only sees the TreeGrid, not the memory file or plugin name, exactly as
the Plaso split is between the module and the loader.
"""
import json
import sys

from volatility3.cli import text_renderer
from volatility3.framework import interfaces


class JsonLinesDfirRenderer(text_renderer.JsonRenderer):
    """Flat JSON Lines — one object per node, with tree_depth."""

    name = "jsonl_dfir"
    structured_output = True

    def output_result(self, outfd, result):
        """Writes each row dict as its own JSON line."""
        for row in result:
            outfd.write(json.dumps(row, sort_keys=True, default=str))
            outfd.write("\n")

    def render(self, grid: interfaces.renderers.TreeGrid):
        rows = []
        ignore_columns = self.ignored_columns(grid)

        def visitor(node, accumulator):
            row = {"tree_depth": node.path_depth}
            for column_index, column in enumerate(grid.columns):
                if column in ignore_columns:
                    continue
                value = node.values[column_index]
                if isinstance(value, interfaces.renderers.BaseAbsentValue):
                    data = None
                else:
                    renderer = self._type_renderers.get(
                        column.type, self._type_renderers["default"])
                    data = renderer(value)
                row[column.name] = data

            if self.filter and self.filter.filter(
                    [row.get(c.name) for c in grid.columns if c not in ignore_columns]):
                return accumulator

            accumulator.append(row)
            return accumulator

        if not grid.populated:
            grid.populate(visitor, rows)
        else:
            grid.visit(node=None, function=visitor, initial_accumulator=rows)

        self.output_result(sys.stdout, rows)
