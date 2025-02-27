import React, { useState } from 'react';
import ListCard from './ListCard';

const Top = ({ top, watchlist, setWatchlist, onStockSelect, watch, priceData }) => {



  return (
    <div>
      <div className="top-container">
        <ul className="top-list">
          {top.map((stock, index) => (
            <ListCard
              key={stock.symbol}
              stock={stock}
              priceData={priceData[stock.symbol] || []}
              onAction={watch}
              actionLabel="Add to Watchlist"
              onClick={onStockSelect} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Top;

// {
//   "symbol": "TSLA",
//   "name": "Tesla, Inc.",
//   "data": {
//       "region": "US",
//       "quoteType": "EQUITY",
//       "currency": "USD",
//       "exchange": "NMS",
//       "shortName": "Tesla, Inc.",
//       "longName": "Tesla, Inc.",
//       "regularMarketDayRange": {
//           "low": 324.7,
//           "high": 342.3973
//       },
//       "regularMarketDayLow": 324.7,
//       "regularMarketVolume": 75157805,
//       "regularMarketPreviousClose": 337.8,
//       "bid": 330.34,
//       "ask": 330.8,
//       "fullExchangeName": "NasdaqGS",
//       "financialCurrency": "USD",
//       "regularMarketOpen": 338.1,
//       "averageDailyVolume3Month": 79745956,
//       "averageDailyVolume10Day": 76793740,
//       "fiftyTwoWeekLowChange": 191.73,
//       "fiftyTwoWeekLowChangePercent": 1.38134,
//       "fiftyTwoWeekRange": {
//           "low": 138.8,
//           "high": 488.54
//       },
//       "sharesOutstanding": 3216519936,
//       "marketCap": 1063156318208,
//       "gmtOffSetMilliseconds": -18000000,
//       "market": "us_market",
//       "regularMarketChangePercent": -2.152158,
//       "regularMarketPrice": 330.53,
//       "displayName": "Tesla",
//       "symbol": "TSLA"
//   }
// }