import React from 'react';

const StockCard = ({ stock, onClose }) => {

  const getPercentageChange = (open, current) => {
    if (open === 0) return '0%';
    return (((current - open) / open) * 100).toFixed(2) + '%';
  };


  return (
    <div className="stock-card">
      <h2>{stock.name}  ({stock.symbol})</h2>
      <button className="close-button" onClick={onClose}>X</button>
    </div>
  );
};

export default StockCard;