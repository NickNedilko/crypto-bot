import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });



export async function generateSummary(newsText) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Ты эксперт крипторынка. Дай краткий прогноз по новости: рост, падение или нейтрально.',
        },
        {
          role: 'user',
          content: newsText,
        },
      ],
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error);
    return '🤖 Не удалось сгенерировать прогноз.';
  }
}