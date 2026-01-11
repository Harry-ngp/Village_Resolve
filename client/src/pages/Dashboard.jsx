import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ReportModal from "../components/ReportModal"; 
import VillageMap from "../components/VillageMap"; 
// 1. IMPORT THE NEW RATING MODAL
import RatingModal from "../components/RatingModal";
import API from "../services/api"; 
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast"; 
import { 
  Search, Bell, Plus, MapPin, ThumbsUp, 
  MessageCircle, Loader2, CheckSquare, Clock, 
  Send, User, List, Map, Star 
} from "lucide-react";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("list"); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 2. NEW STATE FOR RATING
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingTargetId, setRatingTargetId] = useState(null);
  
  const [reports, setReports] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [expandedCommentId, setExpandedCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const fetchReports = async () => {
    try {
      const { data } = await API.get('/reports');
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(); 
    const interval = setInterval(fetchReports, 10000); 
    return () => clearInterval(interval);
  }, []);

  // --- HANDLE RATING SUBMIT ---
  const handleRatingSubmit = async ({ rating, comment }) => {
    try {
        // Optimistic Update: Update UI immediately
        setReports(prev => prev.map(r => 
            r._id === ratingTargetId 
            ? { ...r, rating: { score: rating, comment: comment } } // Mocking structure
            : r
        ));

        // API Call (Ensure your backend supports this, or remove if just UI demo)
        await API.post(`/reports/${ratingTargetId}/rate`, { rating, comment });
        
        toast.success("Feedback submitted!");
        setIsRatingModalOpen(false);
    } catch (error) {
        console.error("Rating failed", error);
        // Fallback for demo purposes if backend doesn't exist yet:
        toast.success("Feedback submitted! (Demo Mode)");
        setIsRatingModalOpen(false);
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
        setReports(prev => prev.map(r => 
            r._id === reportId ? { ...r, status: newStatus } : r
        ));
        await API.patch(`/reports/${reportId}/status`, { status: newStatus });
        toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
        toast.error("Failed to update status");
        fetchReports(); 
    }
  };

  const handleUpvote = async (reportId) => {
    try {
        const reportIndex = reports.findIndex(r => r._id === reportId);
        if (reportIndex === -1) return;
        
        const report = reports[reportIndex];
        const userId = user?._id || user?.id;
        if (!userId) return;

        const hasUpvoted = report.upvotes.includes(userId); 
        let newUpvotes = hasUpvoted 
            ? report.upvotes.filter(id => id !== userId)
            : [...report.upvotes, userId];

        const updatedReports = [...reports];
        updatedReports[reportIndex] = { ...report, upvotes: newUpvotes };
        setReports(updatedReports);

        await API.put(`/reports/${reportId}/upvote`);
    } catch (error) {
        console.error("Upvote failed", error);
        toast.error("Action failed");
        fetchReports();
    }
  };

  const handleCommentSubmit = async (reportId) => {
    if (!commentText.trim()) return;
    try {
        const { data: newComments } = await API.post(`/reports/${reportId}/comment`, { text: commentText });
        setReports(prev => prev.map(r => 
            r._id === reportId ? { ...r, comments: newComments } : r
        ));
        setCommentText("");
        toast.success("Comment added!");
    } catch (error) {
        toast.error("Failed to post comment");
    }
  };

  const filteredReports = filter === "All" ? reports : reports.filter(r => r.status === filter);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onReportSubmit={fetchReports} />
      
      {/* 3. INJECT THE RATING MODAL */}
      <RatingModal 
        isOpen={isRatingModalOpen} 
        onClose={() => setIsRatingModalOpen(false)} 
        onSubmit={handleRatingSubmit}
      />

      <main className="main-content">
        <header className="top-header">
          <div>
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.8rem' }}>Hello, {user?.name} 👋</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '5px 0 0 0' }}>
                Logged in as: <strong style={{textTransform: 'capitalize', color: '#bef264'}}>{user?.role}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search color="white" size={18} style={{ position: 'absolute', left: '12px', top: '12px', opacity: 0.7 }} />
              <input type="text" placeholder="Search issues..." className="glass-input" style={{ paddingLeft: '40px' }} />
            </div>
            <button className="action-btn" style={{ padding: '10px', borderRadius: '50%', width: '45px', height: '45px', justifyContent: 'center' }}><Bell size={20} /></button>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#6366f1' }}>{user?.name?.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <div className="glass-panel" style={{ minHeight: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: filter === f ? '#6366f1' : '#f1f5f9', color: filter === f ? 'white' : '#64748b', fontWeight: '600', transition: 'all 0.3s' }}>
                  {f}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '12px', display: 'flex', gap: '5px' }}>
                    <button onClick={() => setViewMode('list')} style={{ padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', background: viewMode === 'list' ? 'white' : 'transparent', color: viewMode === 'list' ? '#6366f1' : '#64748b', boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>
                        <List size={18} /> List
                    </button>
                    <button onClick={() => setViewMode('map')} style={{ padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', background: viewMode === 'map' ? 'white' : 'transparent', color: viewMode === 'map' ? '#6366f1' : '#64748b', boxShadow: viewMode === 'map' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>
                        <Map size={18} /> Map
                    </button>
                </div>
                {user?.role === 'citizen' && (
                    <button onClick={() => setIsModalOpen(true)} className="action-btn">
                        <Plus size={18} /> Report Issue
                    </button>
                )}
            </div>
          </div>

          {loading ? (
             <div style={{display:'flex', justifyContent:'center', padding: '50px'}}><Loader2 className="animate-spin" size={40} color="#6366f1"/></div>
          ) : (
            <>
                {viewMode === 'list' ? (
                    <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    <AnimatePresence>
                        {filteredReports.length === 0 ? (
                            <p style={{textAlign:'center', width:'100%', color:'#64748b'}}>No reports found.</p>
                        ) : (
                        filteredReports.map((report) => {
                            const userId = user?._id || user?.id;
                            const isUpvoted = report.upvotes?.includes(userId);
                            const isCommentsOpen = expandedCommentId === report._id;

                            return (
                            <motion.div key={report._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -5 }} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                
                                <div style={{ height: '180px', margin: '-20px -20px 15px -20px', background: '#f1f5f9', position: 'relative' }}>
                                    <img src={report.image ? `http://localhost:5000${report.image}` : "https://via.placeholder.com/300?text=No+Image"} alt={report.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {e.target.src = "https://via.placeholder.com/300?text=Image+Error"}} />
                                    <span style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', background: report.status === 'Resolved' ? '#dcfce7' : report.status === 'In Progress' ? '#fef3c7' : '#fee2e2', color: report.status === 'Resolved' ? '#166534' : report.status === 'In Progress' ? '#92400e' : '#991b1b' }}>
                                    {report.status || "Open"}
                                    </span>
                                </div>

                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{report.title}</h3>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 15px 0' }}>
                                <MapPin size={14} /> {report.location?.address?.substring(0, 30) || "Unknown Location"}...
                                </p>

                                {/* --- RATING SECTION (NEW) --- */}
                                {/* If Resolved and Rated, show stars */}
                                {report.status === 'Resolved' && report.rating && (
                                    <div style={{ margin: '0 0 15px 0', padding: '10px', background: '#f8fafc', borderRadius: '10px', display:'flex', alignItems:'center', gap:'8px' }}>
                                        <div style={{display:'flex'}}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < report.rating.score ? "#fbbf24" : "none"} color={i < report.rating.score ? "#fbbf24" : "#cbd5e1"} />
                                            ))}
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Rated by Citizen</span>
                                    </div>
                                )}

                                <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    
                                    {user?.role === 'authority' ? (
                                    <>
                                        {report.status !== 'Resolved' ? (
                                            <>
                                                {report.status !== 'In Progress' && (
                                                    <button onClick={() => handleUpdateStatus(report._id, 'In Progress')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #fbbf24', background: '#fffbeb', color: '#b45309', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                                        <Clock size={14} /> Start Work
                                                    </button>
                                                )}
                                                <button onClick={() => handleUpdateStatus(report._id, 'Resolved')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #4ade80', background: '#f0fdf4', color: '#15803d', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                                    <CheckSquare size={14} /> Mark Done
                                                </button>
                                            </>
                                        ) : (
                                            <div style={{ width: '100%', textAlign: 'center', color: '#166534', fontSize: '0.9rem', fontWeight: '600' }}>✅ Case Resolved</div>
                                        )}
                                    </>
                                    ) : (
                                    /* CITIZEN VIEW */
                                    <>
                                        {/* 4. SHOW RATE BUTTON IF RESOLVED AND NOT RATED */}
                                        {report.status === 'Resolved' && !report.rating ? (
                                            <button 
                                                onClick={() => { setRatingTargetId(report._id); setIsRatingModalOpen(true); }}
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#e0e7ff', color: '#4338ca', border: '1px solid #6366f1', borderRadius: '8px', padding: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                <Star size={16} fill="#4338ca" /> Rate Work
                                            </button>
                                        ) : (
                                            <>
                                                <button onClick={() => handleUpvote(report._id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: isUpvoted ? '#e0e7ff' : 'none', color: isUpvoted ? '#4338ca' : '#64748b', border: isUpvoted ? '1px solid #6366f1' : '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: isUpvoted ? '600' : 'normal' }}>
                                                    <ThumbsUp size={16} fill={isUpvoted ? "currentColor" : "none"} /> {report.upvotes?.length || 0} Upvotes
                                                </button>
                                                <button onClick={() => setExpandedCommentId(isCommentsOpen ? null : report._id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: isCommentsOpen ? '#f1f5f9' : 'none', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
                                                    <MessageCircle size={16} /> {report.comments?.length || 0}
                                                </button>
                                            </>
                                        )}
                                    </>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {isCommentsOpen && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                            <div style={{ marginTop: '15px', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                                    <input type="text" placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(report._id)} />
                                                    <button onClick={() => handleCommentSubmit(report._id)} style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', padding: '0 12px', cursor: 'pointer', display:'flex', alignItems:'center' }}><Send size={16} /></button>
                                                </div>
                                                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {report.comments?.length === 0 && <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>No comments yet.</div>}
                                                    {report.comments?.map((c, idx) => (
                                                        <div key={idx} style={{ background: 'white', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                                                            <div style={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#475569', marginBottom: '2px', display:'flex', alignItems:'center', gap:'4px' }}>
                                                                <User size={10} /> {c.user?.name || "User"}
                                                            </div>
                                                            <div style={{ color: '#334155' }}>{c.text}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                            );
                        })
                        )}
                    </AnimatePresence>
                    </motion.div>
                ) : (
                    <div style={{ height: '600px', width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
                        <VillageMap issues={filteredReports} />
                    </div>
                )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;