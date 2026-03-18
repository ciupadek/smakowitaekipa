@echo off
cd /d %~dp0

echo ==========================
echo PUSH DO GITHUB
echo ==========================

git add .
git commit -m "auto update"
git push

echo ==========================
echo GOTOWE!
echo ==========================
pause
