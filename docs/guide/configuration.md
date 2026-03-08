# Configuration

Configuration is stored in `~/.trello-cli/config.json`.

## Settings

| Key | Values | Default | Description |
|-----|--------|---------|-------------|
| `outputFormat` | `pretty`, `json` | `pretty` | Default output format |

## Commands

### View Configuration

```bash
trello config get
```

### Set a Value

```bash
# Set default output to JSON
trello config set outputFormat json

# Set default output to pretty
trello config set outputFormat pretty
```

### Reset to Defaults

```bash
trello config reset
```

### Show Config File Path

```bash
trello config path
# Output: /Users/username/.trello-cli/config.json
```

## File Structure

```json
{
  "auth": {
    "apiKey": "your-api-key",
    "token": "your-token"
  },
  "settings": {
    "outputFormat": "pretty"
  }
}
```

::: warning
The config file contains your API credentials. It's created with secure permissions (0600) and should not be shared.
:::
