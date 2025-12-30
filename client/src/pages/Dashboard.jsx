import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ReportModal from "../components/ReportModal";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Bell, Plus, Filter, MapPin, ThumbsUp, 
  MessageCircle, TrendingUp, AlertTriangle, CheckCircle 
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Data (Replace with API later)
  const stats = [
    { title: "Critical Issues", value: "08", icon: AlertTriangle, theme: "grad-orange", sub: "Requires attention" },
    { title: "Resolved Cases", value: "142", icon: CheckCircle, theme: "grad-green", sub: "+12% this month" },
    { title: "Active Reports", value: "24", icon: TrendingUp, theme: "grad-blue", sub: "Currently tracking" },
  ];

  const reports = [
    { id: 1, title: "Broken Streetlight", location: "Sector 7 Market", status: "Pending", votes: 45, comments: 12, img: "💡" },
    { id: 2, title: "Water Pipe Leakage", location: "Main Village Road", status: "In Progress", votes: 89, comments: 34, img: "💧" },
    { id: 3, title: "Garbage Dump Overflow", location: "Near Primary School", status: "Resolved", votes: 120, comments: 56, img: "🗑️" },
    { id: 4, title: "Pothole on Highway", location: "Entrance Gate", status: "Pending", votes: 23, comments: 5, img: "🚧" },
  ];

  const filteredReports = filter === "All" ? reports : reports.filter(r => r.status === filter);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <main className="main-content">
        
        {/* --- TOP HEADER --- */}
        <header className="top-header">
          <div>
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.8rem' }}>Hello, {user?.name} 👋</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '5px 0 0 0' }}>Here's what's happening in <strong>{user?.village || "your village"}</strong>.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search color="white" size={18} style={{ position: 'absolute', left: '12px', top: '12px', opacity: 0.7 }} />
              <input type="text" placeholder="Search issues..." className="glass-input" style={{ paddingLeft: '40px' }} />
            </div>
            <button className="action-btn" style={{ padding: '10px', borderRadius: '50%', width: '45px', height: '45px', justifyContent: 'center' }}>
              <Bell size={20} />
            </button>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#6366f1' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* --- STATS GRID --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="stats-container"
        >
          {stats.map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} className="glass-panel">
              <div className={`stat-icon-box ${stat.theme}`}>
                <stat.icon size={24} />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0 0 5px 0', color: '#1e293b' }}>{stat.value}</h2>
              <h4 style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>{stat.title}</h4>
              <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="glass-panel" style={{ minHeight: '500px' }}>
          
          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{ 
                    padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                    background: filter === f ? '#6366f1' : '#f1f5f9',
                    color: filter === f ? 'white' : '#64748b',
                    fontWeight: '600', transition: 'all 0.3s'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            <button onClick={() => setIsModalOpen(true)} className="action-btn">
              <Plus size={18} /> Report Issue
            </button>
          </div>

          {/* Reports Grid */}
          <motion.div 
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}
          >
            <AnimatePresence>
              {filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <span style={{ fontSize: '2rem' }}>{report.img}</span>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', height: 'fit-content',
                      background: report.status === 'Resolved' ? '#dcfce7' : report.status === 'Pending' ? '#fee2e2' : '#fef3c7',
                      color: report.status === 'Resolved' ? '#166534' : report.status === 'Pending' ? '#991b1b' : '#92400e'
                    }}>
                      {report.status}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{report.title}</h3>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 20px 0' }}>
                    <MapPin size={14} /> {report.location}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                      <ThumbsUp size={16} /> {report.votes}
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                      <MessageCircle size={16} /> {report.comments}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;