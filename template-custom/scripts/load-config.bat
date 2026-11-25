@echo off
rem Reads project.config from the current folder (the project root).
rem build.bat and start.bat call this file. Do not run it directly.
rem
rem Each KEY=VALUE line sets the variable CFG_<KEY>. Lines that start with "#" and empty lines are ignored.
rem This file does not run the config as code. It only reads KEY=VALUE lines.
for %%F in (project.config) do (
    if exist "%%F" (
        for /f "usebackq eol=# tokens=1,* delims==" %%A in ("%%F") do set "CFG_%%A=%%B"
    )
)
exit /b 0
