import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Watchlist from './Watchlist.jsx';
import StockCard from './StockCard.jsx';
import Notifications from './Notifications.jsx';
import Top from './Top.jsx';
import * as tf from '@tensorflow/tfjs';


const App = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [query, setQuery] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [top, setTop] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [priceData, setPriceData] = useState({});
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);

  const handleStockSelect = (stock) => setSelectedStock(stock);
  const handleStockClose = () => setSelectedStock(null);

  const handleAddToWatchlist = (stock) => {
    setWatchlist(prevWatchlist => {
      const exists = prevWatchlist.some(item => item.symbol === stock.symbol);
      if (exists) {
        alert('Stock already in watchlist');
        return prevWatchlist;
      }
      const updatedWatchlist = [...prevWatchlist, stock];

      axios.post('/api/watchlist', {stocks: updatedWatchlist})
        .then(() => console.log('db updated'))
        .catch(err => console.error('Failed to update watchlist in db', err));

        return updatedWatchlist;
    });
  };

  const handleRemove = (stock) => {
    const updatedWatchlist = watchlist.filter(item => item.symbol !== stock.symbol);
    setWatchlist(updatedWatchlist);

    axios.post('/api/watchlist', {stocks: updatedWatchlist})
      .then(() => console.log('db updated'))
      .catch(err => console.error('Failed to update watchlist in db', err));
  };

  const trainAndPredict = async (data, symbol) => {
    if (!Array.isArray(data) || data.length < 2) return;

    const dates = data.map((_, index) => index);
    const prices = data.map(item => item.price);

    const maxDate = Math.max(...dates);
    const normalizedDates = dates.map(date => date / maxDate);

    const xs = tf.tensor1d(normalizedDates);
    const ys = tf.tensor1d(prices);

    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [1], units: 1 }));

    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

    await model.fit(xs, ys, { epochs: 200 });

    const nextDay = (dates.length + 1) / maxDate;
    const prediction = model.predict(tf.tensor1d([nextDay]));
    let predictedPrice = prediction.dataSync()[0];

    if (predictedPrice < 0 || !isFinite(predictedPrice)) {
      predictedPrice = prices[prices.length - 1];
    }

    setPredictedPrice(predictedPrice.toFixed(2));

    const predictedYs = model.predict(xs).reshape([ys.shape[0]]);
    const mseTensor = tf.losses.meanSquaredError(ys, predictedYs);
    const mse = mseTensor.dataSync()[0];
    const confidence = Math.sqrt(mse).toFixed(2);

    setConfidenceScore(confidence);
  };

  const fetchPriceData = async (symbol) => {
    try {
      const response = await axios.get(`/api/price/${symbol}`);
      setPriceData(prev => ({ ...prev, [symbol]: response.data }));
      await trainAndPredict(response.data, symbol);
    } catch (err) {
      console.error('Failed to fetch historical data', err);
    }
  };

  const handleSearch = async () => {
    const sanitized = query.trim().toUpperCase();
    if (!sanitized) return;

    try {
      const response = await axios.get(`/api/search?query=${sanitized}`);
      console.log('search results', response.data);
      if (response.data.length > 0) {
        const stock = response.data[0];

        setSelectedStock(stock);
        await fetchPriceData(stock.symbol);
      } else {
        alert('No results found');
      }
    } catch (err) {
      console.error('search failed', err);
    }
  };

  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        const response = await axios.get('/api/top');
        setTop(response.data);
      } catch (err) {
        console.error('Failed to fetch top stocks', err);
      }
    };

    const fetchWatchlist = async () => {
      try {
        const response = await axios.get('/api/watchlist');
        setWatchlist(response.data);
      } catch (err) {
        console.error('Failed to fetch watchlist', err);
      }
    };

    fetchTopStocks();
    fetchWatchlist();
  }, []);

  useEffect(() => {
    top.forEach(stock => fetchPriceData(stock.symbol));
  }, [top]);

  useEffect(() => {
    if (selectedStock) {
      fetchPriceData(selectedStock.symbol);
    }
  }, [selectedStock]);

  useEffect(() => {
    if (selectedStock && priceData[selectedStock.symbol]) {
      trainAndPredict(priceData[selectedStock.symbol], selectedStock.symbol);
    }
  }, [selectedStock, priceData]);


  return (
    <div className="app">
      <div className="header">
        <div className="logo">
          <h1>TORO MVP</h1>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a ticker, ex: AAPL"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
            <button onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="main-content">
          <div className="dashboard">
            {selectedStock ? (
              <StockCard
                stock={selectedStock}
                onClose={handleStockClose}
                priceData={priceData[selectedStock.symbol]}
                predictedPrice={predictedPrice}
                confidenceScore={confidenceScore}
                onClose={() => setSelectedStock(null)} />
            ) : (
              <Top
                top={top}
                onStockSelect={setSelectedStock}
                watch={handleAddToWatchlist}
                priceData={priceData} />
            )}
          </div>
        <div className="right-panel">
          <Notifications
            notifications={notifications}
            onStockSelect={handleStockSelect} />
          <Watchlist
            watchlist={watchlist}
            setWatchlist={setWatchlist}
            onStockSelect={handleStockSelect}
            onRemove={handleRemove} />
        </div>
      </div>
    </div>
  );
};

export default App;
