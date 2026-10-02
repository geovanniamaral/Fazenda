@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title Fazenda Rio Acima - Publicar no Netlify
set "NETLIFY_SITE_ID=7629bdb8-edf1-4332-9e2c-0ec4d5154450"

echo ============================================================
echo   FAZENDA RIO ACIMA - PUBLICAÇÃO NO NETLIFY
echo ============================================================
echo.
echo Preparando fotos e arquivos do site...

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0PREPARAR_PUBLICACAO.ps1"
if errorlevel 1 goto :erro_preparo

echo.
echo A pasta dist foi preparada com sucesso.

if /I "%~1"=="--prepare-only" goto :sucesso_preparo

set "NETLIFY_CMD=%~dp0.netlify-cli\node_modules\.bin\netlify.cmd"
if exist "%NETLIFY_CMD%" goto :confirmar

for %%I in (netlify.cmd) do set "NETLIFY_CMD=%%~$PATH:I"
if defined NETLIFY_CMD goto :confirmar

echo.
echo ERRO: o Netlify CLI não foi encontrado.
echo A pasta dist está pronta, mas a publicação não foi enviada.
echo Consulte o README.md para reinstalar ou configurar o Netlify CLI.
goto :fim_erro

:confirmar
echo.
choice /C SN /N /M "Publicar agora no site de produção? [S/N]: "
if errorlevel 2 goto :cancelado

echo.
echo Enviando a pasta dist para o Netlify...
call "%NETLIFY_CMD%" deploy --prod --site="%NETLIFY_SITE_ID%" --dir="%~dp0dist"
if errorlevel 1 goto :erro_netlify

echo.
echo ============================================================
echo   PUBLICAÇÃO CONCLUÍDA COM SUCESSO
echo ============================================================
echo Confira acima o endereço publicado pelo Netlify.
goto :fim_ok

:sucesso_preparo
echo Modo de teste: somente a preparação foi executada.
goto :fim_ok

:cancelado
echo.
echo Publicação cancelada. A pasta dist continua pronta.
goto :fim_ok

:erro_preparo
echo.
echo ERRO: não foi possível preparar os arquivos do site.
goto :fim_erro

:erro_netlify
echo.
echo ERRO: o Netlify não concluiu a publicação.
echo O site configurado é fazendarioacima.netlify.app.
echo Se a sessão tiver expirado, talvez seja necessário fazer login novamente.
echo Execute no terminal: .netlify-cli\node_modules\.bin\netlify.cmd login
goto :fim_erro

:fim_ok
echo.
if /I not "%~1"=="--prepare-only" pause
exit /b 0

:fim_erro
echo.
pause
exit /b 1
