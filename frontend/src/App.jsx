import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;