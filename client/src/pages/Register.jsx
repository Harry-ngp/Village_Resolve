import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { User, Mail, Lock, MapPin, UserCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    village: "",
    role: "citizen"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send data to backend (Backend sends OTP email)
      await API.post("/auth/register", formData);
      
      // 2. Success Feedback
      toast.success(`OTP Sent to ${formData.email}`);
      
      // 3. Redirect to Verify Page (Passing email via state)
      navigate("/verify-otp", { state: { email: formData.email } });

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 1. Use auth-container for the full-screen purple gradient */
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        /* 2. Use auth-card for the white box */
        className="auth-card"
      >
        {/* 3. Wrap header text in auth-header for correct spacing/fonts */ }
        <div className="auth-header">
            <h1>Join Us</h1>
            <p>Connect with your village & solve issues.</p>
        </div>

        <form onSubmit={handleRegister}>
          {/* Full Name */}
          <div className="input-wrapper">
            <User className="input-icon" size={20} />
            <input 
                name="name" 
                type="text" 
                placeholder="Full Name" 
                required 
                className="auth-input" 
                onChange={handleChange} 
            />
          </div>

          {/* Email */}
          <div className="input-wrapper">
            <Mail className="input-icon" size={20} />
            <input 
                name="email" 
                type="email" 
                placeholder="Email Address" 
                required 
                className="auth-input" 
                onChange={handleChange} 
            />
          </div>

          {/* Password */}
          <div className="input-wrapper">
            <Lock className="input-icon" size={20} />
            <input 
                name="password" 
                type="password" 
                placeholder="Password" 
                required 
                className="auth-input" 
                onChange={handleChange} 
            />
          </div>

          {/* Village */}
          <div className="input-wrapper">
            <MapPin className="input-icon" size={20} />
            <input 
                name="village" 
                type="text" 
                placeholder="Village Name" 
                required 
                className="auth-input" 
                onChange={handleChange} 
            />
          </div>

          {/* Role Selection */}
          <div className="input-wrapper">
            <UserCheck className="input-icon" size={20} />
            {/* Note: using auth-select here for the dropdown style */}
            <select name="role" className="auth-select" onChange={handleChange}>
              <option value="villager">I am a Citizen</option> 
              <option value="authority">I am an Authority</option>
            </select>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;