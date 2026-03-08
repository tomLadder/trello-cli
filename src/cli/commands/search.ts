import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { search, searchMembers } from '../../api/search.ts';
import { isLoggedIn } from '../../store/config.ts';

export function registerSearchCommands(program: Command): void {
  const searchCmd = program
    .command('search')
    .description('Search Trello')
    .argument('<query>', 'Search query')
    .option('--boards <boardIds>', 'Comma-separated board IDs to limit search')
    .option('--type <types>', 'Comma-separated model types to search: cards, boards', 'all')
    .option('--cards-limit <n>', 'Max cards to return', '10')
    .option('--boards-limit <n>', 'Max boards to return', '10')
    .option('--cards-page <n>', 'Page of card results', '0')
    .option('--partial', 'Allow partial word matching')
    .option('--json', 'Output as JSON')
    .action(async (query, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Searching...').start();
      const result = await search({
        query,
        idBoards: options.boards,
        modelTypes: options.type !== 'all' ? options.type : undefined,
        cards_limit: parseInt(options.cardsLimit, 10),
        cards_page: parseInt(options.cardsPage, 10),
        boards_limit: parseInt(options.boardsLimit, 10),
        partial: options.partial || undefined,
      });

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Search failed');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const { boards, cards } = result.data;

      if (boards.length === 0 && cards.length === 0) {
        console.log(chalk.yellow('No results found'));
        return;
      }

      if (boards.length > 0) {
        console.log();
        console.log(chalk.bold(`Boards (${boards.length})`));
        console.log(chalk.gray('─'.repeat(40)));

        for (const board of boards) {
          console.log();
          console.log(chalk.bold(board.name));
          console.log(chalk.cyan('ID:'), board.id);
          console.log(chalk.cyan('URL:'), board.shortUrl || board.url);
        }
      }

      if (cards.length > 0) {
        console.log();
        console.log(chalk.bold(`Cards (${cards.length})`));
        console.log(chalk.gray('─'.repeat(40)));

        for (const card of cards) {
          console.log();
          console.log(chalk.bold(card.name));
          console.log(chalk.cyan('ID:'), card.id);
          console.log(chalk.cyan('List ID:'), card.idList);
          console.log(chalk.cyan('Board ID:'), card.idBoard);
          if (card.due) {
            console.log(chalk.cyan('Due:'), card.due);
          }
        }
      }
      console.log();
    });

  searchCmd
    .command('members <query>')
    .description('Search for members')
    .option('--board <boardId>', 'Limit to members of a board')
    .option('--org <orgId>', 'Limit to members of an organization')
    .option('--limit <n>', 'Max results', '8')
    .option('--json', 'Output as JSON')
    .action(async (query, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Searching members...').start();
      const result = await searchMembers({
        query,
        limit: parseInt(options.limit, 10),
        idBoard: options.board,
        idOrganization: options.org,
      });

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to search members');
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
      console.log(chalk.bold(`Members (${members.length})`));
      console.log(chalk.gray('─'.repeat(40)));

      for (const member of members) {
        console.log();
        console.log(chalk.bold(member.fullName));
        console.log(chalk.cyan('Username:'), member.username);
        console.log(chalk.cyan('ID:'), member.id);
      }
      console.log();
    });
}
