import React, { useState } from 'react';

const Watchlist = ({ watchlist, onStockSelect }) => {


  return (
    <div className="watchlist">
      <h2>Watchlist</h2>
      <ul>
        {watchlist.map(stock => (
          <li key={stock.symbol} onClick={() => handleStockClick(stock)}>
            {stock.symbol} - {stock.name}
            <button onClick={() => handleRemoveStock(stock)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;