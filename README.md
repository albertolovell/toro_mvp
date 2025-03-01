Toro MVP is a lightweight stock tracker designed to track trending stocks, enable personalized watchlists, and notify users when watched stocks reach a target price


Features:
  - Browse top 10 trending stocks fetched from Yahoo Finance API
  - Search and add stocks to a personalized watchlist
  - Set price alerts when stocks meet target conditions
  - Visualize stock data with mini charts and detailed analytics
  - Predict future prices using a linear regression model with TensorFlow.js (RMSE quality metric)
  - Sign in securely with Google authentication using Firebase


Navigation Demo:

![Toro MVP Navigation](./assets/toro_nav.gif)


Tech Stack:

Frontend:
  React.js, Axios, Recharts, TensorFlow.js

Backend:
  Node.js, Express, MongoDB/mongoose, Yahoo Finance API/yahoo-finance2, Firebase, AWS EC2


Installation & Setup:
  - Clone the repo
  - npm install
  - Replace variables in example.env and rename to .env
  - Start the server and client with npm run dev
  - The app will be available at http://localhost:3000

