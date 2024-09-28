import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApiCommunicatorMockup } from './modules/ApiCommunicator/ApiCommunicatorMockup.tsx'
import type { ApiCommunicator } from './modules/ApiCommunicator/ApiCommunicator.ts'

export const mockupApiCommunicator: ApiCommunicator = new ApiCommunicatorMockup();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
