import fetch from 'node-fetch'

export default {
  command: ['scsearch', 'soundcloudsearch', 'scfind'],
  category: 'downloader',
  run: async (client, m, args) => {
    try {
      if (!args[0]) {
        return m.reply('✎ Por favor, escribe el nombre del track o artista que deseas buscar en SoundCloud')
      }

      const query = args.join(' ')
      await m.reply('🔍 Buscando en SoundCloud...')

      let res, data
      try {
        res = await fetch(`${api.url}/search/soundcloud?query=${encodeURIComponent(query)}&key=${api.key}`)
        data = await res.json()
      } catch {
        return m.reply('ꕥ No se pudo conectar con el servidor de búsqueda.')
      }

      if (!data.status || !data.results || data.results.length === 0) {
        return m.reply('❌ No se encontraron resultados en SoundCloud')
      }

      let message = '🎧 *RESULTADOS DE SOUNDCLOUD*\n\n'

      data.results.slice(0, 5).forEach((item, i) => {
        message += `*${i + 1}.* ${item.title || 'Sin título'}\n`
        message += `   👤 *Autor:* ${item.author?.name || 'Desconocido'}\n`
        if (item.duration) message += `   ⏱️ *Duración:* ${item.duration}\n`
        if (item.release_date) message += `   📅 *Fecha:* ${item.release_date}\n`
        if (item.play_count) message += `   ▶️ *Reproducciones:* ${item.play_count}\n`
        if (item.like_count) message += `   ❤️ *Likes:* ${item.like_count}\n`
        message += `   🧩 ${item.url}\n\n`
      })

      message += `📌 Usa */scaudio <nombre>* para descargar`

      await m.reply(message)
      await m.react('✅')

    } catch (e) {
      console.error(e)
      await m.reply('❌ Error al buscar en SoundCloud')
    }
  }
}