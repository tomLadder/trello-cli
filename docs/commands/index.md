# Commands

Quick reference for all trello-cli commands.

All commands are based on the [Trello REST API](https://developer.atlassian.com/cloud/trello/rest/api-group-actions/).

## Authentication

| Command | Description |
|---------|-------------|
| [`login`](/commands/login) | Authenticate with Trello |
| [`logout`](/commands/logout) | Clear stored credentials |
| [`whoami`](/commands/whoami) | Show current user info |
| [`status`](/commands/status) | Check login status |

## Boards

| Command | Description |
|---------|-------------|
| [`boards`](/commands/boards) | List your Trello boards |
| [`boards get`](/commands/boards#get-board) | Get details of a specific board |
| [`boards create`](/commands/boards#create-board) | Create a new board |
| [`boards update`](/commands/boards#update-board) | Update an existing board |
| [`boards delete`](/commands/boards#delete-board) | Permanently delete a board |
| [`boards lists`](/commands/boards#board-lists) | List all lists on a board |
| [`boards cards`](/commands/boards#board-cards) | List all cards on a board |
| [`boards members`](/commands/boards#board-members) | List all members of a board |
| [`boards labels`](/commands/boards#board-labels) | List all labels on a board |
| [`boards checklists`](/commands/boards#board-checklists) | List all checklists on a board |
| [`boards custom-fields`](/commands/boards#board-custom-fields) | List all custom fields on a board |

## Lists

| Command | Description |
|---------|-------------|
| [`lists get`](/commands/lists#get-list) | Get details of a specific list |
| [`lists create`](/commands/lists#create-list) | Create a new list |
| [`lists update`](/commands/lists#update-list) | Update an existing list |
| [`lists cards`](/commands/lists#list-cards) | List cards in a list |
| [`lists archive-all-cards`](/commands/lists#archive-all-cards) | Archive all cards in a list |
| [`lists move-all-cards`](/commands/lists#move-all-cards) | Move all cards to another list |

## Cards

| Command | Description |
|---------|-------------|
| [`cards get`](/commands/cards#get-card) | Get details of a specific card |
| [`cards create`](/commands/cards#create-card) | Create a new card |
| [`cards update`](/commands/cards#update-card) | Update an existing card |
| [`cards delete`](/commands/cards#delete-card) | Permanently delete a card |
| [`cards comments`](/commands/cards#list-comments) | List comments on a card |
| [`cards add-comment`](/commands/cards#add-comment) | Add a comment to a card |
| [`cards update-comment`](/commands/cards#update-comment) | Update a comment |
| [`cards delete-comment`](/commands/cards#delete-comment) | Delete a comment |
| [`cards attachments`](/commands/cards#list-attachments) | List attachments on a card |
| [`cards add-attachment`](/commands/cards#add-attachment) | Add an attachment |
| [`cards delete-attachment`](/commands/cards#delete-attachment) | Delete an attachment |
| [`cards members`](/commands/cards#list-members) | List members on a card |
| [`cards add-member`](/commands/cards#add-member) | Add a member to a card |
| [`cards remove-member`](/commands/cards#remove-member) | Remove a member from a card |
| [`cards add-label`](/commands/cards#add-label) | Add a label to a card |
| [`cards remove-label`](/commands/cards#remove-label) | Remove a label from a card |

## Labels

| Command | Description |
|---------|-------------|
| [`labels get`](/commands/labels#get-label) | Get details of a specific label |
| [`labels create`](/commands/labels#create-label) | Create a new label |
| [`labels update`](/commands/labels#update-label) | Update an existing label |
| [`labels delete`](/commands/labels#delete-label) | Permanently delete a label |

## Checklists

| Command | Description |
|---------|-------------|
| [`checklists get`](/commands/checklists#get-checklist) | Get checklist details |
| [`checklists create`](/commands/checklists#create-checklist) | Create a new checklist |
| [`checklists update`](/commands/checklists#update-checklist) | Update a checklist |
| [`checklists delete`](/commands/checklists#delete-checklist) | Permanently delete a checklist |
| [`checklists items`](/commands/checklists#list-check-items) | List check items in a checklist |
| [`checklists add-item`](/commands/checklists#add-check-item) | Add a check item |
| [`checklists remove-item`](/commands/checklists#remove-check-item) | Remove a check item |
| [`checklists update-item`](/commands/checklists#update-check-item) | Update a check item |

## Custom Fields

| Command | Description |
|---------|-------------|
| [`custom-fields get`](/commands/custom-fields#get-custom-field) | Get a custom field definition |
| [`custom-fields create`](/commands/custom-fields#create-custom-field) | Create a custom field |
| [`custom-fields update`](/commands/custom-fields#update-custom-field) | Update a custom field |
| [`custom-fields delete`](/commands/custom-fields#delete-custom-field) | Delete a custom field |
| [`custom-fields options`](/commands/custom-fields#list-dropdown-options) | List dropdown options |
| [`custom-fields add-option`](/commands/custom-fields#add-dropdown-option) | Add a dropdown option |
| [`custom-fields delete-option`](/commands/custom-fields#delete-dropdown-option) | Delete a dropdown option |
| [`custom-fields card-values`](/commands/custom-fields#list-values) | List custom field values on a card |
| [`custom-fields set-value`](/commands/custom-fields#set-value) | Set a custom field value on a card |

## Search

| Command | Description |
|---------|-------------|
| [`search`](/commands/search) | Search boards and cards |
| [`search members`](/commands/search#search-members) | Search for members |

## Configuration

| Command | Description |
|---------|-------------|
| [`config get`](/commands/config#get) | Show current configuration |
| [`config set`](/commands/config#set) | Set a configuration value |
| [`config reset`](/commands/config#reset) | Reset to defaults |
| [`config path`](/commands/config#path) | Show config file path |

## Global Options

All commands support:

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON (for scripting) |
| `--help` | Show command help |
| `--version` | Show version |
