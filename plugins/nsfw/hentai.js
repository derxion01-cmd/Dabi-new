import axios from 'axios';

export default {
  name: 'hentai',
  command: ['hentai'],
  tags: 'NSFW',
  desc: 'Random hentai image',
  prefix: true,
  owner: false,
  premium: false,

  run: async (conn, msg, { chatInfo, prefix, commandText }) => {
    const { chatId } = chatInfo;

    try {
      const res = await axios.get('https://api.vreden.my.id/api/v1/random/hentai');
      // Adjust based on API response structure
      const imgUrl = res.data?.result || res.data?.url || null;
      if (!imgUrl) {
        return conn.sendMessage(chatId, { text: '❌ Tidak dapat mengambil gambar.' }, { quoted: msg });
      }
      await conn.sendMessage(chatId, { image: { url: imgUrl }, caption: 'Random hentai image' }, { quoted: msg });
    } catch (err) {
      console.error('Hentai API Error:', err?.response?.data ?? err);
      await conn.sendMessage(chatId, { text: '❌ Gagal mengambil gambar dari API.' }, { quoted: msg });
    }
  }
};
