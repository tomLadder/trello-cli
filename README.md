<h1 align="center">📋 trello-cli</h1>

<p align="center">
  <strong>The command-line interface for Trello</strong>
</p>

<p align="center">
  Manage your Trello boards directly from the terminal. Built with TypeScript, powered by Bun.
</p>

<p align="center">
  <a href="https://tomladder.github.io/trello-cli/">📖 Documentation</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#commands">Commands</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <a href="https://tomladder.github.io/trello-cli/"><img src="https://img.shields.io/badge/docs-online-0055CC.svg" alt="Documentation"></a>
  <img src="https://img.shields.io/badge/version-0.0.1-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/bun-%3E%3D1.0-black.svg" alt="Bun">
  <img src="https://img.shields.io/badge/TypeScript-5.4-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey.svg" alt="Platform">
</p>

---

## Features

**Board Management**
- List all your boards
- Create, update, and archive boards
- View board members and settings

**Card Management**
- Create and update cards
- Move cards between lists
- Add labels, due dates, and attachments

**List Management**
- Create and organize lists
- Archive and restore lists

**Developer Experience**
- JSON output for scripting and AI agents
- Beautiful terminal UI with spinners
- Cross-platform compatibility

---

## Installation

### Prerequisites

- [Bun](https://bun.sh) v1.0 or higher

### From Source

```bash
# Clone the repository
git clone https://github.com/tomLadder/trello-cli.git
cd trello-cli

# Install dependencies
bun install

# Build the standalone executable
bun run build

# Move to your PATH (optional)
mv dist/trello /usr/local/bin/
```

### Development Mode

```bash
# Run directly without building
bun run dev -- --help
```

---

## Quick Start

### 1. Get your API credentials

1. Go to https://trello.com/power-ups/admin/ and create a Power-Up
2. Navigate to API Key → Generate a new API Key
3. Generate a token using the authorization URL

See [Trello API documentation](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/) for details.

### 2. Login to your account

```bash
trello login
```

You'll be prompted for your API key and token.

### 3. Check your identity

```bash
trello whoami
```

### 4. List your boards

```bash
trello boards
```

---

## Commands

### Authentication

| Command | Description |
|---------|-------------|
| `trello login` | Authenticate with Trello |
| `trello logout` | Clear stored credentials |
| `trello whoami` | Display current user info |
| `trello status` | Check login status |

### Configuration

| Command | Description |
|---------|-------------|
| `trello config get` | Show all settings |
| `trello config set <key> <value>` | Set a configuration value |
| `trello config reset` | Reset to defaults |
| `trello config path` | Show config file location |

### Global Options

These options are available on all commands:

| Option | Description |
|--------|-------------|
| `-h, --help` | Display help for the command |
| `-V, --version` | Display CLI version (root command only) |
| `--json` | Output as JSON (where supported) |

---

## Configuration

Configuration is stored in `~/.trello-cli/`:

| File | Description |
|------|-------------|
| `config.json` | Settings and API credentials |

### Available Settings

| Key | Values | Default | Description |
|-----|--------|---------|-------------|
| `outputFormat` | `pretty`, `json` | `pretty` | Default output format |

---

## Scripting & Automation

### JSON Output

All commands support `--json` for machine-readable output:

```bash
# Get user info as JSON
trello whoami --json

# Check status
trello status --json
```

---

## Architecture

```
src/
├── index.ts           # CLI entry point
├── api/
│   ├── client.ts      # HTTP client with auth
│   └── auth.ts        # Authentication
├── cli/
│   └── commands/      # Command implementations
├── store/
│   └── config.ts      # Configuration management
└── types/
    └── index.ts       # TypeScript interfaces
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## FAQ

<details>
<summary><strong>How do I get my API key and token?</strong></summary>

1. Visit https://trello.com/power-ups/admin/ and create a Power-Up
2. Go to API Key → Generate a new API Key
3. Copy your API key
4. Generate a token by visiting the authorization URL shown during `trello login`
5. See [Trello API docs](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/) for more details
</details>

<details>
<summary><strong>Where are my credentials stored?</strong></summary>

Your API key and token are stored in `~/.trello-cli/config.json` with secure file permissions (0600). Never share this file.
</details>

<details>
<summary><strong>Do tokens expire?</strong></summary>

By default, the CLI requests tokens that never expire. You can revoke access anytime from your Trello account settings.
</details>

---

## Acknowledgments

- Built with [Bun](https://bun.sh) - The fast JavaScript runtime
- CLI powered by [Commander.js](https://github.com/tj/commander.js)
- Beautiful output with [Chalk](https://github.com/chalk/chalk) and [Ora](https://github.com/sindresorhus/ora)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>Made with ❤️ in Austria</sub>
</p>
