import { Client, ChatInputCommandInteraction } from 'discord.js';

module.exports = {
  name: 'ping',
  description: 'Replies with the bot ping!',

  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply(
      `Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`
    );
  },
};
