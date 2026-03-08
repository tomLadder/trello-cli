# config

Manage CLI configuration settings.

## Subcommands

| Command | Description |
|---------|-------------|
| `get` | Show current configuration |
| `set` | Set a configuration value |
| `reset` | Reset to defaults |
| `path` | Show config file path |

---

## get

Show current configuration.

### Usage

```bash
trello config get [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Example

```bash
trello config get

# Configuration
# ────────────────────────────────────────
# Output format: pretty
# Logged in: Yes
#
# Config file: /Users/you/.trello-cli/config.json
```

---

## set

Set a configuration value.

### Usage

```bash
trello config set <key> <value>
```

### Available Keys

| Key | Values | Description |
|-----|--------|-------------|
| `outputFormat` | `pretty`, `json` | Default output format |

### Examples

```bash
# Set default output to JSON
trello config set outputFormat json

# Set default output to pretty
trello config set outputFormat pretty
```

---

## reset

Reset configuration to defaults.

### Usage

```bash
trello config reset
```

### Example

```bash
trello config reset
# Configuration reset to defaults
```

::: warning
This removes your authentication credentials. You'll need to login again.
:::

---

## path

Show configuration file path.

### Usage

```bash
trello config path
```

### Example

```bash
trello config path
# /Users/you/.trello-cli/config.json
```
