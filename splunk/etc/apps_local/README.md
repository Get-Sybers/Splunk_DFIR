# App override overlay

Project-specific settings for **third-party** apps go here, and are copied into
the installed app's `local/` directory at deploy time by
[`Apply-App-Overrides.yml`](/ansible/playbooks/Apply-App-Overrides.yml).

That playbook runs as a **post-task**, not a pre-task. splunk-ansible's
`site.yml` runs `pre_tasks → provisioning role → post_tasks`, and the role is
what installs apps from `SPLUNK_APPS_URL`. As a pre-task these copies would
target app directories that don't exist yet and silently do nothing.

```
splunk/etc/apps_local/<AppName>/local/<file>.conf
        ↓  copied to
/opt/splunk/etc/apps/<AppName>/local/<file>.conf
```

## Why `local/` and not `default/`

Splunk layers configuration: `default/` holds the vendor's shipped values,
`local/` holds site changes, and `local/` wins. Editing a third-party app's
`default/` means the next app upgrade silently reverts your change — and makes
it hard to tell what you altered versus what shipped.

Putting overrides here keeps them separate from the vendor's files and lets the
app be reinstalled or upgraded without losing them.

## Currently

Empty. The mechanism is wired and ready; no overrides are needed yet.
