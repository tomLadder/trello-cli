# lists

Manage Trello lists — view, create, update, and manage cards within lists.

## Get List

```bash
trello lists get <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
# Get list details
trello lists get 60d5ecb2a1b2c30a12345678

# Get list as JSON
trello lists get 60d5ecb2a1b2c30a12345678 --json
```

## Create List

```bash
trello lists create [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | List name (required) |
| `-b, --board <boardId>` | Board ID to create the list on (required) |
| `--pos <position>` | Position: `top` or `bottom` |
| `--json` | Output as JSON |

### Examples

```bash
# Create a list on a board
trello lists create -n "In Progress" -b 60d5ecb2a1b2c30a12345678

# Create a list at the top
trello lists create -n "Urgent" -b 60d5ecb2a1b2c30a12345678 --pos top
```

## Update List

```bash
trello lists update <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | New list name |
| `--close` | Archive the list |
| `--reopen` | Unarchive the list |
| `--pos <position>` | New position: `top` or `bottom` |
| `--json` | Output as JSON |

### Examples

```bash
# Rename a list
trello lists update 60d5ecb2a1b2c30a12345678 -n "Done"

# Archive a list
trello lists update 60d5ecb2a1b2c30a12345678 --close

# Unarchive a list
trello lists update 60d5ecb2a1b2c30a12345678 --reopen
```

## List Cards

```bash
trello lists cards <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
# List all cards in a list
trello lists cards 60d5ecb2a1b2c30a12345678
```

## Archive All Cards

```bash
trello lists archive-all-cards <id> [options]
```

::: warning
This archives **all cards** in the list. Cards can be unarchived individually afterwards.
:::

### Options

| Option | Description |
|--------|-------------|
| `--yes` | Skip confirmation |
| `--json` | Output as JSON |

### Examples

```bash
# Archive all cards (shows confirmation warning)
trello lists archive-all-cards 60d5ecb2a1b2c30a12345678

# Archive all cards without confirmation
trello lists archive-all-cards 60d5ecb2a1b2c30a12345678 --yes
```

## Move All Cards

```bash
trello lists move-all-cards <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-b, --board <boardId>` | Destination board ID (required) |
| `-l, --list <listId>` | Destination list ID (required) |
| `--json` | Output as JSON |

### Examples

```bash
# Move all cards to another list
trello lists move-all-cards 60d5ecb2a1b2c30a12345678 -b 60d5ecb2a1b2c3 -l 60d5ecb2a1b2c4
```
