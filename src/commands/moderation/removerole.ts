import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  GuildMember,
  Role,
} from "discord.js";

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const targetUserId = interaction.options.get("target-user")?.value as string;
    await interaction.deferReply();

    const targetUser = await interaction.guild?.members.fetch(targetUserId) as GuildMember;
    const role = await interaction.options.getRole("role") as Role;
    const member = interaction.options.getMember("target-user") as GuildMember;

    //Checks if user exsists in server
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    // Change the targetUser's roles
    try {
      await member.roles.remove(role);
      await interaction.editReply(`Removed ${role} role from ${targetUser}`);
    } catch (error) {
      console.log(
        `There was an error when removing the ${role} role from ${targetUser}: ${error}`
      );
      await interaction.editReply(
        `There was an error when removing the ${role} role from ${targetUser}: ${error}`
      );
    }
  },

  name: "removerole",
  description: "Removes a role from a user.",
  options: [
    {
      name: "target-user",
      description: "The user you want to remove a role from.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "role",
      description: "Role you want to remove from a user",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};
