import { 
    ApplicationCommandOptionType, 
    PermissionFlagsBits, 
    ChatInputCommandInteraction, 
    Client 
} from 'discord.js';

module.exports = {

    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
        // Defer the reply to give us time to process
        await interaction.deferReply();

        // Extract the name of the channel from the command options
        const channelName = interaction.options.getString('name');
        const categoryId = interaction.options.getChannel('category')

        try {
            // Create the new channel
            const newChannel = await interaction.guild?.channels.create({
                name: channelName!,
                //type: channelType,
                parent: categoryId ? categoryId.id : null,
            });
    
            // Send a success message
            interaction.editReply(`Channel "${newChannel?.name}" created successfully!`);
        } catch (error) {
            // Handle any errors that occur during channel creation
            interaction.editReply(`Error: failed to create channel: ${error}`);
        }
    },
    
    name: 'addchannel',
    description: 'Creates a new channel in the server under a specified category.',
    options: [
        {
            name: 'name',
            description: 'The name of the new channel',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'category',
            description: 'The category under which to create the channel',
            required: true,
            type: ApplicationCommandOptionType.Channel,
        },
        {
            name: 'type',
            description: 'The type of the channel (text, voice)',
            required: false,
            type: ApplicationCommandOptionType.Integer,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageRoles],
    botPermissions: [PermissionFlagsBits.ManageRoles],
  };
