import { REST, Routes } from "discord.js";
import "dotenv/config";

const commands = [{ name: "ping", description: "returns pong" }];

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

try {
  console.log("refreshing commands");

  await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
    body: commands,
  });

  console.log("refreshed commands");
} catch (error) {
  console.error(error);
}
