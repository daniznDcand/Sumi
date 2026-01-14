import fetch from 'node-fetch'
import FormData from 'form-data'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

export default {
  command: ['tourl'],
  category: 'utils',
  run: async (client, m, args, command, text, prefix) => {
    try {
      const q = m.quoted || m
      const mime = q.mimetype || q.msg?.mimetype || ''

      if (!mime) return m.reply(`🌾 Envía una *imagen* junto al comando *${prefix + command}*`)
      if (!/image\/(png|jpe?g|gif)|video\/mp4/.test(mime)) {
        return m.reply(`🌱 El formato *${mime}* no es compatible`)
      }

      const buffer = await q.download()
      const url = await uploadToUguu(buffer, mime)

      if (!url) return m.reply('🍒 No se pudo *subir* la imagen')

      const userName = global.db.data.users[m.sender]?.name || 'Usuario'
      const peso = formatBytes(buffer.length)

      const msg = `🍒 *Upload To Uguu*\n\n> 🌾 *Link ›* ${url}\n> 🌾 *Peso ›* ${peso}\n> 🌾 *Solicitado por ›* ${userName}\n\n${dev}`

      return m.reply(msg)
    } catch (err) {
      console.error(err)
      return m.reply(msgglobal)
    }
  },
}

async function uploadToUguu(buffer, mime) {
  const body = new FormData()
  body.append('files[]', buffer, `file.${mime.split('/')[1]}`)
  const res = await fetch('https://uguu.se/upload.php', { method: 'POST', body, headers: body.getHeaders() })
  const json = await res.json()
  return json.files?.[0]?.url
}
