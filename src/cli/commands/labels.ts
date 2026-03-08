import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getLabel, createLabel, updateLabel, deleteLabel } from '../../api/labels.ts';
import { isLoggedIn } from '../../store/config.ts';

const VALID_COLORS = ['yellow', 'purple', 'blue', 'red', 'green', 'orange', 'black', 'sky', 'pink', 'lime'];

export function registerLabelCommands(program: Command): void {
  const labels = program
    .command('labels')
    .description('Manage Trello labels');

  // Subcommand: labels get <id>
  labels
    .command('get <id>')
    .description('Get details of a specific label')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching label...').start();
      const result = await getLabel(id);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch label');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const label = result.data;
      console.log();
      console.log(chalk.bold('Label Details'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.cyan('Name:'), label.name);
      console.log(chalk.cyan('Color:'), label.color);
      console.log(chalk.cyan('ID:'), label.id);
      console.log();
    });

  // Subcommand: labels create
  labels
    .command('create')
    .description('Create a new label')
    .requiredOption('-n, --name <name>', 'Label name')
    .requiredOption('-c, --color <color>', `Label color: ${VALID_COLORS.join(', ')}`)
    .requiredOption('-b, --board <boardId>', 'Board ID to create the label on')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      if (!VALID_COLORS.includes(options.color)) {
        console.log(chalk.red('Invalid color:'), options.color);
        console.log(chalk.yellow('Valid colors:'), VALID_COLORS.join(', '));
        return;
      }

      const spinner = options.json ? null : ora('Creating label...').start();
      const result = await createLabel({
        name: options.name,
        color: options.color,
        idBoard: options.board,
      });

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to create label');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Label created');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const label = result.data;
      console.log();
      console.log(chalk.bold(label.name));
      console.log(chalk.cyan('Color:'), label.color);
      console.log(chalk.cyan('ID:'), label.id);
      console.log();
    });

  // Subcommand: labels update <id>
  labels
    .command('update <id>')
    .description('Update an existing label')
    .option('-n, --name <name>', 'New label name')
    .option('-c, --color <color>', `New label color: ${VALID_COLORS.join(', ')}`)
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const updateOptions: Record<string, string> = {};
      if (options.name !== undefined) updateOptions.name = options.name;
      if (options.color !== undefined) updateOptions.color = options.color;

      if (Object.keys(updateOptions).length === 0) {
        console.log(chalk.yellow('No update options provided. Use --help to see available options.'));
        return;
      }

      if (options.color !== undefined && !VALID_COLORS.includes(options.color)) {
        console.log(chalk.red('Invalid color:'), options.color);
        console.log(chalk.yellow('Valid colors:'), VALID_COLORS.join(', '));
        return;
      }

      const spinner = options.json ? null : ora('Updating label...').start();
      const result = await updateLabel(id, updateOptions);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to update label');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Label updated');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const label = result.data;
      console.log();
      console.log(chalk.bold(label.name));
      console.log(chalk.cyan('Color:'), label.color);
      console.log(chalk.cyan('ID:'), label.id);
      console.log();
    });

  // Subcommand: labels delete <id>
  labels
    .command('delete <id>')
    .description('Permanently delete a label')
    .option('--yes', 'Skip confirmation')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      if (!options.yes && !options.json) {
        const labelResult = await getLabel(id);
        const labelName = labelResult.success && labelResult.data ? labelResult.data.name : id;
        console.log(chalk.yellow(`⚠ This will permanently delete label "${labelName}".`));
        console.log(chalk.yellow('  This action cannot be undone.'));
        console.log();
        console.log('Run with --yes to confirm deletion.');
        return;
      }

      const spinner = options.json ? null : ora('Deleting label...').start();
      const result = await deleteLabel(id);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to delete label');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Label deleted');
      }
    });
}
