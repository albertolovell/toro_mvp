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

  handleSetNotification = () => {
    onSetNotification(stock, targetPrice, condition);
    setShowModal(false);
  };


  return (
    <div className="stock-card">
      <h2>{stock.name}  ({stock.symbol})</h2>
      <div className="stock-card-buttons">
        <button className="notify-button" onClick={() => setShowModal(true)}>+</button>
        <button className="close-button" onClick={onClose}>X</button>
      </div>

      {predictedPrice ? (
        <>
          <span className="current">Current Price: ${stock?.data?.regularMarketPrice?.toFixed(2)}</span>
          <span className="change">% Change: {getPercentageChange(stock?.data?.regularMarketOpen, stock?.data?.regularMarketPrice)}</span>
          <span className="predicted">"Tomorrow's Price": ${parseFloat(predictedPrice).toFixed(2)}</span>
          <span className="confidence">RMSE: +/-${confidenceScore}</span>
        </>
      ) : (<p className="loading-text">Loading stats...</p>)}

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
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="loading-text">Loading price action data...</p>
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