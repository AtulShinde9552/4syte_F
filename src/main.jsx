import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PopupProvider } from './components/Popup.jsx'
import Startup from './components/Startup.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PopupProvider>
      <Startup />
    </PopupProvider>
  </StrictMode>,
)