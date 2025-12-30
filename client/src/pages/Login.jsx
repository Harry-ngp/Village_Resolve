import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 1. Use 'auth-container' instead of inline styles */
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        /* 2. Use 'auth-card' so it becomes white */
        className="auth-card"
      >
        <div className="auth-header">
            <h1>Village Resolve</h1>
            <p>Sign in to report issues & help your community.</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          {/* 3. Use 'input-wrapper' to position the icon correctly */}
          <div className="input-wrapper">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              /* 4. Use 'auth-input' for the styling */
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-wrapper">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 5. Use 'auth-btn' for the purple button */}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <>Login <LogIn size={20} /></>}
          </button>
        </form>

        <div className="auth-footer">
          New here? <Link to="/register" className="auth-link">Create an Account</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;