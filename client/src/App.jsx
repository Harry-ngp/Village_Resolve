import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "./context/AuthContext"; // Import AuthContext

// Import Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard"; 
import LandingPage from "./pages/LandingPage";

function App() {
  const { user } = useContext(AuthContext); // Get current user status

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* 1. Root Route: Show Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* 2. Auth Routes: Redirect to Dashboard if already logged in */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/dashboard" />} 
        />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        
        {/* 3. Protected Route: Redirect to Login if NOT logged in */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;