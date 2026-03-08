import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import {
  getCustomField, createCustomField, updateCustomField, deleteCustomField,
  getCustomFieldOptions, addCustomFieldOption, deleteCustomFieldOption,
  getCardCustomFieldItems, setCardCustomFieldValue,
  type CreateCustomFieldOptions, type UpdateCustomFieldOptions,
} from '../../api/customFields.ts';
import { isLoggedIn } from '../../store/config.ts';

export function registerCustomFieldCommands(program: Command): void {
  const customFields = program
    .command('custom-fields')
    .description('Manage Trello custom fields');

  // Subcommand: custom-fields get <id>
  customFields
    .command('get <id>')
    .description('Get a custom field definition')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching custom field...').start();
      const result = await getCustomField(id);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch custom field');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const field = result.data;
      console.log();
      console.log(chalk.bold('Custom Field Details'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.cyan('Name:'), field.name);
      console.log(chalk.cyan('Type:'), field.type);
      console.log(chalk.cyan('ID:'), field.id);
      console.log(chalk.cyan('Board ID:'), field.idModel);
      console.log(chalk.cyan('Display on Card Front:'), field.display?.cardFront ? 'Yes' : 'No');

      if (field.type === 'list' && field.options && field.options.length > 0) {
        console.log();
        console.log(chalk.bold(`Options (${field.options.length})`));
        for (const opt of field.options) {
          console.log(chalk.gray('  -'), opt.value?.text || '(unnamed)', opt.color ? chalk.gray(`[${opt.color}]`) : '', chalk.gray(`(${opt.id})`));
        }
      }
      console.log();
    });

  // Subcommand: custom-fields create
  customFields
    .command('create')
    .description('Create a custom field definition')
    .requiredOption('-b, --board <boardId>', 'Board ID')
    .requiredOption('-n, --name <name>', 'Field name')
    .requiredOption('-t, --type <type>', 'Field type: checkbox, list, number, text, date')
    .option('--pos <position>', 'Position')
    .option('--no-card-front', 'Do not display on card front')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const validTypes = ['checkbox', 'list', 'number', 'text', 'date'];
      if (!validTypes.includes(options.type)) {
        console.log(chalk.red('Invalid type. Must be one of:'), validTypes.join(', '));
        return;
      }

      const spinner = options.json ? null : ora('Creating custom field...').start();
      const result = await createCustomField({
        idModel: options.board,
        name: options.name,
        type: options.type,
        pos: options.pos,
        display_cardFront: options.cardFront,
      } as CreateCustomFieldOptions);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to create custom field');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Custom field created');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const field = result.data;
      console.log();
      console.log(chalk.bold(field.name));
      console.log(chalk.cyan('Type:'), field.type);
      console.log(chalk.cyan('ID:'), field.id);
      console.log(chalk.cyan('Board ID:'), field.idModel);
      console.log();
    });

  // Subcommand: custom-fields update <id>
  customFields
    .command('update <id>')
    .description('Update a custom field')
    .option('-n, --name <name>', 'New field name')
    .option('--pos <position>', 'New position')
    .option('--show-on-card', 'Display on card front')
    .option('--hide-from-card', 'Hide from card front')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const updateOptions: Record<string, unknown> = {};
      if (options.name !== undefined) updateOptions.name = options.name;
      if (options.pos !== undefined) updateOptions.pos = options.pos;
      if (options.showOnCard) updateOptions['display/cardFront'] = true;
      if (options.hideFromCard) updateOptions['display/cardFront'] = false;

      if (Object.keys(updateOptions).length === 0) {
        console.log(chalk.yellow('No update options provided. Use --help to see available options.'));
        return;
      }

      const spinner = options.json ? null : ora('Updating custom field...').start();
      const result = await updateCustomField(id, updateOptions as UpdateCustomFieldOptions);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to update custom field');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Custom field updated');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const field = result.data;
      console.log();
      console.log(chalk.bold(field.name));
      console.log(chalk.cyan('Type:'), field.type);
      console.log(chalk.cyan('ID:'), field.id);
      console.log();
    });

  // Subcommand: custom-fields delete <id>
  customFields
    .command('delete <id>')
    .description('Delete a custom field')
    .option('--yes', 'Skip confirmation')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      if (!options.yes && !options.json) {
        const fieldResult = await getCustomField(id);
        const fieldName = fieldResult.success && fieldResult.data ? fieldResult.data.name : id;
        console.log(chalk.yellow(`⚠ This will permanently delete custom field "${fieldName}".`));
        console.log(chalk.yellow('  This action cannot be undone.'));
        console.log();
        console.log('Run with --yes to confirm deletion.');
        return;
      }

      const spinner = options.json ? null : ora('Deleting custom field...').start();
      const result = await deleteCustomField(id);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to delete custom field');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Custom field deleted');
      }
    });

  // Subcommand: custom-fields options <id>
  customFields
    .command('options <id>')
    .description('List dropdown options for a list-type custom field')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching custom field options...').start();
      const result = await getCustomFieldOptions(id);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch custom field options');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const fieldOptions = result.data;
      if (fieldOptions.length === 0) {
        console.log(chalk.yellow('No options found for this custom field.'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Custom Field Options (${fieldOptions.length})`));
      console.log(chalk.gray('─'.repeat(40)));

      for (const opt of fieldOptions) {
        console.log();
        console.log(chalk.bold(opt.value?.text || '(unnamed)'));
        if (opt.color) {
          console.log(chalk.cyan('Color:'), opt.color);
        }
        console.log(chalk.cyan('ID:'), opt.id);
      }
      console.log();
    });

  // Subcommand: custom-fields add-option <id>
  customFields
    .command('add-option <id>')
    .description('Add an option to a list-type custom field')
    .requiredOption('-v, --value <text>', 'Option text value')
    .option('-c, --color <color>', 'Option color')
    .option('--pos <position>', 'Position')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Adding custom field option...').start();
      const result = await addCustomFieldOption(id, options.value, options.color, options.pos);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to add custom field option');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Custom field option added');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const opt = result.data;
      console.log();
      console.log(chalk.cyan('Value:'), opt.value?.text || '(unnamed)');
      if (opt.color) {
        console.log(chalk.cyan('Color:'), opt.color);
      }
      console.log(chalk.cyan('ID:'), opt.id);
      console.log();
    });

  // Subcommand: custom-fields delete-option <fieldId> <optionId>
  customFields
    .command('delete-option <fieldId> <optionId>')
    .description('Delete an option from a list-type custom field')
    .option('--yes', 'Skip confirmation')
    .option('--json', 'Output as JSON')
    .action(async (fieldId, optionId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      if (!options.yes && !options.json) {
        console.log(chalk.yellow(`⚠ This will permanently delete option "${optionId}".`));
        console.log(chalk.yellow('  This action cannot be undone.'));
        console.log();
        console.log('Run with --yes to confirm deletion.');
        return;
      }

      const spinner = options.json ? null : ora('Deleting custom field option...').start();
      const result = await deleteCustomFieldOption(fieldId, optionId);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to delete custom field option');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Custom field option deleted');
      }
    });

  // Subcommand: custom-fields card-values <cardId>
  customFields
    .command('card-values <cardId>')
    .description('List custom field values on a card')
    .option('--json', 'Output as JSON')
    .action(async (cardId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching card custom field values...').start();
      const result = await getCardCustomFieldItems(cardId);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch card custom field values');
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
        console.log(chalk.yellow('No custom field values found on this card.'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Custom Field Values (${items.length})`));
      console.log(chalk.gray('─'.repeat(40)));

      for (const item of items) {
        console.log();
        console.log(chalk.cyan('Custom Field ID:'), item.idCustomField);

        if (item.idValue) {
          console.log(chalk.cyan('Value:'), `Option ${item.idValue}`);
        } else if (item.value) {
          if (item.value.text !== undefined) {
            console.log(chalk.cyan('Value:'), item.value.text);
          } else if (item.value.number !== undefined) {
            console.log(chalk.cyan('Value:'), item.value.number);
          } else if (item.value.checked !== undefined) {
            console.log(chalk.cyan('Value:'), item.value.checked === 'true' ? 'Yes' : 'No');
          } else if (item.value.date !== undefined) {
            console.log(chalk.cyan('Value:'), item.value.date);
          }
        }

        console.log(chalk.cyan('ID:'), item.id);
      }
      console.log();
    });

  // Subcommand: custom-fields set-value <cardId> <customFieldId>
  customFields
    .command('set-value <cardId> <customFieldId>')
    .description('Set a custom field value on a card')
    .option('--text <text>', 'Set text value')
    .option('--number <number>', 'Set number value')
    .option('--checkbox <value>', 'Set checkbox value (true or false)')
    .option('--date <date>', 'Set date value')
    .option('--option <optionId>', 'Set list/dropdown value by option ID')
    .option('--clear', 'Clear the value')
    .option('--json', 'Output as JSON')
    .action(async (cardId, customFieldId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      let value: Record<string, unknown>;

      if (options.clear) {
        value = { value: {} };
      } else if (options.option) {
        value = { idValue: options.option };
      } else if (options.text !== undefined) {
        value = { value: { text: options.text } };
      } else if (options.number !== undefined) {
        value = { value: { number: options.number } };
      } else if (options.checkbox !== undefined) {
        value = { value: { checked: options.checkbox } };
      } else if (options.date !== undefined) {
        value = { value: { date: options.date } };
      } else {
        console.log(chalk.yellow('No value option provided. Use --text, --number, --checkbox, --date, --option, or --clear.'));
        return;
      }

      const spinner = options.json ? null : ora('Setting custom field value...').start();
      const result = await setCardCustomFieldValue(cardId, customFieldId, value);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to set custom field value');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Custom field value set');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const item = result.data;
      console.log();
      console.log(chalk.cyan('Custom Field ID:'), item.idCustomField);
      console.log(chalk.cyan('ID:'), item.id);
      console.log();
    });
}
