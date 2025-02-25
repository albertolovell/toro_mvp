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
    const result = await yahooFinance.trendingSymbols('US');

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

    console.log('Fetching top stocks from Yahoo Finance');
    const result = await yahooFinance.trendingSymbols('US');
    const topStocks = result.quotes
      .filter(quote => quote.quoteType === 'EQUITY')
      .slice(0, 10);

    const stockDetailsPromises = topStocks.map(async (stock) => {
      try {
        const details = await yahooFinance.quote(stock.symbol);
        return {
          symbol: stock.symbol,
          name: details.longName || stock.symbol,
          data: details
        };
      } catch (err) {
        console.error('Failed to fetch stock details:', err.message);
        return null;
      }
    });

    const stockDetails = await Promise.all(stockDetailsPromises).filter(Boolean);
    if (stockDetails.length === 0) {
      return res.status(500).send('No stocks found');
    }

    await Top.findOneAndUpdate(
      {},
      { stocks: stockDetails, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    console.log('Top stocks updated in the database');
    res.status(200).send(stockDetails);
  } catch (err) {
    console.error('Error fetching top stocks:', err.message);
    res.status(500).send('Failed to fetch top stocks');
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