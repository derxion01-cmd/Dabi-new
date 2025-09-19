import axios from 'axios';

export default {
  name: 'xnxx',
  command: ['xnxx'],
  tags: 'NSFW',
  desc: 'Send XNXX video by keyword search',
  prefix: true,
  owner: false,
  premium: false,

  run: async (conn, msg, { chatInfo, args }) => {
    const { chatId } = chatInfo;
    const query = args.join(' ').trim();

    if (!query) {
      return conn.sendMessage(chatId, {
        text: '❌ Silakan masukkan kata kunci, contoh: xnxx japanese',
      }, { quoted: msg });
    }

    try {
    
      await conn.sendMessage(chatId, { react: { text: "⏳", key: msg.key } });

      
      const searchRes = await axios.get('https://api.vreden.my.id/api/v1/search/xnxx', {
        params: { query }
      });
      const results = Array.isArray(searchRes.data?.result) ? searchRes.data.result : [];
      if (!results.length) {
        await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
        return conn.sendMessage(chatId, { text: '❌ Tidak ditemukan hasil untuk kata kunci itu.' }, { quoted: msg });
      }

      
      const picked = results[Math.floor(Math.random() * results.length)];

      
      const dlRes = await axios.get('https://api.vreden.my.id/api/v1/download/xnxx', {
        params: { url: picked.url }
      });
      const videoUrl = dlRes.data?.result?.video;
      if (!videoUrl) {
        await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
        return conn.sendMessage(chatId, { text: '❌ Gagal mengambil video dari API.' }, { quoted: msg });
      }

      
      await conn.sendMessage(chatId, {
        video: { url: videoUrl }
      }, { quoted: msg });

      
      await conn.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

    } catch (err) {
      console.error('XNXX search/download error:', err?.response?.data ?? err);
      await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
      await conn.sendMessage(chatId, { text: '❌ Terjadi error saat mengambil video.' }, { quoted: msg });
    }
  }
};
