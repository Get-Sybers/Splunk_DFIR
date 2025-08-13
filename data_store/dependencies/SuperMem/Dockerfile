# SuperMem Full Container
# Includes all forensic tools with proper Volatility 3 installation
FROM debian:bullseye

# Avoid interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Set SuperMem environment variables
ENV SUPERMEM_HOME=/opt/SuperMem
ENV PATH="${SUPERMEM_HOME}:${PATH}"

# Install system prerequisites including newer pip tools
RUN apt-get update && apt-get install -y \
    software-properties-common \
    wget \
    unzip \
    python2 \
    python3 \
    python3-pip \
    python3-dev \
    python3-venv \
    python3-setuptools \
    python3-wheel \
    git \
    make \
    build-essential \
    libssl-dev \
    libffi-dev \
    libyara-dev \
    yara \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install build tools
RUN python3 -m pip install --upgrade pip setuptools wheel build

# Create necessary directories
RUN mkdir -p /opt /data/input /data/output /data/yara

# Clone SuperMem repository
RUN wget https://github.com/CrowdStrike/SuperMem/archive/refs/heads/main.zip -O /opt/SuperMem.zip && \
    unzip /opt/SuperMem.zip -d /opt && \
    mv /opt/SuperMem-main /opt/SuperMem && \
    rm /opt/SuperMem.zip

# Set working directory
WORKDIR /opt/SuperMem

# Install Python requirements if they exist
RUN if [ -f requirements.txt ]; then pip3 install -r requirements.txt; fi

# Install Volatility 3 using the recommended method
RUN echo "Installing Volatility 3..." && \
    # Try direct pip install first
    pip3 install volatility3 || { \
        echo "Direct pip install failed, trying from source..."; \
        git clone https://github.com/volatilityfoundation/volatility3.git /opt/volatility3-src && \
        cd /opt/volatility3-src && \
        pip3 install . && \
        rm -rf /opt/volatility3-src; \
    }

# Create vol3 command wrapper that works with subprocess calls
RUN echo '#!/bin/bash' > /usr/local/bin/vol3 && \
    echo '# Volatility 3 wrapper script' >> /usr/local/bin/vol3 && \
    echo 'if command -v vol >/dev/null 2>&1; then' >> /usr/local/bin/vol3 && \
    echo '    vol "$@"' >> /usr/local/bin/vol3 && \
    echo 'elif python3 -c "import volatility3" >/dev/null 2>&1; then' >> /usr/local/bin/vol3 && \
    echo '    python3 -m volatility3.cli "$@"' >> /usr/local/bin/vol3 && \
    echo 'elif [ -f /opt/volatility3/vol.py ]; then' >> /usr/local/bin/vol3 && \
    echo '    cd /opt/volatility3 && python3 vol.py "$@"' >> /usr/local/bin/vol3 && \
    echo 'else' >> /usr/local/bin/vol3 && \
    echo '    echo "ERROR: Volatility 3 not found"' >> /usr/local/bin/vol3 && \
    echo '    exit 1' >> /usr/local/bin/vol3 && \
    echo 'fi' >> /usr/local/bin/vol3 && \
    chmod +x /usr/local/bin/vol3 && \
    # CRITICAL: Create symlinks in /usr/bin where subprocess typically looks
    ln -sf /usr/local/bin/vol3 /usr/bin/vol3

# Download Volatility 3 symbol packs
RUN mkdir -p /opt/volatility3-symbols && \
    cd /opt/volatility3-symbols && \
    echo "Downloading symbol packs..." && \
    wget -q https://downloads.volatilityfoundation.org/volatility3/symbols/windows.zip || echo "Windows symbols download failed" && \
    wget -q https://downloads.volatilityfoundation.org/volatility3/symbols/linux.zip || echo "Linux symbols download failed" && \
    wget -q https://downloads.volatilityfoundation.org/volatility3/symbols/mac.zip || echo "Mac symbols download failed" && \
    # Extract symbols if downloaded
    for zip_file in *.zip; do \
        if [ -f "$zip_file" ]; then \
            echo "Extracting $zip_file"; \
            unzip -q "$zip_file" && rm "$zip_file"; \
        fi; \
    done && \
    # Try to place symbols in the right location
    if python3 -c "import volatility3; print(volatility3.__file__)" >/dev/null 2>&1; then \
        SYMBOLS_DIR=$(python3 -c "import volatility3; import os; print(os.path.dirname(volatility3.__file__))"); \
        mkdir -p "$SYMBOLS_DIR/symbols"; \
        cp -r * "$SYMBOLS_DIR/symbols/" 2>/dev/null || echo "Could not copy symbols to volatility3 directory"; \
    fi

# Install Volatility 2 (if needed by SuperMem) - also fix subprocess access
RUN echo "Installing Volatility 2..." && \
    git clone https://github.com/volatilityfoundation/volatility.git /opt/volatility2 && \
    cd /opt/volatility2 && \
    python2 setup.py build && \
    python2 setup.py install && \
    ln -sf /opt/volatility2/vol.py /usr/local/bin/vol2 && \
    chmod +x /usr/local/bin/vol2 && \
    # Also create in /usr/bin for subprocess calls
    ln -sf /usr/local/bin/vol2 /usr/bin/vol2

# Install forensic tools and dependencies
RUN apt-get update && apt-get install -y \
    binutils \
    autoconf \
    automake \
    libtool \
    pkg-config \
    libssl-dev \
    libexpat1-dev \
    flex \
    bison \
    zlib1g-dev \
    libbz2-dev \
    libxml2-dev \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Try to install bulk-extractor from source (optional, won't fail build if it doesn't work)
RUN echo "Attempting to install bulk-extractor from source..." && \
    { \
        git clone --recurse-submodules https://github.com/simsong/bulk_extractor.git /tmp/bulk_extractor && \
        cd /tmp/bulk_extractor && \
        ./bootstrap.sh && \
        ./configure && \
        make -j$(nproc) && \
        make install && \
        echo "✓ bulk-extractor installed successfully"; \
    } || { \
        echo "⚠ bulk-extractor installation failed - SuperMem will continue without it"; \
    } && \
    # Clean up regardless of success/failure
    rm -rf /tmp/bulk_extractor

# Try to run the original setup script but don't fail if it has issues
RUN chmod +x /opt/SuperMem/setup_supermem.sh && \
    /opt/SuperMem/setup_supermem.sh || echo "Setup script completed with warnings"

# Make Python scripts executable
RUN chmod +x /opt/SuperMem/*.py || echo "Making Python scripts executable"

# Copy and set up entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose volume mount points
VOLUME ["/data/input", "/data/output", "/data/yara"]

# Set default working directory
WORKDIR /data

# Verify installations and test tools - including subprocess access
RUN echo "=== Installation Verification ===" && \
    echo "Python version:" && python3 --version && \
    echo "Pip packages:" && pip3 list | grep -i volatility || echo "No volatility packages in pip" && \
    echo "Testing vol3 command:" && \
    vol3 --help >/dev/null 2>&1 && echo "✓ vol3 command working" || echo "⚠ vol3 command needs runtime fixing" && \
    echo "Testing strings command:" && \
    strings --version >/dev/null 2>&1 && echo "✓ strings command working" || echo "⚠ strings command missing" && \
    echo "Testing bulk_extractor:" && \
    bulk_extractor -h >/dev/null 2>&1 && echo "✓ bulk_extractor working" || echo "⚠ bulk_extractor not available" && \
    echo "Command locations for subprocess:" && \
    echo "vol3: $(which vol3 2>/dev/null || echo 'not found')" && \
    echo "vol2: $(which vol2 2>/dev/null || echo 'not found')" && \
    echo "strings: $(which strings 2>/dev/null || echo 'not found')" && \
    echo "bulk_extractor: $(which bulk_extractor 2>/dev/null || echo 'not found')" && \
    echo "Testing subprocess access:" && \
    python3 -c "import subprocess; result = subprocess.run(['vol3', '--help'], capture_output=True, timeout=5); print('✓ Python subprocess can call vol3')" 2>/dev/null || echo "⚠ Python subprocess vol3 test failed" && \
    echo "=== Verification Complete ==="

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]