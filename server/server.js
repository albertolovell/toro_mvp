require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const { fetch, Headers, Request, Response} = require('undici');
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

const yahooFinance = require('yahoo-finance2').default;
const { Watchlist, Stock, Top } = require('./db.js');


const app = express();

app.use(express.json());
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

app.get('/api/seed/top', async (req, res) => {
  try {
    console.log('Seeding top stocks');
    const queryOptions = { count: 10 };
    const result = await yahooFinance.trendingSymbols('US', queryOptions);

    if (!result || !result.quotes) {
      throw new Error('No trending stocks found');
    }

    const topStocks = result.quotes

    const stockDetailsPromises = topStocks.map(stock =>
      yahooFinance.quote(stock.symbol)
        .then(details => ({
          symbol: stock.symbol,
          name: details.longName || stock.symbol,
          data: details
        }))
        .catch(err => {
          console.error('Failed to fetch stock details:', err.message);
          return null;
        })
    );


    const stockDetails = (await Promise.all(stockDetailsPromises));

    if (stockDetails.length === 0) {
      return res.status(500).send('No stocks found');
    }

    await Top.deleteMany({});
    const newTop = new Top({ stocks: stockDetails, lastUpdated: new Date() });
    await newTop.save();

    console.log('Top stocks seeded in the database');
    res.status(200).send(stockDetails);
  } catch (err) {
    console.error('Error seeding top stocks:', err.message);
    res.status(500).send('Failed to seed top stocks');
  }
});

app.get('/api/top', async (req, res) => {
  try {
    const THIRTY_MINUTES = 30 * 60 * 1000;

    const existingTop = await Top.findOne().sort({ lastUpdated: -1 });
    if (existingTop && (Date.now() - existingTop.lastUpdated.getTime()) < THIRTY_MINUTES) {
      console.log('Using cached top stocks');
      return res.status(200).send(existingTop.stocks);
    }

    console.log('Cached data expired. Fetching top stocks...');

    const seedResponse = await fetch(`http://localhost:${process.env.PORT}/api/seed/top`);

    if (!seedResponse.ok) {
      throw new Error('Failed to seed top stocks');
    }

    const seedData = await seedResponse.json();
    res.status(200).send(seedData);
  } catch (err) {
    console.error('Error fetching top stocks:', err.message);
    res.status(500).send('Failed to fetch top stocks');
  }
});

app.post('/api/watchlist', async (req, res) => {
  const { stocks } = req.body;
  try {
    let watchlist = await Watchlist.findOne();

    if (!watchlist) {
      watchlist = new Watchlist({ stocks: [] });
    }

    watchlist.stocks = stocks;
    await watchlist.save();

    res.status(200).send('watchlist updated');
  } catch (err) {
    console.error('Failed to update watchlist:', err.message);
    return res.status(500).send('Failed to update watchlist');
  }
});

app.delete('/api/price/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    const data = await yahooFinance.historical(symbol, { period1: '2023-01-01', period2: new Date().toISOString().split('T')[0] });
    const priceData = data.map(item => ({
      date: item.date.split('T')[0],
      price: item.close
    }));
    res.status(200).send(priceData);
  } catch (err) {
    console.error('Failed to fetch historical data:', err.message);
    res.status(500).send('Failed to fetch historical data');
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`listening at port: ${PORT}`);

module.exports = app;