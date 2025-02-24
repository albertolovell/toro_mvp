import React from 'react';

const StockCard = ({ stock, onClose }) => {

  return (
    <div className="stock-card">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Stock Card placeholder</h2>
    </div>
  );
};

export default StockCard;