import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LayoutGrid, PlusSquare, FileText, UserCircle, LogOut, Hexagon } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { icon: LayoutGrid, label: "Overview", path: "/dashboard" },
    { icon: PlusSquare, label: "Report Issue", path: "#", action: true }, // Special action item
    { icon: FileText, label: "My Reports", path: "/my-reports" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
  ];

  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="sidebar-container"
    >
      <div className="logo-area">
        <Hexagon fill="white" size={32} />
        <span>Village<br/>Resolve</span>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
            onClick={item.action ? (e) => e.preventDefault() : null} // Prevent Nav for action items
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      <button onClick={handleLogout} className="nav-link" style={{ marginTop: 'auto', color: '#ff8a8a' }}>
        <LogOut size={20} /> Logout
      </button>
    </motion.aside>
  );
};

export default Sidebar;