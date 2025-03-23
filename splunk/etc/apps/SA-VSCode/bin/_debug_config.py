import sys
import json
import os

try:
    # Python 3
    import configparser
except ImportError:
    # Fallback to Python 2
    import ConfigParser as configparser

CONFIGURATION_NAME = "Splunk Enterprise: Python Debugger"

def create_or_update_launch_json(caller, port):
    """
    Creates or updates a .vscode/launch.json file for debugger configuration
    """

    # Get the path to the ./.vscode directory in the caller app
    vscode_path = _get_vscode_path(caller)

    # If this path does not exist, create it
    if not os.path.exists(vscode_path):
        try:
            original_umask = os.umask(0)
            os.makedirs(vscode_path, mode=0o755)
        finally:
            os.umask(original_umask)

    # Get the path to the ./.vscode/launch.json file
    vscode_launch_file = os.path.abspath(os.path.join(os.sep, vscode_path, "launch.json"))

    # Create the launch.json file with an initial configuration if it does not exist
    if not os.path.exists(vscode_launch_file):
        _create_vscode_launch_config(vscode_launch_file, port)

    else:
        # Get the configuration from the launch.json file
        launch_config = _get_vscode_launch_config(vscode_launch_file)
        if 'configurations' not in launch_config:
            raise Exception("Configurations section missing from %s" % vscode_launch_file)

        # Find the Splunk configuration in the config (if any)
        splunk_launch_config = None
        for configuration in launch_config['configurations']:
            if configuration['name'] == CONFIGURATION_NAME:
                splunk_launch_config = configuration
                break

        if splunk_launch_config is None:
            # A Splunk configuration was not found, so append one to launch.json
            launch_config['configurations'].append(_get_splunk_launch_config(port))
            _write_vscode_launch_config(vscode_launch_file, launch_config)

        elif not splunk_launch_config['port'] == port:
            # Just update the port if necessary
            launch_config["configurations"][launch_config["configurations"].index(splunk_launch_config)]["port"] = port
            _write_vscode_launch_config(vscode_launch_file, launch_config)

def get_app_debug_options(caller):
    """
    Gets options for the debugger from debug.conf.
    Combine settings from SA-VSCode, with the default and local paths for the curent app
    """

    SPLUNK_HOME = os.environ['SPLUNK_HOME']

    # Get the path to the current app
    app_path = _get_splunk_app_path(caller)

    # Get the path to the SA-VSCode app
    sa_vscode_path = os.path.abspath(os.path.join(SPLUNK_HOME, "etc", "apps", "SA-VSCode"))

    vscode_default_conf = os.path.abspath(os.path.join(os.sep, sa_vscode_path, "default", "debug.conf"))
    app_default_conf    = os.path.abspath(os.path.join(os.sep, app_path, "default", "debug.conf"))
    app_local_conf      = os.path.abspath(os.path.join(os.sep, app_path, "local", "debug.conf"))

    # Read the debug.conf files and combine settings
    config = configparser.ConfigParser()
    config.read([vscode_default_conf, app_default_conf, app_local_conf])

    return config

def _get_vscode_path(caller):
    """ Gets a path for the .vscode directory for the callers Splunk app """
    splunk_app_path = _get_splunk_app_path(caller)
    vscode_path = os.path.abspath(os.path.join(os.sep, splunk_app_path, ".vscode"))
    return vscode_path

def _get_splunk_app_path(caller):
    """
    Gets the path to the Splunk app based on the location of the caller.
    This file can be anywhere in in $SPLUNK_HOME/etc/apps/<app_name>
    """

    SPLUNK_HOME = os.environ['SPLUNK_HOME']

    # Apps live in $SPLUNK_HOME/etc/apps
    SPLUNK_APPS_PATH = os.path.join(SPLUNK_HOME, "etc", "apps")

    # Get the length of the $SPLUNK_HOME/etc/apps path.
    splunk_app_pos = len(SPLUNK_APPS_PATH.split(os.sep))

    thisFilePath = os.path.dirname(os.path.abspath(caller))

    # The next path after SPLUNK_APPS_PATH will be the app direcotry
    SPLUNK_APP_DIR = thisFilePath.split(os.sep)[splunk_app_pos]

    # Construct the absolute path to the Splunk app directory
    SPLUNK_APP_PATH = os.path.abspath(os.path.join(SPLUNK_APPS_PATH, SPLUNK_APP_DIR))
    return SPLUNK_APP_PATH

def _create_vscode_launch_config(vscode_launch_file, port):
    """
    Create a launch.json file in the .vscode folder
    """

    main = {}
    main["version"] = "0.2.0"
    main['configurations'] = []
    main['configurations'].append(_get_splunk_launch_config(port))

    _write_vscode_launch_config(vscode_launch_file, main)

def _get_splunk_launch_config(port):
    """
    Returns a Splunk launch configuration
    """

    config = {}
    pathMappings = {}

    config['name'] = CONFIGURATION_NAME
    config['type'] = "python"
    config['request'] = "attach"
    config['port'] = port
    config['pathMappings'] = []

    pathMappings['localRoot'] = "${workspaceFolder}"
    pathMappings['remoteRoot'] = "${workspaceFolder}"

    config['pathMappings'].append(pathMappings)

    return config

def _write_vscode_launch_config(vscode_launch_file, launch_json):
    with open(vscode_launch_file, 'w') as launch_file:
        json.dump(launch_json, launch_file, indent=4)
    os.chmod(vscode_launch_file, 0o644)

def _get_vscode_launch_config(vscode_launch_file):

    launch_config = {}

    with open(vscode_launch_file) as launch_file:
        launch_json = _get_json_from_file(vscode_launch_file)
        launch_config = json.loads(launch_json)

    return launch_config

def _get_json_from_file(filePath):
    """
    Removes comments from a .json file
    """

    contents = ""

    with open(filePath) as fh:
        for line in fh:
            cleanedLine = line.split("//", 1)[0]
            if len(cleanedLine) > 0 and line.endswith("\n") and "\n" not in cleanedLine:
              cleanedLine += "\n"
            contents += cleanedLine

    while "/*" in contents:
        preComment, postComment = contents.split("/*", 1)
        contents = preComment + postComment.split("*/", 1)[1]
    return contents

