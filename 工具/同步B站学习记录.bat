@echo off
chcp 65001 >nul
title 同步 B 站学习记录 · 机器学习 15 讲
cd /d "%~dp0.."

where python >nul 2>nul
if errorlevel 1 (
  echo.
  echo [错误] 没找到 python。请先安装 Python 3（安装时勾选 Add to PATH）。
  echo.
  pause
  exit /b 1
)

python "工具\同步B站学习记录.py" %*

echo.
echo 如果上面显示同步成功，接着执行：git add ml15/data/learnlog.js ^&^& git commit -m "feat(ml15): 同步 B 站学习记录" ^&^& git push
echo.
pause
