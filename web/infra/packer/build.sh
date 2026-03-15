#!/bin/bash

# AgentPuter Packer Image Builder
# This script builds the OpenClaw image on Hetzner Cloud

set -e

# Check if HETZNER_API_TOKEN is set
if [ -z "$HETZNER_API_TOKEN" ]; then
    echo "Error: HETZNER_API_TOKEN environment variable is not set"
    echo "Get your token from: https://console.hetzner.cloud/projects/{project-id}/security/tokens"
    exit 1
fi

# Check if packer is installed
if ! command -v packer &> /dev/null; then
    echo "Error: Packer is not installed"
    echo "Install: brew install packer"
    exit 1
fi

# Initialize packer plugins
echo "Initializing Packer plugins..."
packer init openclaw.pkr.hcl

# Build the image
echo "Building OpenClaw image on Hetzner Cloud..."
echo "This will take about 5-10 minutes..."
packer build -var "hcloud_token=$HETZNER_API_TOKEN" openclaw.pkr.hcl

echo ""
echo "✅ Image built successfully!"
echo "The snapshot 'agentputer-openclaw-v1' is now available in your Hetzner Cloud account."
