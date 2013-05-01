@ECHO OFF

set ProjectFolder=C:\Workshop\Planner

IF "%1"=="" GOTO BOTH
IF "%1"=="f" GOTO FOLDER
IF "%1"=="g" GOTO GIT

:FOLDER
	start C:\Workshop\Planner /C
GOTO END

:GIT
	REM	wscript "C:\Program Files (x86)\Git\Git Bash.vbs" "%ProjectFolder%"

	REM assuming the Console2 path is in the environment variable
	start Console -t Planner
GOTO END

:BOTH
	wscript "C:\Program Files (x86)\Git\Git Bash.vbs" "%ProjectFolder%"
	start C:\Workshop\Planner /C
	
:END