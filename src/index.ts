import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { assessTake } from "./assess-take.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, (readyClient) => {
  console.log("Logged in as", readyClient.user.tag);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isMessageContextMenuCommand()) {
    return;
  }

  if (interaction.commandName === "assess-take") {
    await assessTake(interaction);
    return;
  }

  await interaction.reply({ content: "didn't work" });
});

client.login(process.env.DISCORD_TOKEN);
