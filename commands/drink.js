import { SlashCommandSubcommandBuilder } from "discord.js";
import fs from "fs";

const NAME = "drink";
const DESCRIPTION = "Take a swig from the Brew of Beginnings.";
const poolClanPath = "data/poolClan.json";
const poolPillarPath = "data/poolPillar.json";
const numScenarios = 10; // must be an even number
let currentPage = 0;
const embedColor = 0xffa72c;

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandSubcommandBuilder()
        .setName(NAME)
        .setDescription(DESCRIPTION);

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
    // Message in the channel /drink was sent in, letting the user know they're about to ponder
    interaction.reply({
        content:
            "\"This'll sort ye' out!\" You take a swig of the `Brew of Beginnings`, your head drops to the bar as you begin to ponder...",
        ephemeral: true,
    });

    // Get the actual amount of scenarios to grab, this factors in the total of scenarios and the extra scenarios for tie-breakers
    var numEachScenario = Math.floor((numScenarios + 2) / 2);

    // Grab 5 objects from the clan pool
    fs.readFile(poolClanPath, "utf8", (err, clan) => {
        if (err) {
            console.error(err);
            return;
        }
        const clanObj = JSON.parse(clan);
        const clanKeys = Object.keys(clanObj);
        const randomIndices = [];
        const randomClans = [];

        // Generate an array of 5 unique random indices without duplicates
        while (randomIndices.length < numEachScenario) {
            const randomIndex = Math.floor(Math.random() * clanKeys.length);
            if (!randomIndices.includes(randomIndex)) {
                randomIndices.push(randomIndex);
            }
        }

        // Select the 5 random clans
        randomIndices.forEach((index) => {
            const clanName = clanKeys[index];
            const clanData = clanObj[clanName];
            randomClans.push({
                name: clanName,
                data: clanData,
            });
        });

        const bonusClanScenario = randomClans.pop();

        // randomClans is an object with indices pointing to 5 random pillar keys
        console.log("List of random clan scenarios:\n");
        console.log(randomClans);

        console.log("\nHere's the bonus clan scenario:\n");
        console.log(bonusClanScenario);

        fs.readFile(poolPillarPath, "utf8", (err, pillar) => {
            if (err) {
                console.error(err);
                return;
            }
            const pillarObj = JSON.parse(pillar);
            const pillarKeys = Object.keys(pillarObj);
            const randomIndices2 = [];
            const randomPillars = [];

            // Generate an array of 5 unique random indices without duplicates
            while (randomIndices2.length < numEachScenario) {
                const randomIndex = Math.floor(
                    Math.random() * pillarKeys.length
                );
                if (!randomIndices2.includes(randomIndex)) {
                    randomIndices2.push(randomIndex);
                }
            }

            // Select the 5 random pillar scenarios
            randomIndices2.forEach((index) => {
                const pillarName = pillarKeys[index];
                const pillarData = pillarObj[pillarName];
                randomPillars.push({
                    name: pillarName,
                    data: pillarData,
                });
            });

            const bonusPillarScenario = randomPillars.pop();

            // randomPillars is an object with indices pointing to 5 random pillar keys
            console.log("List of random pillar scenarios:\n");
            console.log(randomPillars);

            console.log("\nHere's the bonus pillar scenario:\n");
            console.log(bonusPillarScenario);

            // Combine the two arrays and shuffle the elements randomly
            const specialBrew = [...randomClans, ...randomPillars];
            for (let i = specialBrew.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [specialBrew[i], specialBrew[j]] = [
                    specialBrew[j],
                    specialBrew[i],
                ];
            }

            // A brew, hopefully!
            console.log("The full brew is:\n");
            console.log(specialBrew);

            specialBrew.forEach((scenarios) => {
                buildEmbedWithButtons(scenarios);
            });

            // Get the scoreboard setup
            let ironguard = 0;
            let ramheart = 0;
            let runeforge = 0;
            let commerce = 0;
            let logistic = 0;
            let martial = 0;

            // Serve embeds, collecting the answers with the above values

            // Find clan suggestion
            if (
                ironguard === ramheart ||
                ironguard === runeforge ||
                ramheart === runeforge
            ) {
                console.log("There are matching values.");
                // Handle the logic if matching values are found
                if (ironguard === ramheart) {
                    console.log(
                        "Tie between Ironguard and Ramheart, serve the user a tie-breaker"
                    );
                }
                if (ironguard === runeforge) {
                    console.log(
                        "Tie between Ironguard and Runeforge, serve the user a tie-breaker"
                    );
                }
                if (ramheart === runeforge) {
                    console.log(
                        "Tie between Ramheart and Runeforge, serve the user a tie-breaker"
                    );
                }
            } else {
                console.log(
                    "No ties, declare the highest clan as the suggested clan!"
                );
            }

            // Find pillar suggestion
            if (
                commerce === logistic ||
                commerce === martial ||
                logistic === martial
            ) {
                console.log("There are matching values.");
                // Handle the logic if matching values are found
                if (commerce === logistic) {
                    console.log(
                        "Tie between commerce and logistic, serve the user a tie-breaker"
                    );
                }
                if (commerce === martial) {
                    console.log(
                        "Tie between commerce and martial, serve the user a tie-breaker"
                    );
                }
                if (logistic === martial) {
                    console.log(
                        "Tie between logistic and martial, serve the user a tie-breaker"
                    );
                }
            } else {
                console.log(
                    "No ties, declare the highest pillar as the suggested pillar!"
                );
            }
        });
    });
};

async function buildEmbedWithButtons(data) {
    // Create an embed with the provided data

    // Stupid, but gotta make the attachment first for the image
    const imageName = data.image.replace(/\/$/, "").split("/").pop();
    console.log("Stripping data.image down to :" + imageName);

    const attachedImage = new AttachmentBuilder(data.image, {
        name: imageName,
    });

    const embed = new EmbedBuilder()
        .setTitle(data.question)
        .setImage(`attachment://${data.image}`)
        .setColor(embedColor)
        .setFooter({
            text: `${currentPage}/${numScenarios}`,
        });

    // Create an array of shuffled answers
    const shuffledAnswers = shuffleArray(data.answers);

    // Create an array of button components for each answer
    const buttons = shuffledAnswers.map((answer) =>
        new MessageButton()
            .setCustomId(answer)
            .setLabel(answer)
            .setStyle("PRIMARY")
    );

    // Create an action row with the buttons
    const actionRow = new MessageActionRow().addComponents(buttons);

    // Send the embed with the buttons and wait for a button interaction
    const message = await interaction.reply({
        embeds: [embed],
        components: [actionRow],
        files: attachedImage,
        fetchReply: true,
    });
    const filter = (interaction) =>
        interaction.customId === shuffledAnswers[0] ||
        interaction.customId === shuffledAnswers[1] ||
        interaction.customId === shuffledAnswers[2];
    const collected = await message.awaitMessageComponent({
        filter,
        time: 15000,
    });

    // Return the selected button's value
    return collected.customId;
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export { create, DESCRIPTION, invoke, NAME };
