@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title Fazenda Rio Acima - GitHub

where git.exe >nul 2>&1
if errorlevel 1 (
  echo ERRO: o Git não foi encontrado neste computador.
  pause
  exit /b 1
)

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo ERRO: esta pasta não é um repositório Git.
  pause
  exit /b 1
)

if /I "%~1"=="status" goto :status
if /I "%~1"=="buscar" goto :buscar
if /I "%~1"=="enviar" goto :enviar

:menu
cls
echo ============================================================
echo   FAZENDA RIO ACIMA - SINCRONIZAÇÃO COM O GITHUB
echo ============================================================
echo.
echo   [1] Ver situação dos arquivos
echo   [2] Buscar e aplicar atualizações do GitHub
echo   [3] Enviar minhas alterações para o GitHub
echo   [4] Apenas verificar novidades no GitHub
echo   [5] Sair
echo.
choice /C 12345 /N /M "Escolha uma opção [1-5]: "
if errorlevel 5 exit /b 0
if errorlevel 4 goto :verificar
if errorlevel 3 goto :enviar
if errorlevel 2 goto :buscar
if errorlevel 1 goto :status

:status
call :cabecalho
git status --short --branch
goto :voltar

:verificar
call :cabecalho
echo Buscando informações do GitHub sem alterar seus arquivos...
git fetch --prune origin
if errorlevel 1 goto :erro_git
echo.
git status --short --branch
goto :voltar

:buscar
call :cabecalho
call :branch_atual
if errorlevel 1 goto :erro_git
echo Buscando e aplicando atualizações de origin/%CURRENT_BRANCH%...
git pull --rebase --autostash origin "%CURRENT_BRANCH%"
if errorlevel 1 goto :erro_conflito
echo.
echo Atualização concluída.
goto :voltar

:enviar
call :cabecalho
call :branch_atual
if errorlevel 1 goto :erro_git

echo Arquivos que serão considerados:
git status --short
echo.
choice /C SN /N /M "Preparar o site, registrar e enviar estas alterações? [S/N]: "
if errorlevel 2 goto :cancelado

echo.
echo Atualizando a pasta dist antes do envio...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0PREPARAR_PUBLICACAO.ps1"
if errorlevel 1 goto :erro_preparo

git add --all
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Atualização do site da Fazenda Rio Acima"
  if errorlevel 1 goto :erro_git
) else (
  echo Nenhuma alteração nova para registrar. Verificando commits existentes...
)

echo.
echo Sincronizando antes do envio...
git pull --rebase origin "%CURRENT_BRANCH%"
if errorlevel 1 goto :erro_conflito

echo.
echo Enviando para origin/%CURRENT_BRANCH%...
git push origin "%CURRENT_BRANCH%"
if errorlevel 1 goto :erro_git

echo.
echo ============================================================
echo   ENVIO AO GITHUB CONCLUÍDO COM SUCESSO
echo ============================================================
goto :voltar

:branch_atual
set "CURRENT_BRANCH="
for /f "delims=" %%B in ('git branch --show-current') do set "CURRENT_BRANCH=%%B"
if not defined CURRENT_BRANCH (
  echo ERRO: não foi possível identificar a branch atual.
  exit /b 1
)
exit /b 0

:cabecalho
cls
echo ============================================================
echo   FAZENDA RIO ACIMA - GITHUB
echo ============================================================
echo.
exit /b 0

:cancelado
echo.
echo Operação cancelada. Nenhum arquivo foi enviado.
goto :voltar

:erro_preparo
echo.
echo ERRO: a preparação do site falhou. Nada foi enviado.
goto :voltar_erro

:erro_conflito
echo.
echo ATENÇÃO: o Git encontrou um conflito ou não conseguiu atualizar.
echo Nenhum push foi executado. Abra o terminal para revisar o estado com: git status
goto :voltar_erro

:erro_git
echo.
echo ERRO: o Git não concluiu a operação. Confira a mensagem acima.
goto :voltar_erro

:voltar
echo.
if not "%~1"=="" exit /b 0
pause
goto :menu

:voltar_erro
echo.
if not "%~1"=="" exit /b 1
pause
goto :menu
