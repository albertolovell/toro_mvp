import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Watchlist from './Watchlist.jsx';
import StockCard from './StockCard.jsx';
import Notifications from './Notifications.jsx';
import Top10 from './Top10.jsx';


const App = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [query, setQuery] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [top10, setTop10] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const handleStockSelect = (stock) => setSelectedStock(stock);
  const handleStockClose = () => setSelectedStock(null);

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
            placeholder="Search for a stock"
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
              <Top10 top10={top10} onStockSelect={handleStockSelect} />
            )}
          </div>
        <div className="right-panel">
          <Watchlist watchlist={watchlist} onStockSelect={handleStockSelect} />
          <Notifications notifications={notifications} onStockSelect={handleStockSelect}/>
        </div>
      </div>
    </div>
  );
};

export default App;
