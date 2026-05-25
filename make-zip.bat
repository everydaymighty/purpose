@echo off
REM Double-click this file to create pathway-site.zip with all the website files.
cd /d "%~dp0"
powershell -NoProfile -Command "Compress-Archive -Path 'index.html','signin.html','signup.html','jobs.html','job.html','profile.html','employers.html','styles.css' -DestinationPath 'pathway-site.zip' -Force"
if exist pathway-site.zip (
  echo.
  echo Created pathway-site.zip
) else (
  echo.
  echo Something went wrong - the zip was not created.
)
echo.
pause
