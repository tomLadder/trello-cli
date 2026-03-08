# labels

Manage Trello labels — view, create, update, and delete.

## Get Label

```bash
trello labels get <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
# Get label details
trello labels get 60d5ecb2a1b2c30a12345678

# Get label as JSON
trello labels get 60d5ecb2a1b2c30a12345678 --json
```

## Create Label

```bash
trello labels create [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | Label name (required) |
| `-c, --color <color>` | Label color (required): `yellow`, `purple`, `blue`, `red`, `green`, `orange`, `black`, `sky`, `pink`, `lime` |
| `-b, --board <boardId>` | Board ID the label belongs to (required) |
| `--json` | Output as JSON |

### Examples

```bash
# Create a label
trello labels create -n "Bug" -c red -b 60d5ecb2a1b2c30a12345678

# Create a label with JSON output
trello labels create -n "Feature" -c green -b 60d5ecb2a1b2c30a12345678 --json
```

## Update Label

```bash
trello labels update <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | New label name |
| `-c, --color <color>` | New label color: `yellow`, `purple`, `blue`, `red`, `green`, `orange`, `black`, `sky`, `pink`, `lime` |
| `--json` | Output as JSON |

### Examples

```bash
# Rename a label
trello labels update 60d5ecb2a1b2c30a12345678 -n "Critical Bug"

# Change label color
trello labels update 60d5ecb2a1b2c30a12345678 -c purple

# Update both name and color
trello labels update 60d5ecb2a1b2c30a12345678 -n "Enhancement" -c blue
```

## Delete Label

```bash
trello labels delete <id> [options]
```

::: warning
This action is **permanent** and cannot be undone. The command requires `--yes` to confirm deletion.
:::

### Options

| Option | Description |
|--------|-------------|
| `--yes` | Skip confirmation and delete immediately |
| `--json` | Output as JSON |

### Examples

```bash
# Delete a label (shows confirmation warning)
trello labels delete 60d5ecb2a1b2c30a12345678

# Delete a label without confirmation
trello labels delete 60d5ecb2a1b2c30a12345678 --yes
```
