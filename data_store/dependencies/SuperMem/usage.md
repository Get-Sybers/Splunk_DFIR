# Build the container
./build-Supermem.sh --clean

# Quick analysis
docker run -v $(pwd)/data:/data supermem-image -f /data/input/memdump.mem -tt 1

# Full analysis with custom output
docker run -v $(pwd)/data:/data supermem-image \
  -f /data/input/memdump.mem -o /data/output/case1 -tt 2

# Comprehensive analysis with Yara rules
docker run -v $(pwd)/data:/data supermem-image \
  -f /data/input/memdump.mem -tt 3 -y /data/yara

docker run --rm --name supermem-container \
  -v /opt/github/Splunk_DFIR/data_store/raw/memory:/data/input \
  -v /opt/github/Splunk_DFIR/data_store/processed/supermem:/data/output \
  supermem-image \
  -f /data/input/FOR_800_Windows_memory.mem -tt 3