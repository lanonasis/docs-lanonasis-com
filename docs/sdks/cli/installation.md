# CLI Installation

Install and configure the LanOnasis CLI tool for command-line memory management and automation.

## Installation

### Using npm (Recommended)

```bash
npm install -g @lanonasis/cli
```

### Using pip

```bash
pip install lanonasis-cli
```

### Using Homebrew (macOS)

```bash
brew install lanonasis/tap/lanonasis-cli
```

### Using curl (Linux/macOS)

```bash
curl -sSL https://install.lanonasis.com/cli | bash
```

### Using PowerShell (Windows)

```powershell
Invoke-WebRequest -Uri "https://install.lanonasis.com/cli.ps1" -UseBasicParsing | Invoke-Expression
```

## Verify Installation

Check that the CLI is installed correctly:

```bash
lanonasis --version
```

You should see output like:
```
lanonasis-cli/1.0.0
```

## Configuration

### Initial Setup

Run the setup command to configure your API key:

```bash
lanonasis setup
```

This will prompt you for:
- API Key
- Base URL (optional, defaults to production)
- Default output format (json, yaml, table)

### Environment Variables

You can also set configuration via environment variables:

```bash
export LANONASIS_API_KEY="your-api-key-here"
export LANONASIS_BASE_URL="https://api.lanonasis.com"
export LANONASIS_OUTPUT_FORMAT="json"
```

### Configuration File

The CLI stores configuration in `~/.lanonasis/config.yaml`:

```yaml
api_key: "your-api-key-here"
base_url: "https://api.lanonasis.com"
output_format: "json"
timeout: 30
max_retries: 3
```

## Quick Start

Test your installation with a simple command:

```bash
# List your memories
lanonasis memory list

# Create a new memory
lanonasis memory create "Hello from CLI!"

# Search memories
lanonasis memory search "hello"
```

## Authentication

### API Key

The CLI uses API key authentication. You can provide it via:

1. **Setup command** (recommended):
   ```bash
   lanonasis setup
   ```

2. **Environment variable**:
   ```bash
   export LANONASIS_API_KEY="your-api-key"
   ```

3. **Command line flag**:
   ```bash
   lanonasis --api-key "your-api-key" memory list
   ```

4. **Configuration file**:
   ```yaml
   # ~/.lanonasis/config.yaml
   api_key: "your-api-key"
   ```

### API Key Management

View your current configuration:

```bash
lanonasis config show
```

Update your API key:

```bash
lanonasis config set api-key "new-api-key"
```

Reset configuration:

```bash
lanonasis config reset
```

## Output Formats

The CLI supports multiple output formats:

### JSON (Default)
```bash
lanonasis memory list --format json
```

### YAML
```bash
lanonasis memory list --format yaml
```

### Table
```bash
lanonasis memory list --format table
```

### Custom Format
```bash
lanonasis memory list --format "{{.ID}}\t{{.Content}}\t{{.CreatedAt}}"
```

## Shell Completion

Enable shell completion for better user experience:

### Bash
```bash
# Add to ~/.bashrc
eval "$(lanonasis completion bash)"
```

### Zsh
```bash
# Add to ~/.zshrc
eval "$(lanonasis completion zsh)"
```

### Fish
```bash
# Add to ~/.config/fish/config.fish
lanonasis completion fish | source
```

### PowerShell
```powershell
# Add to PowerShell profile
lanonasis completion powershell | Out-String | Invoke-Expression
```

## Proxy Configuration

If you're behind a corporate proxy:

```bash
export HTTP_PROXY="http://proxy.company.com:8080"
export HTTPS_PROXY="http://proxy.company.com:8080"
export NO_PROXY="localhost,127.0.0.1"
```

Or configure in the config file:

```yaml
# ~/.lanonasis/config.yaml
proxy:
  http: "http://proxy.company.com:8080"
  https: "http://proxy.company.com:8080"
  no_proxy: "localhost,127.0.0.1"
```

## Troubleshooting

### Common Issues

#### Command not found
```bash
# Check if CLI is in PATH
which lanonasis

# If not found, add to PATH
export PATH="$PATH:/path/to/lanonasis/bin"
```

#### Authentication errors
```bash
# Check API key
lanonasis config show

# Test connection
lanonasis auth test
```

#### Permission errors
```bash
# Fix permissions
chmod +x /path/to/lanonasis

# Or reinstall with proper permissions
sudo npm install -g @lanonasis/cli
```

### Debug Mode

Enable debug logging:

```bash
export LANONASIS_DEBUG=1
lanonasis memory list
```

Or use the debug flag:

```bash
lanonasis --debug memory list
```

### Logs

View CLI logs:

```bash
# macOS/Linux
cat ~/.lanonasis/logs/cli.log

# Windows
type %USERPROFILE%\.lanonasis\logs\cli.log
```

## Updating

Update to the latest version:

```bash
# Using npm
npm update -g @lanonasis/cli

# Using pip
pip install --upgrade lanonasis-cli

# Using Homebrew
brew upgrade lanonasis-cli
```

## Uninstalling

Remove the CLI:

```bash
# Using npm
npm uninstall -g @lanonasis/cli

# Using pip
pip uninstall lanonasis-cli

# Using Homebrew
brew uninstall lanonasis-cli

# Remove configuration
rm -rf ~/.lanonasis
```

## Next Steps

Now that you have the CLI installed:

- [Commands Reference](/sdks/cli/commands) - Complete command documentation
- [Automation Guide](/sdks/cli/automation) - Scripting and automation
- [Examples](/sdks/cli/examples) - Real-world usage examples

## Need Help?

- **Documentation**: Browse our comprehensive guides
- **Community**: Join our Discord community
- **Support**: Contact our support team
- **GitHub**: View source code and report issues

[Get Support →](/support)