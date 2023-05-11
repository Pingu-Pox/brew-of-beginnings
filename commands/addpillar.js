import { SlashCommandSubcommandBuilder, PermissionsBitField } from "discord.js";
import fs from "fs";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

const NAME = "addpillar";
const DESCRIPTION = "Adds a scenario to the staging pillar pool.";
const filepath = "data/poolPillarStaged.json";

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandSubcommandBuilder()
        .setName(NAME)
        .setDescription(DESCRIPTION)
        .addAttachmentOption((option) =>
            option
                .setName("image")
                .setDescription("The image used in the scenario")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("question")
                .setDescription("The question the scenario askes the user.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("answer-commerce")
                .setDescription(
                    "The answer one aligned with commercial interests would choose."
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("answer-logistics")
                .setDescription(
                    "The answer one aligned with logistical interests would choose."
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("answer-martial")
                .setDescription(
                    "The answer one aligned with martial interests would choose."
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
            `${interaction.member.displayName} tried running /addpillar, but lacked permissions.`
        );
        return;
    } else {
        console.log(
            `${interaction.member.displayName} tried running /addpillar, and has permissions to do so.`
        );
    }
    // Dump json file
    try {
        console.log("Reading file into string...");
        fs.readFile(filepath, "utf8", (err, pillar) => {
            if (err) {
                console.error(err);
                return;
            }

            const pillarObj = JSON.parse(pillar);

            // Get image url and extract the filename from it.
            console.log("Getting file name...");
            const imageName = interaction.options
                .getAttachment("image")
                .url.replace(/\/$/, "")
                .split("/")
                .pop();

            // TODO: Check if the image name exists already (to prevent overwriting)

            // Download the image
            console.log("Downloading file...");
            fetch(interaction.options.getAttachment("image").url)
                .then((res) => {
                    const dest = fs.createWriteStream(`./img/${imageName}`);
                    res.body.pipe(dest);
                    dest.on("finish", () => {
                        console.log("File downloaded.");
                    });
                })
                .catch((err) => {
                    console.error(err);
                });

            // Prepare new object to append to the end of the existing json file
            console.log("Preparing additions...");
            pillarObj[uuidv4()] = {
                image: "./img/" + imageName,
                question: interaction.options.getString("question"),
                answers: {
                    ironguard: interaction.options.getString("answer-commerce"),
                    ramheart: interaction.options.getString("answer-logistics"),
                    runeforge: interaction.options.getString("answer-martial"),
                },
                author: interaction.member.displayName,
            };

            // Write to file
            console.log("Writing additions to file");
            fs.writeFile(
                filepath,
                JSON.stringify(pillarObj, null, 2),
                (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(filepath + " has been updated.");
                }
            );

            interaction.reply({
                content:
                    "You have added a new scenario to the staging pillar pool.",
                ephemeral: true,
            });
        });
    } catch (err) {
        console.error(err);
        return;
    }
};

export { create, DESCRIPTION, invoke, NAME };
