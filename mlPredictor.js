import axios from 'axios';
import * as tf from '@tensorflow/tfjs';

async function getHistoricalPrices(symbol = 'bitcoin') {
  const url = `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=30&interval=daily`;

  try {
    const response = await axios.get(url);
    const prices = response.data.prices.map(p => p[1]);
    return prices;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error.message);
    return [];
  }
}

function normalize(tensor) {
  const min = tensor.min();
  const max = tensor.max();
  return tensor.sub(min).div(max.sub(min)).arraySync();
}

function denormalize(normValue, originalTensor) {
  const min = originalTensor.min().arraySync();
  const max = originalTensor.max().arraySync();
  return normValue * (max - min) + min;
}

async function trainAndPredict(prices) {
  const inputTensor = tf.tensor1d(prices);
  const normalized = normalize(inputTensor);

  const windowSize = 3;
  const xs = [], ys = [];

  for (let i = 0; i < normalized.length - windowSize; i++) {
    xs.push(normalized.slice(i, i + windowSize));
    ys.push(normalized[i + windowSize]);
  }

  const xsTensor = tf.tensor2d(xs);
  const ysTensor = tf.tensor1d(ys);

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [windowSize], units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  await model.fit(xsTensor, ysTensor, { epochs: 200, verbose: 0 });

  const lastWindow = normalized.slice(-windowSize);
  const input = tf.tensor2d([lastWindow]);
  const prediction = model.predict(input);

  const predictedNormalized = (await prediction.data())[0];
  const predicted = denormalize(predictedNormalized, inputTensor);
  const latest = prices[prices.length - 1];

  return predicted > latest
    ? '📈 Прогноз: возможен рост.'
    : '📉 Прогноз: возможен спад.';
}

export default async function predictWithML(symbol) {
  const prices = await getHistoricalPrices(symbol);
  if (prices.length < 5) return '⚠️ Недостаточно данных для прогноза.';
  return await trainAndPredict(prices);
};
