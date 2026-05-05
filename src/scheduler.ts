import type { Client, TextChannel } from 'discord.js'
import { fetchAdvertisementPayload } from './api.js'
import type { AdvertisementPayload } from './api.js'
import { buildEmbeds } from './formatter.js'

let timer: ReturnType<typeof setTimeout> | null = null

async function tick(client: Client): Promise<void> {
  let payload: AdvertisementPayload | undefined
  try {
    payload = await fetchAdvertisementPayload()
  } catch (err) {
    console.error('[scheduler] Falha ao buscar configuração da API:', err)
    return
  }

  const { config, data } = payload

  if (!config.enabled) {
    console.log('[scheduler] Anúncios desabilitados, pulando envio.')
    return
  }

  if (!config.channelId) {
    console.warn('[scheduler] channelId não configurado no painel, pulando envio.')
    return
  }

  let channel: TextChannel
  try {
    const ch = await client.channels.fetch(config.channelId)
    if (!ch || !ch.isTextBased()) {
      console.error(`[scheduler] Canal ${config.channelId} não encontrado ou não é de texto.`)
      return
    }
    channel = ch as TextChannel
  } catch (err) {
    console.error(`[scheduler] Erro ao buscar canal ${config.channelId}:`, err)
    return
  }

  const embeds = buildEmbeds(config.messageType, data)

  try {
    await channel.send({ embeds })
    console.log(`[scheduler] Mensagem enviada para #${channel.name} (tipo: ${config.messageType})`)
  } catch (err) {
    console.error('[scheduler] Erro ao enviar mensagem:', err)
  }
}

export function startScheduler(client: Client): void {
  async function loop(): Promise<void> {
    let intervalMinutes = 60

    try {
      const payload = await fetchAdvertisementPayload()
      intervalMinutes = payload.config.intervalMinutes
      await tick(client)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn(`[scheduler] API indisponível, tentando novamente em ${intervalMinutes} minuto(s): ${message}`)
    }

    const ms = Math.max(intervalMinutes, 1) * 60 * 1000
    console.log(`[scheduler] Próximo envio em ${intervalMinutes} minuto(s).`)
    timer = setTimeout(loop, ms)
  }

  loop()
}

export function stopScheduler(): void {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
}
