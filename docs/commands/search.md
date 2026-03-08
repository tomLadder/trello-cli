# search

Search across your Trello boards, cards, and members.

## Search

```bash
trello search <query> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--boards <boardIds>` | Comma-separated board IDs to limit search |
| `--type <types>` | Model types to search: `cards`, `boards` (default: `all`) |
| `--cards-limit <n>` | Max cards to return (default: `10`) |
| `--boards-limit <n>` | Max boards to return (default: `10`) |
| `--cards-page <n>` | Page of card results (default: `0`) |
| `--partial` | Allow partial word matching |
| `--json` | Output as JSON |

### Examples

```bash
# Search for everything matching "login bug"
trello search "login bug"

# Search only cards
trello search "deploy" --type cards

# Search within specific boards
trello search "urgent" --boards boardId1,boardId2

# Search with partial matching and more results
trello search "fix" --partial --cards-limit 25

# Paginate through results
trello search "feature" --cards-page 1
```

## Search Members

```bash
trello search members <query> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--board <boardId>` | Limit to members of a board |
| `--org <orgId>` | Limit to members of an organization |
| `--limit <n>` | Max results (default: `8`) |
| `--json` | Output as JSON |

### Examples

```bash
# Search for members by name
trello search members "john"

# Search within a specific board
trello search members "jane" --board 60d5ecb2a1b2c30a12345678
```
