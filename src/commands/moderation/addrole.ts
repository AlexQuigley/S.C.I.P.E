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

    const targetUser = await interaction.guild?.members.fetch(targetUserId);
    const role = await interaction.options.getRole("role") as Role;
    const member = interaction.options.getMember("target-user") as GuildMember;

    //Checks if user exsists in server
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    // Chaneg the targetUser's roles
    try {
      await member.roles.add(role);
      await interaction.editReply(`Added ${role} role to ${targetUser}`);
    } catch (error) {
      console.log(
        `There was an error when adding the ${role} role to ${targetUser}: ${error}`
      );
      await interaction.editReply(
        `There was an error when adding the ${role} role to ${targetUser}: ${error}`
      );
    }
  },

  name: "addrole",
  description: "Adds a role to a user.",
  options: [
    {
      name: "target-user",
      description: "The user you want to add a role to.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "role",
      description: "Role you want to give to user",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};
