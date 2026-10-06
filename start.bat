@echo off
title EventHub - Centralized Event Management Portal
echo ========================================================
echo Starting EventHub Portal (Student & Organizer Hub)...
echo ========================================================
echo.
start "" "http://localhost:3000"
node server.js
pause
