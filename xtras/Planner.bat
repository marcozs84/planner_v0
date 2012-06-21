@ECHO OFF

set ProjectFolder=C:\Workshop\Planner

IF "%1"=="" GOTO BOTH
IF "%1"=="f" GOTO FOLDER
IF "%1"=="g" GOTO GIT

:FOLDER
	start C:\Workshop\Planner /C
GOTO END

:GIT
	wscript "C:\Program Files (x86)\Git\Git Bash.vbs" "%ProjectFolder%"
GOTO END

:BOTH
	wscript "C:\Program Files (x86)\Git\Git Bash.vbs" "%ProjectFolder%"
	start C:\Workshop\Planner /C
	
:END