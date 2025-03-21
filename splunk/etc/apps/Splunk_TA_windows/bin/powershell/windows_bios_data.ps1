## This script fetches the Windows machine BIOS data using Get-WmiObject cmdlet

$bios_data = Get-WmiObject -class win32_bios | format-list -property * | Out-String
$bios_data = $bios_data.Trim()
$bios_data -replace '(.*?)\s:(.*)', '$1 = $2'
