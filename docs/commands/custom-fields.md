# custom-fields

Manage Trello custom fields — define fields on boards, manage dropdown options, and set values on cards.

## Get Custom Field

```bash
trello custom-fields get <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

```bash
trello custom-fields get 60d5ecb2a1b2c30a12345678
```

## Create Custom Field

```bash
trello custom-fields create [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-b, --board <boardId>` | Board ID (required) |
| `-n, --name <name>` | Field name (required) |
| `-t, --type <type>` | Field type: `checkbox`, `list`, `number`, `text`, `date` (required) |
| `--pos <position>` | Position: `top` or `bottom` |
| `--no-card-front` | Don't display on card front |
| `--json` | Output as JSON |

### Examples

```bash
# Create a text field
trello custom-fields create -b 60d5ecb2a1b2c30a12345678 -n "Priority" -t text

# Create a dropdown field
trello custom-fields create -b 60d5ecb2a1b2c30a12345678 -n "Status" -t list

# Create a checkbox hidden from card front
trello custom-fields create -b 60d5ecb2a1b2c30a12345678 -n "Reviewed" -t checkbox --no-card-front
```

## Update Custom Field

```bash
trello custom-fields update <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | New field name |
| `--pos <position>` | New position |
| `--show-on-card` | Show on card front |
| `--hide-from-card` | Hide from card front |
| `--json` | Output as JSON |

### Examples

```bash
trello custom-fields update 60d5ecb2a1b2c30a12345678 -n "Severity"
trello custom-fields update 60d5ecb2a1b2c30a12345678 --hide-from-card
```

## Delete Custom Field

```bash
trello custom-fields delete <id> [options]
```

::: warning
This action is **permanent** and cannot be undone. The command requires `--yes` to confirm deletion.
:::

### Options

| Option | Description |
|--------|-------------|
| `--yes` | Skip confirmation |
| `--json` | Output as JSON |

```bash
trello custom-fields delete 60d5ecb2a1b2c30a12345678 --yes
```

## List Dropdown Options

```bash
trello custom-fields options <id> [options]
```

For `list`-type custom fields only.

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

```bash
trello custom-fields options 60d5ecb2a1b2c30a12345678
```

## Add Dropdown Option

```bash
trello custom-fields add-option <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-v, --value <text>` | Option text value (required) |
| `-c, --color <color>` | Option color |
| `--pos <position>` | Position: `top` or `bottom` |
| `--json` | Output as JSON |

```bash
trello custom-fields add-option 60d5ecb2a1b2c30a12345678 -v "High" -c red
trello custom-fields add-option 60d5ecb2a1b2c30a12345678 -v "Low" -c green --pos bottom
```

## Delete Dropdown Option

```bash
trello custom-fields delete-option <fieldId> <optionId> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--yes` | Skip confirmation |
| `--json` | Output as JSON |

```bash
trello custom-fields delete-option 60d5ecb2a1b2c3 60d5ecb2a1b2c4 --yes
```

## Card Custom Field Values

### List Values

```bash
trello custom-fields card-values <cardId> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

```bash
trello custom-fields card-values 60d5ecb2a1b2c30a12345678
```

### Set Value

```bash
trello custom-fields set-value <cardId> <customFieldId> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--text <text>` | Set text value |
| `--number <number>` | Set number value |
| `--checkbox <true\|false>` | Set checkbox value |
| `--date <date>` | Set date value (ISO 8601) |
| `--option <optionId>` | Set dropdown option (by ID) |
| `--clear` | Clear the value |
| `--json` | Output as JSON |

### Examples

```bash
# Set a text value
trello custom-fields set-value 60d5ecb2a1b2c3 60d5ecb2a1b2c4 --text "High"

# Set a number
trello custom-fields set-value 60d5ecb2a1b2c3 60d5ecb2a1b2c4 --number 42

# Toggle a checkbox
trello custom-fields set-value 60d5ecb2a1b2c3 60d5ecb2a1b2c4 --checkbox true

# Set a date
trello custom-fields set-value 60d5ecb2a1b2c3 60d5ecb2a1b2c4 --date 2026-04-01

# Set a dropdown option
trello custom-fields set-value 60d5ecb2a1b2c3 60d5ecb2a1b2c4 --option 60d5ecb2a1b2c5

# Clear a value
trello custom-fields set-value 60d5ecb2a1b2c3 60d5ecb2a1b2c4 --clear
```
