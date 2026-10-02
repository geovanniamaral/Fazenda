@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title Fazenda Rio Acima - Manutenção do site

:menu
cls
echo ============================================================
echo   FAZENDA RIO ACIMA - MANUTENÇÃO DO SITE
echo ============================================================
echo.
echo   PASTAS DE FOTOS
echo   [1] Chalés
echo   [2] Espaço gastronômico
echo   [3] Eventos
echo   [4] Baias
echo   [5] Paisagens
echo   [6] Imagem do topo
echo.
echo   AÇÕES
echo   [7] Visualizar alterações sem publicar
echo   [8] Publicar no Netlify
echo   [9] Sincronizar com o GitHub
echo   [0] Sair
echo.
choice /C 1234567890 /N /M "Escolha uma opção [0-9]: "
if errorlevel 10 exit /b 0
if errorlevel 9 goto :github
if errorlevel 8 goto :publicar
if errorlevel 7 goto :visualizar
if errorlevel 6 goto :hero
if errorlevel 5 goto :paisagens
if errorlevel 4 goto :baias
if errorlevel 3 goto :eventos
if errorlevel 2 goto :gastronomia
if errorlevel 1 goto :chales

:chales
start "" explorer.exe "%~dp0assets\images\site\chales"
goto :menu

:gastronomia
start "" explorer.exe "%~dp0assets\images\site\espaco-gastronomico"
goto :menu

:eventos
start "" explorer.exe "%~dp0assets\images\site\eventos"
goto :menu

:baias
start "" explorer.exe "%~dp0assets\images\site\baias"
goto :menu

:paisagens
start "" explorer.exe "%~dp0assets\images\site\paisagens"
goto :menu

:hero
start "" explorer.exe "%~dp0assets\images\site\hero"
goto :menu

:visualizar
call "%~dp0VISUALIZAR_SITE.bat"
goto :menu

:publicar
call "%~dp0PUBLICAR_NETLIFY.bat"
goto :menu

:github
call "%~dp0GITHUB_SINCRONIZAR.bat"
goto :menu
