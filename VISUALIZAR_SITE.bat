@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title Fazenda Rio Acima - Visualização local

echo ============================================================
echo   VISUALIZAR O SITE SEM PUBLICAR
echo ============================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0VISUALIZAR_SITE.ps1"
if errorlevel 1 (
  echo.
  echo ERRO: não foi possível abrir a visualização.
  pause
  exit /b 1
)

exit /b 0
