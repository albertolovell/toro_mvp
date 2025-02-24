import React from 'react';

const Notifications = ({ notifications, onStockSelect }) => {

  const handleStockClick = (stock) => {
    onStockSelect(stock);
  };

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index} onClick={() => handleStockClick(notification.stock)}>
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;