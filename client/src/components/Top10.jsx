import React, { useState } from 'react';

const Top10 = ({ top10, onStockSelect }) => {
  return (
    <div className="top10">
      <h2>Top 10 Stocks</h2>
      <ul>
        {Array.from({ length: 10 }, (_, index) => (
          <li key={index} onClick={() => onStockSelect({ symbol: `STOCK${index + 1}`, name: `Stock ${index + 1}` })}>
            Stock {index + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Top10;