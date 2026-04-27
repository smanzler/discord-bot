import type {
  Message,
  MessageContextMenuCommandInteraction,
  TextBasedChannel,
} from "discord.js";

async function getMessages(channel: TextBasedChannel | null, message: Message) {
  if (!channel || !channel.isTextBased()) {
    throw new Error("Invalid channel");
  }

  if (!message) {
    throw new Error("Couldn't find a recent message from that user.");
  }

  const previousMessages = await channel.messages.fetch({
    limit: 2,
    before: message.id,
  });

  const nextMessages = await channel.messages.fetch({
    limit: 2,
    before: message.id,
  });

  return [
    ...Array.from(previousMessages.values()),
    message,
    ...Array.from(nextMessages.values()),
  ]
    .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
    .map((m) => ({ author: m.author, message: m.content }));
}

export async function assessTake(
  interaction: MessageContextMenuCommandInteraction,
) {
  try {
    const message = interaction.targetMessage;

    const messages = await getMessages(interaction.channel, message);

    console.log(messages);

    await interaction.reply(`Found context for <@${message.author.id}>`);
  } catch (err: any) {
    return interaction.reply({
      content: err.message ?? "An error occured while processing your command",
      ephemeral: true,
    });
  }
}
