import axios from 'axios';

export default {
  name: 'zerochan',
  command: ['zerochan', 'zc'],
  tags: 'Fun Menu',
  desc: 'Search anime images from Zerochan',
  prefix: true,
  owner: false,
  premium: false,

  run: async (conn, msg, { chatInfo, args }) => {
    const { chatId } = chatInfo;
    const query = args.join(' ').trim();

    if (!query) {
      return conn.sendMessage(chatId, {
        text: '❌ Silakan masukkan kata kunci pencarian, contoh: zerochan Hu Tao',
      }, { quoted: msg });
    }

    try {
      
      await conn.sendMessage(chatId, { react: { text: "⏳", key: msg.key } });

      
      const res = await axios.get('https://api.nekolabs.my.id/discovery/zerochan/search', {
        params: { q: query }
      });
      const results = Array.isArray(res.data?.result) ? res.data.result : [];

      if (!results.length) {
        await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
        return conn.sendMessage(chatId, { text: '❌ Tidak ditemukan gambar untuk kata kunci itu.' }, { quoted: msg });
      }

      
      const picked = results[Math.floor(Math.random() * results.length)];

      await conn.sendMessage(chatId, {
        image: { url: picked.imageUrl },
        caption: `*${picked.title}*\n[Source](${picked.source})`
      }, { quoted: msg });

      
      await conn.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

    } catch (err) {
      console.error('Zerochan API Error:', err?.response?.data ?? err);
      await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
      await conn.sendMessage(chatId, { text: '❌ Gagal mengambil gambar dari API.' }, { quoted: msg });
    }
  }
};
