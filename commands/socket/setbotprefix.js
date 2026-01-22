import GraphemeSplitter from 'grapheme-splitter'

export default {
  command: ['setbotprefix'],
  category: 'socket',
  run: async (client, m, args, command, text, prefix) => {
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const config = global.db.data.settings[idBot]
    const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
    if (!isOwner2) return client.reply(m.chat, mess.socket, m)

    const value = args.join(' ').trim()
    const defaultPrefix = ["#", "/"]

    if (!value) {
      const lista = config.prefijo === null 
        ? '`sin prefijos`' 
        : (Array.isArray(config.prefijo) ? config.prefijo : [config.prefijo || '/']).map(p => `\`${p}\``).join(', ')
      return m.reply(
        `🌵 Por favor, elige cualquiera de los siguientes métodos de prefijos.\n\n` +
        `> *○ Multi-Prefix* :: ${prefix + command} *!/.+-#*\n` +
        `> *○ Reset* :: ${prefix + command} *reset*\n` +
        `> *○ No-Prefix* :: ${prefix + command} *noprefix*\n\n` +
        `🍒 Actualmente se está usando: ${lista}`
      )
    }

    if (value.toLowerCase() === 'reset') {
      config.prefijo = defaultPrefix
      return client.reply(m.chat, `🌵 Se han restaurado los prefijos predeterminados: *${defaultPrefix.join(' ')}*`, m)
    }

    if (value.toLowerCase() === 'noprefix') {
      config.prefijo = true
      return m.reply(`🌵 Se cambió al modo sin prefijos para el Socket correctamente.`)
    }

    const splitter = new GraphemeSplitter()
    const graphemes = splitter.splitGraphemes(value)
    const lista = []

    for (const g of graphemes) {
      if (/^[a-zA-Z]+$/.test(g)) continue
      if (!lista.includes(g)) lista.push(g)
    }

    if (lista.length === 0) {
      return client.reply(m.chat, '🌵 No se detectaron prefijos válidos. Debes incluir al menos un símbolo o emoji.', m)
    }

    if (lista.length > 6) {
      return client.reply(m.chat, '🌱 Máximo 6 prefijos permitidos.', m)
    }

    config.prefijo = lista
    return client.reply(m.chat, `🌱 Se cambió el prefijo del Socket a *${lista.join(' ')}* correctamente.`, m)
  },
}