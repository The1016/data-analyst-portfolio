@echo off
setlocal
cd /d "%~dp0"
title Zawwadul Portfolio - Local Preview
echo Open http://localhost:5500 in your browser after the server starts.
echo Keep this window open while testing. Press Ctrl+C to stop.
echo.
where py >nul 2>nul
if not errorlevel 1 (
  py -m http.server 5500 --bind 127.0.0.1
) else (
  where python >nul 2>nul
  if not errorlevel 1 (
    python -m http.server 5500 --bind 127.0.0.1
  ) else (
    echo Python was not found. You can still open index.html directly.
  )
)
pause
endlocal
