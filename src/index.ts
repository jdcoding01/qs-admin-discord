import { Client as DiscordClient, GatewayIntentBits, Collection, CommandInteraction, Interaction } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Extend the Client class to include the 'commands' property
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>;
  }
}

// Load environment variables
dotenv.config();

// Initialize Discord client
const client = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Define a collection for commands
client.commands = new Collection();

// Database setup using Sequelize with SQLite
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database', 'db.sqlite')
});

// Load events
const loadEvents = (client: DiscordClient) => {
  const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.ts'));
  eventFiles.forEach(file => {
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, (...args) => event.execute(client, ...args));
  });
};

// Load commands
const loadCommands = () => {
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.ts'));

  commandFiles.forEach(file => {
    const command = require(`./commands/${file}`).default;
    client.commands.set(command.data.name, command);
  });
};

// Register slash commands with Discord
const registerSlashCommands = async () => {
  const commands = client.commands.map(command => command.data.toJSON());
  try {
    await client.application?.commands.set(commands);
    console.log('Slash commands registered successfully.');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
};

// Event listener for when the bot is ready
client.once('ready', () => {
  console.log(`${client.user?.tag} is online!`);
  registerSlashCommands(); // Register slash commands once the bot is ready
});

// Event listener for interactions (slash commands)
client.on('interactionCreate', async (interaction: Interaction) => {
  // Check if the interaction is a slash command
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      return interaction.reply({
        content: 'Command not found!',
        ephemeral: true,
      });
    }

    try {
      await (command.execute(interaction as CommandInteraction, sequelize));
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: 'There was an error while executing this command.',
        ephemeral: true,
      });
    }
  }
});

// Initialize the bot
const initializeBot = async () => {
  await sequelize.authenticate()
    .then(() => {
      // sequelize.sync({ alter: true });
      console.log('[DATABASE]: connected successfully');
    })
    .catch(err => console.error('[DATABASE]: connection failed:', err));

  loadEvents(client);
  loadCommands();

  client.login(process.env.TOKEN);
};

initializeBot();
