import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // <-- importer App à la place de HomePage

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
