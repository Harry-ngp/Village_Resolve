import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import {
  ShieldCheck, MapPin, Users, ArrowRight,
  Github, Linkedin, Code, ChevronDown
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVar = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Parallax Refs
  const heroRef = useRef(null);
  const { scrollY } = useScroll();

  // Parallax transforms
  const yHeroText = useTransform(scrollY, [0, 500], [0, 200]);
  const yHeroImg = useTransform(scrollY, [0, 500], [0, -100]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div style={{ position: 'relative', background: '#0f172a', color: 'white', overflowX: 'hidden', fontFamily: '"Inter", sans-serif' }}>

      {/* SCROLL PROGRESS BAR */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
          transformOrigin: "0%",
          scaleX,
          zIndex: 9999
        }}
      />

      {/* --- DYNAMIC BACKGROUND --- */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)'
        }} />
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', // Subtle texture
            opacity: 0.3
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* --- NAVBAR --- */}
        <Navbar />

        {/* --- HERO SECTION --- */}
        <header ref={heroRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '0 8%' }}>
          <motion.div
            style={{ y: yHeroText, opacity: opacityHero, zIndex: 2, maxWidth: '800px', textAlign: 'center' }}
            variants={containerVar}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVar} style={{ display: 'inline-block', marginBottom: '20px' }}>
              <span style={{ padding: '8px 20px', borderRadius: '50px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                🚀 REVOLUTIONIZING CIVIC ENGAGEMENT
              </span>
            </motion.div>

            <motion.h1
              variants={itemVar}
              style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: '900', lineHeight: 1.1, marginBottom: '25px', letterSpacing: '-0.02em' }}
            >
              Resolve Local Issues <br />
              <span style={{ background: 'linear-gradient(to right, #6366f1, #d946ef)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                With Speed & Trust
              </span>
            </motion.h1>

            <motion.p
              variants={itemVar}
              style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: 1.6 }}
            >
              Join the platform where voices matter. Report potholes, broken lights, and public hazards directly to authorities. Track resolution in real-time.
            </motion.p>

            <motion.div variants={itemVar} style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(99, 102, 241, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ padding: '16px 40px', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  Get Started Now <ArrowRight size={20} />
                </motion.button>
              </Link>
              <motion.a
                href="#features"
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: '16px 40px', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', cursor: 'pointer', textDecoration: 'none' }}
              >
                How it Works
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Parallax Background Elements */}
          <motion.div style={{ position: 'absolute', top: '15%', right: '5%', y: yHeroImg, zIndex: 0, opacity: 0.6 }}>
            <FloatingImg src="https://cdn-icons-png.flaticon.com/512/3063/3063823.png" size="120px" delay={0} />
          </motion.div>
          <motion.div style={{ position: 'absolute', bottom: '20%', left: '8%', y: yHeroImg, zIndex: 0, opacity: 0.5 }}>
            <FloatingImg src="https://cdn-icons-png.flaticon.com/512/9630/9630006.png" size="150px" delay={1.5} />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ position: 'absolute', bottom: '40px', left: '50%', translateX: '-50%' }}
          >
            <ChevronDown size={40} color="#a5b4fc" />
          </motion.div>
        </header>

        {/* --- FEATURES SECTION --- */}
        <section id="features" style={{ padding: '100px 8%', position: 'relative' }}>
          <SectionHeader title="Why Choose Us?" subtitle="Advanced technology meeting community needs." />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '50px', paddingTop: '40px' }}>
            <ParallaxCard
              icon={<MapPin size={40} />}
              title="Geo-Tagged Precision"
              desc="Pinpoint map integration ensures authorities know exactly where the problem lies. No more vague descriptions."
              color="#f472b6"
            />
            <ParallaxCard
              icon={<ShieldCheck size={40} />}
              title="Verified Resolutions"
              desc="Official authorities verify fixes with photo evidence before closing mapping tickets. Trust is built on proof."
              color="#4ade80"
            />
            <ParallaxCard
              icon={<Users size={40} />}
              title="Community Voting"
              desc="Vote on issues that matter to you. High priority issues bubble up for faster resolution."
              color="#60a5fa"
            />
          </div>
        </section>

        {/* --- STATS / BANNER SECTION --- */}
        <section style={{ padding: '80px 0', background: 'linear-gradient(90deg, #1e1b4b, #312e81)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '40px', textAlign: 'center' }}
          >
            <StatItem number="10k+" label="Active Users" />
            <StatItem number="500+" label="Issues Resolved" />
            <StatItem number="50+" label="Partnered Villages" />
          </motion.div>
        </section>

        {/* --- DEVELOPER SECTION --- */}
        <section style={{ padding: '120px 8%', background: '#0f172a' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '80px', flexWrap: 'wrap-reverse', justifyContent: 'center' }}>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{ flex: 1, minWidth: '300px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '4px', background: '#6366f1' }}></div>
                <span style={{ color: '#a5b4fc', fontWeight: 'bold', letterSpacing: '1px' }}>MEET THE CREATOR</span>
              </div>
              <h2 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '10px' }}>Harikesh Pasi</h2>
              <h4 style={{ fontSize: '1.5rem', color: '#94a3b8', fontWeight: '500', marginBottom: '30px' }}>Full Stack MERN Developer</h4>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#cbd5e1', marginBottom: '40px' }}>
                Dedicated to building impactful digital solutions. Village Resolve is a testament to the power of code in solving real human problems.
                Merging technical excellence with social responsibility.
              </p>

              <div style={{ display: 'flex', gap: '20px' }}>
                <SocialBtn icon={<Github />} label="GitHub" />
                <SocialBtn icon={<Linkedin />} label="LinkedIn" />
                <SocialBtn icon={<Code />} label="Portfolio" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              whileHover={{ scale: 1.02, rotate: 2 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{ width: '400px', height: '400px', position: 'relative' }}
            >
              <div style={{ position: 'absolute', inset: 0, border: '2px solid #6366f1', borderRadius: '30px', transform: 'translate(20px, 20px)', zIndex: 0 }}></div>
              <img
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop"
                alt="Harikesh"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '30px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
              />
            </motion.div>

          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer style={{ padding: '60px 0', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>Village Resolve</h3>
            <p style={{ color: '#64748b' }}>&copy; {new Date().getFullYear()} Harikesh Pasi. All rights reserved.</p>
          </motion.div>
        </footer>

      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: '20px 50px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backdropFilter: 'blur(10px)', background: 'rgba(15, 23, 42, 0.7)',
        zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #d946ef)', borderRadius: '8px' }}></div>
        Village Resolve
      </div>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link to="/login" style={{ textDecoration: 'none', color: '#cbd5e1', fontWeight: '600', transition: 'color 0.3s' }}>Login</Link>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ padding: '10px 25px', borderRadius: '30px', border: 'none', background: 'white', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Sign Up
          </motion.button>
        </Link>
      </div>
    </motion.nav>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    style={{ textAlign: 'center', marginBottom: '60px' }}
  >
    <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>{title}</h2>
    <div style={{ width: '60px', height: '4px', background: '#6366f1', margin: '0 auto 20px auto', borderRadius: '2px' }}></div>
    <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>{subtitle}</p>
  </motion.div>
);

const ParallaxCard = ({ icon, title, desc, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -15 }}
      style={{
        background: 'rgba(30, 41, 59, 0.5)',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: color, filter: 'blur(60px)', opacity: 0.2 }}></div>
      <div style={{ color: color, marginBottom: '25px', background: 'rgba(255,255,255,0.05)', width: '70px', height: '70px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px' }}>{title}</h3>
      <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>{desc}</p>
    </motion.div>
  );
};

const FloatingImg = ({ src, size, delay }) => (
  <motion.img
    src={src}
    animate={{ y: [-20, 20, -20], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay }}
    style={{ width: size, height: 'auto', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
  />
);

const StatItem = ({ number, label }) => (
  <div>
    <h3 style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(to bottom, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{number}</h3>
    <p style={{ color: '#a5b4fc', fontSize: '1.1rem', fontWeight: '600' }}>{label}</p>
  </div>
);

const SocialBtn = ({ icon, label }) => (
  <motion.a
    href="#"
    whileHover={{ y: -5, color: '#6366f1' }}
    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', transition: 'color 0.2s' }}
  >
    {icon} {label}
  </motion.a>
);

export default LandingPage;