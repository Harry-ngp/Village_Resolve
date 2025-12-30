import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShieldCheck, MapPin, Users, ArrowRight, 
  Github, Linkedin, Code, ChevronDown 
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const LandingPage = () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#1e1e2e', color: 'white', overflowX: 'hidden' }}>
      
      {/* --- DYNAMIC BACKGROUND ELEMENTS --- */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <motion.div 
            animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(40px)' }} 
        />
        <motion.div 
            animate={{ x: [0, -70, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(60px)' }} 
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        
        {/* --- NAVBAR --- */}
        <motion.nav 
          initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 120 }}
          style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(30,30,46,0.8)' }}
        >
          <motion.div whileHover={{ scale: 1.02 }} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
            <div style={{ width: '35px', height: '35px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}></div>
            <span style={{ background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Village Resolve</span>
          </motion.div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/login" style={{ textDecoration: 'none', color: '#a5b4fc', fontWeight: '600', padding: '10px 20px', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#a5b4fc'}>Login</Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '12px 30px', borderRadius: '30px', color: 'white', fontWeight: '700', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>Get Started</Link>
            </motion.div>
          </div>
        </motion.nav>

        {/* --- HERO SECTION --- */}
        <header style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px 8%', gap: '50px' }}>
          
          {/* Text Side */}
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible" 
            style={{ maxWidth: '600px' }}
          >
            <motion.div variants={fadeInUp} style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', borderRadius: '30px', fontWeight: '600', fontSize: '0.9rem', marginBottom: '20px', border: '1px solid rgba(99,102,241,0.3)' }}>
              🚀 Civic Engagement Platform v1.0
            </motion.div>
            <motion.h1 
              variants={fadeInUp}
              style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '20px', lineHeight: 1.1 }}
            >
              Empowering <span style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Communities</span>, Resolving Issues Together.
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '40px', lineHeight: '1.7' }}
            >
              A seamless platform for citizens to report local issues and authorities to track and resolve them in real-time. Join the movement for a better village today.
            </motion.p>

            <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '20px' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', color: '#1e1e2e', padding: '18px 40px', borderRadius: '40px', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,255,255,0.2)' }}>
                    Join Now <ArrowRight size={20} />
                  </Link>
              </motion.div>
              <motion.a 
                href="#features" 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }} 
                whileTap={{ scale: 0.95 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid rgba(255,255,255,0.2)', color: 'white', padding: '18px 40px', borderRadius: '40px', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none', transition: 'background 0.3s' }}
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>
            
          {/* FIXED SECTION: 
              1. Outer motion.div handles the "Entrance" (sliding in from right)
              2. Inner motion.img handles the "Floating Loop" (bobbing up and down)
          */}
          <motion.div 
             initial={{ opacity: 0, x: 50 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ duration: 1, delay: 0.5 }}
             style={{ flex: 1, maxWidth: '500px', display: 'flex', justifyContent: 'center' }}
          >
              <motion.img 
                  animate={{ y: [-15, 15, -15] }} 
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  src="https://static1.howtogeekimages.com/wordpress/wp-content/uploads/2021/01/google-maps-satellite.png" 
                  alt="Community Resolving Issues" 
                  style={{ width: '100%', height: 'auto', dropShadow: '0 25px 50px rgba(0,0,0,0.3)' }} 
              />
          </motion.div>
        </header>
        
        {/* Scroll Down Indicator */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}
        >
            <motion.a href="#features" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: '#a5b4fc', cursor: 'pointer' }}>
                <ChevronDown size={32} />
            </motion.a>
        </motion.div>

        {/* --- FEATURES SECTION --- */}
        <section id="features" style={{ padding: '100px 8%', background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 100%)' }}>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-150px" }}
            variants={staggerContainer}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <motion.h2 variants={fadeInUp} style={{ fontSize: '3rem', marginBottom: '15px', fontWeight: '800' }}>Why Village Resolve?</motion.h2>
            <motion.p variants={fadeInUp} style={{ color: '#a5b4fc', fontSize: '1.2rem' }}>Bridging the digital gap between problems and real-world solutions.</motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}
          >
            <FeatureCard 
              icon={<MapPin size={32} color="white" />} 
              color="#f472b6" 
              title="Geo-Tagged Reports" 
              desc="Pinpoint the exact location of issues like potholes or broken lights using accurate map integration." 
            />
            <FeatureCard 
              icon={<ShieldCheck size={32} color="white" />} 
              color="#4ade80" 
              title="Verified Action" 
              desc="Authorities update status with proof. Watch issues move from 'Open' to 'Resolved' in real-time." 
            />
            <FeatureCard 
              icon={<Users size={32} color="white" />} 
              color="#60a5fa" 
              title="Community Power" 
              desc="Citizens upvote critical issues to prioritize them. Collective voice drives faster action." 
            />
          </motion.div>
        </section>

        {/* --- DEVELOPER SECTION --- */}
        <section style={{ padding: '120px 8%', background: 'rgba(99,102,241,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-150px" }}
             variants={staggerContainer}
             style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '80px', flexWrap: 'wrap-reverse', justifyContent: 'center' }}
          >
            {/* Dev Info */}
            <motion.div variants={fadeInUp} style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', borderRadius: '20px', fontSize: '0.9rem', marginBottom: '25px', fontWeight: 'bold', border: '1px solid rgba(99,102,241,0.3)' }}>
                <Code size={16} /> MEET THE DEVELOPER
              </div>
              <h2 style={{ fontSize: '3.5rem', margin: '0 0 10px 0', fontWeight: '800' }}>Harikesh Pasi</h2>
              <h4 style={{ color: '#a5b4fc', margin: '0 0 25px 0', fontSize: '1.4rem', fontWeight: '500' }}>Full Stack Developer (MERN)</h4>
              <p style={{ lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', marginBottom: '40px', fontSize: '1.1rem' }}>
                Passionate about building scalable web applications that solve real-world problems. 
                Built <strong>Village Resolve</strong> to demonstrate the power of modern web tech 
                in civic engagement and transparency.
              </p>
              
              <div style={{ display: 'flex', gap: '20px' }}>
                <SocialBtn icon={<Github size={22} />} label="GitHub" href="https://github.com" />
                <SocialBtn icon={<Linkedin size={22} />} label="LinkedIn" href="https://linkedin.com" />
                <SocialBtn icon={<Code size={22} />} label="Portfolio" href="#" />
              </div>
            </motion.div>

             {/* Dev Image/Avatar */}
             <motion.div 
               variants={scaleIn}
               whileHover={{ scale: 1.03, rotate: 2 }}
               style={{ width: '350px', height: '400px', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', border: '4px solid rgba(255,255,255,0.1)' }}
            >
               <img src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop" alt="Developer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          </motion.div>
        </section>

        {/* --- FOOTER --- */}
        <footer style={{ padding: '50px', textAlign: 'center', background: '#181824', color: '#64748b' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
             <div style={{ width: '35px', height: '35px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px', margin: '0 auto 20px auto', opacity: 0.5 }}></div>
             <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#a5b4fc' }}>Village Resolve</p>
             <p style={{ marginTop: '10px' }}>&copy; 2024. Built with ❤️ and React by Harikesh.</p>
          </motion.div>
        </footer>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const FeatureCard = ({ icon, color, title, desc }) => (
  <motion.div 
    variants={fadeInUp}
    whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: color }}
    style={{ background: 'rgba(255,255,255,0.03)', padding: '40px 30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', transition: 'border-color 0.3s', textAlign: 'left' }}
  >
    <div style={{ marginBottom: '25px', background: color, width: '60px', height: '60px', borderRadius: '16px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: `0 10px 20px -5px ${color}66` }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '700' }}>{title}</h3>
    <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '1.05rem' }}>{desc}</p>
  </motion.div>
);

const SocialBtn = ({ icon, label, href }) => (
  <motion.a 
    href={href || "#"} target="_blank" rel="noopener noreferrer"
    whileHover={{ scale: 1.1, backgroundColor: 'white', color: '#1e1e2e' }}
    whileTap={{ scale: 0.95 }}
    style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', transition: 'background 0.2s, color 0.2s' }}
  >
    {icon} {label}
  </motion.a>
);

export default LandingPage;