# cards

Manage Trello cards — view, create, update, delete, and manage comments, attachments, members, and labels.

## Get Card

```bash
trello cards get <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
# Get card details
trello cards get 60d5ecb2a1b2c30a12345678

# Get card as JSON
trello cards get 60d5ecb2a1b2c30a12345678 --json
```

## Create Card

```bash
trello cards create [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | Card name (required) |
| `-l, --list <listId>` | List ID to create the card in (required) |
| `-d, --desc <description>` | Card description |
| `--due <date>` | Due date (ISO 8601 format) |
| `--labels <labelIds>` | Comma-separated label IDs |
| `--members <memberIds>` | Comma-separated member IDs |
| `--json` | Output as JSON |

### Examples

```bash
# Create a card
trello cards create -n "Fix login bug" -l 60d5ecb2a1b2c30a12345678

# Create a card with description and due date
trello cards create -n "Release v2.0" -l 60d5ecb2a1b2c30a12345678 \
  -d "Major release with new features" --due 2026-04-01

# Create a card with labels and members
trello cards create -n "Review PR" -l 60d5ecb2a1b2c30a12345678 \
  --labels "labelId1,labelId2" --members "memberId1"
```

## Update Card

```bash
trello cards update <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | New card name |
| `-d, --desc <description>` | New card description |
| `--close` | Archive the card |
| `--reopen` | Unarchive the card |
| `-l, --list <listId>` | Move card to a different list |
| `--due <date>` | Set due date (ISO 8601 format) |
| `--done` | Mark due date as complete |
| `--make-template` | Convert card to a template |
| `--remove-template` | Convert template back to a regular card |
| `--json` | Output as JSON |

### Examples

```bash
# Rename a card
trello cards update 60d5ecb2a1b2c30a12345678 -n "Updated title"

# Move a card to another list
trello cards update 60d5ecb2a1b2c30a12345678 -l 60d5ecb2a1b2c3

# Set a due date and mark complete
trello cards update 60d5ecb2a1b2c30a12345678 --due 2026-04-01 --done

# Archive a card
trello cards update 60d5ecb2a1b2c30a12345678 --close

# Make a card a template
trello cards update 60d5ecb2a1b2c30a12345678 --make-template

# Convert template back to regular card
trello cards update 60d5ecb2a1b2c30a12345678 --remove-template
```

## Delete Card

```bash
trello cards delete <id> [options]
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
# Delete a card (shows confirmation warning)
trello cards delete 60d5ecb2a1b2c30a12345678

# Delete a card without confirmation
trello cards delete 60d5ecb2a1b2c30a12345678 --yes
```

## Card Comments

### List Comments

```bash
trello cards comments <cardId> [options]
```

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

```bash
trello cards comments 60d5ecb2a1b2c30a12345678
```

### Add Comment

```bash
trello cards add-comment <cardId> [options]
```

| Option | Description |
|--------|-------------|
| `-t, --text <text>` | Comment text (required) |
| `--json` | Output as JSON |

```bash
trello cards add-comment 60d5ecb2a1b2c30a12345678 -t "Looks good to me!"
```

### Update Comment

```bash
trello cards update-comment <cardId> <commentId> [options]
```

| Option | Description |
|--------|-------------|
| `-t, --text <text>` | New comment text (required) |
| `--json` | Output as JSON |

```bash
trello cards update-comment 60d5ecb2a1b2c3 60d5ecb2a1b2c4 -t "Updated comment"
```

### Delete Comment

```bash
trello cards delete-comment <cardId> <commentId> [options]
```

| Option | Description |
|--------|-------------|
| `--yes` | Skip confirmation |
| `--json` | Output as JSON |

```bash
trello cards delete-comment 60d5ecb2a1b2c3 60d5ecb2a1b2c4 --yes
```

## Card Attachments

### List Attachments

```bash
trello cards attachments <cardId> [options]
```

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

```bash
trello cards attachments 60d5ecb2a1b2c30a12345678
```

### Add Attachment

```bash
trello cards add-attachment <cardId> [options]
```

| Option | Description |
|--------|-------------|
| `--url <url>` | URL to attach (required) |
| `-n, --name <name>` | Attachment name |
| `--set-cover` | Set as card cover |
| `--json` | Output as JSON |

```bash
# Attach a URL
trello cards add-attachment 60d5ecb2a1b2c30a12345678 --url "https://example.com/doc.pdf"

# Attach with a custom name and set as cover
trello cards add-attachment 60d5ecb2a1b2c30a12345678 --url "https://example.com/img.png" -n "Screenshot" --set-cover
```

### Delete Attachment

```bash
trello cards delete-attachment <cardId> <attachmentId> [options]
```

| Option | Description |
|--------|-------------|
| `--yes` | Skip confirmation |
| `--json` | Output as JSON |

```bash
trello cards delete-attachment 60d5ecb2a1b2c3 60d5ecb2a1b2c4 --yes
```

## Card Members

### List Members

```bash
trello cards members <cardId> [options]
```

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

```bash
trello cards members 60d5ecb2a1b2c30a12345678
```

### Add Member

```bash
trello cards add-member <cardId> <memberId> [options]
```

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

```bash
trello cards add-member 60d5ecb2a1b2c3 60d5ecb2a1b2c4
```

### Remove Member

```bash
trello cards remove-member <cardId> <memberId> [options]
```

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

```bash
trello cards remove-member 60d5ecb2a1b2c3 60d5ecb2a1b2c4
```

## Card Labels

### Add Label

```bash
trello cards add-label <cardId> <labelId> [options]
```

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

```bash
trello cards add-label 60d5ecb2a1b2c3 60d5ecb2a1b2c4
```

### Remove Label

```bash
trello cards remove-label <cardId> <labelId> [options]
```

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

```bash
trello cards remove-label 60d5ecb2a1b2c3 60d5ecb2a1b2c4
```
