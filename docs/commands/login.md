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
| `-t, --token <token>` | Trello API token |
| `--json` | Output as JSON |

## Getting Credentials

### Step 1: Create a Power-Up and Get API Key

1. Go to [Trello Power-Ups Admin](https://trello.com/power-ups/admin/)
2. Create a new Power-Up (or select an existing one)
3. Navigate to **API Key** → **Generate a new API Key**
4. Copy your API key

::: tip Documentation
For detailed instructions, see the [Trello REST API Introduction](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/)
:::

### Step 2: Generate Token

After getting your API key, generate a token by opening this URL (replace `YOUR_API_KEY`):

```
https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=trello-cli&key=YOUR_API_KEY
```

Click **Allow** and copy the token displayed.

## Interactive Login

```bash
trello login

# To get your API credentials:
# ──────────────────────────────────────────────────
# 1. Go to: https://trello.com/power-ups/admin/
# 2. Create a new Power-Up (or select existing)
# 3. Go to API Key → Generate a new API Key
#
# Documentation: https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/
#
# Enter your Trello API key: ********************************
#
# Generate your API token:
# ──────────────────────────────────────────────────
# Open this URL and click "Allow":
# https://trello.com/1/authorize?expiration=never&scope=read,write...
#
# Enter your Trello token: ********************************
# Logging in...
# Login successful
# Welcome, Your Name
```

## Non-Interactive Login

For scripts and automation:

```bash
trello login --api-key YOUR_KEY --token YOUR_TOKEN

# Or with JSON output
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
