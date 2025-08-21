# Splunk_DFIR_Aliases.ps1
# PowerShell version of splunk_dfir_aliases.sh

<#
.SYNOPSIS
    PowerShell module for Splunk DFIR script aliases
    
.DESCRIPTION
    This module provides convenient aliases for Splunk DFIR PowerShell scripts.
    
.NOTES
    HOW TO USE THIS MODULE:
    
    1. Import this module in your PowerShell session:
       Import-Module .\Splunk_DFIR_Aliases.ps1
    
    2. To load these aliases automatically when you start PowerShell,
       add the following line to your PowerShell profile:
       Import-Module "C:\path\to\Splunk_DFIR_Aliases.ps1"
       
       To find your profile location, run: $PROFILE
       To create/edit your profile, run: notepad $PROFILE
    
    3. After importing, you can use the shortened command names with tab completion.
       For example, type "Deploy" and press Tab to see available commands.
    
    4. Run "Get-DFIRHelp" to see a list of all available commands.
#>

# Directory containing the DFIR scripts
$SCRIPT_DIR = $PSScriptRoot

# Function to check if a script exists
function Test-ScriptExists {
    param([string]$ScriptPath)
    
    if (-not (Test-Path $ScriptPath)) {
        Write-Warning "Script $ScriptPath doesn't exist or isn't accessible"
        return $false
    }
    return $true
}

# Create wrapper functions for each script
function Deploy-Splunk {
    <#
    .SYNOPSIS
        Deploy Splunk Enterprise container
    .DESCRIPTION
        Runs the Deploy-Splunk.ps1 script to set up and start the Splunk container
    #>
    param()
    
    $script = Join-Path $SCRIPT_DIR "Deploy-Splunk.ps1"
    if (Test-ScriptExists $script) {
        & $script @args
    }
}

function Process-Timeline {
    <#
    .SYNOPSIS
        Process log2timeline data
    .DESCRIPTION
        Runs the Process-Log2timeline-ALL.ps1 script to process forensic disk images
    #>
    param()
    
    $script = Join-Path $SCRIPT_DIR "Process-Log2timeline-ALL.ps1"
    if (Test-ScriptExists $script) {
        & $script @args
    }
}

function Process-Zeek {
    <#
    .SYNOPSIS
        Process Zeek data
    .DESCRIPTION
        Runs the Process-Zeek-ALL.ps1 script to analyze PCAP files
    #>
    param()
    
    $script = Join-Path $SCRIPT_DIR "Process-Zeek-ALL.ps1"
    if (Test-ScriptExists $script) {
        & $script @args
    }
}

function Purge-Splunk {
    <#
    .SYNOPSIS
        Purge Splunk container and data
    .DESCRIPTION
        Runs the Purge-SplunkContainer.ps1 script to completely remove Splunk container and data
    #>
    param()
    
    $script = Join-Path $SCRIPT_DIR "Purge-SplunkContainer.ps1"
    if (Test-ScriptExists $script) {
        & $script @args
    }
}

function Disable-SplunkInputs {
    <#
    .SYNOPSIS
        Disable all Splunk inputs
    .DESCRIPTION
        Runs the Setup-DisableAllSplunkInputs.ps1 script to disable Splunk data inputs
    #>
    param()
    
    $script = Join-Path $SCRIPT_DIR "Setup-DisableAllSplunkInputs.ps1"
    if (Test-ScriptExists $script) {
        & $script @args
    }
}

function Enable-SplunkInputs {
    <#
    .SYNOPSIS
        Enable all Splunk inputs
    .DESCRIPTION
        Runs the Setup-EnableAllSplunkInputs.ps1 script to enable Splunk data inputs
    #>
    param()
    
    $script = Join-Path $SCRIPT_DIR "Setup-EnableAllSplunkInputs.ps1"
    if (Test-ScriptExists $script) {
        & $script @args
    }
}

function Setup-Environment {
    <#
    .SYNOPSIS
        Setup DFIR environment
    .DESCRIPTION
        Runs the Setup-Environment.ps1 script to configure the DFIR environment
    #>
    param()
    
    $script = Join-Path $SCRIPT_DIR "Setup-Environment.ps1"
    if (Test-ScriptExists $script) {
        & $script @args
    }
}

function Load-DockerImages {
    <#
    .SYNOPSIS
        Load Docker images from tar files
    .DESCRIPTION
        Runs the Setup-LoadDockerTar.ps1 script to load Docker images from tar archives
    #>
    param()
    
    $script = Join-Path $SCRIPT_DIR "Setup-LoadDockerTar.ps1"
    if (Test-ScriptExists $script) {
        & $script @args
    }
}

function Process-Kape {
    <#
    .SYNOPSIS
        Process forensic artifacts with KAPE
    .DESCRIPTION
        Runs the Process-Kape-ALL.ps1 script to extract artifacts from disk images
    #>
    param()
    
    $script = Join-Path $SCRIPT_DIR "Process-Kape-ALL.ps1"
    if (Test-ScriptExists $script) {
        & $script @args
    }
}

function Setup-Kape {
    <#
    .SYNOPSIS
        Setup KAPE environment
    .DESCRIPTION
        Runs the Setup-Environment-Kape.ps1 script to configure KAPE dependencies
    #>
    param()
    
    $script = Join-Path $SCRIPT_DIR "Setup-Environment-Kape.ps1"
    if (Test-ScriptExists $script) {
        & $script @args
    }
}

# Function to list all available DFIR commands
function Get-DFIRHelp {
    <#
    .SYNOPSIS
        Show available DFIR commands
    .DESCRIPTION
        Displays a list of all available DFIR PowerShell functions and their descriptions
    #>
    Write-Host "Available DFIR commands:" -ForegroundColor Cyan
    Write-Host "  Deploy-Splunk            - Deploy Splunk Enterprise container"
    Write-Host "  Process-Timeline         - Process log2timeline data from disk images"
    Write-Host "  Process-Zeek             - Process Zeek data from PCAP files"
    Write-Host "  Process-Kape             - Process forensic artifacts with KAPE"
    Write-Host "  Purge-Splunk             - Purge Splunk container and all data"
    Write-Host "  Disable-SplunkInputs     - Disable all Splunk data inputs"
    Write-Host "  Enable-SplunkInputs      - Enable all Splunk data inputs"
    Write-Host "  Setup-Environment        - Setup Docker and DFIR environment"
    Write-Host "  Setup-Kape               - Setup KAPE environment and dependencies"
    Write-Host "  Load-DockerImages        - Load Docker images from tar files"
    Write-Host "  Get-DFIRHelp             - Show this help message"
    Write-Host ""
    Write-Host "Use Get-Help <CommandName> -Detailed for more information about specific commands." -ForegroundColor Yellow
}

# Create aliases for backwards compatibility
Set-Alias -Name "deploy-splunk" -Value "Deploy-Splunk"
Set-Alias -Name "process-timeline" -Value "Process-Timeline"
Set-Alias -Name "process-zeek" -Value "Process-Zeek"
Set-Alias -Name "process-kape" -Value "Process-Kape"
Set-Alias -Name "purge-splunk" -Value "Purge-Splunk"
Set-Alias -Name "disable-splunk-inputs" -Value "Disable-SplunkInputs"
Set-Alias -Name "enable-splunk-inputs" -Value "Enable-SplunkInputs"
Set-Alias -Name "setup-env" -Value "Setup-Environment"
Set-Alias -Name "setup-kape" -Value "Setup-Kape"
Set-Alias -Name "load-docker" -Value "Load-DockerImages"
Set-Alias -Name "dfir-help" -Value "Get-DFIRHelp"

# Export functions and aliases
Export-ModuleMember -Function Deploy-Splunk, Process-Timeline, Process-Zeek, Process-Kape, Purge-Splunk, Disable-SplunkInputs, Enable-SplunkInputs, Setup-Environment, Setup-Kape, Load-DockerImages, Get-DFIRHelp
Export-ModuleMember -Alias "deploy-splunk", "process-timeline", "process-zeek", "process-kape", "purge-splunk", "disable-splunk-inputs", "enable-splunk-inputs", "setup-env", "setup-kape", "load-docker", "dfir-help"

Write-Host "DFIR PowerShell module loaded. Type 'Get-DFIRHelp' for available commands." -ForegroundColor Green
