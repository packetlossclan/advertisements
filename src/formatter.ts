import { EmbedBuilder } from 'discord.js'
import type { RankEntry, ProximaPartida, AdvertisementConfig } from './api.js'

const MEDALS = ['🥇', '🥈', '🥉']

function medal(pos: number): string {
  return MEDALS[pos - 1] ?? `**${pos}º**`
}

function formatRankList(entries: RankEntry[], limit = 10): string {
  if (entries.length === 0) return '_Nenhum jogador no ranking ainda._'
  return entries
    .slice(0, limit)
    .map(e => `${medal(e.position)} ${e.nick} — **${e.score} pts**`)
    .join('\n')
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function buildEmbeds(
  messageType: AdvertisementConfig['messageType'],
  data: { total: RankEntry[]; weekly: RankEntry[]; proxima: ProximaPartida },
): EmbedBuilder[] {
  switch (messageType) {
    case 'rankings_total':
      return [buildTotalEmbed(data.total)]

    case 'rankings_weekly':
      return [buildWeeklyEmbed(data.weekly)]

    case 'full_rankings':
      return [buildTotalEmbed(data.total), buildWeeklyEmbed(data.weekly)]

    case 'upcoming_match':
      return [buildUpcomingEmbed(data.proxima)]
  }
}

function buildTotalEmbed(total: RankEntry[]): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x61afef)
    .setTitle('🏆 Ranking Geral')
    .setDescription(formatRankList(total))
    .setTimestamp()
    .setFooter({ text: 'PacketAd • packetloss.com.br' })
}

function buildWeeklyEmbed(weekly: RankEntry[]): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x98c379)
    .setTitle('📅 Ranking Semanal')
    .setDescription(
      weekly.length === 0
        ? '_Nenhuma partida registrada esta semana._'
        : formatRankList(weekly),
    )
    .setTimestamp()
    .setFooter({ text: 'PacketAd • packetloss.com.br' })
}

function buildUpcomingEmbed(proxima: ProximaPartida): EmbedBuilder {
  if (!proxima) {
    return new EmbedBuilder()
      .setColor(0xe89016)
      .setTitle('📆 Próxima Partida')
      .setDescription('_Nenhuma partida agendada no momento._')
      .setTimestamp()
      .setFooter({ text: 'PacketAd • packetloss.com.br' })
  }

  const embed = new EmbedBuilder()
    .setColor(0xe89016)
    .setTitle('📆 Próxima Partida')
    .addFields(
      {
        name: 'Campeonato',
        value: proxima.championship.number
          ? `#${proxima.championship.number} — ${proxima.championship.name}`
          : proxima.championship.name,
        inline: false,
      },
      {
        name: 'Data',
        value: formatDate(proxima.scheduledAt),
        inline: true,
      },
    )
    .setTimestamp()
    .setFooter({ text: 'PacketAd • packetloss.com.br' })

  if (proxima.description) {
    embed.setDescription(proxima.description)
  }

  return embed
}
