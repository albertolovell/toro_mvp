const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => console.log('mongoose connected'));
mongoose.connection.on('error', (err) => console.error('mongoose failed: ', err));


const stockSchema = mongoose.Schema ({
  symbol: { type: String, unique: true, index: true },
  name: { type: String },
  data: {type: Object}
});

const watchlistSchema = mongoose.Schema ({
  stocks: [stockSchema]
});

const topSchema = mongoose.Schema ({
  stocks: [stockSchema],
  lastUpdated: { type: Date, default: Date.now }
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
const Stock = mongoose.model('Stock', stockSchema);
const Top = mongoose.model('Top', topSchema);

module.exports = { Watchlist, Stock, Top };

