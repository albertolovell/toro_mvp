import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const StockCard = ({ stock, onClose, priceData, predictedPrice, confidenceScore, addNotification, onSetNotification }) => {

  const [showModal, setShowModal] = useState(false);
  const [targetPrice, setTargetPrice] = useState(stock?.data?.regularMarketPrice || 0);
  const [condition, setCondition] = useState('above');

  const getPercentageChange = (open, current) => {
    if (open === 0) return '0%';
    return (((current - open) / open) * 100).toFixed(2) + '%';
  };

  const handleSetNotification = () => {
    onSetNotification(stock, targetPrice, condition);
    setShowModal(false);
  };


  return (
    <div className="stock-card">
      <h2>{stock.name}  ({stock.symbol})</h2>
      <div className="stock-card-header">
        {predictedPrice ? (
          <div className="stock-stats">
            <span
              className="current"
              title="The current market price of the stock, delayed by 30minutes"
              >Current Price: ${stock?.data?.regularMarketPrice?.toFixed(2)}</span>
            <span
              className="change"
              title="Percentage change from the market open price to the current price"
              >% Change:
                <span
                  className={`change-value ${getPercentageChange(stock?.data?.regularMarketOpen, stock?.data?.regularMarketPrice) >= 0 ? 'positive' : 'negative'}`}>
                {getPercentageChange(stock?.data?.regularMarketOpen, stock?.data?.regularMarketPrice)}
                </span>
              </span>
            <span
              className="predicted"
              title="Predicted price for tomorrow using TensorFlow.js, trained on the past month of historical data"
              >"Forecasted Price":
                <span className="predicted-value">
                  ${parseFloat(predictedPrice).toFixed(2)}
                </span>
            </span>
            <span
              className="confidence"
              title="Confidence level based on Root Mean Square Error (RMSE), representing the average deviation between predicted and actual prices in this model"
              >(RMSE): +/- ${confidenceScore}</span>

            {stock.targetPrice && (
              <span className="target">Target Price: {stock.condition} ${stock.targetPrice}</span>
            )}
          </div>
        ) : (<p className="loading-text">
                TensorFlow.js: Generating Price Forecast
                <span className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
            </p>)}
        <div className="stock-card-buttons">
          <button className="notify-button" onClick={() => setShowModal(true)}>+</button>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
      </div>

      <div className="price-action-chart">
        {Array.isArray(priceData) && priceData.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={400}>
            <LineChart
              data={priceData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0}}>
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']}/>
              <Tooltip
                contentStyle={{ backgroundColor: '#333', color: '#fff', borderRadius: '10px' }}
                itemStyle={{ color: '#82ca9d' }}
                labelStyle={{ color: '#8884d8' }}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}/>
              <CartesianGrid strokeDasharray="3 3" />
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8884d8" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="loading-chart">
            Loading price action chart
            <span className="loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
          </p>
        )}
      </div>
      {showModal && (
        <div className="notification-modal">
          <h2>Set Price Notification for {stock.symbol}</h2>
          <div>
            <label>Target Price:</label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(parseFloat(e.target.value))}/>
            <div>
              <label>
                <input
                  type="radio"
                  value="above"
                  checked={condition === 'above'}
                  onChange={() => setCondition('above')}/>Above Target
              </label>
              <label>
                <input
                  type="radio"
                  value="below"
                  checked={condition === 'below'}
                  onChange={() => setCondition('below')}/>Below Target
              </label>
            </div>
          </div>
          <button onClick={handleSetNotification}>Confirm</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default StockCard;