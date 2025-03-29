#!/usr/bin/env python
# encoding: utf-8

import os
import sys
import yaml
import json
import logging
from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s', 
                    filename='$SPLUNK_HOME/var/log/splunk/car_search.log', filemode='a')
logger = logging.getLogger('car_search')

@Configuration()
class CARSearchCommand(GeneratingCommand):
    """
    A custom Splunk command that searches CAR (Cyber Analytics Repository) YAML files.
    
    ##Syntax
    
    .. code-block::
        | carfind [id=<CAR-ID>] [technique=<technique>] [platform=<platform>] [title=<title_keywords>]
    
    ##Description
    
    Search through CAR analytics rules stored as YAML files.
    """
    
    id = Option(
        doc='''
        **Syntax:** **id=***<CAR-ID>*
        **Description:** Search for a specific CAR ID (e.g., CAR-2022-03-001)''',
        require=False, default=None)
    
    technique = Option(
        doc='''
        **Syntax:** **technique=***<MITRE-technique>*
        **Description:** Search for a specific MITRE ATT&CK technique (e.g., T1562)''',
        require=False, default=None)
    
    platform = Option(
        doc='''
        **Syntax:** **platform=***<platform>*
        **Description:** Filter by platform (e.g., Windows, Linux)''',
        require=False, default=None)
    
    title = Option(
        doc='''
        **Syntax:** **title=***<keywords>*
        **Description:** Search in the title field''',
        require=False, default=None)

    def generate(self):
        try:
            # Determine the app directory (assumes script is in app/bin)
            script_dir = os.path.dirname(os.path.abspath(__file__))
            app_dir = os.path.dirname(script_dir)
            
            # Location of CAR rules
            car_dir = os.path.join(app_dir, 'car_analytics')
            if not os.path.exists(car_dir):
                # Try another common location
                car_dir = os.path.join(app_dir, 'data', 'car_analytics')
                if not os.path.exists(car_dir):
                    yield {'error': f"CAR rules directory not found in app"}
                    return
            
            yaml_extensions = ['.yaml', '.yml']
            for root, dirs, files in os.walk(car_dir):
                for file in files:
                    if any(file.lower().endswith(ext) for ext in yaml_extensions):
                        file_path = os.path.join(root, file)
                        try:
                            # Parse the YAML file
                            with open(file_path, 'r', encoding='utf-8') as f:
                                car_rule = yaml.safe_load(f)
                            
                            # Skip if not a proper CAR rule
                            if not isinstance(car_rule, dict) or 'id' not in car_rule:
                                continue
                            
                            # Apply filters
                            if self.id and car_rule.get('id', '').lower() != self.id.lower():
                                continue
                                
                            if self.title and self.title.lower() not in car_rule.get('title', '').lower():
                                continue
                                
                            if self.platform:
                                platforms = car_rule.get('platforms', [])
                                if not platforms or self.platform not in platforms:
                                    continue
                            
                            if self.technique:
                                # Check coverage section for technique
                                found = False
                                coverage = car_rule.get('coverage', {})
                                
                                # Direct technique match
                                if coverage.get('technique') == self.technique:
                                    found = True
                                    
                                # Check in techniques array if it exists
                                techniques = coverage.get('techniques', [])
                                if self.technique in techniques:
                                    found = True
                                
                                # Check in subtechniques if they exist
                                subtechniques = coverage.get('subtechniques', [])
                                if self.technique in subtechniques:
                                    found = True
                                    
                                if not found:
                                    continue
                            
                            # Prepare result record
                            record = {
                                '_file': file,
                                '_path': file_path
                            }
                            
                            # Add CAR rule fields
                            for key, value in car_rule.items():
                                if isinstance(value, (dict, list)):
                                    record[key] = json.dumps(value)
                                else:
                                    record[key] = value
                            
                            # Add implementations if available
                            implementations = car_rule.get('implementations', [])
                            if implementations:
                                record['_implementations_count'] = len(implementations)
                                for i, impl in enumerate(implementations):
                                    if 'type' in impl:
                                        record[f'implementation_{i}_type'] = impl['type']
                                    if 'code' in impl:
                                        record[f'implementation_{i}_code'] = impl['code']
                            
                            yield record
                            
                        except Exception as e:
                            logger.error(f"Error processing CAR rule {file_path}: {str(e)}")
                            yield {
                                '_file': file,
                                '_path': file_path, 
                                'error': str(e)
                            }
        
        except Exception as e:
            logger.error(f"General error: {str(e)}")
            yield {'error': str(e)}

dispatch(CARSearchCommand, sys.argv, sys.stdin, sys.stdout, __name__)