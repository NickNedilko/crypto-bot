# Crypto News Telegram Bot

A Telegram bot for analyzing cryptocurrency market news by parsing RSS feeds, performing sentiment analysis, generating forecasts using OpenAI GPT-4o, and making price predictions with a TensorFlow.js ML model based on historical data.

---

## 🚀 Features

- Fetch and analyze the latest crypto news from CoinDesk RSS feed
- Simple sentiment analysis of news articles
- Generate brief growth or decline forecasts using OpenAI GPT-4o
- Machine Learning price prediction for selected cryptocurrencies using historical data (TensorFlow.js)
- Telegram commands:
  - `/start` — greeting and command list
  - `/news` — latest news with analysis and GPT-generated forecasts
  - `/ml <coin>` — ML-based price prediction for a cryptocurrency (e.g., `/ml bitcoin`)

---

## 📋 Requirements

- Node.js v18 or higher (recommended)
- Telegram bot token
- OpenAI API key

---

🤖 Usage
Send /start to get a welcome message and list of commands.

Send /news to receive the latest crypto news with sentiment and GPT forecasts.

Send /ml bitcoin (replace bitcoin with any supported crypto symbol) to get an ML-based price trend prediction.

📦 How It Works
Parses CoinDesk RSS feed for fresh crypto news.

Performs sentiment analysis on news headlines and snippets.

Sends news items to OpenAI GPT-4o to generate concise market forecasts.

For /ml commands, fetches last 30 days of price data from CoinGecko, trains a simple TensorFlow.js model, and predicts price movement (growth or decline).
