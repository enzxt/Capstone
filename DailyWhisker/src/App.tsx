import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ForgotPassword from './Pages/ForgotPassword.tsx';
import AppBackground from "./assets/AppBackground.tsx";
import Login from "./Pages/Login.tsx";
import Register from "./Pages/Register.tsx";
import Home from "./Pages/Home.tsx";
import Bookmarks from './Pages/BookmarksPage.tsx'
import Settings from './Pages/Settings.tsx'
import Cat from './components/Cat.tsx'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
    <AppBackground />

    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login onAuthSuccess={() => setIsAuthenticated(true)} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/cat" element={<Cat />} />
    </Routes>
  </Router>
);
}

export default App;
