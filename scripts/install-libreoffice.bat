@echo off
setlocal EnableDelayedExpansion

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Please run as Administrator.
    pause
    exit /b 1
)

set SOFFICE=C:\Program Files\LibreOffice\program\soffice.exe
set INSTALLER=%TEMP%\LibreOffice_installer.msi

set URL1=https://ftp.byfly.by/pub/tdf/libreoffice/stable/26.2.2/win/x86_64/LibreOffice_26.2.2_Win_x86-64.msi
set URL2=https://ftp.gwdg.de/pub/tdf/libreoffice/stable/26.2.2/win/x86_64/LibreOffice_26.2.2_Win_x86-64.msi
set URL3=https://ftp.fau.de/tdf/libreoffice/stable/26.2.2/win/x86_64/LibreOffice_26.2.2_Win_x86-64.msi

echo Checking if LibreOffice is already installed...
if exist "%SOFFICE%" (
    echo Already installed.
    goto :done
)

if exist "%INSTALLER%" (
    for %%A in ("%INSTALLER%") do set EXISTING_SIZE=%%~zA
    if !EXISTING_SIZE! GEQ 104857600 (
        echo Found existing installer ^(!EXISTING_SIZE! bytes^), skipping download.
        goto :install
    ) else (
        echo Found existing installer but it is too small ^(!EXISTING_SIZE! bytes^), deleting...
        del /f /q "%INSTALLER%"
    )
)

echo Downloading LibreOffice ~355MB, please wait...
curl -L --retry 2 -o "%INSTALLER%" "%URL1%"
if %errorLevel% neq 0 (
    echo Mirror 1 failed, trying mirror 2...
    curl -L --retry 2 -o "%INSTALLER%" "%URL2%"
)
if %errorLevel% neq 0 (
    echo Mirror 2 failed, trying mirror 3...
    curl -L --retry 2 -o "%INSTALLER%" "%URL3%"
)
if %errorLevel% neq 0 (
    echo.
    echo ERROR: All mirrors failed.
    echo Please download manually from https://www.libreoffice.org/download/download-libreoffice/
    echo Save MSI to: %INSTALLER%
    echo Then re-run this script.
    pause
    exit /b 1
)


:install
echo Installing LibreOffice...
msiexec /i "%INSTALLER%" /qn /norestart /log "%~dp0msiexec.log"
echo Waiting for installation to complete...
timeout /t 10 /nobreak >nul

if not exist "%SOFFICE%" (
    echo soffice.exe not found at default path, searching...
    for /f "delims=" %%F in ('dir /s /b "C:\Program Files\soffice.exe" 2^>nul') do set SOFFICE=%%F
    for /f "delims=" %%F in ('dir /s /b "C:\Program Files (x86)\soffice.exe" 2^>nul') do set SOFFICE=%%F
)

if not exist "%SOFFICE%" (
    echo ERROR: soffice.exe not found. Check msiexec.log at %~dp0msiexec.log
    pause
    exit /b 1
)

del /f /q "%INSTALLER%"

:done
echo Done. LibreOffice: %SOFFICE%
pause
