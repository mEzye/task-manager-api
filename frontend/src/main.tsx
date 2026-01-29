import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Import the Router provider
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 
      BrowserRouter wraps the application to enable routing features.
      It uses the HTML5 history API to keep UI in sync with the URL.
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)