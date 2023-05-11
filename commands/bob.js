import { SlashCommandBuilder } from "discord.js";
import * as addclan from "./addclan.js";
import * as addpillar from "./addpillar.js";
import * as drink from "./drink.js";
import * as list from "./list.js";
import * as merge from "./merge.js";
import * as ping from "./ping.js";
import * as removeclan from "./removeclan.js";
import * as removepillar from "./removepillar.js";

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandBuilder()
        .setName("bob")
        .setDescription("Base command for the Brew of Beginnings.")
        .addSubcommand((subcommand) =>
            subcommand.setName(addclan.NAME).setDescription(addclan.DESCRIPTION)
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(addpillar.NAME)
                .setDescription(addpillar.DESCRIPTION)
        )
        .addSubcommand((subcommand) =>
            subcommand.setName(drink.NAME).setDescription(drink.DESCRIPTION)
        )
        .addSubcommand((subcommand) =>
            subcommand.setName(list.NAME).setDescription(list.DESCRIPTION)
        )
        .addSubcommand((subcommand) =>
            subcommand.setName(ping.NAME).setDescription(ping.DESCRIPTION)
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(removeclan.NAME)
                .setDescription(removeclan.DESCRIPTION)
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(removepillar.NAME)
                .setDescription(removepillar.DESCRIPTION)
        )
        .addSubcommand((subcommand) =>
            subcommand.setName(merge.NAME).setDescription(merge.DESCRIPTION)
        );

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = async (interaction) => {
    const subCommand = interaction.options.getSubcommand();

    if (subCommand === "addclan") {
        await addclan.invoke(interaction);
    } else if (subCommand === "addpillar") {
        await addpillar.invoke(interaction);
    } else if (subCommand === "drink") {
        await drink.invoke(interaction);
    } else if (subCommand === "list") {
        await list.invoke(interaction);
    } else if (subCommand === "listpillar") {
        await listpillar.invoke(interaction);
    } else if (subCommand === "merge") {
        await merge.invoke(interaction);
    } else if (subCommand === "ping") {
        await ping.invoke(interaction);
    } else if (subCommand === "removeclan") {
        await removeclan.invoke(interaction);
    } else if (subCommand === "removepillar") {
        await removepillar.invoke(interaction);
    } else {
        interaction.reply({
            content: "Invalid subcommand: " + subCommand,
            ephemeral: true,
        });
    }
};

export { create, invoke };
