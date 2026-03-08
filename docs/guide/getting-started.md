# Getting Started

trello-cli is an unofficial command-line interface for managing your Trello boards.

## Quick Start

### 1. Install

```bash
# Clone and build
git clone https://github.com/tomLadder/trello-cli.git
cd trello-cli
bun install
bun run build

# Move to PATH
mv dist/trello /usr/local/bin/
```

### 2. Get API Credentials

1. Go to [Trello Power-Ups Admin](https://trello.com/power-ups/admin/)
2. Create a new Power-Up (or select existing)
3. Navigate to **API Key** → **Generate a new API Key**

See the [Trello API documentation](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/) for more details.

### 3. Login

```bash
trello login
```

Enter your API key and token when prompted.

### 4. Explore

```bash
# View your profile
trello whoami

# Check login status
trello status
```

## What's Next?

- [Installation](/guide/installation) - Detailed installation instructions
- [Configuration](/guide/configuration) - Configure the CLI
- [Commands](/commands/) - Full command reference
