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

    // Get bot ID (usually in format: '123456789@s.whatsapp.net')
    const botId = conn.user?.id;

    // Check if the bot is tagged/mentioned in the message
    const isMentioned = msg.mentionedJid?.includes(botId);

    // Check if this message replies to the bot's message
    const isReplyToBot = msg.quoted?.sender === botId;

    // Trigger only if: normal command, reply to bot, or bot is mentioned
    if (!userInput && !(isMentioned || isReplyToBot)) {
      return conn.sendMessage(chatId, {
        text: `Contoh penggunaan:\n${prefix}${commandText} Halo, apa kabar?`
      }, { quoted: msg });
    }

    // Use quoted message text as input if replying to bot and args are empty
    const promptText = userInput || (isReplyToBot ? msg.quoted.text : '');

    if (!promptText) {
      return conn.sendMessage(chatId, {
        text: `❌ Tidak ada input untuk Botika.`
      }, { quoted: msg });
    }

    try {
      const res = await axios.get('https://api.vreden.my.id/api/v1/artificial/botika', {
        params: {
          prompt: promptText,
          username: 'user123'
        }
      });

      const replyText = res.data?.result ?? res.data?.response ?? 'Tidak ada jawaban dari Botika.';
      await conn.sendMessage(chatId, { text: replyText }, { quoted: msg });
    } catch (err) {
      console.error('Botika API Error:', err?.response?.data ?? err);
      await conn.sendMessage(chatId, {
        text: '❌ Gagal terhubung ke API Botika.'
      }, { quoted: msg });
    }
  }
};
