require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
global.fetch = fetch;

const yahooFinance = require('yahoo-finance2').default;
const { Watchlist, Stock } = require('./db.js');




const app = express();

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).send('Query parameter is required');
  }

  try {
    const results = await yahooFinance.quote(query);
    res.status(200).send(results.quotes || []);
  } catch (err) {
    console.error(err);
    return res.status(500).send('search fetch failed');
  }
});

app.get('/api/top', async (req, res) => {
  try {
    const response = await axios.get('https://api.stocktwits.com/api/2/trending/symbols.json');
    const top10 = response.data.symbols.slice(0, 10);
    res.status(200).send(top10);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/watchlist', async (req, res) => {
  const watchlist = await Watchlist.findOne() || { stocks: [] };
  res.status(200).send(watchlist.stocks);
});

app.post('/api/watchlist', async (req, res) => {
  const { symbol } = req.body;
  let watchlist = await Watchlist.findOne();
  if (!watchlist) {
    watchlist = new Watchlist({ stocks: [] });
  }
  watchlist.stocks = watchlist.stocks.filter(stock => stock.symbol !== symbol);
  await watchlist.save();
  res.status(200).send(watchlist.stocks);
});

app.delete('/api/watchlist/:symbol', async (req, res) => {
  const { symbol } = req.params;
  let watchlist = await Watchlist.findOne();
  if (watchlist) {
    watchlist.stocks = watchlist.stocks.filter(stock => stock.symbol !== symbol);
    await watchlist.save();
  }
  res.status(200).send(watchlist ? watchlist.stocks : []);
});



const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`listening at port: ${PORT}`);

module.exports = app;