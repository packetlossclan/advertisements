export type RankEntry = {
  position: number
  nick: string
  score: number
}

export type ProximaPartida = {
  id: string
  scheduledAt: number
  description: string | null
  status: string
  championship: {
    number: number | null
    name: string
    status: string
  }
} | null

export type AdvertisementConfig = {
  channelId: string | null
  intervalMinutes: number
  enabled: boolean
  messageType: 'full_rankings' | 'rankings_total' | 'rankings_weekly' | 'upcoming_match'
}

export type AdvertisementPayload = {
  config: AdvertisementConfig
  data: {
    total: RankEntry[]
    weekly: RankEntry[]
    proxima: ProximaPartida
  }
}

export async function fetchAdvertisementPayload(): Promise<AdvertisementPayload> {
  const url = process.env.PACKETLOSS_API_URL
  const token = process.env.BOT_API_TOKEN

  if (!url) throw new Error('PACKETLOSS_API_URL não definido no .env')
  if (!token) throw new Error('BOT_API_TOKEN não definido no .env')

  const res = await fetch(`${url}/api/bot/advertisement`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`API retornou ${res.status}: ${await res.text()}`)
  }

  return res.json() as Promise<AdvertisementPayload>
}
