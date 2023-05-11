import { SlashCommandSubcommandBuilder } from "discord.js";

const NAME = "ping";
const DESCRIPTION = "Pings the bot to see if it is online!";

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandSubcommandBuilder()
        .setName(NAME)
        .setDescription(DESCRIPTION);

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
    interaction.reply({
        content: "Pong!",
        ephemeral: true,
    });
};

export { create, DESCRIPTION, invoke, NAME };
