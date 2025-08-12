/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Vertex Inc brand colors and theme
const theme = {
  primary: '#0066CC', // Vertex blue
  secondary: '#8CD366', // Vertex orange
  accent: '#00B4D8', // Light blue
  dark: '#1A1A2E', // Dark navy
  light: '#F8F9FA', // Light background
  gradient: 'linear-gradient(135deg, #0066CC 0%, #00B4D8 50%, #8CD366 100%)',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  glassEffect: 'backdrop-filter: blur(10px)',
};

const Rocket = ({ trail = false }) => (
  <div style={{ position: 'relative' }}>
    <svg width="80" height="160" viewBox="0 0 50 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: theme.primary, stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: theme.secondary, stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <path d="M25 0 L40 30 L25 20 L10 30 Z" fill="url(#rocketGradient)" />
      <rect x="15" y="30" width="20" height="40" fill={theme.secondary} />
      <path d="M15 70 L25 100 L35 70 Z" fill={theme.primary} />
    </svg>
    {trail && Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          bottom: -(i * 20 + 20),
          left: '50%',
          transform: 'translateX(-50%)',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.secondary}, ${theme.accent})`,
          opacity: 0.6 - i * 0.1,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 0], y: [0, 20, 40] }}
        transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
      />
    ))}
  </div>
);

const VertexLogo = () => (
    <motion.div 
      style={{ 
        position: 'absolute', 
        top: '2rem', 
        left: '2rem', 
        zIndex: 10,
        background: theme.gradient,
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <img 
        src="/vlogo.png" 
        alt="Logo"
        width="120"
        height="40"
        style={{
          objectFit: 'contain'
        }}
      />
    </motion.div>
  );
const AnimatedBackground = () => (
  <div style={{ 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    background: theme.gradient,
    zIndex: 0 
  }}>
    {Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: Math.random() * 6 + 2 + 'px',
          height: Math.random() * 6 + 2 + 'px',
          borderRadius: '50%',
          background: i % 3 === 0 ? theme.primary : i % 3 === 1 ? theme.secondary : theme.accent,
          opacity: 0.3,
        }}
        initial={{ 
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
          y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
        }}
        animate={{ 
          y: [
            Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), 
            Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800) + 100
          ], 
          opacity: [0.3, 0, 0.3] 
        }}
        transition={{ duration: Math.random() * 8 + 4, repeat: Infinity, ease: 'linear' }}
      />
    ))}
  </div>
);

const SceneWrapper = ({ children, sceneNumber, onBack }) => (
  <div style={{ 
    height: '100vh', 
    width: '100vw', 
    position: 'relative', 
    overflow: 'hidden', 
    background: theme.gradient,
    fontFamily: "'Space Grotesk', 'Orbitron', sans-serif"
  }}>
    <AnimatedBackground />
    <VertexLogo />
    <motion.div 
      style={{ 
        position: 'absolute', 
        top: '2rem', 
        right: '2rem', 
        background: theme.cardBg, 
        padding: '0.5rem 1rem', 
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <span style={{ color: theme.primary, fontWeight: 'bold', fontFamily: "'Orbitron', monospace" }}>
        Scene {sceneNumber}/12
      </span>
    </motion.div>
    {/* Show back button only if not the first scene and onBack is provided */}
    {sceneNumber > 1 && onBack && (
      <BackButton onBack={onBack} delay={0.8} />
    )}
    <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  </div>
);

const ContentCard = ({ children, delay = 0, direction = 'left' }) => (
  <motion.div 
    style={{ 
      background: theme.cardBg,
      backdropFilter: 'blur(15px)',
      padding: '3rem', 
      borderRadius: '25px', 
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      maxWidth: '600px',
      margin: '2rem',
      border: `2px solid rgba(0, 102, 204, 0.3)`,
    }}
    initial={{ opacity: 0, x: direction === 'left' ? -100 : 100, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay, type: 'spring', stiffness: 100 }}
  >
    {children}
  </motion.div>
);

const Slideshow = ({ images, delay = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slideshow every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <motion.div 
      style={{ 
        border: `3px solid ${theme.primary}`, 
        borderRadius: '20px', 
        overflow: 'hidden', 
        maxWidth: '500px', 
        margin: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        background: 'white',
        position: 'relative'
      }}
      initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1, delay, type: 'spring' }}
      whileHover={{ scale: 1.05, boxShadow: `0 25px 50px rgba(0,102,204,0.4)` }}
    >
      <div style={{ position: 'relative', height: 'auto', overflow: 'hidden', background: '#f0f0f0' }}>
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block'
          }}
          onError={() => {
            console.log('Image failed to load:', images[currentIndex].src);
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', images[currentIndex].src);
          }}
        />
      </div>

      {/* Navigation Controls */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '10px',
        transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10
      }} onClick={prevSlide}>
        <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>‹</span>
      </div>

      <div style={{
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10
      }} onClick={nextSlide}>
        <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>›</span>
      </div>

      {/* Dots Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10
      }}>
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: index === currentIndex ? theme.primary : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          height: '4px',
          background: theme.secondary,
          borderRadius: '0 0 17px 17px'
        }}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
      />
    </motion.div>
  );
};

const WebsiteIframe = ({ url = "https://example.com", delay = 0, useProxy = false }) => {
  // Option 1: Use a CORS proxy (may not work for complex sites)
  const proxyUrl = useProxy ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` : url;
  
  return (
    <motion.div 
      style={{ 
        border: `3px solid ${theme.primary}`, 
        borderRadius: '20px', 
        overflow: 'hidden', 
        maxWidth: '500px', 
        width: '500px',
        height: '400px',
        margin: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        background: 'white',
        position: 'relative'
      }}
      initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1, delay, type: 'spring' }}
      whileHover={{ scale: 1.05, boxShadow: `0 25px 50px rgba(0,102,204,0.4)` }}
    >
      {useProxy ? (
        // Option 2: Use object tag instead of iframe
        <object
          data={proxyUrl}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '17px'
          }}
          title="Embedded Website"
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: theme.primary,
            fontSize: '1.2rem'
          }}>
            Loading Datadog...
          </div>
        </object>
      ) : (
        <iframe
          src={proxyUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '17px'
          }}
          title="Embedded Website"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          // Option 3: Try to bypass CSP with referrerpolicy
          referrerPolicy="no-referrer"
        />
      )}
    </motion.div>
  );
};

const StyledButton = ({ onClick, children, delay = 0 }) => (
  <motion.button 
    onClick={onClick} 
    style={{ 
      position: 'absolute', 
      bottom: '3rem', 
      right: '3rem', 
      padding: '1.2rem 2.5rem', 
      background: `linear-gradient(45deg, ${theme.secondary}, ${theme.primary})`,
      color: 'white', 
      border: 'none', 
      cursor: 'pointer', 
      borderRadius: '50px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      fontFamily: "'Space Grotesk', sans-serif",
      boxShadow: '0 8px 30px rgba(255,102,0,0.4)',
      zIndex: 10,
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }}
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ 
      scale: 1.05, 
      boxShadow: `0 12px 40px rgba(85, 189, 28, 0.6)`,
      background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`
    }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);

const BackButton = ({ onBack, delay = 0 }) => (
  <motion.button 
    onClick={onBack} 
    style={{ 
      position: 'absolute', 
      bottom: '3rem', 
      left: '3rem', 
      padding: '1rem', 
      background: `rgba(255, 255, 255, 0.2)`,
      color: theme.primary, 
      border: `2px solid ${theme.primary}`, 
      cursor: 'pointer', 
      borderRadius: '50%',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 30px rgba(0,102,204,0.3)',
      zIndex: 10
    }}
    initial={{ opacity: 0, x: -100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ 
      scale: 1.1, 
      background: theme.primary,
      color: 'white',
      boxShadow: `0 12px 40px rgba(0,102,204,0.6)`
    }}
    whileTap={{ scale: 0.9 }}
  >
    ←
  </motion.button>
);

// Scene Components
const Scene1 = ({ onNext, onBack }) => (
  <SceneWrapper sceneNumber={1} onBack={onBack}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <ContentCard direction="left" delay={0.3}>
        <motion.h1 
          style={{ color: theme.primary, fontSize: '2.8rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace" }}
          initial={{ scale: 0, rotate: -180 }} 
          animate={{ scale: 1, rotate: 0 }} 
          transition={{ delay: 0.8, duration: 1, type: 'spring' }}
        >
          Meet Swopnil Panday
        </motion.h1>
        <motion.div 
          style={{ fontSize: '1.3rem', lineHeight: '1.6', color: theme.dark }}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.2, duration: 1 }}
        >
          <p><strong style={{color: theme.primary}}>🎓 College:</strong> Rising Senior at Villanova University</p>
          <p><strong style={{color: theme.primary}}>📚 Major:</strong> Computer Science, Mathematics (Minor)</p>
          <p><strong style={{color: theme.primary}}>🌟 Discovery:</strong> Found Vertex Inc through campus alumni network</p>
          <p><strong style={{color: theme.primary}}>💻 Passion:</strong> Software development since youth - Python, JavaScript, building solutions for organizations</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 1.8, duration: 0.8 }} 
          style={{ fontSize: '1.8rem', color: theme.secondary, marginTop: '2rem', textAlign: 'center' }}
        >
          🚀 Ready to blast off into an epic journey!
        </motion.div>
      </ContentCard>
      <Slideshow 
        images={[
          { src: "/vlogo.png", alt: "Welcome to Vertex" },
          { src: "/c2g.png", alt: "Course to Go" },
          { src: "https://placehold.co/500x400/228B22/FFFFFF?text=Villanova+Student", alt: "Villanova Student" },
          { src: "https://placehold.co/500x400/FF6600/FFFFFF?text=CS+Major", alt: "Computer Science Major" }
        ]} 
        delay={0.6} 
      />
    </div>
    <StyledButton onClick={onNext} delay={2}>Start My Vertex Journey</StyledButton>
  </SceneWrapper>
);

const Scene2 = ({ onNext, onBack }) => (
  <SceneWrapper sceneNumber={2} onBack={onBack}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <Slideshow 
        images={[
          { src: "https://placehold.co/500x400/FF6600/FFFFFF?text=Certificate+Center+Team", alt: "Certificate Center Team" },
          { src: "https://placehold.co/500x400/0066CC/FFFFFF?text=Manager+Rhonda+Shaw", alt: "Manager Rhonda Shaw" },
          { src: "https://placehold.co/500x400/228B22/FFFFFF?text=Night+Watch+Team", alt: "Night Watch Team" },
          { src: "https://placehold.co/500x400/8A2BE2/FFFFFF?text=Dragon+Keepers", alt: "Dragon Keepers" },
          { src: "https://placehold.co/500x400/00B4D8/FFFFFF?text=Delta+Force", alt: "Delta Force" }
        ]} 
        delay={0.3} 
      />
      <ContentCard direction="right" delay={0.6}>
        <motion.h1 
          style={{ color: theme.primary, fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace" }}
          initial={{ y: -50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          The Certificate Center Team
        </motion.h1>
        <motion.div 
          style={{ fontSize: '1.2rem', lineHeight: '1.6', color: theme.dark }}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.3, duration: 1 }}
        >
          <p><strong style={{color: theme.secondary}}>👩‍💼 Manager:</strong> Rhonda Shaw</p>
          <p><strong style={{color: theme.secondary}}>🎯 Mission:</strong> Managing tax exemption certificates for customers</p>
          <p><strong style={{color: theme.secondary}}>🛡️ Three Elite Teams:</strong></p>
          <ul style={{marginLeft: '1.5rem', marginTop: '1rem'}}>
            <li><strong>Night Watch</strong> - The vigilant guardians</li>
            <li><strong>Dragon Keepers</strong> - The fierce protectors</li>
            <li><strong>Delta Force</strong> - The precision specialists</li>
          </ul>
          <p style={{marginTop: '1rem'}}><em>Started with Dragon Keepers, expanded to Night Watch for maximum impact and full-stack experience!</em></p>
        </motion.div>
      </ContentCard>
    </div>
    <StyledButton onClick={onNext} delay={2}>Let's Start Coding for Cert Center</StyledButton>
  </SceneWrapper>
);

const Scene3 = ({ onNext, onBack }) => (
  <SceneWrapper sceneNumber={3} onBack={onBack}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <ContentCard direction="left" delay={0.3}>
        <motion.h1 
          style={{ color: theme.primary, fontSize: '2.3rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace" }}
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
        >
          Building the Developer Dashboard
        </motion.h1>
        <motion.div 
          style={{ fontSize: '1.2rem', lineHeight: '1.6', color: theme.dark }}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1, duration: 1 }}
        >
          <p><strong style={{color: theme.secondary}}>🤝 Collaboration:</strong> Worked alongside another intern with Datadog</p>
          <p><strong style={{color: theme.secondary}}>👨‍🏫 Mentor:</strong> Matthew Dickens</p>
          <p><strong style={{color: theme.secondary}}>🎯 Purpose:</strong> Display Cert Center API endpoints data for developer convenience</p>
          
          <div style={{background: 'rgba(0,102,204,0.1)', padding: '1rem', borderRadius: '10px', marginTop: '1.5rem'}}>
            <p><strong>Dashboard Features:</strong></p>
            <ul style={{marginLeft: '1rem', marginTop: '0.5rem'}}>
              <li>📊 P95 & P99 performance metrics</li>
              <li>📈 SQL monitoring with line graphs</li>
              <li>📋 Request count tracking</li>
              <li>🚨 Error monitoring system</li>
              <li>🎯 SLOs (Service Level Objectives)</li>
            </ul>
          </div>
          <p style={{marginTop: '1rem', fontStyle: 'italic'}}>This project taught me the critical importance of monitoring in development environments!</p>
        </motion.div>
      </ContentCard>
      <WebsiteIframe 
        url="https://www.datadoghq.com"
        delay={0.6}
        useProxy={true}
      />
    </div>
    <StyledButton onClick={onNext} delay={2}>Submit the Dashboard</StyledButton>
  </SceneWrapper>
);

const Scene4 = ({ onNext, onBack }) => (
  <SceneWrapper sceneNumber={4} onBack={onBack}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <Slideshow 
        images={[
          { src: "https://placehold.co/500x400/0066CC/FFFFFF?text=Terraform+Infrastructure", alt: "Terraform Integration" },
          { src: "https://placehold.co/500x400/FF6600/FFFFFF?text=Infrastructure+as+Code", alt: "Infrastructure as Code" },
          { src: "https://placehold.co/500x400/228B22/FFFFFF?text=Scalable+Monitoring", alt: "Scalable Monitoring" },
          { src: "https://placehold.co/500x400/8A2BE2/FFFFFF?text=Automated+Deployment", alt: "Automated Deployment" }
        ]} 
        delay={0.3} 
      />
      <ContentCard direction="right" delay={0.6}>
        <motion.h1 
          style={{ color: theme.secondary, fontSize: '3rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace" }}
          initial={{ scale: 2, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.9, duration: 0.8, type: 'spring' }}
        >
          Not Yet!
        </motion.h1>
        <motion.div 
          style={{ fontSize: '1.3rem', lineHeight: '1.6', color: theme.dark }}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.3, duration: 1 }}
        >
          <p>The dashboard needed to evolve into something more powerful and maintainable...</p>
          
          <div style={{background: 'rgba(255,102,0,0.1)', padding: '1.5rem', borderRadius: '15px', marginTop: '1.5rem'}}>
            <p><strong style={{color: theme.secondary}}>🏗️ Infrastructure as Code Challenge:</strong></p>
            <p>Migrated the dashboard to <strong>Terraform repository</strong> for:</p>
            <ul style={{marginLeft: '1rem', marginTop: '1rem'}}>
              <li>🔧 Easy future maintenance</li>
              <li>📈 Scalable monitoring infrastructure</li>
              <li>🎯 Standardized SLOs</li>
              <li>🚀 Automated deployment</li>
            </ul>
          </div>
          
          <p style={{marginTop: '1.5rem', fontSize: '1.1rem', color: theme.primary}}>
            <em>Took ownership of migrating monitors and SLOs to Terraform - building the foundation for scalable observability!</em>
          </p>
        </motion.div>
      </ContentCard>
    </div>
    <StyledButton onClick={onNext} delay={2}>Submit the Dashboard Now</StyledButton>
  </SceneWrapper>
);

const Scene5 = ({ onNext, onBack }) => (
  <SceneWrapper sceneNumber={5} onBack={onBack}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <ContentCard direction="left" delay={0.3}>
        <motion.h1 
          style={{ color: theme.primary, fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace" }}
          initial={{ x: -200, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          🌱 Spring Into Action
        </motion.h1>
        <motion.div 
          style={{ fontSize: '1.2rem', lineHeight: '1.6', color: theme.dark }}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1, duration: 1 }}
        >
          <p>Simultaneously working with <strong style={{color: theme.secondary}}>Night Watch team</strong> on a critical mission:</p>
          
          <div style={{background: 'rgba(0,102,204,0.1)', padding: '1.5rem', borderRadius: '15px', marginTop: '1.5rem'}}>
            <p><strong>🐛 The Challenge:</strong></p>
            <p>Forms in our Certificate Center wizard were experiencing issues</p>
            
            <p style={{marginTop: '1rem'}}><strong>🚀 The Solution:</strong></p>
            <ul style={{marginLeft: '1rem'}}>
              <li>Dive into <strong>Spring Boot backend</strong> (completely new to me!)</li>
              <li>Ask countless questions to senior developers</li>
              <li>Learn Spring Boot architecture from one ticket</li>
              <li>Connect with amazing team members</li>
              <li>Write comprehensive test cases</li>
            </ul>
          </div>
          
          <p style={{marginTop: '1.5rem', fontStyle: 'italic', color: theme.primary}}>
            This single ticket became my Spring Boot masterclass - showing me the immense value of asking questions and writing tests!
          </p>
        </motion.div>
      </ContentCard>
      <Slideshow 
        images={[
          { src: "https://placehold.co/500x400/228B22/FFFFFF?text=Spring+Boot+Learning+Journey", alt: "Spring Boot Learning" },
          { src: "https://placehold.co/500x400/0066CC/FFFFFF?text=Night+Watch+Team", alt: "Night Watch Team" },
          { src: "https://placehold.co/500x400/FF6600/FFFFFF?text=Backend+Architecture", alt: "Backend Architecture" },
          { src: "https://placehold.co/500x400/8A2BE2/FFFFFF?text=Test+Cases+Writing", alt: "Test Cases" },
          { src: "https://placehold.co/500x400/00B4D8/FFFFFF?text=Certificate+Wizard", alt: "Certificate Wizard" }
        ]} 
        delay={0.6} 
      />
    </div>
    <StyledButton onClick={onNext} delay={2}>Submit My First PR</StyledButton>
  </SceneWrapper>
);

const Scene6 = ({ onNext, onBack }) => (
  <SceneWrapper sceneNumber={6} onBack={onBack}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <Slideshow 
        images={[
          { src: "https://placehold.co/500x400/FF0000/FFFFFF?text=NPE+ALERT%21", alt: "NPE Alert" },
          { src: "https://placehold.co/500x400/8B0000/FFFFFF?text=Root+Cause+Analysis", alt: "Root Cause Analysis" },
          { src: "https://placehold.co/500x400/DC143C/FFFFFF?text=Testing+Importance", alt: "Testing Importance" },
          { src: "https://placehold.co/500x400/B22222/FFFFFF?text=Code+Quality+Learning", alt: "Code Quality" }
        ]} 
        delay={0.3} 
      />
      <ContentCard direction="right" delay={0.6}>
        <motion.h1 
          style={{ color: theme.secondary, fontSize: '3.2rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace", textAlign: 'center' }}
          initial={{ opacity: 0, scale: 0 }} 
          animate={{ 
            opacity: 1, 
            scale: [0, 1.2, 1], 
            color: [theme.secondary, '#FF0000', theme.secondary] 
          }} 
          transition={{ delay: 0.9, duration: 1.5, times: [0, 0.5, 1] }}
        >
          💥 Hit My First NPE!
        </motion.h1>
        
        <motion.div 
          style={{ fontSize: '6rem', textAlign: 'center', margin: '1rem 0' }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 2, 1], 
            opacity: [0, 1, 0.8], 
            rotate: [0, 360, 0] 
          }}
          transition={{ delay: 1.3, duration: 2, ease: 'easeOut' }}
        >
          🚨
        </motion.div>
        
        <motion.div 
          style={{ fontSize: '1.2rem', lineHeight: '1.6', color: theme.dark }}
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 2, duration: 1 }}
        >
          <div style={{background: 'rgba(255,0,0,0.1)', padding: '1.5rem', borderRadius: '15px', border: '2px solid rgba(255,0,0,0.3)'}}>
            <p><strong style={{color: '#FF0000'}}>The Learning Moment:</strong></p>
            <ul style={{marginLeft: '1rem', marginTop: '1rem'}}>
              <li>🔍 Discovered the NPE myself</li>
              <li>🤔 Took full responsibility</li>
              <li>💡 Analyzed and understood the root cause</li>
              <li>🔧 Implemented the fix properly</li>
              <li>✅ Learned the importance of thorough testing</li>
            </ul>
          </div>
          
          <p style={{marginTop: '1.5rem', fontSize: '1.1rem', color: theme.primary, fontWeight: 'bold'}}>
            This NPE taught me more than any textbook ever could - the critical importance of understanding code deeply to deliver perfection!
          </p>
          
          <p style={{marginTop: '1rem', textAlign: 'center', fontSize: '1.5rem'}}>
            Every bug is a lesson in disguise! 🌟
          </p>
        </motion.div>
      </ContentCard>
    </div>
    <StyledButton onClick={onNext} delay={3}>Submit My First PR 🙏</StyledButton>
  </SceneWrapper>
);

const Scene7 = ({ onNext, onBack }) => (
  <SceneWrapper sceneNumber={7} onBack={onBack}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <ContentCard direction="left" delay={0.3}>
        <motion.h1 
          style={{ color: theme.primary, fontSize: '2.8rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace" }}
          initial={{ x: -200, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          🎉 It Worked!
        </motion.h1>
        <motion.div 
          style={{ fontSize: '1.3rem', lineHeight: '1.6', color: theme.dark }}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1, duration: 1 }}
        >
          <p>With newfound confidence, I tackled the next challenge:</p>
          
          <div style={{background: 'rgba(0,180,216,0.1)', padding: '1.5rem', borderRadius: '15px', marginTop: '1.5rem'}}>
            <p><strong style={{color: theme.accent}}>🔒 Security Vulnerabilities Mission:</strong></p>
            <ul style={{marginLeft: '1rem', marginTop: '1rem'}}>
              <li>🕵️ Identified multiple security vulnerabilities</li>
              <li>🔧 Developed comprehensive fixes</li>
              <li>🧪 Rigorously tested all solutions</li>
              <li>📚 Explored numerous repositories</li>
              <li>🌐 Understood the bigger picture of system architecture</li>
            </ul>
          </div>
          
          <p style={{marginTop: '1.5rem', color: theme.primary, fontSize: '1.2rem'}}>
            <strong>💡 Key Insight:</strong> Each repository contributes to the larger ecosystem - understanding these connections was crucial for effective fixes.
          </p>
          
          <p style={{marginTop: '1rem', textAlign: 'center', fontSize: '1.4rem', color: theme.secondary}}>
            🔒 Building a more secure Vertex, one vulnerability at a time!
          </p>
        </motion.div>
      </ContentCard>
      <Slideshow 
        images={[
          { src: "https://placehold.co/500x400/00B4D8/FFFFFF?text=Security+Fortress+Built", alt: "Security Fixes" },
          { src: "https://placehold.co/500x400/0066CC/FFFFFF?text=Vulnerability+Detection", alt: "Vulnerability Detection" },
          { src: "https://placehold.co/500x400/4169E1/FFFFFF?text=System+Architecture", alt: "System Architecture" },
          { src: "https://placehold.co/500x400/1E90FF/FFFFFF?text=Repository+Analysis", alt: "Repository Analysis" }
        ]} 
        delay={0.6} 
      />
    </div>
    <StyledButton onClick={onNext} delay={2}>Get Things Serious</StyledButton>
  </SceneWrapper>
);

const Scene8 = ({ onNext, onBack }) => (
  <SceneWrapper sceneNumber={8} onBack={onBack}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <Slideshow 
        images={[
          { src: "https://placehold.co/500x400/8A2BE2/FFFFFF?text=AI+OCR+Innovation", alt: "OCR Project" },
          { src: "https://placehold.co/500x400/9932CC/FFFFFF?text=AI+Revolution", alt: "AI Revolution" },
          { src: "https://placehold.co/500x400/BA55D3/FFFFFF?text=Customer+Benefits", alt: "Customer Benefits" },
          { src: "https://placehold.co/500x400/DA70D6/FFFFFF?text=Project+Lifecycle", alt: "Project Lifecycle" }
        ]} 
        delay={0.3} 
      />
      <ContentCard direction="right" delay={0.6}>
        <motion.h1 
          style={{ color: theme.secondary, fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace", textAlign: 'center' }}
          initial={{ y: 200, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          🚀 One-of-a-Kind Project
        </motion.h1>
        <motion.div 
          style={{ fontSize: '1.2rem', lineHeight: '1.6', color: theme.dark }}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.3, duration: 1 }}
        >
          <div style={{background: 'linear-gradient(135deg, rgba(138,43,226,0.1), rgba(0,102,204,0.1))', padding: '2rem', borderRadius: '20px', border: '2px solid rgba(138,43,226,0.3)'}}>
            <p><strong style={{color: '#8A2BE2', fontSize: '1.4rem'}}>🤖 OCR - The AI Revolution at Vertex</strong></p>
            <p style={{marginTop: '1rem'}}>This wasn't just another project - it was <em>the</em> project that would bring AI benefits directly to our customers, built completely from scratch.</p>
            
            <div style={{marginTop: '1.5rem', background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '10px'}}>
              <p><strong>My Deep Dive Approach:</strong></p>
              <ul style={{marginLeft: '1rem', marginTop: '0.5rem'}}>
                <li>📅 Attended every single meeting</li>
                <li>👀 Observed how work gets started, divided, and executed</li>
                <li>📖 Extensive research and reading</li>
                <li>💡 Devoted genuine interest and curiosity</li>
                <li>🔍 Reviewed every PR, understanding its importance</li>
                <li>🧠 Absorbed every learning opportunity</li>
              </ul>
            </div>
          </div>
          
          <p style={{marginTop: '1.5rem', fontSize: '1.1rem', color: theme.primary, textAlign: 'center'}}>
            While I didn't make extensive backend changes, I became a sponge for knowledge - understanding the entire system architecture and project lifecycle!
          </p>
          
          <motion.div 
            initial={{ opacity: 0, rotate: 0 }} 
            animate={{ opacity: 1, rotate: [0, 360] }} 
            transition={{ delay: 2, duration: 2, ease: 'easeInOut' }} 
            style={{ fontSize: '2rem', textAlign: 'center', marginTop: '1rem', color: theme.secondary }}
          >
            🤖✨ AI Magic in the Making! ✨🤖
          </motion.div>
        </motion.div>
      </ContentCard>
    </div>
    <StyledButton onClick={onNext} delay={2.5}>Get Some Work Done</StyledButton>
  </SceneWrapper>
);

const Scene9 = ({ onNext, onBack }) => (
  <SceneWrapper sceneNumber={9} onBack={onBack}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <ContentCard direction="left" delay={0.3}>
        <motion.h1 
          style={{ color: theme.primary, fontSize: '2.3rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace" }}
          initial={{ opacity: 0, scale: 0 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
        >
          🎨 OCR UI Foundation Work
        </motion.h1>
        <motion.div 
          style={{ fontSize: '1.2rem', lineHeight: '1.6', color: theme.dark }}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1, duration: 1 }}
        >
          <p>Got the crucial role in <strong style={{color: theme.secondary}}>OCR Foundation</strong> due to my extensive frontend and mock server experience!</p>
          
          <div style={{background: 'rgba(255,102,0,0.1)', padding: '1.5rem', borderRadius: '15px', marginTop: '1.5rem'}}>
            <p><strong style={{color: theme.secondary}}>🏗️ The Challenge:</strong></p>
            <p>Build a robust UI while the backend wasn't ready yet</p>
            
            <p style={{marginTop: '1rem'}}><strong>🎯 Key Accomplishments:</strong></p>
            <ul style={{marginLeft: '1rem', marginTop: '0.5rem'}}>
              <li>✅ Built comprehensive validation systems</li>
              <li>🚨 Implemented error handling</li>
              <li>🔄 Created UI that doesn't disrupt normal flow</li>
              <li>🎭 Developed advanced mocking for testing</li>
              <li>📡 API fetching for add/edit pages</li>
              <li>🧪 Environment mocking without hardcoded test cases</li>
            </ul>
          </div>
          
          <p style={{marginTop: '1.5rem', color: theme.primary, fontSize: '1.1rem'}}>
            <strong>💡 Biggest Learning:</strong> Creating a mock environment that could adapt to real scenarios without hardcoding - this taught me invaluable lessons about flexible architecture!
          </p>
          
          <p style={{textAlign: 'center', fontSize: '1.4rem', color: theme.secondary, marginTop: '1rem'}}>
            🎨 Building the frontend fortress that would power AI innovation!
          </p>
        </motion.div>
      </ContentCard>
      <Slideshow 
        images={[
          { src: "https://placehold.co/500x400/FF6600/FFFFFF?text=OCR+UI+Foundation+Built", alt: "OCR UI Foundation" },
          { src: "https://placehold.co/500x400/FF8C00/FFFFFF?text=Validation+Systems", alt: "Validation Systems" },
          { src: "https://placehold.co/500x400/FFA500/FFFFFF?text=Error+Handling", alt: "Error Handling" },
          { src: "https://placehold.co/500x400/FFB347/FFFFFF?text=Mock+Environment", alt: "Mock Environment" },
          { src: "https://placehold.co/500x400/FFCC80/FFFFFF?text=API+Integration", alt: "API Integration" }
        ]} 
        delay={0.6} 
      />
    </div>
    <StyledButton onClick={onNext} delay={2}>The Launchpad</StyledButton>
  </SceneWrapper>
);

const Scene10 = ({ onNext, onBack }) => (
  <SceneWrapper sceneNumber={10} onBack={onBack}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <Slideshow 
        images={[
          { src: "https://placehold.co/500x400/0066CC/FFFFFF?text=Vertex+HQ+Experience", alt: "Vertex Headquarters" },
          { src: "https://placehold.co/500x400/4169E1/FFFFFF?text=King+of+Prussia+Office", alt: "King of Prussia Office" },
          { src: "https://placehold.co/500x400/1E90FF/FFFFFF?text=Intern+Connections", alt: "Intern Connections" },
          { src: "https://placehold.co/500x400/00BFFF/FFFFFF?text=Hackathon+Team", alt: "Hackathon Team" },
          { src: "https://placehold.co/500x400/87CEEB/FFFFFF?text=E-Invoice+Verifier", alt: "E-Invoice Verifier" }
        ]} 
        delay={0.3} 
      />
      <ContentCard direction="right" delay={0.6}>
        <motion.h1 
          style={{ color: theme.primary, fontSize: '2.2rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace", textAlign: 'center' }}
          initial={{ opacity: 0, x: 200 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          🏢 Understanding Vertex at its Core
        </motion.h1>
        <motion.div 
          style={{ fontSize: '1.2rem', lineHeight: '1.6', color: theme.dark }}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.3, duration: 1 }}
        >
          <div style={{background: 'rgba(0,102,204,0.1)', padding: '1.5rem', borderRadius: '15px', marginBottom: '1.5rem'}}>
            <p><strong style={{color: theme.primary, fontSize: '1.3rem'}}>🚀 In-Person Launchpad Event</strong></p>
            <p style={{marginTop: '1rem'}}>Visited the head office in <strong>King of Prussia</strong></p>
            <ul style={{marginLeft: '1rem', marginTop: '1rem'}}>
              <li>🤝 Connected with fellow interns</li>
              <li>👥 Interacted with senior leaders</li>
              <li>🌐 Learned about different teams across Vertex</li>
              <li>🔗 Understood how teams collaborate</li>
              <li>💼 Gained insights into company culture</li>
            </ul>
          </div>
          
          <div style={{background: 'rgba(255,102,0,0.1)', padding: '1.5rem', borderRadius: '15px'}}>
            <p><strong style={{color: theme.secondary, fontSize: '1.3rem'}}>🏆 Hackathon Experience</strong></p>
            <p style={{marginTop: '1rem'}}>Built <strong>"E-Invoice Verifier"</strong> - a real-time solution for Vertex!</p>
            <ul style={{marginLeft: '1rem', marginTop: '1rem'}}>
              <li>💻 Real-time development under pressure</li>
              <li>🎯 Created something genuinely useful for Vertex</li>
              <li>🤝 Amazing team collaboration</li>
              <li>📚 Incredible learning experience</li>
            </ul>
            <p style={{marginTop: '1rem', fontStyle: 'italic'}}>We didn't win, but the experience was priceless!</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, rotate: 0 }} 
            animate={{ opacity: 1, rotate: [0, 360] }} 
            transition={{ delay: 2, duration: 2 }} 
            style={{ fontSize: '1.5rem', textAlign: 'center', marginTop: '1rem', color: theme.secondary }}
          >
            🚀 Launching ideas and building connections!
          </motion.div>
        </motion.div>
      </ContentCard>
    </div>
    <StyledButton onClick={onNext} delay={2.5}>My Journey Altogether</StyledButton>
  </SceneWrapper>
);

const Scene11 = ({ onNext, onBack }) => {
  const highlights = [
    'https://placehold.co/800x500/0066CC/FFFFFF?text=Dashboard+Success',
    'https://placehold.co/800x500/FF6600/FFFFFF?text=Spring+Boot+Mastery', 
    'https://placehold.co/800x500/00B4D8/FFFFFF?text=Security+Champion',
    'https://placehold.co/800x500/8A2BE2/FFFFFF?text=OCR+AI+Innovation',
    'https://placehold.co/800x500/228B22/FFFFFF?text=Team+Collaboration',
    'https://placehold.co/800x500/FF1493/FFFFFF?text=Hackathon+Spirit'
  ];

  return (
    <SceneWrapper sceneNumber={11} onBack={onBack}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '2rem' }}>
        <ContentCard delay={0.3}>
          <motion.h1 
            style={{ color: theme.primary, fontSize: '3rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace", textAlign: 'center' }}
            initial={{ y: -50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            📚 The Lessons Learned
          </motion.h1>
          <motion.div 
            style={{ fontSize: '1.3rem', lineHeight: '1.8', color: theme.dark, textAlign: 'center' }}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1, duration: 1 }}
          >
            <div style={{background: 'linear-gradient(135deg, rgba(0,102,204,0.1), rgba(255,102,0,0.1))', padding: '2rem', borderRadius: '20px', marginBottom: '2rem'}}>
              <p><strong style={{color: theme.primary, fontSize: '1.4rem'}}>🚀 Growth as a Developer:</strong></p>
              <ul style={{textAlign: 'left', marginTop: '1rem', marginLeft: '2rem'}}>
                <li>🔧 Mastered full-stack development across multiple teams</li>
                <li>🤝 Learned the power of asking questions and collaboration</li>
                <li>🛡️ Understood the critical importance of testing and security</li>
                <li>🏗️ Gained experience in infrastructure as code with Terraform</li>
                <li>🤖 Contributed to cutting-edge AI projects from the ground up</li>
                <li>📊 Appreciated the value of monitoring and observability</li>
              </ul>
            </div>
            
            <p style={{fontSize: '1.2rem', color: theme.secondary, fontStyle: 'italic'}}>
              "Every challenge was a stepping stone, every bug was a lesson, every collaboration was growth."
            </p>
          </motion.div>
        </ContentCard>
        
        <motion.div 
          style={{ 
            position: 'relative', 
            width: '70%', 
            height: '300px', 
            marginTop: '2rem', 
            overflow: 'hidden',
            borderRadius: '25px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <AnimatePresence>
            {highlights.map((src, index) => (
              <motion.img
                key={index}
                src={src}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '25px'
                }}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 1.5, 
                  delay: index * 2, 
                  repeat: Infinity, 
                  repeatDelay: (highlights.length - 1) * 2 
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        
        <motion.div 
          style={{ 
            textAlign: 'center', 
            fontSize: '1.4rem', 
            color: theme.primary, 
            marginTop: '2rem',
            background: theme.cardBg,
            padding: '1.5rem',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
        >
          💝 <strong style={{color: theme.secondary}}>Gratitude:</strong> To Vertex Inc, my mentors, teammates, and this incredible journey that transformed me from a curious student into a confident developer ready to tackle any challenge!
        </motion.div>
      </div>
      <StyledButton onClick={onNext} delay={3}>Thank You</StyledButton>
    </SceneWrapper>
  );
};

const FinalScene = ({ onBack }) => (
  <SceneWrapper sceneNumber={12} onBack={onBack}>
    <motion.div
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%', 
        textAlign: 'center'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <motion.h1 
        style={{ color: theme.primary, fontSize: '8rem', fontFamily: "'Orbitron', monospace", textShadow: '0 0 30px rgba(0,102,204,0.5)' }} 
        initial={{ scale: 0, rotate: -180 }} 
        animate={{ scale: 1, rotate: 0 }} 
        transition={{ duration: 2, type: 'spring', stiffness: 50 }}
      >
        Thank You
      </motion.h1>
      
      <motion.p 
        style={{ color: theme.secondary, fontSize: '3rem', marginTop: '2rem', textShadow: '0 0 20px rgba(255,102,0,0.5)' }} 
        initial={{ opacity: 0, y: 100 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 1, duration: 1 }}
      >
        An epic journey ends... but the adventure continues! 🚀
      </motion.p>
      
      <motion.div
        style={{ fontSize: '4rem', marginTop: '3rem' }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1], rotate: [0, 360, 0] }}
        transition={{ delay: 2, duration: 3, repeat: Infinity, repeatDelay: 2 }}
      >
        🌟✨🚀✨🌟
      </motion.div>
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: theme.cardBg,
          padding: '1rem 2rem',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          fontSize: '1.2rem',
          color: theme.dark
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        Thank you for joining me on this incredible journey at Vertex Inc! 🙏
      </motion.div>
    </motion.div>
  </SceneWrapper>
);

// Main App Component
const scenes = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8, Scene9, Scene10, Scene11, FinalScene];

const VertexJourneyApp = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    if (currentScene < scenes.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      
      // Add a delay to ensure the transition animation starts
      setTimeout(() => {
        completeTransition();
      }, 1000); // Complete transition after rocket starts flying
    }
  };

  const handleBack = () => {
    if (currentScene > 0 && !isTransitioning) {
      setIsTransitioning(true);
      
      // Add a delay to ensure the transition animation starts
      setTimeout(() => {
        completeBackTransition();
      }, 1000); // Complete transition after rocket starts flying
    }
  };

  const completeTransition = () => {
    setCurrentScene(prev => prev + 1);
    setIsTransitioning(false);
  };

  const completeBackTransition = () => {
    setCurrentScene(prev => prev - 1);
    setIsTransitioning(false);
  };

  const CurrentScene = scenes[currentScene];

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden', background: theme.dark }}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key={currentScene}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            initial={{ opacity: 0, x: '100vw' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100vw' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <CurrentScene onNext={handleNext} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>

      {isTransitioning && (
        <motion.div
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            background: theme.gradient,
            zIndex: 1000, 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'center',
            overflow: 'hidden'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            style={{ position: 'absolute', bottom: '0', transformOrigin: 'center' }}
            initial={{ y: 0, x: 0, rotate: 0 }}
            animate={{
              y: '-120vh',
              x: [0, 400, -400, 300, -200, 0],
              rotate: [0, 45, -45, 90, -90, 0],
            }}
            transition={{ 
              duration: 2.5, 
              ease: 'easeInOut'
            }}
          >
            <Rocket trail={true} />
          </motion.div>
          
          <motion.div
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}
          >
            <motion.p
              style={{ 
                color: 'white', 
                fontSize: '4rem', 
                textShadow: '0 0 20px rgba(0,0,0,0.8)',
                fontFamily: "'Orbitron', monospace",
                fontWeight: 'bold'
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0.5, 1.2, 0.5],
                rotate: [0, 360, 0]
              }}
              transition={{ duration: 2.5 }}
            >
              🌌 Zooming to the next adventure! 🚀
            </motion.p>
          </motion.div>

          {/* Particle effects during transition */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: i % 2 === 0 ? theme.primary : theme.secondary,
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5, 0], 
                opacity: [0, 1, 0],
                y: [0, -200, -400]
              }}
              transition={{ 
                duration: 2, 
                delay: Math.random() * 2,
                repeat: 1
              }}
            />
          ))}
        </motion.div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Space Grotesk', sans-serif;
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          div[style*="display: flex"] > div {
            flex-direction: column !important;
            justify-content: center;
            align-items: center;
          }
          
          div[style*="maxWidth: '600px'"] {
            max-width: 95% !important;
            padding: 2rem !important;
          }
          
          div[style*="maxWidth: '500px'"] {
            max-width: 90% !important;
            margin: 1rem !important;
          }
          
          button {
            bottom: 1rem !important;
            right: 1rem !important;
            padding: 1rem 1.5rem !important;
            font-size: 0.9rem !important;
          }
          
          h1 {
            font-size: 2rem !important;
          }
          
          div[style*="fontSize: '8rem'"] {
            font-size: 4rem !important;
          }
          
          div[style*="fontSize: '3rem'"] {
            font-size: 2rem !important;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="padding: '3rem'"] {
            padding: 1.5rem !important;
          }
          
          h1 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VertexJourneyApp;