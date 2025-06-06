import TelegramBot from 'node-telegram-bot-api';
import { generateSummary } from './gptCommenter.js';
import  predictWithML  from './mlPredictor.js';
import Parser from 'rss-parser';
import Sentiment from 'sentiment';
import dotenv from 'dotenv';

dotenv.config();


const rssParser = new Parser();
const sentiment = new Sentiment();


const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// /start — приветствие
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcome = `👋 Привет, ${msg.from.first_name}!

Я — бот для анализа крипторынка.
Доступные команды:
/news — новости с прогнозом
/ml <coin> — прогноз по ML (например, /ml bitcoin)`;
  bot.sendMessage(chatId, welcome);
});

// /news — новости с анализом и GPT-ответом
bot.onText(/\/news/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '📡 Собираю свежие новости CoinDesk...');

  try {
    const feed = await rssParser.parseURL('https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml');
    const topNews = feed.items.slice(0, 5);
    let response = '📰 *Анализ новостей CoinDesk:*\n\n';

    for (const item of topNews) {
      const text = item.title + '. ' + item.contentSnippet;
      const sentimentResult = sentiment.analyze(text);
      const score = sentimentResult.score;

      let emoji = '🟡';
      if (score > 2) emoji = '🟢';
      else if (score < -2) emoji = '🔴';

      const gptComment = await generateSummary(text);
      response += `${emoji} [${item.title}](${item.link})\n🧠 ${gptComment}\n\n`;
    }

    bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Ошибка при получении новостей:', error);
    bot.sendMessage(chatId, '❌ Не удалось загрузить новости.');
  }
});

// /ml <coin> — ML прогноз
bot.onText(/\/ml (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const coin = match[1].toLowerCase();

  bot.sendMessage(chatId, `🤖 Анализирую ${coin} с помощью ML...`);
  const result = await predictWithML(coin);
  bot.sendMessage(chatId, result);
});