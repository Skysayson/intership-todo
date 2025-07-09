import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store.js'
import { Provider } from 'react-redux'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <Provider store = {store}>
      <BrowserRouter>
        <App />
        </BrowserRouter>
      </Provider>
    </MantineProvider>
  </StrictMode>,
)
