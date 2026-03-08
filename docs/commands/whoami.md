# whoami

Show current user information.

## Usage

```bash
trello whoami [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

## Example

```bash
trello whoami

# User Information
# ────────────────────────────────────────
# Username: johndoe
# Full Name: John Doe
# Email: john@example.com
# ID: 5a1b2c3d4e5f6g7h8i9j0k
```

## JSON Output

```bash
trello whoami --json
```

```json
{
  "id": "5a1b2c3d4e5f6g7h8i9j0k",
  "username": "johndoe",
  "fullName": "John Doe",
  "email": "john@example.com"
}
```

## Requires Authentication

You must be logged in to use this command:

```bash
trello whoami
# Not logged in. Run: trello login
```
