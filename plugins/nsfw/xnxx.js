import axios from 'axios';

export default {
  name: 'xnxx',
  command: ['xnxx'],
  tags: 'Nsfw Menu',
  desc: 'Send XNXX video by direct URL',
  prefix: true,
  owner: false,
  premium: false,

  run: async (conn, msg, { chatInfo, args }) => {
    const { chatId } = chatInfo;
    const url = args[0];

    
    if (!url || !/^https?:\/\/(www\.)?xnxx\.com\/video-/.test(url)) {
      return conn.sendMessage(chatId, {
        text: '❌ Masukkan link XNXX yang valid!\nContoh: xnxx https://www.xnxx.com/video-fzypdd8/beautiful_filipina_with_big_tits',
      }, { quoted: msg });
    }

    try {
      
      await conn.sendMessage(chatId, { react: { text: "⏳", key: msg.key } });

      const res = await axios.get('https://api.vreden.my.id/api/v1/download/xnxx', {
        params: { url }
      });
      const result = res.data?.result;
      const videoUrl = result?.download?.high || result?.download?.low;

      if (!videoUrl) {
        await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
        return conn.sendMessage(chatId, { text: '❌ Gagal mengambil video dari API, pastikan link benar.', quoted: msg });
      }

      
      await conn.sendMessage(chatId, {
        video: { url: videoUrl }
      }, { quoted: msg });

      
      await conn.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

    } catch (err) {
      console.error('XNXX API Error:', err?.response?.data ?? err);
      await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
      await conn.sendMessage(chatId, { text: '❌ Gagal mengambil video dari API.' }, { quoted: msg });
    }
  }
};
