import axios from 'axios';

export default {
  name: 'stickerly',
  command: ['stickerly', 'stly'],
  tags: 'Search Menu',
  desc: 'Search Stickerly using Nekolabs API',
  prefix: true,
  owner: false,
  premium: false,

  run: async (conn, msg, { chatInfo, args, prefix, commandText }) => {
    const { chatId } = chatInfo;
    const query = args.join(' ');

    if (!query) {
      return conn.sendMessage(chatId, {
        text: `Contoh penggunaan:\n${prefix}${commandText} <kata kunci>`
      }, { quoted: msg });
    }

    try {
      const res = await axios.get('https://api.nekolabs.my.id/discovery/stickerly/search', {
        params: { q: query }
      });

      if (!res.data?.result?.length) {
        return conn.sendMessage(chatId, {
          text: '❌ Tidak ditemukan hasil untuk pencarian tersebut.'
        }, { quoted: msg });
      }

      // Format search results
      let replyText = 'Hasil pencarian Stickerly:\n\n';
      res.data.result.slice(0, 5).forEach((item, i) => {
        replyText += `${i + 1}. ${item.title}\n${item.url}\n\n`;
      });

      await conn.sendMessage(chatId, { text: replyText }, { quoted: msg });
    } catch (err) {
      console.error('Stickerly Search API Error:', err?.response?.data ?? err);
      await conn.sendMessage(chatId, {
        text: '❌ Gagal melakukan pencarian Stickerly.'
      }, { quoted: msg });
    }
  }
};
