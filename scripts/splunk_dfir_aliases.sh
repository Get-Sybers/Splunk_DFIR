#!/bin/bash

# HOW TO USE THIS SCRIPT:
# 1. Make this file executable:
#    chmod +x splunk_dfir_aliases.sh
#
# 2. Source this file in your current terminal session:
#    source ./splunk_dfir_aliases.sh
#
# 3. To load these aliases automatically when you start a new terminal,
#    add the following line to your ~/.bashrc file:
#    source /path/to/splunk_dfir_aliases.sh
#
# 4. After sourcing, you can use the shortened command names with tab completion.
#    For example, type "pro" and press Tab to see available commands.
#
# 5. Run "dfir-help" to see a list of all available commands.

# Directory containing the DFIR scripts
SCRIPT_DIR=$(dirname $(readlink -f "${BASH_SOURCE[0]}"))

# Function to check if a script exists
script_exists() {
    if [[ ! -f "$1" ]]; then
        echo "Warning: Script $1 doesn't exist or isn't accessible"
        return 1
    elif [[ ! -x "$1" ]]; then
        echo "Warning: Script $1 isn't executable. Consider running: chmod +x $1"
        return 1
    fi
    return 0
}

# Create safer wrapper functions instead of direct aliases
deploy-splunk() {
    local script="$SCRIPT_DIR/deploy-splunk.sh"
    if script_exists "$script"; then
        "$script" "$@"
    fi
}

process-timeline() {
    local script="$SCRIPT_DIR/process-log2timeline-ALL.sh"
    if script_exists "$script"; then
        "$script" "$@"
    fi
}

process-zeek() {
    local script="$SCRIPT_DIR/process-zeek-ALL.sh"
    if script_exists "$script"; then
        "$script" "$@"
    fi
}

purge-splunk() {
    local script="$SCRIPT_DIR/purge-splunk-container.sh"
    if script_exists "$script"; then
        "$script" "$@"
    fi
}

disable-splunk-inputs() {
    local script="$SCRIPT_DIR/setup-disable-all-splunk-inputs.sh"
    if script_exists "$script"; then
        "$script" "$@"
    fi
}

enable-splunk-inputs() {
    local script="$SCRIPT_DIR/setup-enable-all-splunk-inputs.sh"
    if script_exists "$script"; then
        "$script" "$@"
    fi
}

setup-env() {
    local script="$SCRIPT_DIR/setup_environment.sh"
    if script_exists "$script"; then
        "$script" "$@"
    fi
}

load-docker() {
    local script="$SCRIPT_DIR/setup_load_docker_tar.sh"
    if script_exists "$script"; then
        "$script" "$@"
    fi
}

# Function to list all available DFIR commands
dfir-help() {
    echo "Available DFIR commands:"
    echo "  deploy-splunk            - Deploy Splunk container"
    echo "  process-timeline         - Process log2timeline data"
    echo "  process-zeek             - Process Zeek data"
    echo "  purge-splunk             - Purge Splunk container"
    echo "  disable-splunk-inputs    - Disable all Splunk inputs"
    echo "  enable-splunk-inputs     - Enable all Splunk inputs"
    echo "  setup-env                - Setup environment"
    echo "  load-docker              - Load Docker tar images"
    echo "  dfir-help                - Show this help message"
}

# Add tab completion for the commands
_dfir_commands() {
    local cur=${COMP_WORDS[COMP_CWORD]}
    local commands="deploy-splunk process-timeline process-zeek purge-splunk disable-splunk-inputs enable-splunk-inputs setup-env load-docker dfir-help"
    COMPREPLY=( $(compgen -W "$commands" -- $cur) )
}

# Register completion for our commands
complete -F _dfir_commands deploy-splunk process-timeline process-zeek purge-splunk disable-splunk-inputs enable-splunk-inputs setup-env load-docker dfir-help

echo "DFIR script aliases loaded. Type 'dfir-help' for available commands."
