[CmdletBinding()]
param(
    [switch]$SkipInstall,
    [switch]$SkipMongoDB
)

$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$npmCache = Join-Path $env:TEMP 'f8-education-npm-cache'

Set-Location $repoRoot

function Invoke-Step {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,

        [Parameter(Mandatory = $true)]
        [string]$Command,

        [Parameter(Mandatory = $false)]
        [string[]]$Arguments = @(),

        [Parameter(Mandatory = $false)]
        [string]$WorkingDirectory = $repoRoot
    )

    Write-Host "`n==> $Name" -ForegroundColor Cyan
    Push-Location $WorkingDirectory
    try {
        & $Command @Arguments
        if ($LASTEXITCODE -ne 0) {
            throw "Command failed with exit code ${LASTEXITCODE}: $Command $($Arguments -join ' ')"
        }
    }
    finally {
        Pop-Location
    }
}

function Copy-EnvIfMissing {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Example,

        [Parameter(Mandatory = $true)]
        [string]$Destination
    )

    $examplePath = Join-Path $repoRoot $Example
    $destinationPath = Join-Path $repoRoot $Destination

    if (-not (Test-Path $destinationPath)) {
        Copy-Item $examplePath $destinationPath
        Write-Host "Created $Destination" -ForegroundColor Green
    }
    else {
        Write-Host "Kept existing $Destination" -ForegroundColor DarkGray
    }
}

Write-Host 'F8 Education Clone local setup' -ForegroundColor Green

Copy-EnvIfMissing '.env.example' 'backend/.env'
Copy-EnvIfMissing '.env.example' 'backend/src/api-gateway/.env'
Copy-EnvIfMissing '.env.example' 'backend/src/services/auth-service/.env'
Copy-EnvIfMissing '.env.example' 'backend/src/services/user-service/.env'
Copy-EnvIfMissing '.env.example' 'backend/src/services/course-service/.env'
Copy-EnvIfMissing '.env.example' 'backend/src/services/blog-service/.env'
Copy-EnvIfMissing '.env.example' 'backend/src/services/enrollment-service/.env'
Copy-EnvIfMissing '.env.example' 'backend/src/services/learning-path-service/.env'
Copy-EnvIfMissing 'frontend/.env.example' 'frontend/.env'
Copy-EnvIfMissing 'admin/.env.example' 'admin/.env'

if (-not $SkipInstall) {
    $npmArguments = @('ci', '--no-audit', '--no-fund', '--cache', $npmCache)
    $npmDirectories = @(
        'frontend',
        'admin',
        'backend',
        'backend/src/shared',
        'backend/src/api-gateway',
        'backend/src/services/auth-service',
        'backend/src/services/user-service',
        'backend/src/services/course-service',
        'backend/src/services/blog-service',
        'backend/src/services/enrollment-service',
        'backend/src/services/learning-path-service'
    )

    foreach ($directory in $npmDirectories) {
        Invoke-Step "Install $directory dependencies" 'npm' $npmArguments (Join-Path $repoRoot $directory)
    }
}
else {
    Write-Host 'Skipping dependency installation.' -ForegroundColor Yellow
}

if (-not $SkipMongoDB) {
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        Invoke-Step 'Start MongoDB' 'docker' @('compose', 'up', '-d', 'mongodb')
    }
    else {
        Write-Warning 'Docker was not found. Start MongoDB manually before running the backend.'
    }
}
else {
    Write-Host 'Skipping MongoDB startup.' -ForegroundColor Yellow
}

Write-Host "`nSetup completed." -ForegroundColor Green
Write-Host 'Run `make dev` or start frontend, admin and backend in separate terminals.'
