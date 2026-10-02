param(
  [switch]$TestOnly
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
& (Join-Path $projectRoot 'PREPARAR_PUBLICACAO.ps1')
$previewRoot = Join-Path $projectRoot 'dist'

$python = Get-Command python.exe -ErrorAction SilentlyContinue
if (-not $python) {
  $python = Get-Command py.exe -ErrorAction SilentlyContinue
}
if (-not $python) {
  throw 'Python não foi encontrado. Instale o Python ou abra o index.html diretamente.'
}

$portFinder = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, 0)
$portFinder.Start()
$port = ([Net.IPEndPoint]$portFinder.LocalEndpoint).Port
$portFinder.Stop()

$server = $null
try {
  $arguments = @('-m', 'http.server', $port, '--bind', '127.0.0.1', '--directory', "`"$previewRoot`"")
  $server = Start-Process -FilePath $python.Source -ArgumentList $arguments -PassThru -WindowStyle Hidden
  $url = "http://127.0.0.1:$port/"

  $available = $false
  for ($attempt = 0; $attempt -lt 20; $attempt++) {
    Start-Sleep -Milliseconds 250
    try {
      $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
      if ($response.StatusCode -eq 200) {
        $available = $true
        break
      }
    } catch {
      # Aguarda o servidor local terminar de iniciar.
    }
  }

  if (-not $available) {
    throw 'Não foi possível iniciar a visualização local.'
  }

  if ($TestOnly) {
    Write-Output 'Teste da visualização local concluído com sucesso.'
    return
  }

  Start-Process $url
  Write-Output ''
  Write-Output 'Site aberto para visualização. Nenhuma publicação foi realizada.'
  Write-Output 'Ao substituir uma foto com o mesmo nome, atualize a página no navegador.'
  Write-Output 'Ao adicionar ou excluir arquivos, feche e abra a visualização novamente.'
  Write-Output ''
  [void](Read-Host 'Pressione ENTER aqui quando terminar a visualização')
} finally {
  if ($server -and -not $server.HasExited) {
    Stop-Process -Id $server.Id -Force
  }
}
