import fs from "fs";
import { Routes, REST } from "discord.js";
import {} from "dotenv/config";

const once = true;
const name = "ready";

async function invoke(client) {
    const commands = fs
        .readdirSync("./commands")
        .filter((file) => file.endsWith(".js"))
        .map((file) => file.slice(0, -3));

    const commandsArray = [];

    for (let command of commands) {
        const commandFile = await import(`#commands/${command}`);
        commandsArray.push(commandFile.create());
    }

    client.application.commands.set(commandsArray);

    console.log(`Successfully logged in as ${client.user.tag}!`);

    const CLIENT_ID = client.user.id;
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    (async () => {
        try {
            console.log("Trying to register commands...");
            if (process.env.ENV === "production") {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commandsArray,
                });
                console.log("Successfully registered commands globally.");
            } else {
                await rest.put(
                    Routes.applicationGuildCommands(
                        CLIENT_ID,
                        process.env.GUILD_ID
                    ),
                    {
                        body: commandsArray,
                    }
                );
                console.log("Successfully registered commands locally.");
            }
        } catch (err) {
            if (err) console.log(err);
        }
    })();
}

export { once, name, invoke };
