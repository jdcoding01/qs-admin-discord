import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  
  async execute(message: Message, args: string[], sequelize: any) {
    try {
      message.reply('Pong!');
    } catch (error) {
      console.error(error);
      message.reply('There was an error executing the command.');
    }
  }
};
