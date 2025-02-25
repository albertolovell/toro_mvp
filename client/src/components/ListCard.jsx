import React from 'react';

const ListCard = ({ stock, onAction, actionLabel }) => {

  const handleAction = (e) => {
    e.stopPropagation();
    onAction(stock);
  };

  const getPercentageChange = (open, current) => {
    if (open === 0) return '0%';
    return (((current - open) / open) * 100).toFixed(2) + '%';
  };

  return (
    <div className="list-card">
      <h2>{stock.symbol}</h2>
      <p>{stock.name}</p>
      <p>{`$${stock.data.regularMarketPrice.toFixed(2)}`}</p>
      <p>{getPercentageChange(stock.data.regularMarketOpen, stock.data.regularMarketPrice)}</p>
      <button
        className={`action-button ${actionLabel === 'X' ? 'remove-button' : 'add-button'}`}
        onClick={handleAction}>{actionLabel}</button>
    </div>
  );
};

export default ListCard;