import axios from 'axios';

export default {
  name: 'facebook',
  command: ['facebook', 'fb'],
  tags: 'Download Menu',
  desc: 'Download Facebook video using API',
  prefix: true,
  owner: false,
  premium: false,

  run: async (conn, msg, { chatInfo, args, prefix, commandText }) => {
    const { chatId } = chatInfo;
    const fbUrl = args[0];

    if (!fbUrl) {
      return conn.sendMessage(chatId, {
        text: `Contoh penggunaan:\n${prefix}${commandText} <link Facebook>`
      }, { quoted: msg });
    }

    try {
      const res = await axios.get('https://api.vreden.my.id/api/v1/download/facebook', {
        params: { url: fbUrl }
      });

      // Check if API response includes a valid video URL
      const videoUrl = res.data?.result?.url ?? res.data?.url;
      if (!videoUrl) {
        return conn.sendMessage(chatId, {
          text: '❌ Video tidak ditemukan atau gagal mengambil link.'
        }, { quoted: msg });
      }

      await conn.sendMessage(chatId, {
        video: { url: videoUrl },
        caption: '✅ Berikut video dari Facebook.'
      }, { quoted: msg });

    } catch (err) {
      console.error('Facebook Download API Error:', err?.response?.data ?? err);
      await conn.sendMessage(chatId, {
        text: '❌ Gagal mengambil video dari Facebook.'
      }, { quoted: msg });
    }
  }
};
