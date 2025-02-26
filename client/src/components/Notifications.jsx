import React from 'react';
import ListCard from './ListCard.jsx';

const Notifications = ({ notifications, setNotifications, onStockSelect, onRemove, priceData }) => {

  const handleStockClick = (stock) => {
    onStockSelect(stock);
  };

  const handleRemove = (stock) => {
    onRemove(stock);
  };


  return (
    <div className="notifications">
      <h2>Notifications  ({notifications.length})</h2>
      <ul>
        {notifications.map((stock, index) => (
            <ListCard
              key={index}
              stock={stock}
              priceData={priceData[stock.symbol] || []}
              onAction={handleRemove}
              actionLabel="X"
              onClick={onStockSelect}
              compact={true} />
          ))}
      </ul>
    </div>
  );
};

export default Notifications;