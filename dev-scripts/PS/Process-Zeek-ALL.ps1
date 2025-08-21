# Process-Zeek-ALL.ps1
# PowerShell version of process-zeek-ALL.sh

# Ensure correct filepath assigned when referenced
$SCRIPT_DIR = $PSScriptRoot
$REPO_ROOT_DIR = Split-Path -Path $SCRIPT_DIR -Parent

# Define input and output directories dynamically
$PCAP_DIR = Join-Path $REPO_ROOT_DIR "data_store\raw\pcaps"
$ZEEK_LOGS_DIR = Join-Path $REPO_ROOT_DIR "data_store\processed\zeek"

# Ensure output directory exists
if (-not (Test-Path $ZEEK_LOGS_DIR)) {
    New-Item -ItemType Directory -Path $ZEEK_LOGS_DIR -Force | Out-Null
}

################################################################################
Write-Host ""
Write-Host " ██████╗ ███████╗████████╗   ███████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗"
Start-Sleep 0.1
Write-Host "██╔════╝ ██╔════╝╚══██╔══╝   ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝"
Start-Sleep 0.1
Write-Host "██║  ███╗█████╗     ██║█████╗███████╗ ╚████╔╝ ██████╔╝█████╗  ██████╔╝███████╗"
Start-Sleep 0.1
Write-Host "██║   ██║██╔══╝     ██║╚════╝╚════██║  ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗╚════██║"
Start-Sleep 0.1
Write-Host "╚██████╔╝███████╗   ██║      ███████║   ██║   ██████╔╝███████╗██║  ██║███████║"
Start-Sleep 0.1
Write-Host "╚═════╝ ╚══════╝   ╚═╝      ╚══════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝"
Write-Host ""

Write-Host "$REPO_ROOT_DIR"
Write-Host ""

# Debugging Output (Check Paths)
Write-Host "📂 PCAP Directory: $PCAP_DIR" -ForegroundColor Cyan
Write-Host "📂 Zeek Logs Directory: $ZEEK_LOGS_DIR" -ForegroundColor Cyan

# Check if PCAP files exist
$pcapFiles = @()
if (Test-Path $PCAP_DIR) {
    $pcapFiles += Get-ChildItem -Path $PCAP_DIR -Filter "*.pcap" -File
    $pcapFiles += Get-ChildItem -Path $PCAP_DIR -Filter "*.pcapng" -File
}

if ($pcapFiles.Count -eq 0) {
    Write-Host "⚠️ No PCAP files found in $PCAP_DIR. Exiting." -ForegroundColor Yellow
    exit 1
}

# Process each PCAP file
foreach ($pcapFile in $pcapFiles) {
    # Extract filename without extension
    $pcapBasename = [System.IO.Path]::GetFileNameWithoutExtension($pcapFile.Name)
    
    # Create a temporary directory for initial Zeek output
    $tempDir = Join-Path $env:TEMP "zeek_$(Get-Random)"
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    
    # Define final Zeek output directory for this PCAP
    $outputDir = Join-Path $ZEEK_LOGS_DIR $pcapBasename
    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }
    
    Write-Host "🚀 Processing: $pcapBasename" -ForegroundColor Green
    
    # Convert paths for Docker (Windows to Linux path format)
    $pcapDirDocker = $PCAP_DIR -replace "\\", "/" -replace "^C:", "/c"
    $tempDirDocker = $tempDir -replace "\\", "/" -replace "^C:", "/c"
    
    # Run Zeek container to generate logs in temporary directory
    $containerName = "zeek_$pcapBasename"
    try {
        $dockerArgs = @(
            "run", "--name", $containerName,
            "-v", "${PCAP_DIR}:/pcap:ro",
            "-v", "${tempDir}:/logs",
            "zeek/zeek", "sh", "-c",
            "cd /logs && zeek -C -r /pcap/$($pcapFile.Name)"
        )
        
        & docker $dockerArgs
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Finished processing: $pcapBasename" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Error processing: $pcapBasename" -ForegroundColor Red
            continue
        }
    }
    catch {
        Write-Host "❌ Error running Zeek container for $pcapBasename : $_" -ForegroundColor Red
        continue
    }
    
    # Process log files with zeek-cut to convert timestamps to ISO8601
    Write-Host "🕒 Converting timestamps to ISO8601 format..." -ForegroundColor Yellow
    
    $logFiles = Get-ChildItem -Path $tempDir -Filter "*.log" -File
    foreach ($logFile in $logFiles) {
        $logFilename = $logFile.Name
        $outputPath = Join-Path $outputDir $logFilename
        
        try {
            # Use docker to run zeek-cut for timestamp conversion
            $zeekCutArgs = @(
                "run", "--rm", "-i",
                "-v", "${tempDir}:/logs",
                "zeek/zeek", "bash", "-c",
                "cat /logs/$logFilename | zeek-cut -C -U '%Y-%m-%dT%H:%M:%S%z'"
            )
            
            $convertedContent = & docker $zeekCutArgs
            Set-Content -Path $outputPath -Value $convertedContent
            
            Write-Host "   ✓ Converted timestamps in $logFilename" -ForegroundColor Green
        }
        catch {
            Write-Host "   ❌ Error converting $logFilename : $_" -ForegroundColor Red
            # Fallback: just copy the original file
            Copy-Item $logFile.FullName $outputPath
        }
    }
    
    # Clean up temporary directory
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    
    # Clean up container
    & docker rm -f $containerName 2>$null | Out-Null
    
    Write-Host "💾 Logs saved in: $outputDir" -ForegroundColor Cyan
}

Write-Host "✅ All PCAPs processed with ISO8601 timestamps." -ForegroundColor Green
