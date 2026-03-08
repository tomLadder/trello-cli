# boards

Manage your Trello boards — list, view, create, update, and delete.

## List Boards

```bash
trello boards [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-f, --filter <filter>` | Filter boards: `all`, `open`, `closed`, `starred` (default: `all`) |
| `--json` | Output as JSON |

### Examples

```bash
# List all boards
trello boards

# List only open boards
trello boards --filter open

# List starred boards as JSON
trello boards --filter starred --json
```

## Get Board

```bash
trello boards get <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
# Get board details
trello boards get 60d5ecb2a1b2c30a12345678

# Get board as JSON
trello boards get 60d5ecb2a1b2c30a12345678 --json
```

## Create Board

```bash
trello boards create <name> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-d, --desc <description>` | Board description |
| `--org <idOrganization>` | Workspace ID the board belongs to |
| `--no-default-lists` | Do not create default lists (To Do, Doing, Done) |
| `--no-default-labels` | Do not create default labels |
| `--permission <level>` | Permission level: `org`, `private`, `public` (default: `private`) |
| `--background <color>` | Background color: `blue`, `orange`, `green`, `red`, `purple`, `pink`, `lime`, `sky`, `grey` |
| `--copy-from <boardId>` | Copy from an existing board |
| `--keep-cards` | When copying, keep cards from the source board |
| `--json` | Output as JSON |

### Examples

```bash
# Create a board with default settings
trello boards create "My Project"

# Create a board with a description and green background
trello boards create "Sprint Board" --desc "Weekly sprints" --background green

# Create a board without default lists
trello boards create "Custom Board" --no-default-lists

# Create a public board in a workspace
trello boards create "Team Board" --org 60d5ecb2a1b2c3 --permission org

# Copy an existing board with its cards
trello boards create "Copy of Project" --copy-from 60d5ecb2a1b2c30a12345678 --keep-cards

# Create a board and get JSON output
trello boards create "API Board" --json
```

## Update Board

```bash
trello boards update <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | New board name |
| `-d, --desc <description>` | New board description |
| `--close` | Close the board |
| `--reopen` | Reopen a closed board |
| `--org <idOrganization>` | Move to a different workspace |
| `--permission <level>` | Permission level: `org`, `private`, `public` |
| `--background <color>` | Background color: `blue`, `orange`, `green`, `red`, `purple`, `pink`, `lime`, `sky`, `grey` |
| `--json` | Output as JSON |

### Examples

```bash
# Rename a board
trello boards update 60d5ecb2a1b2c30a12345678 --name "New Name"

# Update description and background
trello boards update 60d5ecb2a1b2c30a12345678 --desc "Updated description" --background green

# Close a board
trello boards update 60d5ecb2a1b2c30a12345678 --close

# Reopen a closed board
trello boards update 60d5ecb2a1b2c30a12345678 --reopen

# Move to a different workspace
trello boards update 60d5ecb2a1b2c30a12345678 --org 60d5ecb2a1b2c3

# Change permission level
trello boards update 60d5ecb2a1b2c30a12345678 --permission public
```

## Delete Board

```bash
trello boards delete <id> [options]
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
# Delete a board (shows confirmation warning)
trello boards delete 60d5ecb2a1b2c30a12345678

# Delete a board without confirmation
trello boards delete 60d5ecb2a1b2c30a12345678 --yes

# Delete with JSON output (for scripting)
trello boards delete 60d5ecb2a1b2c30a12345678 --yes --json
```

## Board Lists

```bash
trello boards lists <boardId> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--filter <filter>` | Filter: `all`, `open`, `closed` (default: `all`) |
| `--json` | Output as JSON |

### Examples

```bash
# List all lists on a board
trello boards lists 60d5ecb2a1b2c30a12345678

# List only open lists
trello boards lists 60d5ecb2a1b2c30a12345678 --filter open
```

## Board Cards

```bash
trello boards cards <boardId> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
# List all cards on a board
trello boards cards 60d5ecb2a1b2c30a12345678
```

## Board Members

```bash
trello boards members <boardId> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
# List all members of a board
trello boards members 60d5ecb2a1b2c30a12345678
```

## Board Labels

```bash
trello boards labels <boardId> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
# List all labels on a board
trello boards labels 60d5ecb2a1b2c30a12345678
```

## Board Checklists

```bash
trello boards checklists <boardId> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
# List all checklists on a board
trello boards checklists 60d5ecb2a1b2c30a12345678
```

## Board Custom Fields

```bash
trello boards custom-fields <boardId> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
# List all custom fields on a board
trello boards custom-fields 60d5ecb2a1b2c30a12345678
```
