import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getChecklist, createChecklist, updateChecklist, deleteChecklist, getCheckItems, createCheckItem, deleteCheckItem, updateCheckItem } from '../../api/checklists.ts';
import { isLoggedIn } from '../../store/config.ts';

export function registerChecklistCommands(program: Command): void {
  const checklists = program
    .command('checklists')
    .description('Manage Trello checklists');

  // Subcommand: checklists get <id>
  checklists
    .command('get <id>')
    .description('Get checklist details')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching checklist...').start();
      const result = await getChecklist(id);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch checklist');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const checklist = result.data;
      console.log();
      console.log(chalk.bold('Checklist Details'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.cyan('Name:'), checklist.name);
      console.log(chalk.cyan('ID:'), checklist.id);
      console.log(chalk.cyan('Card ID:'), checklist.idCard);
      console.log(chalk.cyan('Board ID:'), checklist.idBoard);

      if (checklist.checkItems && checklist.checkItems.length > 0) {
        console.log();
        console.log(chalk.bold(`Check Items (${checklist.checkItems.length})`));
        console.log(chalk.gray('─'.repeat(40)));

        for (const item of checklist.checkItems) {
          const state = item.state === 'complete'
            ? chalk.green('complete')
            : chalk.yellow('incomplete');
          console.log();
          console.log(chalk.bold(item.name), state);
          console.log(chalk.cyan('ID:'), item.id);
        }
      }
      console.log();
    });

  // Subcommand: checklists create
  checklists
    .command('create')
    .description('Create a new checklist')
    .requiredOption('-c, --card <cardId>', 'Card ID to add the checklist to')
    .option('-n, --name <name>', 'Checklist name')
    .option('--pos <position>', 'Position: top or bottom')
    .option('--copy-from <checklistId>', 'Copy from an existing checklist')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Creating checklist...').start();
      const result = await createChecklist({
        idCard: options.card,
        name: options.name,
        pos: options.pos,
        idChecklistSource: options.copyFrom,
      });

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to create checklist');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Checklist created');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const checklist = result.data;
      console.log();
      console.log(chalk.bold(checklist.name));
      console.log(chalk.cyan('ID:'), checklist.id);
      console.log();
    });

  // Subcommand: checklists update <id>
  checklists
    .command('update <id>')
    .description('Update a checklist')
    .option('-n, --name <name>', 'New checklist name')
    .option('--pos <position>', 'Position: top or bottom')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const updateOptions: Record<string, unknown> = {};
      if (options.name !== undefined) updateOptions.name = options.name;
      if (options.pos !== undefined) updateOptions.pos = options.pos;

      if (Object.keys(updateOptions).length === 0) {
        console.log(chalk.yellow('No update options provided. Use --help to see available options.'));
        return;
      }

      const spinner = options.json ? null : ora('Updating checklist...').start();
      const result = await updateChecklist(id, updateOptions);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to update checklist');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Checklist updated');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const checklist = result.data;
      console.log();
      console.log(chalk.bold(checklist.name));
      console.log(chalk.cyan('ID:'), checklist.id);
      console.log();
    });

  // Subcommand: checklists delete <id>
  checklists
    .command('delete <id>')
    .description('Permanently delete a checklist')
    .option('--yes', 'Skip confirmation')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      if (!options.yes && !options.json) {
        const checklistResult = await getChecklist(id);
        const checklistName = checklistResult.success && checklistResult.data ? checklistResult.data.name : id;
        console.log(chalk.yellow(`⚠ This will permanently delete checklist "${checklistName}".`));
        console.log(chalk.yellow('  This action cannot be undone.'));
        console.log();
        console.log('Run with --yes to confirm deletion.');
        return;
      }

      const spinner = options.json ? null : ora('Deleting checklist...').start();
      const result = await deleteChecklist(id);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to delete checklist');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Checklist deleted');
      }
    });

  // Subcommand: checklists items <id>
  checklists
    .command('items <id>')
    .description('List check items in a checklist')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching check items...').start();
      const result = await getCheckItems(id);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch check items');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const items = result.data;
      if (items.length === 0) {
        console.log(chalk.yellow('No check items found'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Check Items (${items.length})`));
      console.log(chalk.gray('─'.repeat(40)));

      for (const item of items) {
        const state = item.state === 'complete'
          ? chalk.green('complete')
          : chalk.yellow('incomplete');
        console.log();
        console.log(chalk.bold(item.name), state);
        console.log(chalk.cyan('ID:'), item.id);
        if (item.due) {
          console.log(chalk.cyan('Due:'), item.due);
        }
      }
      console.log();
    });

  // Subcommand: checklists add-item <id>
  checklists
    .command('add-item <id>')
    .description('Add a check item to a checklist')
    .requiredOption('-n, --name <name>', 'Check item name')
    .option('--pos <position>', 'Position: top or bottom')
    .option('--checked', 'Start as checked')
    .option('--due <date>', 'Due date')
    .option('--member <memberId>', 'Assign to member')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Adding check item...').start();
      const result = await createCheckItem(id, {
        name: options.name,
        pos: options.pos,
        checked: options.checked ? true : undefined,
        due: options.due,
        idMember: options.member,
      });

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to add check item');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Check item added');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const item = result.data;
      const state = item.state === 'complete'
        ? chalk.green('complete')
        : chalk.yellow('incomplete');
      console.log();
      console.log(chalk.bold(item.name), state);
      console.log(chalk.cyan('ID:'), item.id);
      console.log();
    });

  // Subcommand: checklists remove-item <checklistId> <checkItemId>
  checklists
    .command('remove-item <checklistId> <checkItemId>')
    .description('Remove a check item from a checklist')
    .option('--yes', 'Skip confirmation')
    .option('--json', 'Output as JSON')
    .action(async (checklistId, checkItemId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      if (!options.yes && !options.json) {
        console.log(chalk.yellow(`⚠ This will permanently delete check item "${checkItemId}".`));
        console.log(chalk.yellow('  This action cannot be undone.'));
        console.log();
        console.log('Run with --yes to confirm deletion.');
        return;
      }

      const spinner = options.json ? null : ora('Removing check item...').start();
      const result = await deleteCheckItem(checklistId, checkItemId);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to remove check item');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Check item removed');
      }
    });

  // Subcommand: checklists update-item <cardId> <checkItemId>
  checklists
    .command('update-item <cardId> <checkItemId>')
    .description('Update a check item')
    .option('-n, --name <name>', 'New check item name')
    .option('--complete', 'Set state to complete')
    .option('--incomplete', 'Set state to incomplete')
    .option('--due <date>', 'Set due date')
    .option('--member <memberId>', 'Assign to member')
    .option('--json', 'Output as JSON')
    .action(async (cardId, checkItemId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const updateOptions: Record<string, unknown> = {};
      if (options.name !== undefined) updateOptions.name = options.name;
      if (options.complete) updateOptions.state = 'complete';
      if (options.incomplete) updateOptions.state = 'incomplete';
      if (options.due !== undefined) updateOptions.due = options.due;
      if (options.member !== undefined) updateOptions.idMember = options.member;

      if (Object.keys(updateOptions).length === 0) {
        console.log(chalk.yellow('No update options provided. Use --help to see available options.'));
        return;
      }

      const spinner = options.json ? null : ora('Updating check item...').start();
      const result = await updateCheckItem(cardId, checkItemId, updateOptions);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to update check item');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Check item updated');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const item = result.data;
      const state = item.state === 'complete'
        ? chalk.green('complete')
        : chalk.yellow('incomplete');
      console.log();
      console.log(chalk.bold(item.name), state);
      console.log(chalk.cyan('ID:'), item.id);
      console.log();
    });
}
