# Installation

## Prerequisites

- [Bun](https://bun.sh) v1.0 or higher

## From Source

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

## Development Mode

If you want to run without building:

```bash
bun run dev -- --help
bun run dev login
bun run dev whoami
```

## Verify Installation

```bash
trello --version
# Output: 0.0.1

trello --help
```

## Updating

```bash
cd trello-cli
git pull
bun install
bun run build
mv dist/trello /usr/local/bin/
```
