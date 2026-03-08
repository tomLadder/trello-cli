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
- List, create, update, and delete boards
- View board lists, cards, members, labels, checklists, and custom fields

**Card Management**
- Create, update, archive, and delete cards
- Move cards between lists
- Add/remove comments, attachments, members, and labels
- Template card support

**List Management**
- Create, update, and archive lists
- Archive or move all cards in a list

**Label Management**
- Create, update, and delete labels on boards

**Checklist Management**
- Create, update, and delete checklists on cards
- Add, update, and remove check items
- Mark items complete/incomplete

**Custom Fields**
- Create and manage custom field definitions
- Manage dropdown options for list-type fields
- Set and clear custom field values on cards

**Search**
- Search across boards and cards
- Search for members

**Developer Experience**
- JSON output for scripting and AI agents
- LLMS.md guide for AI assistants
- Beautiful terminal UI with spinners
- Cross-platform compatibility

---

## Installation

### Quick Install (macOS / Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/tomLadder/trello-cli/main/install.sh | sh
```

Pre-built binaries are also available on the [Releases page](https://github.com/tomLadder/trello-cli/releases).

### From Source

**Prerequisites:** [Bun](https://bun.sh) v1.0 or higher

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

All commands are based on the [Trello REST API](https://developer.atlassian.com/cloud/trello/rest/api-group-actions/). See the [full documentation](https://tomladder.github.io/trello-cli/) for detailed options and examples.

### Authentication

| Command | Description |
|---------|-------------|
| `trello login` | Authenticate with Trello |
| `trello logout` | Clear stored credentials |
| `trello whoami` | Display current user info |
| `trello status` | Check login status |

### Boards

| Command | Description |
|---------|-------------|
| `trello boards` | List your boards |
| `trello boards get <id>` | Get board details |
| `trello boards create <name>` | Create a new board |
| `trello boards update <id>` | Update a board |
| `trello boards delete <id>` | Delete a board |
| `trello boards lists <id>` | List all lists on a board |
| `trello boards cards <id>` | List all cards on a board |
| `trello boards members <id>` | List all members of a board |
| `trello boards labels <id>` | List all labels on a board |
| `trello boards checklists <id>` | List all checklists on a board |
| `trello boards custom-fields <id>` | List all custom fields on a board |

### Lists

| Command | Description |
|---------|-------------|
| `trello lists get <id>` | Get list details |
| `trello lists create` | Create a new list |
| `trello lists update <id>` | Update a list |
| `trello lists cards <id>` | List cards in a list |
| `trello lists archive-all-cards <id>` | Archive all cards in a list |
| `trello lists move-all-cards <id>` | Move all cards to another list |

### Cards

| Command | Description |
|---------|-------------|
| `trello cards get <id>` | Get card details |
| `trello cards create` | Create a new card |
| `trello cards update <id>` | Update a card |
| `trello cards delete <id>` | Delete a card |
| `trello cards comments <id>` | List comments on a card |
| `trello cards add-comment <id>` | Add a comment |
| `trello cards update-comment <id> <commentId>` | Update a comment |
| `trello cards delete-comment <id> <commentId>` | Delete a comment |
| `trello cards attachments <id>` | List attachments |
| `trello cards add-attachment <id>` | Add an attachment |
| `trello cards delete-attachment <id> <attachmentId>` | Delete an attachment |
| `trello cards members <id>` | List card members |
| `trello cards add-member <id> <memberId>` | Add a member |
| `trello cards remove-member <id> <memberId>` | Remove a member |
| `trello cards add-label <id> <labelId>` | Add a label |
| `trello cards remove-label <id> <labelId>` | Remove a label |

### Labels

| Command | Description |
|---------|-------------|
| `trello labels get <id>` | Get label details |
| `trello labels create` | Create a new label |
| `trello labels update <id>` | Update a label |
| `trello labels delete <id>` | Delete a label |

### Checklists

| Command | Description |
|---------|-------------|
| `trello checklists get <id>` | Get checklist details |
| `trello checklists create` | Create a new checklist |
| `trello checklists update <id>` | Update a checklist |
| `trello checklists delete <id>` | Delete a checklist |
| `trello checklists items <id>` | List check items |
| `trello checklists add-item <id>` | Add a check item |
| `trello checklists remove-item <id> <itemId>` | Remove a check item |
| `trello checklists update-item <cardId> <itemId>` | Update a check item |

### Custom Fields

| Command | Description |
|---------|-------------|
| `trello custom-fields get <id>` | Get field definition |
| `trello custom-fields create` | Create a custom field |
| `trello custom-fields update <id>` | Update a custom field |
| `trello custom-fields delete <id>` | Delete a custom field |
| `trello custom-fields options <id>` | List dropdown options |
| `trello custom-fields add-option <id>` | Add a dropdown option |
| `trello custom-fields delete-option <id> <optionId>` | Delete a dropdown option |
| `trello custom-fields card-values <cardId>` | List values on a card |
| `trello custom-fields set-value <cardId> <fieldId>` | Set a value on a card |

### Search

| Command | Description |
|---------|-------------|
| `trello search <query>` | Search boards and cards |
| `trello search members <query>` | Search for members |

### Configuration

| Command | Description |
|---------|-------------|
| `trello config get` | Show all settings |
| `trello config set <key> <value>` | Set a configuration value |
| `trello config reset` | Reset to defaults |
| `trello config path` | Show config file location |

### Global Options

All commands support:

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

All commands support `--json` for machine-readable output:

```bash
# Get user info as JSON
trello whoami --json

# List boards as JSON
trello boards --json

# Create a card and get the ID
trello cards create -n "New task" -l <listId> --json | jq -r '.id'

# Search for cards
trello search "bug" --type cards --json
```

For AI agents, see [LLMS.md](LLMS.md) for a comprehensive guide.

---

## Architecture

```
src/
├── index.ts              # CLI entry point
├── api/
│   ├── client.ts         # HTTP client with auth
│   ├── auth.ts           # Authentication
│   ├── boards.ts         # Board API
│   ├── cards.ts          # Card API
│   ├── checklists.ts     # Checklist API
│   ├── customFields.ts   # Custom Fields API
│   ├── labels.ts         # Label API
│   ├── lists.ts          # List API
│   └── search.ts         # Search API
├── cli/
│   └── commands/         # Command implementations
├── store/
│   └── config.ts         # Configuration management
└── types/
    └── index.ts          # TypeScript interfaces
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
