import 'dotenv/config'
import { Client, Events, GatewayIntentBits } from 'discord.js'
import { startScheduler, stopScheduler } from './scheduler.js'

const { DISCORD_TOKEN } = process.env

if (!DISCORD_TOKEN) throw new Error('DISCORD_TOKEN não definido no .env')

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

client.once(Events.ClientReady, (c) => {
  console.log(`[PacketAd] Conectado como ${c.user.tag}`)
  startScheduler(client)
})

process.on('SIGINT', () => {
  console.log('[PacketAd] Encerrando…')
  stopScheduler()
  client.destroy()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('[PacketAd] Encerrando…')
  stopScheduler()
  client.destroy()
  process.exit(0)
})

client.login(DISCORD_TOKEN)
