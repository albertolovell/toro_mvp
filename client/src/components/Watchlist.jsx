import React, { useState } from 'react';
import ListCard from './ListCard.jsx';

const Watchlist = ({ watchlist, setWatchlist, onStockSelect }) => {

  const handleRemove = (stock) => {
    const updatedWatchlist = watchlist.filter(item => item.symbol !== stock.symbol);
    setWatchlist(updatedWatchlist);
  }

  return (
    <div className="watchlist">
      <h2>Watchlist</h2>
      <ul>
        {watchlist.map(stock => (
          <ListCard
            key={stock._id}
            stock={stock}
            onAction={handleRemove}
            actionLabel="X"
            onClick={onStockSelect} />
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;