
//Gets all command files stored locally within the /commands folder

const path = require('path');
const getAllFiles = require('./getAllFiles.js');

module.exports = (exceptions = []) => {
  //Array for storing all commands
  let localCommands = [];

  //Gets the category folders (/misc, /moderation, etc.)
  const commandCategories = getAllFiles(
    path.join(__dirname, '..', 'commands'),
    true
  );

  //Loops through command categories
  for (const commandCategory of commandCategories) {
    //Gets all files within command categories
    const commandFiles = getAllFiles(commandCategory);

    //Loop through all files within command folder
    for (const commandFile of commandFiles) {
      //Gets the command from the file
      const commandObject = require(commandFile);

      //Checks if command is under the exclusion list:
      if (exceptions.includes(commandObject.name)) {
        continue;
      }

      //Pushes command object onto the array
      localCommands.push(commandObject);
    }
  }

  return localCommands;
};
