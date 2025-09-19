import axios from 'axios';

export default {
  name: 'konachan',
  command: ['konachan', 'kch'],
  tags: 'Fun',
  desc: 'Get a random anime image from Konachan',
  prefix: true,
  owner: false,
  premium: false,

  run: async (conn, msg, { chatInfo }) => {
    const { chatId } = chatInfo;

    try {
      
      await conn.sendMessage(chatId, { react: { text: "⏳", key: msg.key } });

      
      const res = await axios.get('https://api.nekolabs.my.id/random/konachan');
      const result = res.data?.result;

      if (!result || !result.url) {
        await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
        return conn.sendMessage(chatId, { text: '❌ Tidak ditemukan gambar.' }, { quoted: msg });
      }

      
      await conn.sendMessage(chatId, {
        image: { url: result.url },
        caption: result.title ? `*${result.title}*` : undefined
      }, { quoted: msg });

      
      await conn.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

    } catch (err) {
      console.error('Konachan API Error:', err?.response?.data ?? err);
      await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
      await conn.sendMessage(chatId, { text: '❌ Gagal mengambil gambar dari API.' }, { quoted: msg });
    }
  }
};
