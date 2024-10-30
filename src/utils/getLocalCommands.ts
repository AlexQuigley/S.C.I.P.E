import * as path from 'path';
import getAllFiles from './getAllFiles';

interface CommandObject {
  name: string;
  [key: string]: any;
}

const getLocalCommands = (exceptions: string[] = []): CommandObject[] => {
  // Array for storing all commands
  let localCommands: CommandObject[] = [];

  // Gets the category folders (/misc, /moderation, etc.)
  const commandCategories = getAllFiles(
    path.join(__dirname, '..', 'commands'),
    true
  );

  // Loops through command categories
  for (const commandCategory of commandCategories) {
    // Gets all files within command categories
    const commandFiles = getAllFiles(commandCategory);

    // Loop through all files within command folder
    for (const commandFile of commandFiles) {
      // Gets the command from the file
      const commandObject: CommandObject = require(commandFile);

      // Checks if command is under the exclusion list:
      if (exceptions.includes(commandObject.name)) {
        continue;
      }

      // Pushes command object onto the array
      localCommands.push(commandObject);
    }
  }

  return localCommands;
};

export default getLocalCommands;
