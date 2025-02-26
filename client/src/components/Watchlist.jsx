import React, { useState } from 'react';
import ListCard from './ListCard.jsx';

const Watchlist = ({ watchlist, setWatchlist, onStockSelect, onRemove }) => {

  const handleRemove = (stock) => {
    onRemove(stock);
  };

  return (
    <div className="watchlist">
      <h2>Watchlist  ({watchlist.length})</h2>
      <ul>
        {watchlist.map((stock, index) => (
          <ListCard
            key={index}
            stock={stock}
            onAction={handleRemove}
            actionLabel="X"
            onClick={onStockSelect}
            compact={true} />
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;