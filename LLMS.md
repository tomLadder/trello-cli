# trello-cli for LLMs

This guide helps AI assistants use trello-cli effectively.

## Overview

trello-cli is a command-line tool for managing Trello boards, lists, cards, labels, checklists, custom fields, and more. All commands are based on the [Trello REST API](https://developer.atlassian.com/cloud/trello/rest/api-group-actions/).

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/tomLadder/trello-cli/main/install.sh | sh
```

Pre-built binaries are also available on the [Releases page](https://github.com/tomLadder/trello-cli/releases).

## Authentication

Trello uses API key + token authentication:

1. User creates a Power-Up at [Trello Power-Ups Admin](https://trello.com/power-ups/admin/) to get an API key
2. User generates a token via the authorize URL
3. Credentials are stored locally in `~/.trello-cli/config.json`

### Interactive Login

```bash
trello login
```

### Non-Interactive Login (for AI Agents)

```bash
trello login --api-key YOUR_KEY --token YOUR_TOKEN --json
```

Response:
```json
{"success": true, "user": {"id": "...", "username": "...", "fullName": "..."}}
```

Error response:
```json
{"success": false, "error": "Invalid credentials"}
```

## JSON Output

All commands support `--json` for machine-readable output. Always use `--json` when parsing output programmatically.

## Common Workflows

### Board Management

```bash
# List all boards
trello boards --json

# List only open/starred boards
trello boards --filter open --json
trello boards --filter starred --json

# Get a specific board
trello boards get <boardId> --json

# Create a board
trello boards create "My Board" --json
trello boards create "My Board" --desc "Description" --background green --json

# Update a board
trello boards update <boardId> --name "New Name" --json
trello boards update <boardId> --close    # archive
trello boards update <boardId> --reopen   # unarchive

# Delete a board (requires --yes)
trello boards delete <boardId> --yes --json

# View board contents
trello boards lists <boardId> --json
trello boards cards <boardId> --json
trello boards members <boardId> --json
trello boards labels <boardId> --json
trello boards checklists <boardId> --json
trello boards custom-fields <boardId> --json
```

### List Management

```bash
# Get list details
trello lists get <listId> --json

# Create a list on a board
trello lists create -n "In Progress" -b <boardId> --json

# Update a list
trello lists update <listId> -n "New Name" --json
trello lists update <listId> --close    # archive
trello lists update <listId> --reopen   # unarchive
trello lists update <listId> --pos top  # move to top

# View cards in a list
trello lists cards <listId> --json

# Bulk operations
trello lists archive-all-cards <listId> --yes --json
trello lists move-all-cards <listId> -b <boardId> -l <targetListId> --json
```

### Card Management

```bash
# Get card details
trello cards get <cardId> --json

# Create a card
trello cards create -n "Fix bug" -l <listId> --json
trello cards create -n "Task" -l <listId> -d "Description" --due 2026-04-01 --json

# Update a card
trello cards update <cardId> -n "New title" --json
trello cards update <cardId> -d "New description" --json
trello cards update <cardId> -l <listId> --json          # move to list
trello cards update <cardId> --due 2026-04-01 --json     # set due date
trello cards update <cardId> --done --json               # mark due complete
trello cards update <cardId> --close --json              # archive
trello cards update <cardId> --reopen --json             # unarchive
trello cards update <cardId> --make-template --json      # convert to template
trello cards update <cardId> --remove-template --json    # convert back

# Delete a card (requires --yes)
trello cards delete <cardId> --yes --json

# Comments
trello cards comments <cardId> --json
trello cards add-comment <cardId> -t "Comment text" --json
trello cards update-comment <cardId> <commentId> -t "Updated" --json
trello cards delete-comment <cardId> <commentId> --yes --json

# Attachments
trello cards attachments <cardId> --json
trello cards add-attachment <cardId> --url "https://example.com" --json
trello cards delete-attachment <cardId> <attachmentId> --yes --json

# Members
trello cards members <cardId> --json
trello cards add-member <cardId> <memberId> --json
trello cards remove-member <cardId> <memberId> --json

# Labels
trello cards add-label <cardId> <labelId> --json
trello cards remove-label <cardId> <labelId> --json
```

### Label Management

```bash
trello labels get <labelId> --json
trello labels create -n "Bug" -c red -b <boardId> --json
trello labels update <labelId> -n "Critical" -c purple --json
trello labels delete <labelId> --yes --json
```

Valid colors: `yellow`, `purple`, `blue`, `red`, `green`, `orange`, `black`, `sky`, `pink`, `lime`

### Checklist Management

```bash
# Get checklist with items
trello checklists get <checklistId> --json

# Create a checklist on a card
trello checklists create -c <cardId> -n "QA Steps" --json

# Update/delete checklist
trello checklists update <checklistId> -n "New Name" --json
trello checklists delete <checklistId> --yes --json

# Manage check items
trello checklists items <checklistId> --json
trello checklists add-item <checklistId> -n "Write tests" --json
trello checklists add-item <checklistId> -n "Done" --checked --json
trello checklists remove-item <checklistId> <checkItemId> --yes --json

# Update check item (note: uses cardId, not checklistId)
trello checklists update-item <cardId> <checkItemId> --complete --json
trello checklists update-item <cardId> <checkItemId> --incomplete --json
trello checklists update-item <cardId> <checkItemId> -n "Renamed" --json
```

### Custom Fields

```bash
# List custom fields on a board
trello boards custom-fields <boardId> --json

# Create a custom field (requires Custom Fields Power-Up enabled)
trello custom-fields create -b <boardId> -n "Priority" -t text --json
trello custom-fields create -b <boardId> -n "Status" -t list --json
# Types: checkbox, list, number, text, date

# Manage dropdown options (list type)
trello custom-fields options <fieldId> --json
trello custom-fields add-option <fieldId> -v "High" -c red --json
trello custom-fields delete-option <fieldId> <optionId> --yes --json

# Set values on cards
trello custom-fields card-values <cardId> --json
trello custom-fields set-value <cardId> <fieldId> --text "Hello" --json
trello custom-fields set-value <cardId> <fieldId> --number 42 --json
trello custom-fields set-value <cardId> <fieldId> --checkbox true --json
trello custom-fields set-value <cardId> <fieldId> --date 2026-04-01 --json
trello custom-fields set-value <cardId> <fieldId> --option <optionId> --json
trello custom-fields set-value <cardId> <fieldId> --clear --json

# Update/delete field definitions
trello custom-fields update <fieldId> -n "New Name" --json
trello custom-fields delete <fieldId> --yes --json
```

### Search

```bash
# Search boards and cards
trello search "query" --json
trello search "bug" --type cards --json
trello search "urgent" --boards <boardId1>,<boardId2> --json
trello search "fix" --partial --cards-limit 25 --json

# Search members
trello search members "john" --json
trello search members "jane" --board <boardId> --json
```

## Scripting Tips

### Get Current User ID

```bash
trello whoami --json | jq -r '.id'
```

### Get All List IDs on a Board

```bash
trello boards lists <boardId> --json | jq -r '.[].id'
```

### Move a Card by List Name

```bash
# Find the target list ID, then move the card
LIST_ID=$(trello boards lists <boardId> --json | jq -r '.[] | select(.name == "Done") | .id')
trello cards update <cardId> -l "$LIST_ID" --json
```

### Create a Card with Full Setup

```bash
# Create card, add members, add labels, add checklist
CARD=$(trello cards create -n "New Feature" -l <listId> --json | jq -r '.id')
trello cards add-member "$CARD" <memberId>
trello cards add-label "$CARD" <labelId>
CL=$(trello checklists create -c "$CARD" -n "Tasks" --json | jq -r '.id')
trello checklists add-item "$CL" -n "Implementation"
trello checklists add-item "$CL" -n "Tests"
trello checklists add-item "$CL" -n "Review"
```

### Find and Update Cards

```bash
trello search "login bug" --type cards --json | jq -r '.cards[].id' | while read id; do
  trello cards update "$id" --due 2026-04-01
done
```

## Error Handling

### Not Logged In

If a command fails with "Not logged in", run:
```bash
trello login
```

### Destructive Operations

Commands that delete data require `--yes` to confirm:
- `trello boards delete <id> --yes`
- `trello cards delete <id> --yes`
- `trello labels delete <id> --yes`
- `trello checklists delete <id> --yes`
- `trello cards delete-comment <cardId> <commentId> --yes`
- `trello cards delete-attachment <cardId> <attachmentId> --yes`
- `trello checklists remove-item <checklistId> <checkItemId> --yes`
- `trello custom-fields delete <id> --yes`
- `trello custom-fields delete-option <fieldId> <optionId> --yes`
- `trello lists archive-all-cards <id> --yes`

## Configuration

Config stored at: `~/.trello-cli/config.json`

```bash
trello config get
trello config set outputFormat json
trello config reset
trello config path
```

## Tips for AI Assistants

1. Always check login status with `trello status --json` before running commands
2. Use `--json` flag for all commands when parsing output programmatically
3. Use `trello boards lists <boardId> --json` to discover list IDs before creating/moving cards
4. Use `trello boards members <boardId> --json` to discover member IDs before assigning
5. Destructive operations always require `--yes` — never omit it
6. The `checklists update-item` command takes a **card ID** (not checklist ID) as the first argument
7. Custom fields require the Custom Fields Power-Up to be enabled on the board
8. IDs are 24-character hex strings (e.g., `60d5ecb2a1b2c30a12345678`)
