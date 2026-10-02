$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$distPath = Join-Path $projectRoot 'dist'
$expectedDistPath = [IO.Path]::GetFullPath($distPath)
$resolvedProjectRoot = [IO.Path]::GetFullPath($projectRoot).TrimEnd('\')

& (Join-Path $projectRoot 'GERAR_CATALOGO_FOTOS.ps1')

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
Copy-Item -LiteralPath (Join-Path $projectRoot 'assets\js\photo-catalog.js') -Destination (Join-Path $distPath 'assets\js')
Copy-Item -LiteralPath (Join-Path $projectRoot 'assets\images\site') -Destination (Join-Path $distPath 'assets\images') -Recurse

$python = Get-Command python.exe -ErrorAction SilentlyContinue
if (-not $python) {
  $python = Get-Command py.exe -ErrorAction SilentlyContinue
}
if (-not $python) {
  throw 'Python não foi encontrado. Não foi possível otimizar as fotos para publicação.'
}

& $python.Source (Join-Path $projectRoot 'OTIMIZAR_FOTOS.py') (Join-Path $distPath 'assets\images\site')
if ($LASTEXITCODE -ne 0) {
  throw 'A otimização das fotos falhou.'
}

$files = Get-ChildItem -LiteralPath $distPath -Recurse -File
$sizeMb = [Math]::Round((($files | Measure-Object Length -Sum).Sum / 1MB), 2)
Write-Output "Publicação preparada em: $distPath"
Write-Output "Arquivos: $($files.Count) | Tamanho: $sizeMb MB"
