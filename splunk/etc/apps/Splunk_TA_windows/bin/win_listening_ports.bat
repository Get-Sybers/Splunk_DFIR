@echo off
REM --------------------------------------------------------
REM Copyright (C) 2021 Splunk Inc. All Rights Reserved.
REM --------------------------------------------------------

setlocal EnableDelayedExpansion

REM Get the current date and time into a variable
for /f "usebackq tokens=1,2 delims==" %%i in (`wmic os get LocalDateTime /value 2^>nul`) do if '.%%i.'=='.LocalDateTime.' set date_time=%%j
set date_time=%date_time:~0,4%-%date_time:~4,2%-%date_time:~6,2% %date_time:~8,2%:%date_time:~10,2%:%date_time:~12,6%

REM Get the Tasklist command output and store array with pid and processname
for /f "tokens=1,2 delims=," %%T in ('tasklist /nh  /fo csv') do (
     set topic[%%~U]=%%~T
)

REM Get the list of open ports by running netstat and filtering the results to those that contain actual ports (dropping the header)
for /f "tokens=*" %%A in ('netstat -nao ^| findstr /r "LISTENING"') do (
    set "line=%%A"
    REM Replace % with %%
    set "line=!line:%%=%%%%!"
    call :output_ports "!line!"
)
goto :eof

:output_ports
	REM Parse the ports list
	for /f "tokens=1,2,4,5 delims= " %%A in (%1) do (
		set protocol=%%A
		set dest=%%B
		set status=%%C
		set pid=%%D
		set appname=!topic[%%D]!
	)

	REM Skip the header
	if "!protocol!"=="Proto" goto :eof
	if "!protocol!"=="Active" goto :eof

	REM Condition to ckeck IPv6 address
    if "!dest:~0,1!"=="[" (
        for /f "tokens=1,2 delims=]" %%Q in ("!dest!") do (
            set full_ipv6=%%Q
            set full_ipv6=!full_ipv6:~1!
            set dest_ip=[!full_ipv6!]
            set dest_port_temp=%%R
			REM Below block is to remove leading ':' from dest_port_temp
            for /f "tokens=1* delims=:" %%X in ("!dest_port_temp!") do (
                set dest_port=%%X
            )
        )
    ) else (
        for /f "tokens=1,2 delims=:" %%F in ("!dest!") do (
            set dest_ip=%%F
            set dest_port=%%G
        )
    )

	REM Replace the dest IP with the empty IP range if necessary
	if "!dest_ip!"=="[" set dest_ip=[::]

	REM Print out the result
	echo %date_time% transport=%protocol% dest_ip=%dest_ip% dest_port=%dest_port% pid=!pid! appname=%appname%
