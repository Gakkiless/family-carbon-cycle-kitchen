import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppShell } from '@/src/components/AppShell'
import '@/app/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>,
)
