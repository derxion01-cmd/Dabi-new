import axios from 'axios';

export default {
  name: 'cookpad',
  command: ['cookpad', 'resep'],
  tags: 'Fun',
  desc: 'Cari resep makanan dari Cookpad',
  prefix: true,
  owner: false,
  premium: false,

  run: async (conn, msg, { chatInfo, args }) => {
    const { chatId } = chatInfo;
    const query = args.join(' ').trim();

    if (!query) {
      return conn.sendMessage(chatId, {
        text: '❌ Silakan masukkan kata kunci resep, contoh: cookpad ayam crispy',
      }, { quoted: msg });
    }

    try {
      
      await conn.sendMessage(chatId, { react: { text: "⏳", key: msg.key } });

      
      const res = await axios.get('https://api.nekolabs.my.id/discovery/cookpad/search', {
        params: { q: query }
      });
      const results = Array.isArray(res.data?.result) ? res.data.result : [];

      if (!results.length) {
        await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
        return conn.sendMessage(chatId, { text: '❌ Tidak ditemukan resep untuk kata kunci itu.' }, { quoted: msg });
      }

      
      const picked = results[Math.floor(Math.random() * results.length)];
      let ingredientsText = '- (Tidak ada data bahan)';
      if (Array.isArray(picked.ingredients) && picked.ingredients.length) {
        ingredientsText = picked.ingredients.map(i => `- ${i}`).join('\n');
      }

      const messageText =
        `*${picked.title}*\n` +
        `Oleh: ${picked.author}\n\n` +
        `Bahan:\n${ingredientsText}\n\n` +
        `[Selengkapnya](${picked.url})`;

      await conn.sendMessage(chatId, {
        text: messageText,
      }, { quoted: msg });

      
      await conn.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

    } catch (err) {
      console.error('Cookpad API Error:', err?.response?.data ?? err);
      await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
      await conn.sendMessage(chatId, { text: '❌ Gagal mengambil resep dari API.' }, { quoted: msg });
    }
  }
};
