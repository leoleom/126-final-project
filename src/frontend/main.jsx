import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "react-hot-toast";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#eef3ef",
            color: "#26322B",
            border: "1px solid #d4ddd6",
            borderRadius: "16px",
            boxShadow: "0 12px 30px rgba(63,111,79,0.10)",
            fontSize: "14px",
            fontWeight: "600",
          },
          success: {
            iconTheme: {
              primary: "#3F6F4F",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#A85858",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </>
  </StrictMode>,
)
