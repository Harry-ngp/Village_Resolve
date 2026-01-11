import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { User, MapPin, Mail, Shield, Save, Edit2, Loader2 } from "lucide-react";

const Profile = () => {
  const { user, login } = useContext(AuthContext); // 'login' updates the local user state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    village: user?.village || ""
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/auth/update', formData);
      
      // Update global context with new user data
      login({ token: localStorage.getItem('token'), user: data }); 
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel" 
            style={{ maxWidth: '600px', width: '100%', padding: '40px', position: 'relative' }}
        >
          {/* Header / Avatar */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ 
                width: '100px', height: '100px', margin: '0 auto 15px auto', 
                background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', fontWeight: 'bold', color: 'white', boxShadow: '0 10px 20px rgba(99,102,241,0.3)'
            }}>
                {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ margin: 0 }}>{user?.name}</h2>
            <p style={{ color: '#64748b', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>

          {/* Details Form */}
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gap: '20px' }}>
                
                {/* Email (Read Only) */}
                <div style={{ background: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #e2e8f0' }}>
                    <Mail size={20} color="#6366f1" />
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Email Address</label>
                        <div style={{ fontWeight: '500', color: '#475569' }}>{user?.email}</div>
                    </div>
                    <Shield size={16} color="#10b981" /> {/* Verified Icon */}
                </div>

                {/* Name Field */}
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <User className="input-icon" size={20} style={{ color: '#64748b' }} />
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!isEditing}
                        className="input-field"
                        style={{ background: isEditing ? 'white' : 'transparent', border: isEditing ? '1px solid #cbd5e1' : 'none', paddingLeft: '45px', color: '#1e293b' }}
                    />
                </div>

                {/* Village Field */}
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <MapPin className="input-icon" size={20} style={{ color: '#64748b' }} />
                    <input 
                        type="text" 
                        value={formData.village}
                        onChange={(e) => setFormData({...formData, village: e.target.value})}
                        disabled={!isEditing}
                        className="input-field"
                        style={{ background: isEditing ? 'white' : 'transparent', border: isEditing ? '1px solid #cbd5e1' : 'none', paddingLeft: '45px', color: '#1e293b' }}
                    />
                </div>

            </div>

            {/* Actions */}
            <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                {!isEditing ? (
                    <button 
                        type="button" 
                        onClick={() => setIsEditing(true)}
                        className="btn-primary" 
                        style={{ background: '#334155', width: '100%' }}
                    >
                        <Edit2 size={18} /> Edit Profile
                    </button>
                ) : (
                    <>
                        <button 
                            type="button" 
                            onClick={() => { setIsEditing(false); setFormData({name: user.name, village: user.village}) }}
                            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#e2e8f0', cursor: 'pointer', fontWeight: '600' }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-primary" 
                            style={{ flex: 1 }}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                        </button>
                    </>
                )}
            </div>
          </form>

        </motion.div>
      </main>
    </div>
  );
};

export default Profile;