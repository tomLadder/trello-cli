# checklists

Manage Trello checklists and check items.

## Get Checklist

```bash
trello checklists get <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
# Get checklist details with all check items
trello checklists get 60d5ecb2a1b2c30a12345678
```

## Create Checklist

```bash
trello checklists create [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-c, --card <cardId>` | Card ID to add the checklist to (required) |
| `-n, --name <name>` | Checklist name |
| `--pos <position>` | Position: `top` or `bottom` |
| `--copy-from <checklistId>` | Copy from an existing checklist |
| `--json` | Output as JSON |

### Examples

```bash
# Create a checklist on a card
trello checklists create -c 60d5ecb2a1b2c30a12345678 -n "QA Steps"

# Copy a checklist from another
trello checklists create -c 60d5ecb2a1b2c30a12345678 --copy-from 60d5ecb2a1b2c3
```

## Update Checklist

```bash
trello checklists update <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | New checklist name |
| `--pos <position>` | New position: `top` or `bottom` |
| `--json` | Output as JSON |

### Examples

```bash
# Rename a checklist
trello checklists update 60d5ecb2a1b2c30a12345678 -n "Updated Checklist"
```

## Delete Checklist

```bash
trello checklists delete <id> [options]
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
# Delete a checklist (shows confirmation warning)
trello checklists delete 60d5ecb2a1b2c30a12345678

# Delete without confirmation
trello checklists delete 60d5ecb2a1b2c30a12345678 --yes
```

## List Check Items

```bash
trello checklists items <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
# List all check items in a checklist
trello checklists items 60d5ecb2a1b2c30a12345678
```

## Add Check Item

```bash
trello checklists add-item <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | Check item name (required) |
| `--pos <position>` | Position: `top` or `bottom` |
| `--checked` | Start as checked |
| `--due <date>` | Due date (ISO 8601 format) |
| `--member <memberId>` | Assign to a member |
| `--json` | Output as JSON |

### Examples

```bash
# Add a check item
trello checklists add-item 60d5ecb2a1b2c30a12345678 -n "Write tests"

# Add a checked item with a due date
trello checklists add-item 60d5ecb2a1b2c30a12345678 -n "Deploy" --checked --due 2026-04-01
```

## Remove Check Item

```bash
trello checklists remove-item <checklistId> <checkItemId> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--yes` | Skip confirmation |
| `--json` | Output as JSON |

### Examples

```bash
# Remove a check item
trello checklists remove-item 60d5ecb2a1b2c3 60d5ecb2a1b2c4 --yes
```

## Update Check Item

```bash
trello checklists update-item <cardId> <checkItemId> [options]
```

::: info
This command takes a **card ID** (not checklist ID) as the first argument, matching the Trello API structure.
:::

### Options

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | New check item name |
| `--complete` | Mark as complete |
| `--incomplete` | Mark as incomplete |
| `--due <date>` | Set due date (ISO 8601 format) |
| `--member <memberId>` | Assign to a member |
| `--json` | Output as JSON |

### Examples

```bash
# Mark a check item as complete
trello checklists update-item 60d5ecb2a1b2c3 60d5ecb2a1b2c4 --complete

# Rename and set due date
trello checklists update-item 60d5ecb2a1b2c3 60d5ecb2a1b2c4 -n "Updated task" --due 2026-04-01
```
