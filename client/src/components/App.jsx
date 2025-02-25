import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Watchlist from './Watchlist.jsx';
import StockCard from './StockCard.jsx';
import Notifications from './Notifications.jsx';
import Top from './Top.jsx';


const App = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [query, setQuery] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [top, setTop] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const handleStockSelect = (stock) => setSelectedStock(stock);
  const handleStockClose = () => setSelectedStock(null);

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

  const handleSearch = async () => {
    const sanitized = query.trim().toUpperCase();
    if (!sanitized) return;

    try {
      const response = await axios.get(`/api/search?query=${sanitized}`);
      if (response.data.length > 0) {
        setSelectedStock(response.data[0]);
      } else {
        alert('No results found');
      }
    } catch (err) {
      console.error('search failed', err);
    }
  };


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
              <StockCard stock={selectedStock} onClose={handleStockClose} />
            ) : (
              <Top
                top={top}
                onStockSelect={setSelectedStock}
                watch={handleAddToWatchlist} />
            )}
          </div>
        <div className="right-panel">
          <Watchlist
            watchlist={watchlist}
            setWatchlist={setWatchlist}
            onStockSelect={handleStockSelect}
            onRemove={handleRemove} />
          <Notifications
            notifications={notifications}
            onStockSelect={handleStockSelect} />
        </div>
      </div>
    </div>
  );
};

export default App;
