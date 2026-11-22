# Deploy this extracted Ir786106-main folder to https://github.com/Ir786106/Ir786106
# Windows PowerShell 5.1+. No force push, no deletion of unrelated remote files.
$ErrorActionPreference = 'Stop'

$sourceDir = $PSScriptRoot
$repoUrl = 'https://github.com/Ir786106/Ir786106.git'
$requiredFiles = @(
    'README.md',
    'docs\index.html',
    'docs\script.js',
    'docs\styles.css',
    'docs\assets\irfan-anime-portrait.webp',
    'assets\profile\irfan-anime-banner.png',
    'assets\profile\irfan-anime-original.png'
)

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw 'Git is not installed. Install Git for Windows first.'
}
foreach ($relPath in $requiredFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $sourceDir $relPath) -PathType Leaf)) {
        throw "Missing required portfolio file: $relPath"
    }
}

# Create a NEW clone so previous local experiments do not get pushed accidentally.
$baseDir = 'D:\Irfan_Project'
if (-not (Test-Path -LiteralPath $baseDir -PathType Container)) { $baseDir = $HOME }
$workDir = Join-Path $baseDir ('Ir786106_Anime_Deploy_' + (Get-Date -Format 'yyyyMMdd_HHmmss_fff'))
$repoDir = Join-Path $workDir 'Ir786106'
New-Item -ItemType Directory -Path $workDir -Force | Out-Null

Write-Host "Cloning latest main into $repoDir" -ForegroundColor Cyan
& git clone --branch main $repoUrl $repoDir
if ($LASTEXITCODE -ne 0) { throw 'Git clone failed.' }

Write-Host 'Copying portfolio source files...' -ForegroundColor Cyan
& robocopy $sourceDir $repoDir /E /R:2 /W:1 /XD '.git'
$copyExit = $LASTEXITCODE
if ($copyExit -gt 7) { throw "File copy failed (robocopy exit code $copyExit)." }

Push-Location $repoDir
try {
    if (Get-Command node -ErrorAction SilentlyContinue) {
        Write-Host 'Running JavaScript and portfolio validation...' -ForegroundColor Cyan
        & node --check '.\docs\script.js'
        if ($LASTEXITCODE -ne 0) { throw 'JavaScript syntax validation failed.' }
        & node '.\scripts\validate-site.mjs'
        if ($LASTEXITCODE -ne 0) { throw 'Portfolio validation failed. Push cancelled.' }
    } else {
        Write-Warning 'Node.js is unavailable. Automated portfolio validation was skipped.'
    }

    Write-Host 'Staging and reviewing portfolio changes...' -ForegroundColor Cyan
    & git add -A
    if ($LASTEXITCODE -ne 0) { throw 'Git add failed.' }
    & git --no-pager diff --cached --stat
    if ($LASTEXITCODE -ne 0) { throw 'Git staged diff failed.' }

    & git diff --cached --quiet
    $diffExit = $LASTEXITCODE
    if ($diffExit -eq 1) {
        & git commit -m 'Update Studio Anime Portfolio with personal anime artwork'
        if ($LASTEXITCODE -ne 0) {
            throw 'Git commit failed. If Git requests identity configuration, set git user.name and user.email.'
        }
    } elseif ($diffExit -eq 0) {
        Write-Host 'No file differences; checking remote commit.' -ForegroundColor Yellow
    } else {
        throw "Git diff failed (exit code $diffExit)."
    }

    Write-Host 'Pushing commit to GitHub main...' -ForegroundColor Cyan
    & git push origin main
    if ($LASTEXITCODE -ne 0) { throw 'Push failed. Check authentication, permissions or remote changes.' }

    # Compare the remote HEAD with this local commit: prevents false success reports.
    $localCommit = (& git rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Could not read local commit.' }
    $remoteRef = & git ls-remote origin refs/heads/main
    if ($LASTEXITCODE -ne 0 -or -not $remoteRef) { throw 'Could not verify remote main.' }
    $remoteCommit = (($remoteRef | Select-Object -First 1) -split '\s+')[0]
    if ($remoteCommit -ne $localCommit) {
        throw "Remote main does not match local commit. Local: $localCommit Remote: $remoteCommit"
    }

    Write-Host ''
    Write-Host 'SUCCESS: GitHub main matches local commit.' -ForegroundColor Green
    Write-Host "Commit: $localCommit" -ForegroundColor Green
    Write-Host "Repository: https://github.com/Ir786106/Ir786106"
    Write-Host "GitHub Pages (if enabled): https://ir786106.github.io/Ir786106/"
    Write-Host "Local copy: $repoDir"
} finally {
    Pop-Location
}
