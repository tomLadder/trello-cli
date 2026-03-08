# logout

Logout and clear stored credentials.

## Usage

```bash
trello logout
```

## Example

```bash
trello logout
# Logged out successfully
```

## What Happens

1. API credentials are removed from `~/.trello-cli/config.json`
2. You'll need to login again to access Trello

::: tip
This only removes local credentials. To fully revoke access, visit https://trello.com/your/account and remove the app authorization.
:::

## If Not Logged In

```bash
trello logout
# Not logged in
```
