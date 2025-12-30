import { Search, Bell, User } from "lucide-react";

const TopBar = ({ user }) => {
  return (
    <div className="top-bar">
      {/* Search Section */}
      <div className="search-box">
        <Search size={18} color="#94a3b8" />
        <input type="text" placeholder="Search issues, villages..." className="search-input" />
      </div>

      {/* Actions Section */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', color: '#1e293b' }}>
              {user?.name || "User"}
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Citizen"}
            </p>
          </div>
          <div className="icon-btn" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            <User size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;