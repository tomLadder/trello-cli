import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { login, logout, getMe } from '../../api/auth.ts';
import { isLoggedIn, getAuth } from '../../store/config.ts';

const TRELLO_POWERUPS_URL = 'https://trello.com/power-ups/admin/';
const TRELLO_API_DOCS_URL = 'https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/';

export function registerAuthCommands(program: Command): void {
  program
    .command('login')
    .description('Login to Trello with API key and token')
    .option('-k, --api-key <key>', 'Trello API key')
    .option('-t, --token <token>', 'Trello API token')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const jsonOutput = options.json;

      // Check if already logged in
      if (await isLoggedIn()) {
        const me = await getMe();
        if (me.success && me.data) {
          if (jsonOutput) {
            console.log(
              JSON.stringify({
                success: false,
                error: 'Already logged in',
                user: me.data.fullName,
              })
            );
            return;
          }
          console.log(chalk.yellow('Already logged in as:'), me.data.fullName);
          const { confirmLogout } = await prompts({
            type: 'confirm',
            name: 'confirmLogout',
            message: 'Do you want to logout and login again?',
            initial: false,
          });
          if (!confirmLogout) {
            return;
          }
          await logout();
        }
      }

      // Get API key
      let apiKey = options.apiKey;
      if (!apiKey) {
        if (jsonOutput) {
          console.log(
            JSON.stringify({ success: false, error: 'API key required (--api-key)' })
          );
          return;
        }
        console.log();
        console.log(chalk.bold('To get your API credentials:'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log('1. Go to:', chalk.cyan(TRELLO_POWERUPS_URL));
        console.log('2. Create a new Power-Up (or select existing)');
        console.log('3. Go to API Key → Generate a new API Key');
        console.log();
        console.log(chalk.gray('Documentation:'), TRELLO_API_DOCS_URL);
        console.log();
        const response = await prompts({
          type: 'text',
          name: 'apiKey',
          message: 'Enter your Trello API key:',
          validate: (value) => {
            if (!value || value.length < 10) {
              return 'Please enter a valid API key';
            }
            return true;
          },
        });
        apiKey = response.apiKey;
        if (!apiKey) {
          console.log(chalk.red('Login cancelled'));
          return;
        }
      }

      // Get token
      let token = options.token;
      if (!token) {
        if (jsonOutput) {
          console.log(
            JSON.stringify({ success: false, error: 'Token required (--token)' })
          );
          return;
        }
        const tokenUrl = `https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=trello-cli&key=${apiKey}`;
        console.log();
        console.log(chalk.bold('Generate your API token:'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log('Open this URL and click "Allow":');
        console.log(chalk.cyan(tokenUrl));
        console.log();
        const response = await prompts({
          type: 'text',
          name: 'token',
          message: 'Enter your Trello token:',
          validate: (value) => {
            if (!value || value.length < 10) {
              return 'Please enter a valid token';
            }
            return true;
          },
        });
        token = response.token;
        if (!token) {
          console.log(chalk.red('Login cancelled'));
          return;
        }
      }

      // Login
      const spinner = jsonOutput ? null : ora('Logging in...').start();
      const result = await login(apiKey, token);

      if (!result.success) {
        if (jsonOutput) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Login failed');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (jsonOutput) {
        console.log(JSON.stringify({ success: true, user: result.data }));
      } else {
        spinner?.succeed('Login successful');
        console.log(chalk.green('Welcome,'), result.data?.fullName || 'User');
      }
    });

  program
    .command('logout')
    .description('Logout from Trello')
    .action(async () => {
      if (!(await isLoggedIn())) {
        console.log(chalk.yellow('Not logged in'));
        return;
      }

      await logout();
      console.log(chalk.green('Logged out successfully'));
    });

  program
    .command('whoami')
    .description('Show current user information')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = ora('Fetching user info...').start();
      const result = await getMe();

      if (!result.success || !result.data) {
        spinner.fail('Failed to fetch user info');
        console.log(chalk.red('Error:'), result.error);
        return;
      }

      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const user = result.data;
      console.log();
      console.log(chalk.bold('User Information'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.cyan('Username:'), user.username);
      console.log(chalk.cyan('Full Name:'), user.fullName);
      if (user.email) {
        console.log(chalk.cyan('Email:'), user.email);
      }
      console.log(chalk.cyan('ID:'), user.id);
    });

  program
    .command('status')
    .description('Check login status')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const auth = await getAuth();
      const loggedIn = await isLoggedIn();

      if (options.json) {
        if (!loggedIn) {
          console.log(JSON.stringify({ loggedIn: false }));
          return;
        }
        const me = await getMe();
        console.log(
          JSON.stringify({
            loggedIn: true,
            user: me.data,
          })
        );
        return;
      }

      if (!loggedIn) {
        console.log(chalk.yellow('Not logged in'));
        return;
      }

      const me = await getMe();
      if (me.success && me.data) {
        console.log(chalk.green('Logged in as:'), me.data.fullName);
        console.log(chalk.cyan('Username:'), me.data.username);
      } else {
        console.log(chalk.yellow('Logged in but unable to fetch user info'));
      }
    });
}
