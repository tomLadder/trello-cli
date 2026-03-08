# status

Check login status and session information.

## Usage

```bash
trello status [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

## Example

```bash
trello status
# Logged in as: John Doe
# Username: johndoe
```

## Not Logged In

```bash
trello status
# Not logged in
```

## JSON Output

```bash
trello status --json
```

```json
{
  "loggedIn": true,
  "user": {
    "id": "5a1b2c3d4e5f6g7h8i9j0k",
    "username": "johndoe",
    "fullName": "John Doe"
  }
}
```

## Use Cases

- Verify you're logged in before running other commands
- Check which account is currently authenticated
- Scripting: check auth status before batch operations
