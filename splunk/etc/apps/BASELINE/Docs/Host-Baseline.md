# Host Baseline Components

## Search Installed Programs

To effectively search for installed programs on both Debian and RedHat systems, consider leveraging system logs and databases alongside manual checks in common directories.

* For Debian, inspect `/var/lib/dpkg/status` and `/var/log/dpkg.log` to fetch details about package installations, using grep to filter for specific information.
* RedHat users can query the RPM database with `rpm -qa --root=/mntpath/var/lib/rpm` to list installed packages.

To uncover software installed manually or outside of these package managers, explore directories like `/usr/local`, `/opt`, `/usr/sbin`, `/usr/bin`, `/bin`, and `/sbin`. Combine directory listings with system-specific commands to identify executables not associated with known packages, enhancing your search for all installed programs.

### Debian package and log details
```bash
cat /var/lib/dpkg/status | grep -E "Package:|Status:"
cat /var/log/dpkg.log | grep installed
```

### RedHat RPM database query
```bash
rpm -qa --root=/mntpath/var/lib/rpm
```

### Listing directories for manual installations
```bash
ls /usr/sbin /usr/bin /bin /sbin
```

### Identifying non-package executables (Debian)
```bash
find /sbin/ -exec dpkg -S {} \; | grep "no path found"
```

### Identifying non-package executables (RedHat)
```bash
find /sbin/ -exec rpm -qf {} \; | grep "is not"
```

### Find executable files
```bash
find / -type f -executable | grep <something>
```

## Recover Deleted Running Binaries

Imagine a process that was executed from `/tmp/exec` and deleted. It's possible to extract it:

```bash
cd /proc/3746/ # PID with the exec file deleted
head -1 maps # Get address of the file. It was 08048000-08049000
dd if=mem bs=1 skip=08048000 count=1000 of=/tmp/exec2 # Recover it
```

## Inspect Autostart Locations

### Scheduled Tasks
```bash
cat /var/spool/cron/crontabs/* \
    /var/spool/cron/atjobs \
    /var/spool/anacron \
    /etc/cron* \
    /etc/at* \
    /etc/anacrontab \
    /etc/incron.d/* \
    /var/spool/incron/*
```

### MacOS
```bash
ls -l /usr/lib/cron/tabs/ /Library/LaunchAgents/ /Library/LaunchDaemons/ ~/Library/LaunchAgents/
```

### Services

Paths where a malware could be installed as a service:

* `/etc/inittab`: Calls initialization scripts like rc.sysinit, directing further to startup scripts.
* `/etc/rc.d/` and `/etc/rc.boot/`: Contain scripts for service startup, the latter being found in older Linux versions.
* `/etc/init.d/`: Used in certain Linux versions like Debian for storing startup scripts.
* Services may also be activated via `/etc/inetd.conf` or `/etc/xinetd/`, depending on the Linux variant.
* `/etc/systemd/system`: A directory for system and service manager scripts.
* `/etc/systemd/system/multi-user.target.wants/`: Contains links to services that should be started in a multi-user runlevel.
* `/usr/local/etc/rc.d/`: For custom or third-party services.
* `~/.config/autostart/`: For user-specific automatic startup applications, which can be a hiding spot for user-targeted malware.
* `/lib/systemd/system/`: System-wide default unit files provided by installed packages.

### Kernel Modules

Linux kernel modules, often utilized by malware as rootkit components, are loaded at system boot. The directories and files critical for these modules include:

* `/lib/modules/$(uname -r)`: Holds modules for the running kernel version.
* `/etc/modprobe.d`: Contains configuration files to control module loading.
* `/etc/modprobe` and `/etc/modprobe.conf`: Files for global module settings.

### Other Autostart Locations

Linux employs various files for automatically executing programs upon user login, potentially harboring malware:

* `/etc/profile.d/*`, `/etc/profile`, and `/etc/bash.bashrc`: Executed for any user login.
* `~/.bashrc`, `~/.bash_profile`, `~/.profile`, and `~/.config/autostart`: User-specific files that run upon their login.
* `/etc/rc.local`: Runs after all system services have started, marking the end of the transition to a multiuser environment.

## Examine Logs

Linux systems track user activities and system events through various log files. These logs are pivotal for identifying unauthorized access, malware infections, and other security incidents. Key log files include:

* `/var/log/syslog` (Debian) or `/var/log/messages` (RedHat): Capture system-wide messages and activities.
* `/var/log/auth.log` (Debian) or `/var/log/secure` (RedHat): Record authentication attempts, successful and failed logins.
  * Use `grep -iE "session opened for|accepted password|new session|not in sudoers" /var/log/auth.log` to filter relevant authentication events.
* `/var/log/boot.log`: Contains system startup messages.
* `/var/log/maillog` or `/var/log/mail.log`: Logs email server activities, useful for tracking email-related services.
* `/var/log/kern.log`: Stores kernel messages, including errors and warnings.
* `/var/log/dmesg`: Holds device driver messages.
* `/var/log/faillog`: Records failed login attempts, aiding in security breach investigations.
* `/var/log/cron`: Logs cron job executions.
* `/var/log/daemon.log`: Tracks background service activities.
* `/var/log/btmp`: Documents failed login attempts.
* `/var/log/httpd/`: Contains Apache HTTPD error and access logs.
* `/var/log/mysqld.log` or `/var/log/mysql.log`: Logs MySQL database activities.
* `/var/log/xferlog`: Records FTP file transfers.
* `/var/log/`: Always check for unexpected logs here.

Linux system logs and audit subsystems may be disabled or deleted in an intrusion or malware incident. Because logs on Linux systems generally contain some of the most useful information about malicious activities, intruders routinely delete them. Therefore, when examining available log files, it is important to look for gaps or out of order entries that might be an indication of deletion or tampering.

Linux maintains a command history for each user, stored in:
* `~/.bash_history`
* `~/.zsh_history`
* `~/.zsh_sessions/*`
* `~/.python_history`
* `~/.*_history`

Moreover, the `last -Faiwx` command provides a list of user logins. Check it for unknown or unexpected logins.

### Check files that can grant extra privileges:
* Review `/etc/sudoers` for unanticipated user privileges that may have been granted.
* Review `/etc/sudoers.d/` for unanticipated user privileges that may have been granted.
* Examine `/etc/groups` to identify any unusual group memberships or permissions.
* Examine `/etc/passwd` to identify any unusual group memberships or permissions.

### Some apps also generate their own logs:
* SSH: Examine `~/.ssh/authorized_keys` and `~/.ssh/known_hosts` for unauthorized remote connections.
* Gnome Desktop: Look into `~/.recently-used.xbel` for recently accessed files via Gnome applications.
* Firefox/Chrome: Check browser history and downloads in `~/.mozilla/firefox` or `~/.config/google-chrome` for suspicious activities.
* VIM: Review `~/.viminfo` for usage details, such as accessed file paths and search history.
* Open Office: Check for recent document access that may indicate compromised files.
* FTP/SFTP: Review logs in `~/.ftp_history` or `~/.sftp_history` for file transfers that might be unauthorized.
* MySQL: Investigate `~/.mysql_history` for executed MySQL queries, potentially revealing unauthorized database activities.
* Less: Analyze `~/.lesshst` for usage history, including viewed files and commands executed.
* Git: Examine `~/.gitconfig` and project `.git/logs` for changes to repositories.

## USB Logs

`usbrip` is a small piece of software written in pure Python 3 which parses Linux log files (`/var/log/syslog*` or `/var/log/messages*` depending on the distro) for constructing USB event history tables.

It is interesting to know all the USBs that have been used and it will be more useful if you have an authorized list of USBs to find "violation events" (the use of USBs that aren't inside that list).

### Installation
```bash
pip3 install usbrip
usbrip ids download # Download USB ID database
```

### Examples
```bash
usbrip events history # Get USB history of your current linux machine
usbrip events history --pid 0002 --vid 0e0f --user kali # Search by pid OR vid OR user
# Search for vid and/or pid
usbrip ids download # Download database
usbrip ids search --pid 0002 --vid 0e0f # Search for pid AND vid
```

## Review User Accounts and Logon Activities

Examine the `/etc/passwd`, `/etc/shadow` and security logs for unusual names or accounts created and or used in close proximity to known unauthorized events. Also, check possible sudo brute-force attacks. Moreover, check files like `/etc/sudoers` and `/etc/groups` for unexpected privileges given to users. Finally, look for accounts with no passwords or easily guessed passwords.

## Examine File System

### Analyzing File System Structures in Malware Investigation

When investigating malware incidents, the structure of the file system is a crucial source of information, revealing both the sequence of events and the malware's content. However, malware authors are developing techniques to hinder this analysis, such as modifying file timestamps or avoiding the file system for data storage.

To counter these anti-forensic methods, it's essential to:

* Conduct a thorough timeline analysis using tools like Autopsy for visualizing event timelines or Sleuth Kit's `mactime` for detailed timeline data.
* Investigate unexpected scripts in the system's `$PATH`, which might include shell or PHP scripts used by attackers.
* Examine `/dev` for atypical files, as it traditionally contains special files, but may house malware-related files.
* Search for hidden files or directories with names like ".. " (dot dot space) or "..^G" (dot dot control-G), which could conceal malicious content.
* Identify setuid root files using the command: `find / -user root -perm -04000 -print` This finds files with elevated permissions, which could be abused by attackers.
* Review deletion timestamps in inode tables to spot mass file deletions, possibly indicating the presence of rootkits or trojans.
* Inspect consecutive inodes for nearby malicious files after identifying one, as they may have been placed together.
* Check common binary directories (`/bin`, `/sbin`) for recently modified files, as these could be altered by malware.

List recent files in a directory: 
```bash
ls -laR --sort=time /bin
```

Sort files in a directory by inode:
```bash
ls -lai /bin | sort -n
```

Note that an attacker can modify the time to make files appear legitimate, but he cannot modify the inode. If you find that a file indicates that it was created and modified at the same time as the rest of the files in the same folder, but the node is unexpectedly bigger, then the timestamps of that file were modified.

## Compare Files of Different Filesystem Versions

### Filesystem Version Comparison Summary

To compare filesystem versions and pinpoint changes, we use simplified git diff commands:

* To find new files, compare two directories:
```bash
git diff --no-index --diff-filter=A path/to/old_version/ path/to/new_version/
```

* For modified content, list changes while ignoring specific lines:
```bash
git diff --no-index --diff-filter=M path/to/old_version/ path/to/new_version/ | grep -E "^\+" | grep -v "Installed-Time"
```

* To detect deleted files:
```bash
git diff --no-index --diff-filter=D path/to/old_version/ path/to/new_version/
```

* Filter options (`--diff-filter`) help narrow down to specific changes like added (A), deleted (D), or modified (M) files.
  * A: Added files
  * C: Copied files
  * D: Deleted files
  * M: Modified files
  * R: Renamed files
  * T: Type changes (e.g., file to symlink)
  * U: Unmerged files
  * X: Unknown files
  * B: Broken files