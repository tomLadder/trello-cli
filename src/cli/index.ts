import { Command } from 'commander';
import { registerAuthCommands } from './commands/auth.ts';
import { registerBoardCommands } from './commands/boards.ts';
import { registerCardCommands } from './commands/cards.ts';
import { registerChecklistCommands } from './commands/checklists.ts';
import { registerConfigCommands } from './commands/config.ts';
import { registerCustomFieldCommands } from './commands/customFields.ts';
import { registerLabelCommands } from './commands/labels.ts';
import { registerListCommands } from './commands/lists.ts';
import { registerSearchCommands } from './commands/search.ts';

export function createCLI(): Command {
  const program = new Command();

  program
    .name('trello')
    .description('CLI for managing your Trello boards from the terminal')
    .version('0.0.2')
    .enablePositionalOptions();

  // Register all command groups
  registerAuthCommands(program);
  registerBoardCommands(program);
  registerCardCommands(program);
  registerChecklistCommands(program);
  registerConfigCommands(program);
  registerCustomFieldCommands(program);
  registerLabelCommands(program);
  registerListCommands(program);
  registerSearchCommands(program);

  return program;
}
