# tsv output altering
root@a3cb234b3684:/# zeek-cut --h

zeek-cut [options] [<columns>]

Extracts the given columns from ASCII Zeek logs on standard input, and outputs
them to standard output. If no columns are given, all are selected.
By default, zeek-cut does not include format header blocks in the output.

Example: cat conn.log | zeek-cut -d ts id.orig_h id.orig_p

    -c       Include the first format header block in the output.
    -C       Include all format header blocks in the output.
    -m       Include the first format header blocks in the output in minimal view.
    -M       Include all format header blocks in the output in minimal view.
    -d       Convert time values into human-readable format.
    -D <fmt> Like -d, but specify format for time (see strftime(3) for syntax).
    -F <ofs> Sets a different output field separator character.
    -h       Show help.
    -n       Print all fields *except* those specified.
    -u       Like -d, but print timestamps in UTC instead of local time.
    -U <fmt> Like -D, but print timestamps in UTC instead of local time.

For time conversion option -d or -u, the format string can be specified by
setting an environment variable ZEEK_CUT_TIMEFMT.

# json altering
root@a3cb234b3684:/# jq -h
jq - commandline JSON processor [version 1.6]

Usage:  jq [options] <jq filter> [file...]
        jq [options] --args <jq filter> [strings...]
        jq [options] --jsonargs <jq filter> [JSON_TEXTS...]

jq is a tool for processing JSON inputs, applying the given filter to
its JSON text inputs and producing the filter's results as JSON on
standard output.

The simplest filter is ., which copies jq's input to its output
unmodified (except for formatting, but note that IEEE754 is used
for number representation internally, with all that that implies).

For more advanced filters see the jq(1) manpage ("man jq")
and/or https://stedolan.github.io/jq

Example:

        $ echo '{"foo": 0}' | jq .
        {
                "foo": 0
        }

Some of the options include:
  -c               compact instead of pretty-printed output;
  -n               use `null` as the single input value;
  -e               set the exit status code based on the output;
  -s               read (slurp) all inputs into an array; apply filter to it;
  -r               output raw strings, not JSON texts;
  -R               read raw strings, not JSON texts;
  -C               colorize JSON;
  -M               monochrome (don't colorize JSON);
  -S               sort keys of objects on output;
  --tab            use tabs for indentation;
  --arg a v        set variable $a to value <v>;
  --argjson a v    set variable $a to JSON value <v>;
  --slurpfile a f  set variable $a to an array of JSON texts read from <f>;
  --rawfile a f    set variable $a to a string consisting of the contents of <f>;
  --args           remaining arguments are string arguments, not files;
  --jsonargs       remaining arguments are JSON arguments, not files;
  --               terminates argument processing;

Named arguments are also available as $ARGS.named[], while
positional arguments are available as $ARGS.positional[].

See the manpage for more options.
