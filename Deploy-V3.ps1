# From the extracted Ir786106-main directory, run: & .\Deploy-V3.ps1
# Does NOT force-push and does NOT delete unrelated files in your repository.
$ErrorActionPreference = 'Stop'
$sourceDir = $PSScriptRoot
$repoUrl = 'https://github.com/Ir786106/Ir786106.git'

if (!(Test-Path (Join-Path $sourceDir 'docs\index.html'))) {
    throw 'Portfolio website not found. Extract the ZIP before running this script.'
}
if (!(Test-Path (Join-Path $sourceDir 'README.md'))) {
    throw 'GitHub README not found.'
}
if (!(Test-Path (Join-Path $sourceDir 'assets\profile\irfan-anime-banner.png'))) { throw 'Anime README banner is missing.' }
if (!(Test-Path (Join-Path $sourceDir 'docs\assets\irfan-anime-portrait.webp'))) { throw 'Anime website portrait is missing.' }

$baseDir = 'D:\Irfan_Project'
if (!(Test-Path $baseDir)) { $baseDir = $HOME }
$workspace = Join-Path $baseDir ('Portfolio_V3_Deploy_' + (Get-Date -Format 'yyyyMMdd_HHmmss'))
New-Item -ItemType Directory -Force -Path $workspace | Out-Null
$repoDir = Join-Path $workspace 'Ir786106'

Write-Host 'Cloning GitHub repository...' -ForegroundColor Cyan
git clone --branch main $repoUrl $repoDir
if ($LASTEXITCODE -ne 0) { throw 'Git clone failed.' }

Write-Host 'Copying V3 files while preserving .git...' -ForegroundColor Cyan
robocopy $sourceDir $repoDir /E /R:2 /W:1 /XD '.git' /XF 'Deploy-V3.ps1'
$copyResult = $LASTEXITCODE
if ($copyResult -gt 7) { throw 'File copy failed.' }

Set-Location $repoDir
$env:GIT_PAGER = 'cat'
git add -A
if ($LASTEXITCODE -ne 0) { throw 'git add failed.' }
Write-Host 'Reviewing staged files...' -ForegroundColor Cyan
git -c core.pager=cat diff --cached --stat

git diff --cached --quiet
$diffCode = $LASTEXITCODE
if ($diffCode -eq 1) {
    git commit -m 'Add personalized anime image to Studio Portfolio V3'
    if ($LASTEXITCODE -ne 0) { throw 'git commit failed.' }
} elseif ($diffCode -ne 0) { throw 'git diff failed.' }

Write-Host 'Pushing to main...' -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) { throw 'Push failed. Check GitHub login and remote changes.' }

git status
Write-Host 'SUCCESS: Studio Portfolio V3 with anime image pushed to GitHub.' -ForegroundColor Green
Write-Host 'GitHub: https://github.com/Ir786106'
Write-Host 'Pages:  https://ir786106.github.io/Ir786106/'
Write-Host "Workspace: $repoDir"
