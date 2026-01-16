import fetch from 'node-fetch'

export default {
  command: ['pinterest', 'pin'],
  category: 'search',
  run: async (client, m, args, from) => {
    const text = args.join(' ')
    const isPinterestUrl = /^https?:\/\//.test(text)

    if (!text) {
      return m.reply(
        `🍒 Ingresa un *término* de búsqueda o un enlace de *Pinterest*.`,
      )
    }

    try {
      if (isPinterestUrl) {
        const pinterestUrl = `${api.url}/dl/pinterest?url=${text}&key=${api.key}`
        const ress = await fetch(pinterestUrl)
        if (!ress.ok) throw new Error(`La API devolvió un código de error: ${ress.status}`)

        const { data: result } = await ress.json()
        const mediaType = ['image', 'video'].includes(result.type) ? result.type : 'document'

        const message2 =
          `🍁 ꨩᰰ𑪐𑂺 ˳ ׄ 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋  ࣭𑁯ᰍ   ̊ ܃܃\n\n` +
          `> 🍃 Resultados para tu enlace › *${text}*\n\n` +
          `𖣣ֶㅤ֯⌗ 🍄 ⬭ Título › *${result.title}*\n` +
          `𖣣ֶㅤ֯⌗ 🍄 ⬭ Tipo › *${result.type === "video" ? "Video" : "Imagen"}*`

        await client.sendMessage(
          m.chat,
          { [mediaType]: { url: result.dl }, caption: message2 },
          { quoted: m },
        )
      } else {
        const pinterestAPI = `${api.url}/search/pinterest?query=${text}&key=${api.key}`
        const res = await fetch(pinterestAPI)
        if (!res.ok) throw new Error(`La API devolvió un código de error: ${res.status}`)

        const jsons = await res.json()
        const json = jsons.data

        if (!json || json.length === 0) {
          return m.reply(`🌵 No se encontraron resultados para *${text}*`)
        }

        if (json.length > 1) {
          const checked = json.slice(0, 10) 
          const medias = checked.map(r => ({
            type: 'image',
            data: { url: r.hd || r.url },
            caption:
              `🍁 ꨩᰰ𑪐𑂺 ˳ ׄ 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍 𝖲𝖾𝖺𝗋𝖼𝗁 ࣭𑁯ᰍ   ̊ ܃܃\n\n` +
              `> 🍃 Resultados para › *${text}*\n\n` +
              `${r.title ? `𖣣ֶㅤ֯⌗ 🍄 ⬭ Título › ${r.title}\n` : ''}` +
              `${r.description ? `𖣣ֶㅤ֯⌗ 🍄 ⬭ Descripción › ${r.description}\n` : ''}` +
              `${r.full_name ? `𖣣ֶㅤ֯⌗ 🍄 ⬭ Autor › ${r.full_name}\n` : ''}` +
              `${r.likes ? `𖣣ֶㅤ֯⌗ 🍄 ⬭ Likes › ${r.likes}\n` : ''}` +
              `${r.created ? `𖣣ֶㅤ֯⌗ 🍄 ⬭ Publicado › ${r.created}\n` : ''}`
          }))
          await client.sendAlbumMessage(m.chat, medias, { quoted: m })
        } else {
          const result = json[0]
          const message =
            `🍁 ꨩᰰ𑪐𑂺 ˳ ׄ 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍 𝖲𝖾𝖺𝗋𝖼𝗁 ࣭𑁯ᰍ   ̊ ܃܃\n\n` +
            `> 🍃 Resultados para › *${text}*\n\n` +
            `𖣣ֶㅤ֯⌗ 🍄 ⬭ Título › *${result.title}*\n` +
            `𖣣ֶㅤ֯⌗ 🍄 ⬭ Descripción › *${result.description}*\n` +
            `𖣣ֶㅤ֯⌗ 🍄 ⬭ Autor › *${result.full_name}*\n` +
            `𖣣ֶㅤ֯⌗ 🍄 ⬭ Likes › *${result.likes}*\n` +
            `𖣣ֶㅤ֯⌗ 🍄 ⬭ Publicado › *${result.created}*`

          await client.sendMessage(
            m.chat,
            { image: { url: result.hd }, caption: message },
            { quoted: m },
          )
        }
      }
    } catch (e) {
      await client.reply(
        m.chat,
        msgglobal,
        m
      )
    }
  },
}