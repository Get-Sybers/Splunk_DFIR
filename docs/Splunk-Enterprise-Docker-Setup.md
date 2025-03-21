# 📂 Splunk Enterprise Docker Setup

This document describes the functionality and operation of the provided shell script, which securely deploys a **Splunk Enterprise** instance within a Docker container, integrates custom configurations, apps, and processed data, and manages permissions and Docker volumes.

---

## 🚀 Functionality

### **Script Overview**

- Securely prompts for and confirms the Splunk administrator password.
- Dynamically sets permissions and ownership for required Splunk directories.
- Mounts essential directories (Splunk configurations, logs, processed data, and Ansible playbooks) into the Docker container.
- Runs Splunk Enterprise with predefined Ansible playbooks for custom application integration.

---

## 📋 Operation Steps

1. Dynamically resolves and assigns paths for necessary directories (`splunk/etc`, `splunk/var`, `data_store/processed`, `splunk/ansible`).
2. Securely prompts the user to input and confirm the Splunk admin password.
3. Sets directory permissions and ownership for Docker container access.
4. Runs a Splunk Enterprise Docker container:
   - Mounts configuration and data directories.
   - Integrates custom apps through an Ansible pre-task (`Include-Custom-Apps.yml`).
   - Sets Splunk environment variables including admin password, acceptance of the license, and popup suppression.
5. Verifies container startup and provides real-time log streaming for immediate feedback.

---

This script facilitates secure, automated deployment of Splunk Enterprise, ensuring consistent configurations and simplifying custom app integrations.

