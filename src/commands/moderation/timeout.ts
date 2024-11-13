import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  GuildMember,
} from "discord.js";

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const targetUserId = interaction.options.get("target-user")!.value as string;
    const timeoutDuration = interaction.options.get("duration")!.value as number; // Duration in minutes
    const reason = interaction.options.get("reason")?.value as string || "No reason provided";

    await interaction.deferReply();

    if (!interaction.guild) {
      await interaction.editReply("This command can only be used in a server.");
      return;
    }

    const targetUser = await interaction.guild?.members.fetch(targetUserId);

    // Check if the user exists in the server
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    // Check if the user is the server owner
    if (targetUser.id === interaction.guild!.ownerId) {
      await interaction.editReply("You can't timeout the server owner.");
      return;
    }

    // Role hierarchy checks
    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = (interaction.member as GuildMember).roles.highest.position; // Highest role of the user running the command
    const botRolePosition = interaction.guild.members.me!.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't timeout that user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I can't timeout that user because they have the same/higher role than me."
      );
      return;
    }

    // Convert timeout duration from minutes to milliseconds
    const timeoutDurationMs = timeoutDuration * 60 * 1000;

    // Timeout the target user
    try {
      await targetUser.timeout(timeoutDurationMs, reason);
      await interaction.editReply(
        `User ${targetUser} has been timed out for ${timeoutDuration} minutes.\nReason: ${reason}`
      );
    } catch (error) {
      console.log(`There was an error when timing out the user: ${error}`);
      await interaction.editReply(
        `There was an error when timing out the user: ${error}`
      );
    }
  },

  name: "timeout",
  description: "Timeout a member for a specified number of minutes.",
  options: [
    {
      name: "target-user",
      description: "The user you want to timeout.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "The duration of the timeout in minutes.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      min_value: 1, // Minimum timeout duration is 1 minute
    },
    {
      name: "reason",
      description: "The reason for the timeout.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],
};
