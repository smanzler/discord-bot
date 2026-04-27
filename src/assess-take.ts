import type {
  Message,
  MessageContextMenuCommandInteraction,
  TextBasedChannel,
} from "discord.js";
import { GoogleGenAI } from "@google/genai";
import z from "zod";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) throw new Error("API key not set");

const ai = new GoogleGenAI({ apiKey: API_KEY });

const AIResponse = z.object({
  result: z.number(),
  reason: z.string(),
});

const AIResponseSchema = z.toJSONSchema(AIResponse);

type AIResponse = z.infer<typeof AIResponse>;

type Msg = {
  author: {
    id: string;
    username: string;
  };
  message: string;
  createdAt: number;
};

async function getMessages(
  channel: TextBasedChannel | null,
  message: Message,
): Promise<{ messages: Msg[]; targetMessage: Msg }> {
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

  const messages = [
    ...Array.from(previousMessages.values()),
    message,
    ...Array.from(nextMessages.values()),
  ]
    .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
    .map((m) => ({
      author: {
        id: m.author.id,
        username: m.author.username,
      },
      message: m.content,
      createdAt: m.createdTimestamp,
    }));

  return {
    messages,
    targetMessage: {
      author: { id: message.author.id, username: message.author.username },
      message: message.content,
      createdAt: message.createdTimestamp,
    },
  };
}

const systemInstruction = `You are a chaotic but fair Discord moderator who rates takes.
You will be given chat messages as context, and the target message to critic.

Response:
- {"result": 0 or 1, "reason": "funny short explanation"}

Rules:
- result = 1 if the take is decent, funny, valid, or defensible
- result = 0 if it's dumb, toxic, cringe, or confidently wrong
- Be slightly sarcastic in the reason, but keep it under 15 words
- No emojis
- No extra text outside JSON

Style guide for reasons:
- dry humor
- mild sarcasm
- short punchy verdicts`;

async function getAnalysis(messages: Msg[], target: Msg): Promise<AIResponse> {
  const prompt = `Context messages (chat history): ${messages}
Target message to judge: ${target}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseJsonSchema: AIResponseSchema,
    },
  });

  if (!response.text) throw new Error("Failed to generate response");

  const result = AIResponse.parse(JSON.parse(response.text));

  return result;
}

export async function assessTake(
  interaction: MessageContextMenuCommandInteraction,
) {
  try {
    const { messages, targetMessage } = await getMessages(
      interaction.channel,
      interaction.targetMessage,
    );

    const response = await getAnalysis(messages, targetMessage);

    await interaction.reply(`<@${targetMessage.author.id}>, ${response.reason}

${response.result === 0 ? "Bad Take" : "Good Take"}`);
  } catch (err: any) {
    return interaction.reply({
      content: err.message ?? "An error occured while processing your command",
      ephemeral: true,
    });
  }
}
