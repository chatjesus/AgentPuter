packer {
  required_plugins {
    hcloud = {
      version = ">= 1.0.0"
      source  = "github.com/hetznercloud/hcloud"
    }
  }
}

variable "hcloud_token" {
  type      = string
  sensitive = true
}

source "hcloud" "openclaw" {
  token         = var.hcloud_token
  image         = "ubuntu-24.04"
  location      = "ash"  # Ashburn, VA, US
  server_type   = "cpx11"  # 2 vCPU, 2GB RAM
  ssh_username  = "root"
  snapshot_name = "agentputer-openclaw-v1"
  snapshot_labels = {
    app     = "agentputer"
    version = "1"
  }
}

build {
  sources = ["source.hcloud.openclaw"]

  # Update system
  provisioner "shell" {
    inline = [
      "apt-get update",
      "apt-get upgrade -y",
      "apt-get install -y curl git build-essential",
    ]
  }

  # Install Node.js 22
  provisioner "shell" {
    inline = [
      "curl -fsSL https://deb.nodesource.com/setup_22.x | bash -",
      "apt-get install -y nodejs",
      "node --version",
      "npm --version",
    ]
  }

  # Install OpenClaw globally
  provisioner "shell" {
    inline = [
      "npm install -g openclaw@latest",
      "openclaw --version",
    ]
  }

  # Setup OpenClaw as system service
  provisioner "shell" {
    inline = [
      "openclaw onboard --install-daemon",
    ]
  }

  # Create startup script to ensure OpenClaw runs on boot
  provisioner "shell" {
    inline = [
      "cat > /etc/systemd/system/openclaw.service << 'EOF'",
      "[Unit]",
      "Description=OpenClaw AI Agent",
      "After=network.target",
      "",
      "[Service]",
      "Type=simple",
      "User=root",
      "WorkingDirectory=/root",
      "ExecStart=/usr/bin/openclaw gateway --port 18789",
      "Restart=always",
      "RestartSec=10",
      "Environment=NODE_ENV=production",
      "",
      "[Install]",
      "WantedBy=multi-user.target",
      "EOF",
      "systemctl daemon-reload",
      "systemctl enable openclaw",
    ]
  }

  # Open firewall ports
  provisioner "shell" {
    inline = [
      "apt-get install -y ufw",
      "ufw allow ssh",
      "ufw allow 18789/tcp comment 'OpenClaw WebChat'",
      "ufw --force enable",
    ]
  }

  # Cleanup
  provisioner "shell" {
    inline = [
      "apt-get clean",
      "rm -rf /var/lib/apt/lists/*",
    ]
  }
}
