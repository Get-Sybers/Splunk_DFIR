#!/usr/bin/env python
# encoding: utf-8

import os
import sys
import yaml
import json
import re
import logging
from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s', 
                    filename='$SPLUNK_HOME/var/log/splunk/yaml_search.log', filemode='a')
logger = logging.getLogger('yaml_search')

@Configuration()
class YAMLSearchCommand(GeneratingCommand):
    """
    A custom Splunk command that searches YAML files stored in your Splunk app.
    
    ##Syntax
    
    .. code-block::
        | yamlfind app=<app_name> path=<relative_path> [fields="field1,field2"] [where="field=value"]
    
    ##Description
    
    Search YAML files stored within a Splunk app directory.
    """
    
    app = Option(
        doc='''
        **Syntax:** **app=***<app_name>*
        **Description:** Splunk app name where YAML files are stored''',
        require=True)
    
    path = Option(
        doc='''
        **Syntax:** **path=***<relative_path>*
        **Description:** Relative path within the app where YAML files are stored''',
        require=True)
    
    fields = Option(
        doc='''
        **Syntax:** **fields=***<comma_separated_fields>*
        **Description:** Specific fields to return (comma-separated, default is all)''',
        require=False, default="*")
    
    where = Option(
        doc='''
        **Syntax:** **where=***<field_name>=<value>*
        **Description:** Simple search filter in the format field=value''',
        require=False, default=None)

    def generate(self):
        try:
            # Construct the full path to the YAML directory
            splunk_home = os.environ.get('SPLUNK_HOME', '/opt/splunk')
            yaml_dir = os.path.join(splunk_home, 'etc', 'apps', self.app, self.path)
            
            if not os.path.exists(yaml_dir):
                yield {'error': f"Directory not found: {yaml_dir}"}
                return
            
            # Parse the where clause if provided
            where_field = None
            where_value = None
            if self.where:
                where_parts = self.where.split('=', 1)
                if len(where_parts) == 2:
                    where_field = where_parts[0].strip()
                    where_value = where_parts[1].strip()
                    # Remove quotes if present
                    if where_value.startswith('"') and where_value.endswith('"'):
                        where_value = where_value[1:-1]
                    if where_value.startswith("'") and where_value.endswith("'"):
                        where_value = where_value[1:-1]
            
            # Determine which fields to return
            specific_fields = None
            if self.fields and self.fields != "*":
                specific_fields = [f.strip() for f in self.fields.split(',')]
            
            # Scan for YAML files
            yaml_extensions = ['.yaml', '.yml']
            for root, dirs, files in os.walk(yaml_dir):
                for file in files:
                    if any(file.lower().endswith(ext) for ext in yaml_extensions):
                        file_path = os.path.join(root, file)
                        try:
                            # Parse the YAML file
                            with open(file_path, 'r', encoding='utf-8') as f:
                                yaml_data = yaml.safe_load(f)
                            
                            # Skip if it's not a dict
                            if not isinstance(yaml_data, dict):
                                continue
                            
                            # Apply where filter if specified
                            if where_field and where_value:
                                if where_field not in yaml_data or str(yaml_data[where_field]) != where_value:
                                    if not self._deep_search(yaml_data, where_field, where_value):
                                        continue
                            
                            # Create result record
                            record = {
                                '_file': file,
                                '_path': file_path,
                                '_app': self.app
                            }
                            
                            # Add requested YAML fields
                            if specific_fields:
                                for field in specific_fields:
                                    if field in yaml_data:
                                        record[field] = yaml_data[field]
                                    else:
                                        # Try deep search for nested fields
                                        value = self._get_nested_field(yaml_data, field)
                                        if value is not None:
                                            record[field] = value
                            else:
                                # Add all fields if no specific fields requested
                                for key, value in yaml_data.items():
                                    if isinstance(value, (dict, list)):
                                        record[key] = json.dumps(value)
                                    else:
                                        record[key] = value
                            
                            yield record
                            
                        except Exception as e:
                            logger.error(f"Error processing YAML file {file_path}: {str(e)}")
                            yield {
                                '_file': file,
                                '_path': file_path, 
                                'error': str(e)
                            }
        
        except Exception as e:
            logger.error(f"General error: {str(e)}")
            yield {'error': str(e)}

    def _deep_search(self, data, field, value):
        """Recursively search for field=value in nested structures"""
        if isinstance(data, dict):
            for k, v in data.items():
                if k == field and str(v) == value:
                    return True
                if isinstance(v, (dict, list)):
                    if self._deep_search(v, field, value):
                        return True
        elif isinstance(data, list):
            for item in data:
                if isinstance(item, (dict, list)):
                    if self._deep_search(item, field, value):
                        return True
        return False
    
    def _get_nested_field(self, data, field_path):
        """Get value from a nested field specified by dot notation (e.g., 'a.b.c')"""
        parts = field_path.split('.')
        current = data
        
        for part in parts:
            # Handle array indexing
            match = re.match(r'(\w+)\[(\d+)\]', part)
            if match:
                name, index = match.groups()
                index = int(index)
                if name in current and isinstance(current[name], list) and index < len(current[name]):
                    current = current[name][index]
                else:
                    return None
            elif isinstance(current, dict) and part in current:
                current = current[part]
            else:
                return None
                
        return current

dispatch(YAMLSearchCommand, sys.argv, sys.stdin, sys.stdout, __name__)