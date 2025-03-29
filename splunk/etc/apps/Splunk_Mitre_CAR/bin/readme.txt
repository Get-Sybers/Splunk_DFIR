# YAML Search for Splunk

This custom Splunk application allows you to search YAML files directly within your Splunk app without indexing them.

## App Structure

```
Splunk_Mitre_CAR/
├── bin/
│   ├── yaml_search.py        # Main YAML search command
│   └── car_search.py         # CAR-specific search command
├── default/
│   └── commands.conf         # Command definitions
├── local/
│   └── app.conf             # App configuration
├── car_analytics/               # Directory to store CAR rules
│   ├── CAR-2022-03-001.yaml
│   └── ... (other YAML files)
└── metadata/
    └── default.meta         # App permissions
```

## Installation Instructions

1. **Create the App Directory Structure**

   ```bash
   mkdir -p $SPLUNK_HOME/etc/apps/Splunk_Mitre_CAR/bin
   mkdir -p $SPLUNK_HOME/etc/apps/Splunk_Mitre_CAR/default
   mkdir -p $SPLUNK_HOME/etc/apps/Splunk_Mitre_CAR/local
   mkdir -p $SPLUNK_HOME/etc/apps/Splunk_Mitre_CAR/car_analytics
   mkdir -p $SPLUNK_HOME/etc/apps/Splunk_Mitre_CAR/metadata
   ```

2. **Install the Python Scripts**

   Copy `yaml_search.py` and `car_search.py` to the `bin` directory and make them executable:

   ```bash
   chmod +x $SPLUNK_HOME/etc/apps/Splunk_Mitre_CAR/bin/yaml_search.py
   chmod +x $SPLUNK_HOME/etc/apps/Splunk_Mitre_CAR/bin/car_search.py
   ```

3. **Install Configuration Files**

   Create the configuration files in the appropriate directories.

4. **Copy Your YAML Files**

   Copy your CAR rule YAML files to the `car_analytics` directory.

5. **Install Required Python Dependencies**

   ```bash
   $SPLUNK_HOME/bin/splunk cmd python -m pip install pyyaml
   ```

6. **Restart Splunk**

   ```bash
   $SPLUNK_HOME/bin/splunk restart
   ```

## Usage Examples

### General YAML Search

```
| yamlfind app=Splunk_Mitre_CAR path=car_analytics fields="title,id,description"
```

### Search for Specific CAR Rules

```
| carfind id=CAR-2022-03-001
```

### Search by MITRE ATT&CK Technique

```
| carfind technique=T1562
```

### Search by Platform and Title Keywords

```
| carfind platform=Windows title="Event Logging"
```

### Combining with Other SPL Commands

```
| carfind platform=Windows
| search description="*disable*"
| table id title description
```

## Notes

1. The search commands can read YAML files directly from your app directory without needing to index them.
2. All searches are case-insensitive for easier matching.
3. Make sure your YAML files have consistent formatting to ensure proper parsing.