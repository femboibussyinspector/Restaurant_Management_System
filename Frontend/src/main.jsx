import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App' 

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Tell React to render our App router */}
    <App />
  </React.StrictMode>,
)
