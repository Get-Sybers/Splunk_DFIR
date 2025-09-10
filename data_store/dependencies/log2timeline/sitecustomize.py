try:
    import splunk               # registers the output module
    import splunk_output        # registers the arguments helper
except Exception as e:
    import sys, traceback
    sys.stderr.write(f"[sitecustomize] Failed to import plugin pieces: {e}\n")
    traceback.print_exc(file=sys.stderr)