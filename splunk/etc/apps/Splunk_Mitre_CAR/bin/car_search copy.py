#!/usr/bin/env python
# encoding: utf-8

import os
import sys
import yaml
import json
from datetime import datetime
from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators

@Configuration()
class CARSearchCommand(GeneratingCommand):
    """
    A custom Splunk command that searches CAR (Cyber Analytics Repository) YAML files
    according to the complete schema structure with field names that match the schema.
    
    ##Syntax
    
    .. code-block::
        | carfind [id=<CAR-ID>] [technique=<technique>] [subtechnique=<subtechnique>] 
                 [tactic=<tactic>] [platform=<platform>] [title=<title>] 
                 [type=<analytic_type>] [subtype=<subtype>] [contributor=<contributor>]
                 [information_domain=<domain>] [d3fend_id=<id>]
                 [daterange=<start_date>..<end_date>] [implementation_type=<type>]
                 [data_model=<data_model>] [test_description=<description>]
                 [true_positive_source=<source>] [code_contains=<text>]
    
    ##Description
    
    Search through CAR analytics rules stored as YAML files based on the complete schema.
    """
    
    # Basic fields
    id = Option(
        doc='''
        **Syntax:** **id=***<CAR-ID>*
        **Description:** Search for a specific CAR ID (e.g., CAR-2022-03-001)''',
        require=False, default=None)
    
    title = Option(
        doc='''
        **Syntax:** **title=***<keywords>*
        **Description:** Search in the title field''',
        require=False, default=None)
        
    information_domain = Option(
        doc='''
        **Syntax:** **information_domain=***<domain>*
        **Description:** Filter by information domain (e.g., Host, Network)''',
        require=False, default=None)

    # List fields        
    platform = Option(
        doc='''
        **Syntax:** **platform=***<platform>*
        **Description:** Filter by platform (e.g., Windows, Linux)''',
        require=False, default=None)
        
    type = Option(
        doc='''
        **Syntax:** **type=***<analytic_type>*
        **Description:** Filter by analytic type (e.g., TTP, Situational Awareness)''',
        require=False, default=None)
        
    subtype = Option(
        doc='''
        **Syntax:** **subtype=***<subtype>*
        **Description:** Filter by subtype (e.g., Process, Network)''',
        require=False, default=None)
        
    contributor = Option(
        doc='''
        **Syntax:** **contributor=***<contributor>*
        **Description:** Filter by contributor name''',
        require=False, default=None)
        
    data_model_reference = Option(
        doc='''
        **Syntax:** **data_model_reference=***<reference>*
        **Description:** Filter by data model reference''',
        require=False, default=None)
        
    reference = Option(
        doc='''
        **Syntax:** **reference=***<reference>*
        **Description:** Filter by reference''',
        require=False, default=None)

    # Date fields
    daterange = Option(
        doc='''
        **Syntax:** **daterange=***<start_date>..<end_date>*
        **Description:** Filter by submission or update date range (format: YYYY/MM/DD)''',
        require=False, default=None)

    # Coverage fields
    technique = Option(
        doc='''
        **Syntax:** **technique=***<MITRE-technique>*
        **Description:** Search for a specific MITRE ATT&CK technique (e.g., T1562)''',
        require=False, default=None)
        
    subtechnique = Option(
        doc='''
        **Syntax:** **subtechnique=***<MITRE-subtechnique>*
        **Description:** Search for a specific MITRE ATT&CK subtechnique (e.g., T1562.002)''',
        require=False, default=None)
    
    tactic = Option(
        doc='''
        **Syntax:** **tactic=***<MITRE-tactic>*
        **Description:** Search for a specific MITRE ATT&CK tactic (e.g., TA0005)''',
        require=False, default=None)
        
    coverage_level = Option(
        doc='''
        **Syntax:** **coverage_level=***<level>*
        **Description:** Filter by coverage level (e.g., Moderate, High)''',
        require=False, default=None)

    # Implementation fields
    implementation_type = Option(
        doc='''
        **Syntax:** **implementation_type=***<type>*
        **Description:** Filter by implementation type (e.g., Pseudocode, Splunk, LogPoint)''',
        require=False, default=None)
        
    implementation_name = Option(
        doc='''
        **Syntax:** **implementation_name=***<name>*
        **Description:** Filter by implementation name''',
        require=False, default=None)
        
    data_model = Option(
        doc='''
        **Syntax:** **data_model=***<data_model>*
        **Description:** Filter by implementation data model''',
        require=False, default=None)
        
    code_contains = Option(
        doc='''
        **Syntax:** **code_contains=***<text>*
        **Description:** Search for text in implementation code''',
        require=False, default=None)

    # Unit test fields
    test_description = Option(
        doc='''
        **Syntax:** **test_description=***<description>*
        **Description:** Filter by unit test description''',
        require=False, default=None)

    # True positive fields
    true_positive_source = Option(
        doc='''
        **Syntax:** **true_positive_source=***<source>*
        **Description:** Filter by true positive source''',
        require=False, default=None)

    # D3FEND mappings
    d3fend_id = Option(
        doc='''
        **Syntax:** **d3fend_id=***<id>*
        **Description:** Filter by D3FEND ID (e.g., D3-PSA)''',
        require=False, default=None)
        
    d3fend_label = Option(
        doc='''
        **Syntax:** **d3fend_label=***<label>*
        **Description:** Filter by D3FEND mapping label''',
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
                    yield {'error': "CAR rules directory not found in app"}
                    return
            
            # Parse date range if provided
            start_date = None
            end_date = None
            if self.daterange:
                date_parts = self.daterange.split('..')
                if len(date_parts) == 2:
                    try:
                        if date_parts[0]:
                            start_date = datetime.strptime(date_parts[0], '%Y/%m/%d')
                        if date_parts[1]:
                            end_date = datetime.strptime(date_parts[1], '%Y/%m/%d')
                    except ValueError:
                        yield {'error': "Invalid date format. Use YYYY/MM/DD..YYYY/MM/DD"}
                        return
            
            yaml_extensions = ['.yaml', '.yml']
            for file in os.listdir(car_dir):
                if any(file.lower().endswith(ext) for ext in yaml_extensions):
                    file_path = os.path.join(car_dir, file)
                    
                    # Skip directories
                    if os.path.isdir(file_path):
                        continue
                    
                    try:
                        # Parse the YAML file
                        with open(file_path, 'r', encoding='utf-8') as f:
                            car_rule = yaml.safe_load(f)
                        
                        # Skip if not a proper CAR rule
                        if not isinstance(car_rule, dict) or 'id' not in car_rule:
                            continue
                        
                        # Apply basic field filters
                        if self.id and self.id.lower() not in car_rule.get('id', '').lower():
                            continue
                                
                        if self.title and self.title.lower() not in car_rule.get('title', '').lower():
                            continue
                        
                        if (self.information_domain and 
                            self.information_domain.lower() != car_rule.get('information_domain', '').lower()):
                            continue
                                
                        # Apply list field filters
                        if self.platform:
                            platforms = car_rule.get('platforms', [])
                            if not platforms or not any(
                                self.platform.lower() in p.lower() for p in platforms):
                                continue
                        
                        if self.subtype:
                            subtypes = car_rule.get('subtypes', [])
                            if not subtypes or not any(
                                self.subtype.lower() in s.lower() for s in subtypes):
                                continue
                        
                        if self.type:
                            analytic_types = car_rule.get('analytic_types', [])
                            if not analytic_types or not any(
                                self.type.lower() in t.lower() for t in analytic_types):
                                continue
                        
                        if self.contributor:
                            contributors = car_rule.get('contributors', [])
                            if not contributors or not any(
                                self.contributor.lower() in c.lower() for c in contributors):
                                continue
                        
                        if self.data_model_reference:
                            references = car_rule.get('data_model_references', [])
                            if not references or not any(
                                self.data_model_reference.lower() in r.lower() for r in references):
                                continue
                                
                        if self.reference:
                            references = car_rule.get('references', [])
                            if not references or not any(
                                self.reference.lower() in r.lower() for r in references):
                                continue
                        
                        # Apply date filters
                        if start_date or end_date:
                            submission_date_str = car_rule.get('submission_date')
                            update_date_str = car_rule.get('update_date')
                            
                            # Parse the dates
                            submission_date = None
                            update_date = None
                            
                            if submission_date_str:
                                try:
                                    submission_date = datetime.strptime(submission_date_str, '%Y/%m/%d')
                                except ValueError:
                                    pass
                            
                            if update_date_str:
                                try:
                                    update_date = datetime.strptime(update_date_str, '%Y/%m/%d')
                                except ValueError:
                                    pass
                            
                            # Check if dates are within range
                            if start_date:
                                if submission_date and submission_date < start_date:
                                    if not (update_date and update_date >= start_date):
                                        continue
                            
                            if end_date:
                                if submission_date and submission_date > end_date:
                                    continue
                        
                        # Apply coverage filters
                        coverage_match = True
                        if self.technique or self.subtechnique or self.tactic or self.coverage_level:
                            coverage_items = car_rule.get('coverage', [])
                            if not coverage_items:
                                coverage_match = False
                            else:
                                found_match = False
                                for item in coverage_items:
                                    # Track if this coverage item matches all filters
                                    item_matches = True
                                    
                                    # Check technique match
                                    if self.technique:
                                        if item.get('technique') != self.technique:
                                            item_matches = False
                                    
                                    # Check subtechnique match
                                    if self.subtechnique and item_matches:
                                        subtechniques = item.get('subtechniques', [])
                                        if self.subtechnique not in subtechniques:
                                            item_matches = False
                                    
                                    # Check tactic match
                                    if self.tactic and item_matches:
                                        tactics = item.get('tactics', [])
                                        if self.tactic not in tactics:
                                            item_matches = False
                                    
                                    # Check coverage level match
                                    if self.coverage_level and item_matches:
                                        if item.get('coverage', '').lower() != self.coverage_level.lower():
                                            item_matches = False
                                    
                                    # If this item matched all filters
                                    if item_matches:
                                        found_match = True
                                        break
                                
                                if not found_match:
                                    coverage_match = False
                        
                        if not coverage_match:
                            continue
                        
                        # Apply implementation filters
                        impl_match = True
                        if (self.implementation_type or self.implementation_name or 
                            self.data_model or self.code_contains):
                            implementations = car_rule.get('implementations', [])
                            if not implementations:
                                impl_match = False
                            else:
                                found_match = False
                                for impl in implementations:
                                    # Track if this implementation matches all filters
                                    impl_item_matches = True
                                    
                                    # Check implementation type
                                    if self.implementation_type:
                                        if impl.get('type', '').lower() != self.implementation_type.lower():
                                            impl_item_matches = False
                                    
                                    # Check implementation name
                                    if self.implementation_name and impl_item_matches:
                                        if (self.implementation_name.lower() not in 
                                            impl.get('name', '').lower()):
                                            impl_item_matches = False
                                    
                                    # Check data model
                                    if self.data_model and impl_item_matches:
                                        if (self.data_model.lower() not in 
                                            impl.get('data_model', '').lower()):
                                            impl_item_matches = False
                                    
                                    # Check code contains
                                    if self.code_contains and impl_item_matches:
                                        if not impl.get('code') or (self.code_contains.lower() not in 
                                            impl.get('code', '').lower()):
                                            impl_item_matches = False
                                    
                                    # If this implementation matched all filters
                                    if impl_item_matches:
                                        found_match = True
                                        break
                                
                                if not found_match:
                                    impl_match = False
                        
                        if not impl_match:
                            continue
                        
                        # Apply unit test filters
                        if self.test_description:
                            unit_tests = car_rule.get('unit_tests', [])
                            if not unit_tests:
                                continue
                                
                            test_match = False
                            for test in unit_tests:
                                if (self.test_description.lower() in 
                                    test.get('description', '').lower()):
                                    test_match = True
                                    break
                                    
                            if not test_match:
                                continue
                        
                        # Apply true positive filters
                        if self.true_positive_source:
                            true_positives = car_rule.get('true_positives', [])
                            if not true_positives:
                                continue
                                
                            source_match = False
                            for tp in true_positives:
                                if (self.true_positive_source.lower() in 
                                    tp.get('source', '').lower()):
                                    source_match = True
                                    break
                                    
                            if not source_match:
                                continue
                        
                        # Apply D3FEND mapping filters
                        d3fend_match = True
                        if self.d3fend_id or self.d3fend_label:
                            d3fend_mappings = car_rule.get('d3fend_mappings', [])
                            if not d3fend_mappings:
                                d3fend_match = False
                            else:
                                found_match = False
                                for mapping in d3fend_mappings:
                                    mapping_matches = True
                                    
                                    if self.d3fend_id:
                                        if mapping.get('id') != self.d3fend_id:
                                            mapping_matches = False
                                    
                                    if self.d3fend_label and mapping_matches:
                                        if (self.d3fend_label.lower() not in 
                                            mapping.get('label', '').lower()):
                                            mapping_matches = False
                                    
                                    if mapping_matches:
                                        found_match = True
                                        break
                                
                                if not found_match:
                                    d3fend_match = False
                        
                        if not d3fend_match:
                            continue
                        
                        # ---- SCHEMA-ALIGNED FIELD NAMES ----
                        
                        # Prepare result record with schema-aligned field names
                        record = {
                            'file_name': file,
                            'file_path': file_path
                        }
                        
                        # Add top-level fields (keeping exact schema names)
                        # These are simple scalar fields
                        scalar_fields = [
                            'id', 'title', 'description', 'information_domain',
                            'submission_date', 'update_date'
                        ]
                        for field in scalar_fields:
                            if field in car_rule:
                                record[field] = car_rule[field]
                        
                        # Add top-level list fields (keeping exact schema names)
                        list_fields = [
                            'platforms', 'subtypes', 'analytic_types', 
                            'contributors', 'data_model_references', 'references'
                        ]
                        for field in list_fields:
                            if field in car_rule and car_rule[field]:
                                # Store both as JSON and comma-separated for flexibility
                                record[field] = json.dumps(car_rule[field])
                                record[f"{field}_list"] = ', '.join(str(item) for item in car_rule[field])
                        
                        # Store complex objects with schema structure
                        
                        # Process coverage items - schema field name: coverage
                        coverage_items = car_rule.get('coverage', [])
                        if coverage_items:
                            record['coverage'] = json.dumps(coverage_items)
                            record['coverage_count'] = len(coverage_items)
                            
                            # Collect all values across items
                            techniques = []
                            subtechniques = []
                            tactics = []
                            coverage_levels = []
                            
                            # Process each coverage item with schema-aligned names
                            for i, item in enumerate(coverage_items):
                                # Use schema field names with index
                                record[f"coverage.{i}.technique"] = item.get('technique', '')
                                
                                if 'subtechniques' in item and item['subtechniques']:
                                    subtechniques.extend(item['subtechniques'])
                                    record[f"coverage.{i}.subtechniques"] = json.dumps(item['subtechniques'])
                                
                                if 'tactics' in item and item['tactics']:
                                    tactics.extend(item['tactics'])
                                    record[f"coverage.{i}.tactics"] = json.dumps(item['tactics'])
                                
                                if 'coverage' in item:
                                    coverage_levels.append(item['coverage'])
                                    record[f"coverage.{i}.coverage"] = item['coverage']
                                
                                # Add technique to consolidated list
                                if 'technique' in item:
                                    techniques.append(item['technique'])
                            
                            # Add consolidated fields
                            record['coverage.techniques'] = json.dumps(techniques)
                            record['coverage.subtechniques'] = json.dumps(subtechniques)
                            record['coverage.tactics'] = json.dumps(tactics)
                            record['coverage.levels'] = json.dumps(coverage_levels)
                        
                        # Process implementations - schema field name: implementations
                        implementations = car_rule.get('implementations', [])
                        if implementations:
                            record['implementations'] = json.dumps(implementations)
                            record['implementations_count'] = len(implementations)
                            
                            # Collect for easier searching
                            impl_types = []
                            impl_names = []
                            impl_data_models = []
                            
                            # Process each implementation with schema-aligned names
                            for i, impl in enumerate(implementations):
                                # Use schema field names with index
                                if 'type' in impl:
                                    impl_types.append(impl['type'])
                                    record[f"implementations.{i}.type"] = impl['type']
                                
                                if 'name' in impl:
                                    impl_names.append(impl['name'])
                                    record[f"implementations.{i}.name"] = impl['name']
                                
                                if 'description' in impl:
                                    record[f"implementations.{i}.description"] = impl['description']
                                
                                if 'data_model' in impl:
                                    impl_data_models.append(impl['data_model'])
                                    record[f"implementations.{i}.data_model"] = impl['data_model']
                                
                                if 'code' in impl:
                                    record[f"implementations.{i}.code"] = impl['code']
                            
                            # Add consolidated fields
                            record['implementations.types'] = json.dumps(impl_types)
                            record['implementations.names'] = json.dumps(impl_names)
                            record['implementations.data_models'] = json.dumps(impl_data_models)
                        
                        # Process unit tests - schema field name: unit_tests
                        unit_tests = car_rule.get('unit_tests', [])
                        if unit_tests:
                            record['unit_tests'] = json.dumps(unit_tests)
                            record['unit_tests_count'] = len(unit_tests)
                            
                            # Process each unit test
                            for i, test in enumerate(unit_tests):
                                if 'description' in test:
                                    record[f"unit_tests.{i}.description"] = test['description']
                                
                                if 'commands' in test and test['commands']:
                                    record[f"unit_tests.{i}.commands"] = json.dumps(test['commands'])
                                    
                                if 'configurations' in test and test['configurations']:
                                    record[f"unit_tests.{i}.configurations"] = json.dumps(test['configurations'])
                        
                        # Process true positives - schema field name: true_positives
                        true_positives = car_rule.get('true_positives', [])
                        if true_positives:
                            record['true_positives'] = json.dumps(true_positives)
                            record['true_positives_count'] = len(true_positives)
                            
                            # Process each true positive
                            for i, tp in enumerate(true_positives):
                                if 'source' in tp:
                                    record[f"true_positives.{i}.source"] = tp['source']
                                
                                if 'description' in tp:
                                    record[f"true_positives.{i}.description"] = tp['description']
                                
                                # These could be large, so consider whether you want to include them
                                if 'event_snippet' in tp:
                                    record[f"true_positives.{i}.event_snippet"] = tp['event_snippet']
                                
                                if 'full_event' in tp:
                                    record[f"true_positives.{i}.full_event"] = tp['full_event']
                        
                        # Process d3fend mappings - schema field name: d3fend_mappings
                        d3fend_mappings = car_rule.get('d3fend_mappings', [])
                        if d3fend_mappings:
                            record['d3fend_mappings'] = json.dumps(d3fend_mappings)
                            record['d3fend_mappings_count'] = len(d3fend_mappings)
                            
                            # Collect values
                            d3fend_ids = []
                            d3fend_labels = []
                            d3fend_iris = []
                            
                            # Process each mapping
                            for i, mapping in enumerate(d3fend_mappings):
                                if 'id' in mapping:
                                    d3fend_ids.append(mapping['id'])
                                    record[f"d3fend_mappings.{i}.id"] = mapping['id']
                                
                                if 'label' in mapping:
                                    d3fend_labels.append(mapping['label'])
                                    record[f"d3fend_mappings.{i}.label"] = mapping['label']
                                
                                if 'iri' in mapping:
                                    d3fend_iris.append(mapping['iri'])
                                    record[f"d3fend_mappings.{i}.iri"] = mapping['iri']
                            
                            # Add consolidated fields
                            record['d3fend_mappings.ids'] = json.dumps(d3fend_ids)
                            record['d3fend_mappings.labels'] = json.dumps(d3fend_labels)
                            record['d3fend_mappings.iris'] = json.dumps(d3fend_iris)
                        
                        yield record
                        
                    except Exception as e:
                        yield {
                            'file_name': file,
                            'file_path': file_path, 
                            'error': str(e)
                        }
        
        except Exception as e:
            yield {'error': str(e)}

dispatch(CARSearchCommand, sys.argv, sys.stdin, sys.stdout, __name__)