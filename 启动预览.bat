@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo   廖恒 · 学习进度  本地预览
echo   ------------------------------------
echo.

where python >nul 2>nul
if %errorlevel%==0 (
    echo   正在启动 http://localhost:8000
    echo   关掉这个窗口即停止服务
    echo.
    start "" "http://localhost:8000"
    python -m http.server 8000
    goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
    start "" "http://localhost:8000"
    py -m http.server 8000
    goto :eof
)

echo   没找到 Python，直接用浏览器打开页面（功能一样，只是手机连不上）。
echo.
start "" "index.html"
pause
