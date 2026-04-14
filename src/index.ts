import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, (readyClient) => {
  console.log("logged in as ", readyClient.user.tag);
});

client.on(Events.InteractionCreate, async (interaction) => {
  console.log(interaction);
  if (!interaction.isChatInputCommand()) return;

  await interaction.reply("pong");
});

client.login(process.env.DISCORD_TOKEN);
