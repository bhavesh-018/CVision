import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import CoachPage from "./pages/CoachPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0f172a',
            color: '#f1f5f9',
            border: '1px solid #1e3a5f',
            borderRadius: '14px',
            padding: '12px 18px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#0f172a',
            },
            style: {
              background: '#0f172a',
              color: '#f1f5f9',
              border: '1px solid #16a34a',
              borderRadius: '14px',
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 32px rgba(22,163,74,0.2)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0f172a',
            },
            style: {
              background: '#0f172a',
              color: '#f1f5f9',
              border: '1px solid #dc2626',
              borderRadius: '14px',
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 32px rgba(239,68,68,0.2)',
            },
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        
        <Route
          path="/chat"
          element={<ChatPage />}
        />

        <Route
          path="/coach"
          element={<CoachPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;