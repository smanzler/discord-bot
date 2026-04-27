import {
  ApplicationCommandType,
  REST,
  Routes,
  type RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import "dotenv/config";

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
  {
    name: "assess-take",
    type: ApplicationCommandType.Message,
  },
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

try {
  await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
    body: commands,
  });

  console.log("Successfully refreshed commands.");
} catch (error) {
  console.error(error);
}
