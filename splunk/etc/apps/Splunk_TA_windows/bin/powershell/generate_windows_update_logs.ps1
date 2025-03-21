# ## This script generates WindowsUpdate.Log using Get-WindowsUpdateLog in $SplunkHome\var\log\Splunk_TA_windows\WindowsUpdate
# ## It monitors the WindowsUpdate.log from $SplunkHome\var\log\Splunk_TA_windows\

Set-Variable -Name "LogFolder" -Value "$SplunkHome\var\log\Splunk_TA_windows\WindowsUpdate"
Set-Variable -Name "MonitoredLogFile" -Value "$SplunkHome\var\log\Splunk_TA_windows\WindowsUpdate.log"

if (!(Test-Path -Path $LogFolder )) {
	New-Item -ItemType directory -Path $LogFolder
}

Get-WindowsUpdateLog -LogPath $LogFolder\WindowsUpdate.log

if (Test-Path $MonitoredLogFile) {
	try{
		$currentLastLogLine = Get-Content $MonitoredLogFile | Select-Object -Last 1
		if ($currentLastLogLine -match '\d{4}[-\/]\d{2}[-\/]\d{2} \d{2}:\d{2}:\d{2}\.\d{7}') {
			try{
				$currentLastTimestamp = [datetime]::ParseExact($matches[0], 'yyyy-MM-dd HH:mm:ss.fffffff', $null)
				$is_timeformate_contain_slash = $false
			}catch {
				$currentLastTimestamp = [datetime]::ParseExact($matches[0], 'yyyy/MM/dd HH:mm:ss.fffffff', $null)
				$is_timeformate_contain_slash = $true
			}
			if($is_timeformate_contain_slash){
				$newLogs = Get-Content "$LogFolder\WindowsUpdate.log" | Where-Object { $_ -match '\d{4}[-\/]\d{2}[-\/]\d{2} \d{2}:\d{2}:\d{2}\.\d{7}' } | ForEach-Object {
					$logTimestamp = [datetime]::ParseExact($matches[0], 'yyyy/MM/dd HH:mm:ss.fffffff', $null)
					if ($logTimestamp -gt $currentLastTimestamp) {
						$_
					}
				}
			}
			else{
				$newLogs = Get-Content "$LogFolder\WindowsUpdate.log" | Where-Object { $_ -match '\d{4}[-\/]\d{2}[-\/]\d{2} \d{2}:\d{2}:\d{2}\.\d{7}' } | ForEach-Object {
					$logTimestamp = [datetime]::ParseExact($matches[0], 'yyyy-MM-dd HH:mm:ss.fffffff', $null)
					if ($logTimestamp -gt $currentLastTimestamp) {
						$_
					}
				}
			}
			if ($newLogs) {
				$newLogs | Set-Content -Path $MonitoredLogFile
				# Write-Output "New logs appended to $MonitoredLogFile."
			}else {
				# Write-Output "No new logs found to append."
				exit
			}
		}else {
			# Write-Output "No timestamp matched in the current log file, hence copied file content."
			Copy-Item -Path "$LogFolder\WindowsUpdate.log" -Destination "$MonitoredLogFile"
		}
	}
	catch {
		# Write-Output "Something went wrong, hence copying the entire log file"
		Copy-Item -Path "$LogFolder\WindowsUpdate.log" -Destination "$MonitoredLogFile"
	}
}
else {
	# Write-Output "File does not exist, hence copied file content."
	Copy-Item -Path "$LogFolder\WindowsUpdate.log" -Destination "$MonitoredLogFile"
}

exit
