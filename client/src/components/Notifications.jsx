import React from 'react';
import ListCard from './ListCard.jsx';

const Notifications = ({ notifications, setNotifications, onStockSelect, onRemove }) => {

  const handleStockClick = (stock) => {
    onStockSelect(stock);
  };

  const handleRemove = (stock) => {
    onRemove(stock);
  };

  // const handleDelete = (stock) => {
  //   const updatedNotifications = notifications.filter(item => item.symbol !== stock.symbol);
  //   setNotifications(updatedNotifications);
  // }

  return (
    <div className="notifications">
      <h2>Notifications  ({notifications.length})</h2>
      <ul>
        {notifications.map((stock, index) => (
            <ListCard
              key={index}
              stock={stock}
              onAction={handleRemove}
              actionLabel="X"
              onClick={onStockSelect} />
          ))}
      </ul>
    </div>
  );
};

export default Notifications;