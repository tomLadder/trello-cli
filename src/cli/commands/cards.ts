import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import {
  getCard, createCard, updateCard, deleteCard,
  getCardComments, addCardComment, updateCardComment, deleteCardComment,
  getCardAttachments, addCardAttachment, deleteCardAttachment,
  getCardMembers, addCardMember, removeCardMember,
  addCardLabel, removeCardLabel,
} from '../../api/cards.ts';
import { isLoggedIn } from '../../store/config.ts';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function registerCardCommands(program: Command): void {
  const cards = program
    .command('cards')
    .description('Manage Trello cards');

  // Subcommand: cards get <id>
  cards
    .command('get <id>')
    .description('Get details of a specific card')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching card...').start();
      const result = await getCard(id);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch card');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const card = result.data;
      console.log();
      console.log(chalk.bold('Card Details'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.cyan('Name:'), card.name);
      console.log(chalk.cyan('ID:'), card.id);
      console.log(chalk.cyan('Status:'), card.closed ? 'Archived' : 'Open');
      if (card.isTemplate) {
        console.log(chalk.cyan('Template:'), chalk.magenta('Yes'));
      }
      if (card.desc) {
        console.log(chalk.cyan('Description:'), card.desc);
      }
      console.log(chalk.cyan('List ID:'), card.idList);
      console.log(chalk.cyan('Board ID:'), card.idBoard);
      if (card.due) {
        console.log(chalk.cyan('Due Date:'), card.due);
      }
      console.log(chalk.cyan('URL:'), card.url);
      if (card.labels && card.labels.length > 0) {
        const labelStr = card.labels.map((l) => `${l.name || l.color} (${l.id})`).join(', ');
        console.log(chalk.cyan('Labels:'), labelStr);
      }
      console.log();
    });

  // Subcommand: cards create
  cards
    .command('create')
    .description('Create a new card')
    .requiredOption('-n, --name <name>', 'Card name')
    .requiredOption('-l, --list <listId>', 'List ID to add the card to')
    .option('-d, --desc <description>', 'Card description')
    .option('--due <date>', 'Due date')
    .option('--labels <labelIds>', 'Comma-separated label IDs')
    .option('--members <memberIds>', 'Comma-separated member IDs')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Creating card...').start();
      const result = await createCard({
        name: options.name,
        idList: options.list,
        desc: options.desc,
        due: options.due,
        idLabels: options.labels,
        idMembers: options.members,
      });

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to create card');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Card created');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const card = result.data;
      console.log();
      console.log(chalk.bold(card.name));
      console.log(chalk.cyan('ID:'), card.id);
      console.log(chalk.cyan('URL:'), card.url);
      console.log();
    });

  // Subcommand: cards update <id>
  cards
    .command('update <id>')
    .description('Update an existing card')
    .option('-n, --name <name>', 'New card name')
    .option('-d, --desc <description>', 'New card description')
    .option('--close', 'Archive the card')
    .option('--reopen', 'Unarchive the card')
    .option('-l, --list <listId>', 'Move card to a different list')
    .option('--due <date>', 'Set due date')
    .option('--done', 'Mark due date as complete')
    .option('--make-template', 'Convert card to a template')
    .option('--remove-template', 'Convert template back to a regular card')
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
      if (options.list !== undefined) updateOptions.idList = options.list;
      if (options.due !== undefined) updateOptions.due = options.due;
      if (options.done) updateOptions.dueComplete = true;
      if (options.makeTemplate) updateOptions.isTemplate = true;
      if (options.removeTemplate) updateOptions.isTemplate = false;

      if (Object.keys(updateOptions).length === 0) {
        console.log(chalk.yellow('No update options provided. Use --help to see available options.'));
        return;
      }

      const spinner = options.json ? null : ora('Updating card...').start();
      const result = await updateCard(id, updateOptions);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to update card');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Card updated');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const card = result.data;
      console.log();
      console.log(chalk.bold(card.name));
      console.log(chalk.cyan('ID:'), card.id);
      console.log(chalk.cyan('Status:'), card.closed ? 'Archived' : 'Open');
      console.log(chalk.cyan('URL:'), card.url);
      console.log();
    });

  // Subcommand: cards delete <id>
  cards
    .command('delete <id>')
    .description('Permanently delete a card')
    .option('--yes', 'Skip confirmation')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      if (!options.yes && !options.json) {
        const cardResult = await getCard(id);
        const cardName = cardResult.success && cardResult.data ? cardResult.data.name : id;
        console.log(chalk.yellow(`⚠ This will permanently delete card "${cardName}".`));
        console.log(chalk.yellow('  This action cannot be undone.'));
        console.log();
        console.log('Run with --yes to confirm deletion.');
        return;
      }

      const spinner = options.json ? null : ora('Deleting card...').start();
      const result = await deleteCard(id);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to delete card');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Card deleted');
      }
    });

  // Subcommand: cards comments <cardId>
  cards
    .command('comments <cardId>')
    .description('List comments on a card')
    .option('--json', 'Output as JSON')
    .action(async (cardId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching comments...').start();
      const result = await getCardComments(cardId);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch comments');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const comments = result.data;
      if (comments.length === 0) {
        console.log(chalk.yellow('No comments found on this card.'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Comments (${comments.length})`));
      console.log(chalk.gray('─'.repeat(40)));
      for (const comment of comments) {
        console.log(chalk.bold(comment.memberCreator.fullName), chalk.gray(comment.date));
        console.log(comment.data.text);
        console.log(chalk.gray(`ID: ${comment.id}`));
        console.log();
      }
    });

  // Subcommand: cards add-comment <cardId>
  cards
    .command('add-comment <cardId>')
    .description('Add a comment to a card')
    .requiredOption('-t, --text <text>', 'Comment text')
    .option('--json', 'Output as JSON')
    .action(async (cardId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Adding comment...').start();
      const result = await addCardComment(cardId, options.text);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to add comment');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Comment added');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const comment = result.data;
      console.log();
      console.log(chalk.cyan('Text:'), comment.data.text);
      console.log(chalk.cyan('Author:'), comment.memberCreator.fullName);
      console.log(chalk.cyan('ID:'), comment.id);
      console.log();
    });

  // Subcommand: cards update-comment <cardId> <commentId>
  cards
    .command('update-comment <cardId> <commentId>')
    .description('Update a comment on a card')
    .requiredOption('-t, --text <text>', 'New comment text')
    .option('--json', 'Output as JSON')
    .action(async (cardId, commentId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Updating comment...').start();
      const result = await updateCardComment(cardId, commentId, options.text);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to update comment');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Comment updated');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const comment = result.data;
      console.log();
      console.log(chalk.cyan('Text:'), comment.data.text);
      console.log(chalk.cyan('Author:'), comment.memberCreator.fullName);
      console.log(chalk.cyan('ID:'), comment.id);
      console.log();
    });

  // Subcommand: cards delete-comment <cardId> <commentId>
  cards
    .command('delete-comment <cardId> <commentId>')
    .description('Delete a comment from a card')
    .option('--yes', 'Skip confirmation')
    .option('--json', 'Output as JSON')
    .action(async (cardId, commentId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      if (!options.yes && !options.json) {
        console.log(chalk.yellow(`⚠ This will permanently delete comment "${commentId}".`));
        console.log(chalk.yellow('  This action cannot be undone.'));
        console.log();
        console.log('Run with --yes to confirm deletion.');
        return;
      }

      const spinner = options.json ? null : ora('Deleting comment...').start();
      const result = await deleteCardComment(cardId, commentId);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to delete comment');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Comment deleted');
      }
    });

  // Subcommand: cards attachments <cardId>
  cards
    .command('attachments <cardId>')
    .description('List attachments on a card')
    .option('--json', 'Output as JSON')
    .action(async (cardId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching attachments...').start();
      const result = await getCardAttachments(cardId);

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to fetch attachments');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const attachments = result.data;
      if (attachments.length === 0) {
        console.log(chalk.yellow('No attachments found on this card.'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Attachments (${attachments.length})`));
      console.log(chalk.gray('─'.repeat(40)));
      for (const attachment of attachments) {
        console.log(chalk.bold(attachment.name));
        console.log(chalk.cyan('URL:'), attachment.url);
        console.log(chalk.cyan('Size:'), formatBytes(attachment.bytes));
        console.log(chalk.cyan('Date:'), chalk.gray(attachment.date));
        console.log(chalk.gray(`ID: ${attachment.id}`));
        console.log();
      }
    });

  // Subcommand: cards add-attachment <cardId>
  cards
    .command('add-attachment <cardId>')
    .description('Add an attachment to a card')
    .requiredOption('--url <url>', 'Attachment URL')
    .option('-n, --name <name>', 'Attachment name')
    .option('--set-cover', 'Set as card cover')
    .option('--json', 'Output as JSON')
    .action(async (cardId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Adding attachment...').start();
      const result = await addCardAttachment(cardId, {
        url: options.url,
        name: options.name,
        setCover: options.setCover,
      });

      if (!result.success || !result.data) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to add attachment');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      spinner?.succeed('Attachment added');

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const attachment = result.data;
      console.log();
      console.log(chalk.cyan('Name:'), attachment.name);
      console.log(chalk.cyan('URL:'), attachment.url);
      console.log(chalk.cyan('ID:'), attachment.id);
      console.log();
    });

  // Subcommand: cards delete-attachment <cardId> <attachmentId>
  cards
    .command('delete-attachment <cardId> <attachmentId>')
    .description('Delete an attachment from a card')
    .option('--yes', 'Skip confirmation')
    .option('--json', 'Output as JSON')
    .action(async (cardId, attachmentId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      if (!options.yes && !options.json) {
        console.log(chalk.yellow(`⚠ This will permanently delete attachment "${attachmentId}".`));
        console.log(chalk.yellow('  This action cannot be undone.'));
        console.log();
        console.log('Run with --yes to confirm deletion.');
        return;
      }

      const spinner = options.json ? null : ora('Deleting attachment...').start();
      const result = await deleteCardAttachment(cardId, attachmentId);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to delete attachment');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Attachment deleted');
      }
    });

  // Subcommand: cards members <cardId>
  cards
    .command('members <cardId>')
    .description('List members assigned to a card')
    .option('--json', 'Output as JSON')
    .action(async (cardId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Fetching members...').start();
      const result = await getCardMembers(cardId);

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
        console.log(chalk.yellow('No members assigned to this card.'));
        return;
      }

      console.log();
      console.log(chalk.bold(`Members (${members.length})`));
      console.log(chalk.gray('─'.repeat(40)));
      for (const member of members) {
        console.log(chalk.bold(member.fullName), chalk.gray(`@${member.username}`));
        console.log(chalk.gray(`ID: ${member.id}`));
        console.log();
      }
    });

  // Subcommand: cards add-member <cardId> <memberId>
  cards
    .command('add-member <cardId> <memberId>')
    .description('Add a member to a card')
    .option('--json', 'Output as JSON')
    .action(async (cardId, memberId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Adding member...').start();
      const result = await addCardMember(cardId, memberId);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to add member');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Member added');
      }
    });

  // Subcommand: cards remove-member <cardId> <memberId>
  cards
    .command('remove-member <cardId> <memberId>')
    .description('Remove a member from a card')
    .option('--json', 'Output as JSON')
    .action(async (cardId, memberId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Removing member...').start();
      const result = await removeCardMember(cardId, memberId);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to remove member');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Member removed');
      }
    });

  // Subcommand: cards add-label <cardId> <labelId>
  cards
    .command('add-label <cardId> <labelId>')
    .description('Add a label to a card')
    .option('--json', 'Output as JSON')
    .action(async (cardId, labelId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Adding label...').start();
      const result = await addCardLabel(cardId, labelId);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to add label');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Label added');
      }
    });

  // Subcommand: cards remove-label <cardId> <labelId>
  cards
    .command('remove-label <cardId> <labelId>')
    .description('Remove a label from a card')
    .option('--json', 'Output as JSON')
    .action(async (cardId, labelId, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'trello login');
        return;
      }

      const spinner = options.json ? null : ora('Removing label...').start();
      const result = await removeCardLabel(cardId, labelId);

      if (!result.success) {
        if (options.json) {
          console.log(JSON.stringify({ success: false, error: result.error }));
        } else {
          spinner?.fail('Failed to remove label');
          console.log(chalk.red('Error:'), result.error);
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true }));
      } else {
        spinner?.succeed('Label removed');
      }
    });
}
