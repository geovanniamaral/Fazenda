$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$photosRoot = Join-Path $projectRoot 'assets\images\site'
$catalogPath = Join-Path $projectRoot 'assets\js\photo-catalog.js'
$categories = @('hero', 'chales', 'espaco-gastronomico', 'eventos', 'baias', 'paisagens')
$validExtensions = @('.jpg', '.jpeg', '.png', '.webp', '.avif')
$catalog = [ordered]@{}

foreach ($category in $categories) {
  $categoryPath = Join-Path $photosRoot $category
  if (-not (Test-Path -LiteralPath $categoryPath -PathType Container)) {
    New-Item -ItemType Directory -Path $categoryPath -Force | Out-Null
  }

  $catalog[$category] = @(
    Get-ChildItem -LiteralPath $categoryPath -File |
      Where-Object { $validExtensions -contains $_.Extension.ToLowerInvariant() } |
      Sort-Object Name |
      ForEach-Object { "assets/images/site/$category/$($_.Name)" }
  )
}

$json = $catalog | ConvertTo-Json -Depth 4
$content = @"
/* Arquivo gerado automaticamente. Nao edite: use as pastas em assets/images/site/. */
window.FAZENDA_PHOTOS = $json;
"@

[IO.File]::WriteAllText($catalogPath, $content, [Text.UTF8Encoding]::new($false))
$count = ($catalog.Values | ForEach-Object { $_ }).Count
Write-Output "Catalogo atualizado: $count foto(s) em $catalogPath"
