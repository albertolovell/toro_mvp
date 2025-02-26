import React from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const ListCard = ({ stock, priceData, onAction, actionLabel, onClick, compact }) => {

  const handleAction = (e) => {
    e.stopPropagation();
    onAction(stock);
  };

  const getPercentageChange = (open, current) => {
    if (open === 0) return '0%';
    return (((current - open) / open) * 100).toFixed(2) + '%';
  };

  return (
    <div className={`list-card ${compact ? 'compact' : ''}`} onClick={() => onClick(stock)}>
      <div className="stock-info">
        <h2 className="stock-symbol">{stock.symbol}</h2>
        <p className="stock-name">{stock.name}</p>
      </div>
      <div className="mini-chart">
        {Array.isArray(priceData) && priceData.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={70}
            min-width={100}>
            <LineChart data={priceData}>
              <XAxis dataKey="date" hide={true} />
              <YAxis hide={true} domain={['auto', 'auto']} />
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
      <p className="price">{`$${stock.data.regularMarketPrice.toFixed(2)}`}</p>
      <p
        className={`percent-change ${
          getPercentageChange(stock.data.regularMarketOpen, stock.data.regularMarketPrice).startsWith('-')
          ? 'negative'
          : 'positive'
      }`}>{getPercentageChange(stock.data.regularMarketOpen, stock.data.regularMarketPrice)}</p>
      <button
        className={`action-button ${actionLabel === 'X' ? 'close-button' : 'add-button'}`}
        onClick={handleAction}>{actionLabel}</button>
    </div>
  );
};

export default ListCard;