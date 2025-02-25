import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const ListCard = ({ stock, priceData, onAction, actionLabel, onClick }) => {

  const handleAction = (e) => {
    e.stopPropagation();
    onAction(stock);
  };

  const getPercentageChange = (open, current) => {
    if (open === 0) return '0%';
    return (((current - open) / open) * 100).toFixed(2) + '%';
  };

  return (
    <div className="list-card" onClick={() => onClick(stock)}>
      <h2>{stock.symbol}</h2>
      <p>{stock.name}</p>
      <div className="mini-chart">
        {Array.isArray(priceData) && priceData.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={50}
            min-width={100}>
            <LineChart data={priceData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <span className="loading-text">...</span>
        )}
      </div>
      <p>{`$${stock.data.regularMarketPrice.toFixed(2)}`}</p>
      <p>{getPercentageChange(stock.data.regularMarketOpen, stock.data.regularMarketPrice)}</p>
      <button
        className={`action-button ${actionLabel === 'X' ? 'remove-button' : 'add-button'}`}
        onClick={handleAction}>{actionLabel}</button>
    </div>
  );
};

export default ListCard;