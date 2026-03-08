# login

Authenticate with Trello using API key and token.

## Usage

```bash
trello login [options]
```

## Options

| Option | Description |
|--------|-------------|
| `-k, --api-key <key>` | Trello API key |
| `-t, --token <token>` | Trello token |
| `--json` | Output as JSON |

## Getting Credentials

### Step 1: Get API Key

Visit https://trello.com/app-key while logged into Trello.

### Step 2: Generate Token

Click the "Token" link on the API key page, or use this URL format:

```
https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=trello-cli&key=YOUR_API_KEY
```

## Interactive Login

```bash
trello login
# Get your API key from: https://trello.com/app-key
#
# Enter your Trello API key: ********************************
#
# Authorize and get your token from:
# https://trello.com/1/authorize?expiration=never&scope=read,write...
#
# Enter your Trello token: ********************************
# Logging in...
# Login successful
# Welcome, Your Name
```

## Non-Interactive Login

```bash
trello login --api-key YOUR_KEY --token YOUR_TOKEN --json
# {"success":true,"user":{"id":"...","username":"...","fullName":"..."}}
```

## Token Permissions

The CLI requests tokens with:
- **read** - Read boards, lists, cards
- **write** - Create and modify boards, lists, cards
- **expiration: never** - Token doesn't expire

::: info
You can revoke access anytime from your Trello account settings at https://trello.com/your/account
:::

## Errors

| Error | Solution |
|-------|----------|
| Invalid credentials | Check your API key and token are correct |
| Already logged in | Use `trello logout` first or confirm re-login |
