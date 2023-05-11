import {
    SlashCommandSubcommandBuilder,
    PermissionsBitField,
    Attachment,
    AttachmentBuilder,
    MessagePayload,
} from "discord.js";
import fs from "fs";

const NAME = "list";
const DESCRIPTION =
    "Lists scenarios based on which pool you select. `clan` or ` pillar`";
const MAX_MESSAGE_SIZE = 2000;

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandSubcommandBuilder()
        .setName(NAME)
        .setDescription(DESCRIPTION)
        .addStringOption((option) =>
            option
                .setName("pooltype")
                .setDescription(
                    "The pool you want to list. `clan` or ` pillar`"
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("environment")
                .setDescription(
                    "The environment you are targeting. 'stage' or 'live'"
                )
                .setRequired(true)
        );

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
    if (
        !interaction.member.permissions.has(PermissionsBitField.Administrator)
    ) {
        interaction.reply("You do not have required role to use this command");
        console.log(
            `${interaction.member.displayName} tried running /list ` +
                interaction.options.getString("pooltype") +
                ` ` +
                interaction.options.getString("environment") +
                `, but lacked permissions.`
        );
        return;
    } else {
        console.log(
            `${interaction.member.displayName} tried running /list ` +
                interaction.options.getString("pooltype") +
                ` ` +
                interaction.options.getString("environment") +
                `, and has permissions to do so.`
        );
    }
    if (interaction.options.getString("pooltype") === "clan") {
        if (interaction.options.getString("environment") === "stage") {
            // List Staged Clan Data
            try {
                fs.readFile("data/poolClanStaged.json", "utf8", (err, clan) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Check if the file is too large for a single message
                    console.log("Message length is: " + clan.length);
                    if (clan.length <= MAX_MESSAGE_SIZE) {
                        // Output the JSON data directly as a Discord message
                        interaction.reply({
                            content: "```" + clan + "```",
                            ephemeral: true,
                        });
                    } else {
                        const buffer = Buffer.from(clan, "utf-8");
                        const attachment = new AttachmentBuilder(buffer, {
                            name: "poolClanStaged.json",
                        });
                        interaction.reply({
                            content: "Here are the staged clan-scenarios",
                            files: [attachment],
                            ephemeral: true,
                        });
                    }
                });
            } catch (err) {
                console.error(err);
                return;
            }
        } else if (interaction.options.getString("environment") === "live") {
            // List Live Clan Data
            try {
                fs.readFile("data/poolClan.json", "utf8", (err, clan) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Check if the file is too large for a single message
                    console.log("Message length is: " + clan.length);
                    if (clan.length <= MAX_MESSAGE_SIZE) {
                        // Output the JSON data directly as a Discord message
                        interaction.reply({
                            content: "```" + clan + "```",
                            ephemeral: true,
                        });
                    } else {
                        const buffer = Buffer.from(clan, "utf-8");
                        const attachment = new AttachmentBuilder(buffer, {
                            name: "poolClan.json",
                        });
                        interaction.reply({
                            content: "Here are the live clan-scenarios",
                            files: [attachment],
                            ephemeral: true,
                        });
                    }
                });
            } catch (err) {
                console.error(err);
                return;
            }
        } else {
            interaction.reply({
                content:
                    "Invalid environment: " +
                    interaction.options.getString("environment"),
                ephemeral: true,
            });
        }
    } else if (interaction.options.getString("pooltype") === "pillar") {
        if (interaction.options.getString("environment") === "stage") {
            // List Staged Pillar Data
            try {
                fs.readFile(
                    "data/poolPillarStaged.json",
                    "utf8",
                    (err, pillar) => {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        // Check if the file is too large for a single message
                        console.log("Message length is: " + pillar.length);
                        if (pillar.length <= MAX_MESSAGE_SIZE) {
                            // Output the JSON data directly as a Discord message
                            interaction.reply({
                                content: "```" + pillar + "```",
                                ephemeral: true,
                            });
                        } else {
                            const buffer = Buffer.from(pillar, "utf-8");
                            const attachment = new AttachmentBuilder(buffer, {
                                name: "poolPillarStaged.json",
                            });
                            interaction.reply({
                                content: "Here are the staged pillar-scenarios",
                                files: [attachment],
                                ephemeral: true,
                            });
                        }
                    }
                );
            } catch (err) {
                console.error(err);
                return;
            }
        } else if (interaction.options.getString("environment") === "live") {
            // List Live Pillar Data
            try {
                fs.readFile("data/poolPillar.json", "utf8", (err, pillar) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Check if the file is too large for a single message
                    console.log("Message length is: " + pillar.length);
                    if (pillar.length <= MAX_MESSAGE_SIZE) {
                        // Output the JSON data directly as a Discord message
                        interaction.reply({
                            content: "```" + pillar + "```",
                            ephemeral: true,
                        });
                    } else {
                        const buffer = Buffer.from(pillar, "utf-8");
                        const attachment = new AttachmentBuilder(buffer, {
                            name: "poolPillar.json",
                        });
                        interaction.reply({
                            content: "Here are the live pillar-scenarios",
                            files: [attachment],
                            ephemeral: true,
                        });
                    }
                });
            } catch (err) {
                console.error(err);
                return;
            }
        } else {
            interaction.reply({
                content:
                    "Invalid environment: " +
                    interaction.options.getString("environment"),
                ephemeral: true,
            });
        }
    } else {
        interaction.reply({
            content:
                "Invalid pooltype: " +
                interaction.options.getString("pooltype"),
            ephemeral: true,
        });
    }
};

export { create, DESCRIPTION, invoke, NAME };
