import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getList, createList, updateList, archiveAllCards, moveAllCards, getListCards } from '../../api/lists.ts';
import { isLoggedIn } from '../../store/config.ts';

export function registerListCommands(program: Command): void {
  const lists = program
    .command('lists')
    .description('Manage Trello lists');

  // Subcommand: lists get <id>
  lists
    .command('get <id>')
    .description('Get details of a specific list')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching list...').start();
      const result = await getList(id);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch list');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const list = result.data;
      console.log();
      console.log(chalk.bold('List Details'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.cyan('Name:'), list.name);
      console.log(chalk.cyan('ID:'), list.id);
      console.log(chalk.cyan('Status:'), list.closed ? 'Closed' : 'Open');
      console.log(chalk.cyan('Board ID:'), list.idBoard);
      console.log();
    });

  // Subcommand: lists create
  lists
    .command('create')
    .description('Create a new list')
    .requiredOption('-n, --name <name>', 'List name')
    .requiredOption('-b, --board <boardId>', 'Board ID to create the list on')
    .option('--pos <position>', 'Position: top or bottom')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Creating list...').start();
      const result = await createList({
        name: options.name,
        idBoard: options.board,
        pos: options.pos,
      });

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to create list');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('List created');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const list = result.data;
      console.log();
      console.log(chalk.bold(list.name));
      console.log(chalk.cyan('ID:'), list.id);
      console.log();
    });

  // Subcommand: lists update <id>
  lists
    .command('update <id>')
    .description('Update an existing list')
    .option('-n, --name <name>', 'New list name')
    .option('--close', 'Archive the list')
    .option('--reopen', 'Unarchive the list')
    .option('--pos <position>', 'Position: top or bottom')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const updateOptions: Record<string, unknown> = {};
      if (options.name !== undefined) updateOptions.name = options.name;
      if (options.close) updateOptions.closed = true;
      if (options.reopen) updateOptions.closed = false;
      if (options.pos !== undefined) updateOptions.pos = options.pos;

      if (Object.keys(updateOptions).length === 0) {
        console.log(chalk.yellow('No update options provided. Use --help to see available options.'));
        return;
      }

      const spinner = options.json ? null : ora('Updating list...').start();
      const result = await updateList(id, updateOptions);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to update list');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('List updated');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const list = result.data;
      console.log();
      console.log(chalk.bold(list.name));
      console.log(chalk.cyan('ID:'), list.id);
      console.log(chalk.cyan('Status:'), list.closed ? 'Closed' : 'Open');
      console.log();
    });

  // Subcommand: lists cards <id>
  lists
    .command('cards <id>')
    .description('List cards in a list')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching cards...').start();
      const result = await getListCards(id);

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
        console.log(chalk.yellow('No cards found in this list'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Cards (${cards.length})`));
      console.log(chalk.gray('─'.repeat(70)));

      for (const card of cards) {
        console.log();
        console.log(chalk.bold(card.name));
        console.log(chalk.cyan('ID:'), card.id);
        if (card.due) {
          console.log(chalk.cyan('Due:'), card.due);
        }
      }
      console.log();
    });

  // Subcommand: lists archive-all-cards <id>
  lists
    .command('archive-all-cards <id>')
    .description('Archive all cards in a list')
    .option('--yes', 'Skip confirmation')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      if (!options.yes && !options.json) {
        const listResult = await getList(id);
        const listName = listResult.success && listResult.data ? listResult.data.name : id;
        console.log(chalk.yellow(`⚠ This will archive all cards in list "${listName}".`));
        console.log(chalk.yellow('  This action cannot be undone.'));
        console.log();
        console.log('Run with --yes to confirm.');
        return;
      }

      const spinner = options.json ? null : ora('Archiving all cards...').start();
      const result = await archiveAllCards(id);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to archive cards');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('All cards archived');
      }
    });

  // Subcommand: lists move-all-cards <id>
  lists
    .command('move-all-cards <id>')
    .description('Move all cards in a list to another list')
    .requiredOption('-b, --board <boardId>', 'Destination board ID')
    .requiredOption('-l, --list <listId>', 'Destination list ID')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Moving all cards...').start();
      const result = await moveAllCards(id, options.board, options.list);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to move cards');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('All cards moved');
      }
    });
}
