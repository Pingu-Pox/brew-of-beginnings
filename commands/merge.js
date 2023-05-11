import { SlashCommandSubcommandBuilder, PermissionsBitField } from "discord.js";
import fs from "fs";

const NAME = "merge";
const DESCRIPTION = "Merges the staged pools into the live pools.";

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandSubcommandBuilder()
        .setName(NAME)
        .setDescription(DESCRIPTION);

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
    // Check permissions
    if (
        !interaction.member.permissions.has(PermissionsBitField.Administrator)
    ) {
        interaction.reply("You do not have required role to use this command");
        console.log(
            `${interaction.member.displayName} tried running /merge, but lacked permissions.`
        );
        return;
    } else {
        console.log(
            `${interaction.member.displayName} tried running /merge, and has permissions to do so.`
        );
    }

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const dateTimeString = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

    const clanBackupPath = `data/merges/clan-${dateTimeString}.json`;
    const pillarBackupPath = `data/merges/pillar-${dateTimeString}.json`;

    // Logic time!
    console.log("Starting merge of clan scenarios...");
    fs.readFile("data/poolClanStaged.json", "utf8", (err, clanStage) => {
        if (err) {
            console.error(err);
            return;
        }
        const clanStageObj = JSON.parse(clanStage);
        fs.readFile("data/poolClan.json", "utf8", (err, clanLive) => {
            if (err) {
                console.error(err);
                return;
            }
            const clanLiveObj = JSON.parse(clanLive);
            const mergedClan = { ...clanLiveObj, ...clanStageObj };
            fs.writeFile(
                "data/poolClan.json",
                JSON.stringify(mergedClan, null, 2),
                (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    // Backup the processed data
                    fs.writeFile(
                        clanBackupPath,
                        JSON.stringify(clanStageObj, null, 2),
                        (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log("Processed clan scenarios backed up!");
                            const blankClan = {};
                            fs.writeFileSync(
                                "data/poolClanStaged.json",
                                JSON.stringify(blankClan),
                                (err) => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    console.log("Clan staging area cleared!");
                                }
                            );
                        }
                    );
                    console.log("Merge of clan scenarios completed!");
                }
            );
        });
    });

    console.log("Starting merge of pillar scenarios...");
    fs.readFile("data/poolPillarStaged.json", "utf8", (err, pillarStage) => {
        if (err) {
            console.error(err);
            return;
        }
        const pillarStageObj = JSON.parse(pillarStage);
        fs.readFile("data/poolPillar.json", "utf8", (err, pillarLive) => {
            if (err) {
                console.error(err);
                return;
            }
            const pillarLiveObj = JSON.parse(pillarLive);
            const mergedPillar = { ...pillarLiveObj, ...pillarStageObj };
            fs.writeFile(
                "data/poolPillar.json",
                JSON.stringify(mergedPillar, null, 2),
                (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    // Backup the processed data
                    fs.writeFile(
                        pillarBackupPath,
                        JSON.stringify(pillarStageObj, null, 2),
                        (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log(
                                "Processed pillar scenarios backed up!"
                            );
                            const blankPillar = {};
                            fs.writeFileSync(
                                "data/poolPillarStaged.json",
                                JSON.stringify(blankPillar),
                                (err) => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    console.log("Pillar staging area cleared!");
                                }
                            );
                        }
                    );
                    console.log("Merge of pillar scenarios completed!");
                }
            );
        });
    });

    interaction.reply({
        content:
            "You have finalized pending scenarios, they will now appear in the brew.",
        ephemeral: true,
    });
};

export { create, DESCRIPTION, invoke, NAME };
