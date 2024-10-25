import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  GuildMember,
} from 'discord.js';

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const targetUserId = interaction.options.get('target-user')?.value as string;
    const reason =
      (interaction.options.get('reason')?.value as string) || 'No reason provided';

    await interaction.deferReply();

    const targetUser = await interaction.guild?.members.fetch(targetUserId);

    //Checks if user exsists in server
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    //Checks if user is server owner
    if (targetUser.id === interaction.guild?.ownerId) {
      await interaction.editReply(
        "You can't ban that user because they're the server owner."
      );
      return;
    }

    //Checks role permission higherarchy for proper authority
    //(Not allowed to ban someone with higher role permissions than you or the bot)
    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = (interaction.member as GuildMember).roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild?.members.me?.roles.highest.position || 0; // Highest role of the bot, can we set it to 0 by default

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't ban that user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I can't ban that user because they have the same/higher role than me."
      );
      return;
    }

    // Ban the targetUser
    try {
      await targetUser.ban({ reason });
      await interaction.editReply(
        `User ${targetUser} was banned\nReason: ${reason}`
      );
    } catch (error) {
      console.log(`There was an error when banning: ${error}`);
      await interaction.editReply(`There was an error when banning: ${error}`);
    }
  },

  name: 'ban',
  description: 'Bans a member from this server.',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to ban.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason you want to ban.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};
