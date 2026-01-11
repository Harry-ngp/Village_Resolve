import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const MyReports = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ONLY my reports
  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const { data } = await API.get('/reports/me'); // Calls the new route
        setReports(data);
      } catch (err) {
        console.error("Failed to fetch my reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReports();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="main-content">
        <header className="top-header">
          <div>
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.8rem' }}>My Reports</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '5px 0 0 0' }}>
              Track the status of issues you have raised.
            </p>
          </div>
        </header>

        <div className="glass-panel" style={{ minHeight: '500px', marginTop: '30px' }}>
            
          {loading ? (
             <div style={{display:'flex', justifyContent:'center', padding: '50px'}}>
                <Loader2 className="animate-spin" size={40} color="#6366f1"/>
             </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {reports.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      <h3>You haven't reported any issues yet.</h3>
                      <p>Go to the Dashboard to submit your first report!</p>
                  </div>
              ) : (
                reports.map((report) => (
                  <motion.div 
                    key={report._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}
                  >
                    {/* Status Banner */}
                    <div style={{ 
                        padding: '10px 20px', 
                        background: report.status === 'Resolved' ? '#dcfce7' : report.status === 'In Progress' ? '#fef3c7' : '#fee2e2',
                        color: report.status === 'Resolved' ? '#15803d' : report.status === 'In Progress' ? '#b45309' : '#991b1b',
                        fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        {report.status === 'Resolved' && <CheckCircle size={16} />}
                        {report.status === 'In Progress' && <Clock size={16} />}
                        {report.status === 'Open' && <AlertCircle size={16} />}
                        {report.status}
                    </div>

                    {/* Image */}
                    <div style={{ height: '160px', width: '100%', background: '#f1f5f9' }}>
                        <img 
                          src={report.image ? `http://localhost:5000${report.image}` : "https://via.placeholder.com/300"} 
                          alt="Report" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{report.title}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '15px' }}>
                            {report.description.substring(0, 80)}...
                        </p>
                        
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={14} /> {report.location?.address?.substring(0, 25)}...
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={14} /> {new Date(report.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyReports;