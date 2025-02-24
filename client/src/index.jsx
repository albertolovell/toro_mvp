import React from 'react';
import App from './components/App.jsx';
import { createRoot } from 'react-dom/client';
import './styles/styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);