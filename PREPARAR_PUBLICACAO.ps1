$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$distPath = Join-Path $projectRoot 'dist'
$expectedDistPath = [IO.Path]::GetFullPath($distPath)
$resolvedProjectRoot = [IO.Path]::GetFullPath($projectRoot).TrimEnd('\')

if (-not $expectedDistPath.StartsWith($resolvedProjectRoot + '\', [StringComparison]::OrdinalIgnoreCase)) {
  throw 'A pasta de publicação foi resolvida fora do projeto.'
}

if (Test-Path -LiteralPath $distPath) {
  Remove-Item -LiteralPath $distPath -Recurse -Force
}

New-Item -ItemType Directory -Path (Join-Path $distPath 'assets\css') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $distPath 'assets\js') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $distPath 'assets\images') -Force | Out-Null

Copy-Item -LiteralPath (Join-Path $projectRoot 'index.html') -Destination $distPath
Copy-Item -LiteralPath (Join-Path $projectRoot 'assets\css\style.css') -Destination (Join-Path $distPath 'assets\css')
Copy-Item -LiteralPath (Join-Path $projectRoot 'assets\js\main.js') -Destination (Join-Path $distPath 'assets\js')
Copy-Item -LiteralPath (Join-Path $projectRoot 'assets\images\site') -Destination (Join-Path $distPath 'assets\images') -Recurse

$files = Get-ChildItem -LiteralPath $distPath -Recurse -File
$sizeMb = [Math]::Round((($files | Measure-Object Length -Sum).Sum / 1MB), 2)
Write-Output "Publicação preparada em: $distPath"
Write-Output "Arquivos: $($files.Count) | Tamanho: $sizeMb MB"
