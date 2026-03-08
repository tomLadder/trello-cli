import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getBoards, getBoard, createBoard, updateBoard, deleteBoard, getBoardLists, getBoardCards, getBoardMembers, getBoardLabels, getBoardChecklists, getBoardCustomFields, type BoardFilter } from '../../api/boards.ts';
import { isLoggedIn } from '../../store/config.ts';

export function registerBoardCommands(program: Command): void {
  const boards = program
    .command('boards')
    .description('List your Trello boards')
    .option('-f, --filter <filter>', 'Filter boards: all, open, closed, starred', 'all')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching boards...').start();
      const filter = options.filter as BoardFilter;
      const result = await getBoards(filter);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch boards');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const boards = result.data;
      if (boards.length === 0) {
        console.log(chalk.yellow('No boards found'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Your Boards (${boards.length})`));
      console.log(chalk.gray('─'.repeat(70)));

      for (const board of boards) {
        const status = board.closed ? chalk.red('[Closed]') : chalk.green('[Open]');
        console.log();
        console.log(chalk.bold(board.name), status);
        if (board.desc) {
          console.log(chalk.gray(board.desc.substring(0, 80) + (board.desc.length > 80 ? '...' : '')));
        }
        console.log(chalk.cyan('ID:'), board.id);
        console.log(chalk.cyan('URL:'), board.shortUrl || board.url);
      }
      console.log();
    });

  // Subcommand: boards create <name>
  boards
    .command('create <name>')
    .description('Create a new board')
    .option('-d, --desc <description>', 'Board description')
    .option('--org <idOrganization>', 'Workspace ID the board belongs to')
    .option('--no-default-lists', 'Do not create default lists (To Do, Doing, Done)')
    .option('--no-default-labels', 'Do not create default labels')
    .option('--permission <level>', 'Permission level: org, private, public', 'private')
    .option('--background <color>', 'Background color: blue, orange, green, red, purple, pink, lime, sky, grey')
    .option('--copy-from <boardId>', 'Copy from an existing board')
    .option('--keep-cards', 'When copying, keep cards from the source board')
    .option('--json', 'Output as JSON')
    .action(async (name, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Creating board...').start();
      const result = await createBoard({
        name,
        desc: options.desc,
        idOrganization: options.org,
        defaultLists: options.defaultLists,
        defaultLabels: options.defaultLabels,
        prefs_permissionLevel: options.permission,
        prefs_background: options.background,
        idBoardSource: options.copyFrom,
        keepFromSource: options.keepCards ? 'cards' : undefined,
      });

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to create board');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Board created');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const board = result.data;
      console.log();
      console.log(chalk.bold(board.name));
      console.log(chalk.cyan('ID:'), board.id);
      console.log(chalk.cyan('URL:'), board.shortUrl || board.url);
      console.log();
    });

  // Subcommand: boards update <id>
  boards
    .command('update <id>')
    .description('Update an existing board')
    .option('-n, --name <name>', 'New board name')
    .option('-d, --desc <description>', 'New board description')
    .option('--close', 'Close the board')
    .option('--reopen', 'Reopen a closed board')
    .option('--org <idOrganization>', 'Move to a different workspace')
    .option('--permission <level>', 'Permission level: org, private, public')
    .option('--background <color>', 'Background color: blue, orange, green, red, purple, pink, lime, sky, grey')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const updateOptions: Record<string, unknown> = {};
      if (options.name !== undefined) updateOptions.name = options.name;
      if (options.desc !== undefined) updateOptions.desc = options.desc;
      if (options.close) updateOptions.closed = true;
      if (options.reopen) updateOptions.closed = false;
      if (options.org !== undefined) updateOptions.idOrganization = options.org;
      if (options.permission !== undefined) updateOptions.prefs_permissionLevel = options.permission;
      if (options.background !== undefined) updateOptions.prefs_background = options.background;

      if (Object.keys(updateOptions).length === 0) {
        console.log(chalk.yellow('No update options provided. Use --help to see available options.'));
        return;
      }

      const spinner = options.json ? null : ora('Updating board...').start();
      const result = await updateBoard(id, updateOptions);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to update board');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Board updated');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const board = result.data;
      console.log();
      console.log(chalk.bold(board.name));
      console.log(chalk.cyan('ID:'), board.id);
      console.log(chalk.cyan('Status:'), board.closed ? 'Closed' : 'Open');
      console.log(chalk.cyan('URL:'), board.shortUrl || board.url);
      console.log();
    });

  // Subcommand: boards delete <id>
  boards
    .command('delete <id>')
    .description('Permanently delete a board')
    .option('--yes', 'Skip confirmation')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      if (!options.yes && !options.json) {
        const boardResult = await getBoard(id);
        const boardName = boardResult.success && boardResult.data ? boardResult.data.name : id;
        console.log(chalk.yellow(`⚠ This will permanently delete board "${boardName}".`));
        console.log(chalk.yellow('  This action cannot be undone.'));
        console.log();
        console.log('Run with --yes to confirm deletion.');
        return;
      }

      const spinner = options.json ? null : ora('Deleting board...').start();
      const result = await deleteBoard(id);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to delete board');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Board deleted');
      }
    });

  // Subcommand: boards get <id>
  boards
    .command('get <id>')
    .description('Get details of a specific board')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching board...').start();
      const result = await getBoard(id);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch board');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const board = result.data;
      console.log();
      console.log(chalk.bold('Board Details'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.cyan('Name:'), board.name);
      console.log(chalk.cyan('ID:'), board.id);
      console.log(chalk.cyan('Status:'), board.closed ? 'Closed' : 'Open');
      if (board.desc) {
        console.log(chalk.cyan('Description:'), board.desc);
      }
      console.log(chalk.cyan('URL:'), board.url);
      if (board.shortUrl) {
        console.log(chalk.cyan('Short URL:'), board.shortUrl);
      }
    });

  // Subcommand: boards lists <boardId>
  boards
    .command('lists <boardId>')
    .description('List all lists on a board')
    .option('--filter <filter>', 'Filter: all, open, closed', 'all')
    .option('--json', 'Output as JSON')
    .action(async (boardId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching lists...').start();
      const result = await getBoardLists(boardId, options.filter);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch lists');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const lists = result.data;
      if (lists.length === 0) {
        console.log(chalk.yellow('No lists found'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Board Lists (${lists.length})`));
      console.log(chalk.gray('─'.repeat(40)));

      for (const list of lists) {
        const status = list.closed ? chalk.red('[Closed]') : chalk.green('[Open]');
        console.log();
        console.log(chalk.bold(list.name), status);
        console.log(chalk.cyan('ID:'), list.id);
      }
      console.log();
    });

  // Subcommand: boards cards <boardId>
  boards
    .command('cards <boardId>')
    .description('List all cards on a board')
    .option('--json', 'Output as JSON')
    .action(async (boardId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching cards...').start();
      const result = await getBoardCards(boardId);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch cards');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const cards = result.data;
      if (cards.length === 0) {
        console.log(chalk.yellow('No cards found'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Board Cards (${cards.length})`));
      console.log(chalk.gray('─'.repeat(40)));

      for (const card of cards) {
        console.log();
        console.log(chalk.bold(card.name));
        console.log(chalk.cyan('ID:'), card.id);
        console.log(chalk.cyan('List ID:'), card.idList);
        if (card.due) {
          console.log(chalk.cyan('Due:'), card.due);
        }
        if (card.labels && card.labels.length > 0) {
          const labelStr = card.labels.map(l => l.name || l.color).join(', ');
          console.log(chalk.cyan('Labels:'), labelStr);
        }
      }
      console.log();
    });

  // Subcommand: boards members <boardId>
  boards
    .command('members <boardId>')
    .description('List all members of a board')
    .option('--json', 'Output as JSON')
    .action(async (boardId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching members...').start();
      const result = await getBoardMembers(boardId);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch members');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const members = result.data;
      if (members.length === 0) {
        console.log(chalk.yellow('No members found'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Board Members (${members.length})`));
      console.log(chalk.gray('─'.repeat(40)));

      for (const member of members) {
        console.log();
        console.log(chalk.bold(member.fullName));
        console.log(chalk.cyan('Username:'), member.username);
        console.log(chalk.cyan('ID:'), member.id);
      }
      console.log();
    });

  // Subcommand: boards labels <boardId>
  boards
    .command('labels <boardId>')
    .description('List all labels on a board')
    .option('--json', 'Output as JSON')
    .action(async (boardId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching labels...').start();
      const result = await getBoardLabels(boardId);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch labels');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const labels = result.data;
      if (labels.length === 0) {
        console.log(chalk.yellow('No labels found'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Board Labels (${labels.length})`));
      console.log(chalk.gray('─'.repeat(40)));

      for (const label of labels) {
        console.log();
        console.log(chalk.bold(label.name || '(unnamed)'));
        console.log(chalk.cyan('Color:'), label.color);
        console.log(chalk.cyan('ID:'), label.id);
      }
      console.log();
    });

  // Subcommand: boards checklists <boardId>
  boards
    .command('checklists <boardId>')
    .description('List all checklists on a board')
    .option('--json', 'Output as JSON')
    .action(async (boardId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching checklists...').start();
      const result = await getBoardChecklists(boardId);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch checklists');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const checklists = result.data;
      if (checklists.length === 0) {
        console.log(chalk.yellow('No checklists found'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Board Checklists (${checklists.length})`));
      console.log(chalk.gray('─'.repeat(40)));

      for (const checklist of checklists) {
        const total = checklist.checkItems.length;
        const complete = checklist.checkItems.filter(i => i.state === 'complete').length;
        console.log();
        console.log(chalk.bold(checklist.name));
        console.log(chalk.cyan('ID:'), checklist.id);
        console.log(chalk.cyan('Card ID:'), checklist.idCard);
        console.log(chalk.cyan('Check Items:'), total);
        console.log(chalk.cyan('Progress:'), `${complete}/${total} complete`);
      }
      console.log();
    });

  // Subcommand: boards custom-fields <boardId>
  boards
    .command('custom-fields <boardId>')
    .description('List all custom fields on a board')
    .option('--json', 'Output as JSON')
    .action(async (boardId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching custom fields...').start();
      const result = await getBoardCustomFields(boardId);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch custom fields');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const customFields = result.data;
      if (customFields.length === 0) {
        console.log(chalk.yellow('No custom fields found'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Board Custom Fields (${customFields.length})`));
      console.log(chalk.gray('─'.repeat(40)));

      for (const field of customFields) {
        console.log();
        console.log(chalk.bold(field.name));
        console.log(chalk.cyan('Type:'), field.type);
        console.log(chalk.cyan('ID:'), field.id);
        console.log(chalk.cyan('Display on Card Front:'), field.display.cardFront ? 'Yes' : 'No');
        if (field.type === 'list' && field.options && field.options.length > 0) {
          console.log(chalk.cyan('Options:'));
          for (const option of field.options) {
            const color = option.color ? ` (${option.color})` : '';
            console.log(`  - ${option.value.text}${color}`);
          }
        }
      }
      console.log();
    });
}
