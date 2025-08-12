# SuperMem Full Container
# Includes all forensic tools via the official setup_supermem.sh script
FROM debian:bullseye

# Avoid interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Set SuperMem environment variables
ENV SUPERMEM_HOME=/opt/SuperMem
ENV PATH="${SUPERMEM_HOME}:${PATH}"

# Install prerequisites for the setup script
RUN apt-get update && apt-get install -y \
    software-properties-common \
    wget \
    unzip \
    python2 \
    python3 \
    python3-pip \
    git \
    make

# Create necessary directories
RUN mkdir -p /opt /data/input /data/output /data/yara

# Clone SuperMem repository
RUN wget https://github.com/CrowdStrike/SuperMem/archive/refs/heads/main.zip -O /opt/SuperMem.zip && \
    unzip /opt/SuperMem.zip -d /opt && \
    mv /opt/SuperMem-main /opt/SuperMem && \
    rm /opt/SuperMem.zip

# Set working directory
WORKDIR /opt/SuperMem

# Make setup script executable and run it
RUN chmod +x /opt/SuperMem/setup_supermem.sh && \
    /opt/SuperMem/setup_supermem.sh || echo "Setup completed with warnings"

# Install Python requirements if they exist
RUN if [ -f requirements.txt ]; then pip3 install -r requirements.txt; fi

# Copy and set up entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose volume mount points
VOLUME ["/data/input", "/data/output", "/data/yara"]

# Set default working directory
WORKDIR /data

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]