//This file handles all slash commands

const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
  //Is the interaction a chat-input command
  if (!interaction.isChatInputCommand()) return;

  //Imports local commands
  const localCommands = getLocalCommands();

  //Check if command matches local commands
  try {
    //Checks if command names match
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    //Checks if commandObject exists
    if (!commandObject) return;

    //Checks if command has "Dev Only" set to true,
    //if so, checks to make sure person running command has 
    //developer permissions.
    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: 'Only developers are allowed to run this command.',
          //Only person running command can see message
          ephemeral: true,
        });
        return;
      }
    }

    //Checks if command has "Test Only" set to true,
    //if so, checks if the server is a test server.
    //if server isnt a test serevr, bot does not run command.
    if (commandObject.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: 'This command cannot be ran here.',
          ephemeral: true,
        });
        return;
      }
    }

    //Checks if person runnig command has required permissions
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: 'Not enough permissions.',
            ephemeral: true,
          });
          return;
        }
      }
    }

    //Checks if bot has permissions to run command
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I don't have enough permissions.",
            ephemeral: true,
          });
          return;
        }
      }
    }

    //If all checks are fine, runs command
    await commandObject.callback(client, interaction);

    //Error handling
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};