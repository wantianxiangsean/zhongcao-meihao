@echo off
chcp 65001 >nul
cd /d "%~dp0"
start "" /min cmd /c "timeout /t 1 >nul && start http://localhost:4321"
node server.js
pause
