import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Role,
  GuildMember,
  User,
  GuildTextBasedChannel,
} from 'discord.js';
import Permissions from '../database/models/Permissions';
import GuildConfig from '../database/models/GuildConfig';

export default {
  data: new SlashCommandBuilder()
    .setName('setpermission')
    .setDescription('Grant a permission (kick or ban) to a user or role')
    .addMentionableOption(option =>
      option
        .setName('id')
        .setDescription('The user or role to grant permission to (mention or paste ID)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('action')
        .setDescription('The permission action to grant')
        .setRequired(true)
        .addChoices(
          { name: 'Kick', value: 'kick' },
          { name: 'Ban', value: 'ban' }
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (!interaction.guild) {
        return interaction.reply({
          content: 'This command can only be used in a guild.',
          ephemeral: true
        });
      }

      const mentionable = interaction.options.getMentionable('id', true);

      let targetId: string;
      let targetMention: string;

      if (mentionable instanceof Role) {
        targetId = mentionable.id;
        targetMention = mentionable.toString();
      } else if (mentionable instanceof GuildMember) {

        targetId = mentionable.user.id;
        targetMention = mentionable.user.toString();
      } else if (mentionable instanceof User) {

        targetId = mentionable.id;
        targetMention = mentionable.toString();
      } else {

        return interaction.reply({
          content: 'Could not resolve a valid user or role from the mention.',
          ephemeral: true
        });
      }


      const action = interaction.options.getString('action', true);

      const data = {
        action: action,
        id: targetId,
      }

      await Permissions.upsert(data);


      const embed = new EmbedBuilder()
        .setTitle('Permission Granted')
        .setDescription(
          `Permission \`${action}\` has been granted to ${targetMention} by ${interaction.user.toString()}.`
        )
        .setColor(0x00FF00)
        .setTimestamp();

      const guildConfig = await GuildConfig.findOne({ where: { guild_id: interaction.guild.id } });
      if (guildConfig && guildConfig.get('log_channel_id')) {
        const logChannelId = guildConfig.get('log_channel_id') as string;
        const logChannel = interaction.guild.channels.cache.get(logChannelId);

        if (logChannel && logChannel.isTextBased()) {
          (logChannel as GuildTextBasedChannel).send({ embeds: [embed] });
        }
      }

      await interaction.reply({
        content: `Permission \`${action}\` granted to ${targetMention}.`,
        ephemeral: true
      });

    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error executing this command.',
        ephemeral: true
      });
    }
  }
};
