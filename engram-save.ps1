param (
    [Parameter(Mandatory=$true)] [string]$Name,
    [Parameter(Mandatory=$true)] [string]$Message
)
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$env:ENGRAM_DATA_DIR = Join-Path $projectRoot "memory"
$engramPath = "C:\Users\Isaac\dev\tools\engram\engram.exe"
& $engramPath save $Name $Message --project "propinando"
