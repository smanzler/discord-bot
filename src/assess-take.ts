import type { ChatInputCommandInteraction, TextBasedChannel } from "discord.js";

async function getMessages(channel: TextBasedChannel | null, userId: string) {
  if (!channel || !channel.isTextBased()) {
    throw new Error("Invalid channel");
  }

  const fetched = await channel.messages.fetch({ limit: 50 });

  const targetMessage = fetched.find((m) => m.author.id === userId);

  if (!targetMessage) {
    throw new Error("Couldn't find a recent message from that user.");
  }

  const previousMessages = await channel.messages.fetch({
    limit: 2,
    before: targetMessage.id,
  });

  const nextMessages = await channel.messages.fetch({
    limit: 2,
    before: targetMessage.id,
  });

  return [
    ...Array.from(previousMessages.values()),
    targetMessage,
    ...Array.from(nextMessages.values()),
  ]
    .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
    .map((m) => ({ author: m.author, message: m.content }));
}

export async function assessTake(interaction: ChatInputCommandInteraction) {
  try {
    const targetUser = interaction.options.getUser("target");

    if (!targetUser) {
      return interaction.reply({
        content: "No user specified",
        ephemeral: true,
      });
    }

    const messages = getMessages(interaction.channel, targetUser.id);

    console.log(messages);

    await interaction.reply(`Found context for <@${targetUser.id}>`);
  } catch (err: any) {
    return interaction.reply({
      content: err.message ?? "An error occured while processing your command",
      ephemeral: true,
    });
  }
}
