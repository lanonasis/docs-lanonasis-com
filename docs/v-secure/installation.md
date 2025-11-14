---
sidebar_position: 3
title: Installation
description: Detailed installation guide for v-secure CLI and SDKs
---

# Installation Guide

This guide covers detailed installation instructions for v-secure CLI, SDKs, and various integration options.

## CLI Installation

### Node.js/npm (Recommended)

```bash
npm install -g @lanonasis/v-secure-cli
```

### Yarn

```bash
yarn global add @lanonasis/v-secure-cli
```

### pnpm

```bash
pnpm add -g @lanonasis/v-secure-cli
```

### Verify Installation

```bash
vsecure --version
# Output: v-secure-cli version 1.0.0

vsecure --help
# Shows available commands
```

## SDK Installation

### TypeScript/Node.js

```bash
npm install @lanonasis/v-secure-sdk
```

**TypeScript Example:**
```typescript
import { VSecureClient } from '@lanonasis/v-secure-sdk';

const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY
});
```

### Python

```bash
pip install lanonasis-vsecure
```

**Python Example:**
```python
from lanonasis_vsecure import VSecureClient

client = VSecureClient(
    api_key=os.environ['VSECURE_API_KEY']
)
```

### Go

```bash
go get github.com/lanonasis/vsecure-go
```

**Go Example:**
```go
import "github.com/lanonasis/vsecure-go"

client := vsecure.NewClient(
    vsecure.WithAPIKey(os.Getenv("VSECURE_API_KEY")),
)
```

### Java

```xml
<!-- Maven -->
<dependency>
    <groupId>com.lanonasis</groupId>
    <artifactId>vsecure-java</artifactId>
    <version>1.0.0</version>
</dependency>
```

```groovy
// Gradle
implementation 'com.lanonasis:vsecure-java:1.0.0'
```

### Ruby

```bash
gem install lanonasis-vsecure
```

**Ruby Example:**
```ruby
require 'lanonasis/vsecure'

client = Lanonasis::VSecure::Client.new(
  api_key: ENV['VSECURE_API_KEY']
)
```

## Docker Installation

### Using Official Docker Image

```bash
docker pull lanonasis/vsecure-cli:latest

# Run commands
docker run --rm \
  -e VSECURE_API_KEY=$VSECURE_API_KEY \
  lanonasis/vsecure-cli:latest \
  secrets:list
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    image: your-app:latest
    environment:
      - VSECURE_API_KEY=${VSECURE_API_KEY}
    volumes:
      - ./vsecure-config:/root/.vsecure

  vsecure-sidecar:
    image: lanonasis/vsecure-agent:latest
    environment:
      - VSECURE_API_KEY=${VSECURE_API_KEY}
    volumes:
      - secrets:/secrets
    command: agent --watch

volumes:
  secrets:
```

## Kubernetes Installation

### Using Helm

```bash
# Add the LanOnasis Helm repository
helm repo add lanonasis https://charts.lanonasis.com
helm repo update

# Install v-secure operator
helm install v-secure lanonasis/v-secure \
  --set apiKey=$VSECURE_API_KEY \
  --set operator.enabled=true
```

### Kubernetes Secret Store CSI Driver

```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: vsecure-secrets
spec:
  provider: vsecure
  parameters:
    apiEndpoint: "https://api.lanonasis.com/v1/security"
    secrets: |
      - name: database-url
        secretName: DATABASE_URL
      - name: api-key
        secretName: API_KEY
  secretObjects:
    - secretName: app-secrets
      type: Opaque
      data:
        - objectName: database-url
          key: DATABASE_URL
        - objectName: api-key
          key: API_KEY
```

### Manual Deployment

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: vsecure-api-key
type: Opaque
stringData:
  api-key: your-api-key-here
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vsecure-sync
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vsecure-sync
  template:
    metadata:
      labels:
        app: vsecure-sync
    spec:
      containers:
        - name: vsecure-sync
          image: lanonasis/vsecure-agent:latest
          env:
            - name: VSECURE_API_KEY
              valueFrom:
                secretKeyRef:
                  name: vsecure-api-key
                  key: api-key
          volumeMounts:
            - name: secrets
              mountPath: /secrets
      volumes:
        - name: secrets
          emptyDir: {}
```

## Platform-Specific Installation

### macOS

#### Using Homebrew

```bash
brew tap lanonasis/tap
brew install vsecure-cli
```

#### Manual Installation

```bash
curl -fsSL https://install.lanonasis.com/vsecure.sh | bash
```

### Linux

#### Debian/Ubuntu

```bash
curl -fsSL https://apt.lanonasis.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/lanonasis.gpg

echo "deb [signed-by=/usr/share/keyrings/lanonasis.gpg] https://apt.lanonasis.com stable main" | \
  sudo tee /etc/apt/sources.list.d/lanonasis.list

sudo apt update
sudo apt install vsecure-cli
```

#### Red Hat/CentOS/Fedora

```bash
sudo dnf config-manager --add-repo https://yum.lanonasis.com/vsecure.repo
sudo dnf install vsecure-cli
```

#### Arch Linux

```bash
yay -S vsecure-cli
```

### Windows

#### Using Chocolatey

```powershell
choco install vsecure-cli
```

#### Using Scoop

```powershell
scoop bucket add lanonasis https://github.com/lanonasis/scoop-bucket
scoop install vsecure-cli
```

#### Manual Installation

Download the installer from [releases page](https://github.com/lanonasis/v-secure/releases) and run:

```powershell
.\vsecure-installer.exe
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Deploy with v-secure

on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup v-secure
        uses: lanonasis/setup-vsecure@v1
        with:
          api-key: ${{ secrets.VSECURE_API_KEY }}

      - name: Fetch secrets
        run: |
          vsecure secrets:get DATABASE_URL > .env
          vsecure secrets:get API_KEY >> .env

      - name: Deploy
        run: ./deploy.sh
```

### GitLab CI

```yaml
deploy:
  image: lanonasis/vsecure-cli:latest
  script:
    - vsecure secrets:get DATABASE_URL > .env
    - vsecure secrets:get API_KEY >> .env
    - ./deploy.sh
  variables:
    VSECURE_API_KEY: $VSECURE_API_KEY
```

### CircleCI

```yaml
version: 2.1

orbs:
  vsecure: lanonasis/vsecure@1.0

jobs:
  deploy:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - vsecure/install
      - run:
          name: Fetch secrets
          command: |
            vsecure secrets:export > .env
      - run:
          name: Deploy
          command: ./deploy.sh
```

### Jenkins

```groovy
pipeline {
    agent any
    environment {
        VSECURE_API_KEY = credentials('vsecure-api-key')
    }
    stages {
        stage('Setup') {
            steps {
                sh 'npm install -g @lanonasis/v-secure-cli'
            }
        }
        stage('Fetch Secrets') {
            steps {
                sh 'vsecure secrets:export > .env'
            }
        }
        stage('Deploy') {
            steps {
                sh './deploy.sh'
            }
        }
    }
}
```

## Configuration

After installation, configure v-secure:

```bash
# Interactive configuration
vsecure config:init

# Set API endpoint
vsecure config:set endpoint https://api.lanonasis.com/v1/security

# Set default region
vsecure config:set region us-east-1

# View current configuration
vsecure config:show
```

## Upgrade

### CLI Upgrade

```bash
# npm
npm update -g @lanonasis/v-secure-cli

# Homebrew
brew upgrade vsecure-cli

# Docker
docker pull lanonasis/vsecure-cli:latest
```

### SDK Upgrade

```bash
# npm
npm update @lanonasis/v-secure-sdk

# pip
pip install --upgrade lanonasis-vsecure
```

## Verification

Verify your installation:

```bash
# Check version
vsecure --version

# Test authentication
vsecure auth:whoami

# Check connection
vsecure ping

# Run diagnostics
vsecure doctor
```

## Troubleshooting

### Command Not Found

If `vsecure` command is not found after installation:

```bash
# Check if it's in your PATH
which vsecure

# Add to PATH (Linux/macOS)
export PATH="$PATH:$(npm root -g)/@lanonasis/v-secure-cli/bin"

# Add to PATH permanently
echo 'export PATH="$PATH:$(npm root -g)/@lanonasis/v-secure-cli/bin"' >> ~/.bashrc
source ~/.bashrc
```

### Permission Issues

```bash
# Fix npm permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Or use npx instead
npx @lanonasis/v-secure-cli secrets:list
```

### SSL/TLS Issues

```bash
# Disable SSL verification (not recommended for production)
vsecure config:set verify-ssl false

# Use custom CA certificate
vsecure config:set ca-cert /path/to/ca-cert.pem
```

## Uninstallation

### Remove CLI

```bash
# npm
npm uninstall -g @lanonasis/v-secure-cli

# Homebrew
brew uninstall vsecure-cli

# Chocolatey
choco uninstall vsecure-cli
```

### Remove Configuration

```bash
rm -rf ~/.vsecure
```

## Next Steps

- [Getting Started](./getting-started) - Quick start guide
- [Configuration](./configuration) - Configure v-secure
- [API Reference](./api/overview) - API documentation
