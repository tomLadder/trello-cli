# Installation

## Quick Install (macOS / Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/tomLadder/trello-cli/main/install.sh | sh
```

This will automatically detect your OS and architecture, download the latest release binary, and install it to `/usr/local/bin`.

## GitHub Releases

Pre-built binaries for macOS, Linux, and Windows are available on the [Releases page](https://github.com/tomLadder/trello-cli/releases).

Download the binary for your platform, make it executable (`chmod +x`), and move it to a directory in your `PATH`.

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
