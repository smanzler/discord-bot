import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { assessTake } from "./assess-take.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, (readyClient) => {
  console.log("Logged in as", readyClient.user.tag);
});

client.on(Events.InteractionCreate, async (interaction) => {
  console.log(interaction);
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "assess-take") {
    await assessTake(interaction);
    return;
  }
});

client.login(process.env.DISCORD_TOKEN);
