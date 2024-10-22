import { Client, ChatInputCommandInteraction } from "discord.js";

export default {
  name: 'ping',
  description: 'Replies with the bot ping!',
  options: [], // Ensure options are defined, even if empty

  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply(
      `Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`
    );
  },
};