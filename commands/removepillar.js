import { SlashCommandSubcommandBuilder, PermissionsBitField } from "discord.js";
import fs from "fs";

const NAME = "removepillar";
const DESCRIPTION = "Removes a scenario from the staged pillar pool.";
const filepath = "data/poolPillarStaged.json";
const trashpath = "data/deletedObjects.json";

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandSubcommandBuilder()
        .setName(NAME)
        .setDescription(DESCRIPTION)
        .addStringOption((option) =>
            option
                .setName("key")
                .setDescription("The key of the scenario you wish to delete.")
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
            `${interaction.member.displayName} tried running /removepillar ` +
                interaction.options.getString("key") +
                `, but lacked permissions.`
        );
        return;
    } else {
        console.log(
            `${interaction.member.displayName} tried running /removepillar ` +
                interaction.options.getString("key") +
                `, and has permissions to do so.`
        );
    }
    // Dump json file
    try {
        // Get json as object
        fs.readFile(filepath, "utf8", (err, pillar) => {
            if (err) {
                console.error(err);
                return;
            }

            const filePath = filepath;
            const keyToDelete = interaction.options.getString("key");
            const pillarObj = JSON.parse(pillar);
            if (pillarObj.hasOwnProperty(keyToDelete)) {
                // Write the key to deletedObjects.json
                fs.readFile(trashpath, "utf8", (err, trash) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    var trashObj = JSON.parse(trash);
                    if (!Array.isArray(trashObj)) {
                        trashObj = []; // make sure trashObj is an array
                    }
                    trashObj.push(pillarObj[keyToDelete]);
                    fs.writeFile(
                        trashpath,
                        JSON.stringify(trashObj, null, 2),
                        (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log(
                                `Key ${keyToDelete} copied successfully from ${filePath} to ${trashpath}.`
                            );
                        }
                    );

                    delete pillarObj[keyToDelete];
                    fs.writeFile(
                        filePath,
                        JSON.stringify(pillarObj, null, 2),
                        (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log(
                                `Key ${keyToDelete} deleted successfully from ${filePath}`
                            );
                        }
                    );
                    interaction.reply({
                        content: `Key ${keyToDelete} deleted successfully from ${filePath}`,
                        ephemeral: true,
                    });
                });
            } else {
                console.log(`Key ${keyToDelete} not found in ${filePath}`);
                interaction.reply({
                    content: `Key ${keyToDelete} not found in ${filePath}`,
                    ephemeral: true,
                });
            }
        });
    } catch (err) {
        console.error(err);
        return;
    }
};

export { create, DESCRIPTION, invoke, NAME };
