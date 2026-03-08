import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getBoards, getBoard, type BoardFilter } from '../../api/boards.ts';
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
}
