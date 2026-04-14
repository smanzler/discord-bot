import { Client, Events, GatewayIntentBits } from 'discord.js'
import 'dotenv/config'

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on(Events.ClientReady, readyClient => {
  console.log("logged in")
})

client.login(process.env.DISCORD_TOKEN)
