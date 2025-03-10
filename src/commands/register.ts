import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import GuildConfig from '../database/models/GuildConfig';

export default {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register guild in the database')
    .addChannelOption(option =>
      option
        .setName('log_channel')
        .setDescription('Select an existing channel or paste a channel ID for logging')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      // Get the log_channel option
      const logChannel = interaction.options.getChannel('log_channel');
      if (!logChannel) {
        return interaction.reply({ content: 'Log Channel value is required.', ephemeral: true });
      }
      
      // Ensure this is being run in a guild
      const guildId = interaction.guild?.id;
      const guildName = interaction.guild?.name;
      if (!guildId || !guildName) {
        return interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      }

      // Save or update in your database
      await GuildConfig.upsert({
        guild_id: guildId,
        guild_name: guildName,
        log_channel_id: logChannel.id,
      });

      // Build an embed using EmbedBuilder
      const embed = new EmbedBuilder()
        .setTitle('Guild Registered')
        .setDescription('The guild has been successfully registered in the database.')
        .setColor(0x00FF00)
        .addFields(
          { name: 'Guild ID', value: guildId, inline: true },
          { name: 'Guild Name', value: guildName, inline: true },
          { name: 'Log Channel', value: `<#${logChannel.id}>`, inline: true },
        )
        .setTimestamp();

      // Reply with the embed
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error executing the command.', ephemeral: true });
    }
  }
};
