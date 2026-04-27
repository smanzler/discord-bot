import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  REST,
  Routes,
  type RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import "dotenv/config";

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
  {
    name: "assess-take",
    description:
      "Assess a users take and have them muted if the take is considered trash.",
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: "target",
        description: "User to assess",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
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
