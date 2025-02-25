import React from 'react';

const Notifications = ({ notifications, setNotifications, onStockSelect }) => {

  const handleStockClick = (stock) => {
    onStockSelect(stock);
  };

  const handleDelete = (stock) => {
    const updatedNotifications = notifications.filter(item => item.symbol !== stock.symbol);
    setNotifications(updatedNotifications);
  }

  return (
    <div className="notifications">
      <h2>Notifications  ({notifications.length})</h2>
      <ul>
        {notifications.map((stock, index) => (
            <ListCard
              key={index}
              stock={stock}
              onAction={handleDelete}
              actionLabel="X"
              onClick={onStockSelect} />
          ))}
      </ul>
    </div>
  );
};

export default Notifications;