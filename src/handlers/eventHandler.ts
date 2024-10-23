// This file handles all events within the events folder

import path from 'path';
import getAllFiles from '../utils/getAllFiles.js';
import { Client } from 'discord.js';

export default (client: Client) => {
  // List of all folders inside the /events folder
  const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

  // Loops through all folders:
  for (const eventFolder of eventFolders) {
    // Gets all files within the event folder
    const eventFiles = getAllFiles(eventFolder);
    
    // Sorts files inside folders so that files with lower numbers get higher priority
    eventFiles.sort((a, b) => (a > b ? 1 : -1));

    // Gets the name of the event based on the folder name
    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

    if (!eventName) continue; // Ensure eventName is valid

    // Listens for events to happen and then calls the required event
    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = (await import(eventFile)).default;
        await eventFunction(client, arg);
      }
    });
  }
};