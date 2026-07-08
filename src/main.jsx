import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Pubd visual editor: when this site is framed by the CMS with ?pubd-edit, load
// the edit bridge (dynamic import — normal visitors never download a byte of it).
if (window.self !== window.top && new URLSearchParams(window.location.search).has('pubd-edit')) {
  import('./pubd-edit-bridge.js')
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
