import axios from 'axios';

export default {
  name: 'botika',
  command: ['botika'],
  tags: 'Ai Menu',
  desc: 'Chat AI using Botika API',
  prefix: true,
  owner: false,
  premium: false,

  run: async (conn, msg, { chatInfo, args, prefix, commandText }) => {
    const { chatId } = chatInfo;
    const userInput = args.join(' ');
    if (!userInput) {
      return conn.sendMessage(chatId, {
        text: `Contoh penggunaan:\n${prefix}${commandText} Halo, apa kabar?`
      }, { quoted: msg });
    }

    try {
      const res = await axios.post('https://api.vreden.my.id/api/v1/artificial/botika', {
        message: userInput
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      
      const replyText = res.data?.result ?? 'Tidak ada jawaban dari Botika.';
      await conn.sendMessage(chatId, { text: replyText }, { quoted: msg });
    } catch (err) {
      console.error('Botika API Error:', err);
      await conn.sendMessage(chatId, {
        text: '❌ Gagal terhubung ke API Botika.'
      }, { quoted: msg });
    }
  }
};
