// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';

import './css/styles.css';
import './css/custom-styles.css';
import './css/seat-plan.css';
import './css/booking-progress.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);