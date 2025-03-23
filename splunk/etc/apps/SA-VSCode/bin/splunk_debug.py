import ptvsd
import inspect
import os
import random
import _debug_config

# Defaults

DEBUG_ADDRESS = "0.0.0.0"
DEBUG_PORT = random.randint(5000,5999)
ATTACH_TIMEOUT = 25
UPDATE_DEBUG_CONFIG = True
SPLUNK_LOG_DIR = os.path.join(os.environ['SPLUNK_HOME'], "var", "log", "splunk")

def enable_debugging(address=DEBUG_ADDRESS, port=DEBUG_PORT, timeout=ATTACH_TIMEOUT, updateDebugConfig=UPDATE_DEBUG_CONFIG):
    """Enables the debug adapater.

    :param address: The interface address on which the debug server is listening for connections. Using 0.0.0.0 will make it listen on all available interfaces.
    :type address: str

    :param port: The port used to connect to the address.  The combination of address and port should be accessible by the machine running Visual Studio Code.
    :type port: int

    :param timeout: Specifies how long to wait for Visual Studio Code to attach.
    "type timeout: int

    :param updateDebugConfig: If set to True, this code will attempt to create a debug configuration file named launch.json in the caller's .vscode directory.
    :type updateDebugConfig: bool
    """

    # Get the file path of the caller
    frame_info = inspect.stack()[1]
    filepath = frame_info[1]
    del frame_info

    # Get the debug.conf options
    try:
        debug_options = _debug_config.get_app_debug_options(filepath)
    except Exception as e:
        raise Exception("Could not read debug.conf: {}".format(e))

    if debug_options.getboolean("debug", "enabled"):

        if updateDebugConfig in [True, "true", "True", "1", 1, "yes", "y"]:
            try:
                _debug_config.create_or_update_launch_json(filepath, port)
            except Exception as e:
                raise Exception("Could not create or update the launch configuration: {}".format(e))

        ptvsd.enable_attach((address, port), log_dir=SPLUNK_LOG_DIR, redirect_output=True)

        ptvsd.wait_for_attach(timeout=timeout)
    

def set_breakpoint():
    try:
        breakpoint()
    except:
        ptvsd.break_into_debugger()
