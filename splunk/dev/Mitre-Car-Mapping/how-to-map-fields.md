# Map sourcetype fields to common Mitre CAR fields

## Generate field summary for sourcetypes in Splunk
```spl
    index=host
    | stats count by sourcetype 
    | map maxsearches=10000 search="search index=host sourcetype=\"$sourcetype$\" | fieldsummary | eval sourcetype=\"$sourcetype$\" | fields field sourcetype"
    | stats values(field) as sourcetype_fields by sourcetype
    | sort sourcetype
```

**Export this as a JSON file**

## Manually assign field aliases in Props.conf
- use this [template](/splunk/dev/Mitre-Car-Mapping/default/props.conf) as an example

**Example**
```
    # Process Model Aliases
    [SOURCETYPE]
    # Required fields
    FIELDALIAS-car_process_pid = source_field AS process.pid
    FIELDALIAS-car_process_ppid = source_field AS process.ppid
    FIELDALIAS-car_process_exe = source_field AS process.exe
    FIELDALIAS-car_process_hostname = source_field AS process.hostname
```

## If you're feeling lazy
- ask Claude.ai to have a crack passing it your `fieldsummary.json` that you exported and the [props.conf template](/splunk/dev/Mitre-Car-Mapping/default/props.conf)
- definitely validate this though as the `fieldsummary.json` won't actually pass any field values for Claude.ai to reference.