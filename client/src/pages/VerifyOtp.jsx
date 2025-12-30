import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { ShieldCheck, Loader2 } from "lucide-react";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { state } = useLocation(); // We get the email from the Register page
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the backend verify function
      const { data } = await API.post("/auth/verify-otp", { 
        email: state?.email, 
        otp 
      });

      // Login immediately after verification
      login(data);
      toast.success("Email Verified! Welcome.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Added justifyContent: 'center' to fix alignment
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="glass-card">
        <h1>Verify Email</h1>
        <p className="subtitle">Enter the code sent to {state?.email}</p>

        <form onSubmit={handleVerify}>
          {/* 2. Added maxWidth and margin to center & shrink the input bar */}
          <div className="input-group" style={{ maxWidth: '300px', margin: '0 auto 24px auto' }}>
            <ShieldCheck className="input-icon" size={20} />
            <input 
              type="text" 
              placeholder="6-Digit OTP" 
              maxLength="6"
              required 
              className="input-field"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              // 3. Adjusted padding and spacing for a cleaner look
              style={{ 
                letterSpacing: '8px', 
                fontSize: '1.2rem', 
                textAlign: 'center',
                paddingLeft: '10px', 
                paddingTop: '12px',
                paddingBottom: '12px'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;