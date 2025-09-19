import axios from 'axios';

export default {
  name: 'animequote',
  command: ['animequote', 'aq'],
  tags: 'Fun',
  desc: 'Get a random anime quote',
  prefix: true,
  owner: false,
  premium: false,

  run: async (conn, msg, { chatInfo }) => {
    const { chatId } = chatInfo;

    try {
      // React with loading emoji
      await conn.sendMessage(chatId, { react: { text: "⏳", key: msg.key } });

      // Fetch quotes from the API
      const res = await axios.get('https://api.nekolabs.my.id/random/anime-quote');
      const quotes = Array.isArray(res.data?.result) ? res.data.result : [];

      if (!quotes.length) {
        await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
        return conn.sendMessage(chatId, { text: '❌ Tidak ada quote tersedia.' }, { quoted: msg });
      }

      // Pick one random quote
      const picked = quotes[Math.floor(Math.random() * quotes.length)];

      // Build the message text
      const text =
        `_"${picked.quote}"_\n` +
        `— *${picked.char}* (${picked.from_anime}, ${picked.episode})`;

      await conn.sendMessage(chatId, { text }, { quoted: msg });

      // React with success emoji
      await conn.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

    } catch (err) {
      console.error('Anime Quote API Error:', err?.response?.data ?? err);
      await conn.sendMessage(chatId, { react: { text: "", key: msg.key } });
      await conn.sendMessage(chatId, { text: '❌ Gagal mengambil quote dari API.' }, { quoted: msg });
    }
  }
};
