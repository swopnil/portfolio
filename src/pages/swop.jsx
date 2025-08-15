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

const SceneWrapper = ({ children, sceneNumber, onBack, onSceneClick }) => (
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
        zIndex: 10,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: `0 8px 25px ${theme.primary}40`
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onSceneClick}
    >
      <span style={{ 
        color: theme.primary, 
        fontWeight: 'bold', 
        fontFamily: "'Orbitron', monospace",
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        🎬 Scene {sceneNumber}/9
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
        maxWidth: '900px', 
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
const Scene1 = ({ onNext, onBack, onSceneClick }) => (
  <SceneWrapper sceneNumber={1} onBack={onBack} onSceneClick={onSceneClick}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <ContentCard direction="left" delay={0.3}>
        <motion.h1 
          style={{ color: theme.primary, fontSize: '2.8rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace" }}
          initial={{ scale: 0, rotate: -180 }} 
          animate={{ scale: 1, rotate: 0 }} 
          transition={{ delay: 0.8, duration: 1, type: 'spring' }}
        >
          I am Swopnil Panday
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
          <p><strong style={{color: theme.primary}}>💻 Passion:</strong> Soccer, Motorbikes, Building cool products</p>
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
          { src: "personal.jpeg", alt: "Welcome to Vertex" },
        ]} 
        delay={0.6} 
      />
    </div>
    <StyledButton onClick={onNext} delay={2}>Start My Vertex Journey</StyledButton>
  </SceneWrapper>
);

const Scene2 = ({ onNext, onBack, onSceneClick }) => (
  <SceneWrapper sceneNumber={2} onBack={onBack} onSceneClick={onSceneClick}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <Slideshow 
        images={[
          { src: "vtx.png", alt: "Certificate Center Team" },
          { src: "cer.png", alt: "Manager Rhonda Shaw" },
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
            <li><strong>Night Watch</strong>  </li>
            <li><strong>Dragon Keepers</strong>  </li>
            <li><strong>Delta Force</strong> </li>
          </ul>
          <p style={{marginTop: '1rem'}}><em>Started with Dragon Keepers, expanded to Night Watch for maximum impact and full-stack experience!</em></p>
        </motion.div>
      </ContentCard>
    </div>
    <StyledButton onClick={onNext} delay={2}>Let's Start Coding for Cert Center</StyledButton>
  </SceneWrapper>
);

const Scene3 = ({ onNext, onBack, onSceneClick }) => (
  <SceneWrapper sceneNumber={3} onBack={onBack} onSceneClick={onSceneClick}>
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
          <p><strong style={{color: theme.secondary}}>🤝 Collaboration:</strong> Worked alongside Daniel with Datadog</p>
          <p><strong style={{color: theme.secondary}}>👨‍🏫 Mentor:</strong> Matthew Dickens</p>
          <p><strong style={{color: theme.secondary}}>🎯 Purpose:</strong> To ensure the reliability, performance, and scalability of our systems</p>
          
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
 <Slideshow 
        images={[
          { src: "dashbord1.png", alt: "Dashboard Project" },
          { src: "dashboard2.png", alt: "SQL Monitoring" },
          { src: "obs1.png", alt: "Request Tracking" },
          { src: "monitor1.png", alt: "Error Monitoring" }
        ]} 
        delay={0.6}

      />
    </div>
    <StyledButton onClick={onNext} delay={2}>Submit the Dashboard</StyledButton>
  </SceneWrapper>
);

const Scene4 = ({ onNext, onBack, onSceneClick }) => (
  <SceneWrapper sceneNumber={4} onBack={onBack} onSceneClick={onSceneClick}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <Slideshow 
        images={[
          { src: "terra.png", alt: "Terraform Integration" }
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

const Scene5 = ({ onNext, onBack, onSceneClick }) => (
  <SceneWrapper sceneNumber={5} onBack={onBack} onSceneClick={onSceneClick}>
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
          <p>Working with <strong style={{color: theme.secondary}}>Night Watch team</strong> on Spring Boot Tickets:</p>
          
          <div style={{background: 'rgba(0,102,204,0.1)', padding: '1.5rem', borderRadius: '15px', marginTop: '1.5rem'}}>
            <p><strong>� The Journey:</strong></p>
            <ul style={{marginLeft: '1rem'}}>
              <li>Dive into <strong>Spring Boot backend</strong> (completely new!)</li>
              <li>Learn Spring Boot architecture through mentorship</li>
              <li>Write comprehensive test cases</li>
              <li>Submit first PR with confidence</li>
            </ul>
          </div>

          <div style={{background: 'rgba(255,0,0,0.1)', padding: '1.5rem', borderRadius: '15px', marginTop: '1.5rem', border: '2px solid rgba(255,0,0,0.3)'}}>
            <p><strong style={{color: '#FF0000'}}>💥 First Error Learning:</strong></p>
            <ul style={{marginLeft: '1rem', marginTop: '1rem'}}>
              <li>🔍 Discovered my own bug</li>
              <li>💡 Analyzed root cause thoroughly</li>
              <li>🔧 Implemented proper fix</li>
            </ul>
          </div>
          
          <p style={{marginTop: '1.5rem', fontStyle: 'italic', color: theme.primary}}>
            This experience taught me that every bug is a lesson in disguise - from Spring Boot basics to the critical importance of thorough testing!
          </p>
        </motion.div>
      </ContentCard>
      <Slideshow 
        images={[
          { src: "customv5.png", alt: "Spring Boot Learning" },
          { src: "spring-boot.png", alt: "Night Watch Team" },
        ]} 
        delay={0.6} 
      />
    </div>
    <StyledButton onClick={onNext} delay={2}>Security First ☁️</StyledButton>
  </SceneWrapper>
);

const Scene6 = ({ onNext, onBack, onSceneClick }) => (
  <SceneWrapper sceneNumber={6} onBack={onBack} onSceneClick={onSceneClick}>
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
          { src: "cert.png", alt: "Security Fixes" }
        ]} 
        delay={0.6} 
      />
    </div>
    <StyledButton onClick={onNext} delay={2}>Get Things Serious</StyledButton>
  </SceneWrapper>
);

const Scene7 = ({ onNext, onBack, onSceneClick }) => (
  <SceneWrapper sceneNumber={7} onBack={onBack} onSceneClick={onSceneClick}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <ContentCard direction="left" delay={0.3}>
        <motion.h1 
          style={{ color: theme.secondary, fontSize: '2.3rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace", textAlign: 'center' }}
          initial={{ y: 200, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          🤖 
        </motion.h1>
        <motion.div 
          style={{ fontSize: '1.2rem', lineHeight: '1.6', color: theme.dark }}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1, duration: 1 }}
        >
          <div style={{background: 'linear-gradient(135deg, rgba(138,43,226,0.1), rgba(0,102,204,0.1))', padding: '1.5rem', borderRadius: '15px', border: '2px solid rgba(138,43,226,0.3)', marginBottom: '1.5rem'}}>
            <p><strong style={{color: '#8A2BE2', fontSize: '1.3rem'}}>🚀 Automated Certificate Ingestion and Validation</strong></p>
            <p>Integrating AI-powered models to bring cutting-edge benefits directly to customers!</p>
            
            <div style={{marginTop: '1rem', background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '10px'}}>
              <p><strong>My Deep Dive Approach:</strong></p>
              <ul style={{marginLeft: '1rem', fontSize: '0.95rem'}}>
                <li>📅 Attended every meeting to understand project lifecycle</li>
                <li>🔍 Reviewed every PR for system understanding</li>
                <li>💡 Absorbed every learning opportunity</li>
              </ul>
            </div>
          </div>

          <div style={{background: 'rgba(255,102,0,0.1)', padding: '1.5rem', borderRadius: '15px'}}>
            <p><strong style={{color: theme.secondary}}>� UI Foundation Work:</strong></p>
            <ul style={{marginLeft: '1rem', marginTop: '0.5rem', fontSize: '0.95rem'}}>
              <li>✅ Built comprehensive validation systems</li>
              <li>🚨 Implemented advanced error handling</li>
              <li>🎭 Developed flexible mocking for testing</li>
              <li>📡 Created API integration for add/edit pages</li>
              <li>🧪 Cypress tests for changes made</li>
            </ul>
          </div>
          
          <p style={{marginTop: '1.5rem', fontSize: '1.1rem', color: theme.primary, textAlign: 'center'}}>
            � Learning big-scale frontend development while contributing to AI innovation!
          </p>
        </motion.div>
      </ContentCard>
      <Slideshow 
        images={[
          { src: "ocr.png", alt: "OCR Project" },
          { src: "ocrsuccess.png", alt: "OCR UI Foundation" },
          { src: "ocrwarning.png", alt: "Validation Systems" },
          { src: "ocrpr.png", alt: "Mock Environment" },
          { src: "ocrpr2.png", alt: "API Integration" }
        ]} 
        delay={0.6} 
      />
    </div>
    <StyledButton onClick={onNext} delay={2}>Understanding Vertex Culture</StyledButton>
  </SceneWrapper>
);

const Scene8 = ({ onNext, onBack, onSceneClick }) => (
  <SceneWrapper sceneNumber={8} onBack={onBack} onSceneClick={onSceneClick}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
      <ContentCard delay={0.3}>
        <motion.h1 
          style={{ color: theme.primary, fontSize: '2.2rem', marginBottom: '1.5rem', fontFamily: "'Orbitron', monospace", textAlign: 'center' }}
          initial={{ y: -50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          🏢 Launchpad & Lessons Learned
        </motion.h1>
        <motion.div 
          style={{ fontSize: '1.1rem', lineHeight: '1.6', color: theme.dark }}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1, duration: 1 }}
        >
          <div style={{background: 'rgba(0,102,204,0.1)', padding: '1.5rem', borderRadius: '15px', marginBottom: '1.5rem'}}>
            <p><strong style={{color: theme.primary, fontSize: '1.2rem'}}>🚀 Launchpad Experience</strong></p>
            <p>Visited King of Prussia office - connected with interns, leaders, and teams</p>
            <p style={{marginTop: '0.5rem'}}>🏆 Built "E-Invoice Verifier" at hackathon!</p>
          </div>

          <div style={{background: 'linear-gradient(135deg, rgba(0,102,204,0.1), rgba(255,102,0,0.1))', padding: '1.5rem', borderRadius: '15px'}}>
            <p><strong style={{color: theme.primary, fontSize: '1.2rem'}}>🚀 Key Growth Areas:</strong></p>
            <ul style={{marginTop: '1rem', fontSize: '0.95rem'}}>
              <li>🔧 Full-stack experience</li>
              <li>🤝 Collaborative problem-solving</li>
              <li>🛡️ Security-first mindset</li>
              <li>🏗️ Infrastructure experience</li>
              <li>📦 API design and integration</li>
            </ul>
          </div>
          
          <motion.div 
            style={{ 
              textAlign: 'center', 
              fontSize: '1.1rem', 
              color: theme.primary, 
              marginTop: '1.5rem',
              background: 'rgba(0,102,204,0.1)',
              padding: '1rem',
              borderRadius: '15px',
              border: `1px solid ${theme.primary}30`
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            💝 <strong style={{color: theme.secondary}}>Grateful</strong> for this transformative journey at Vertex Inc!
          </motion.div>
        </motion.div>
      </ContentCard>
      
      <Slideshow 
        images={[
          { src: "launchpad.png", alt: "Vertex Headquarters" },
          { src: "dashboard2.png", alt: "Dashboard Success" },
          { src: "ocrsuccess.png", alt: "OCR Innovation" },
          { src: "terra.png", alt: "Infrastructure Growth" }
        ]} 
        delay={0.6} 
      />
    </div>
    <StyledButton onClick={onNext} delay={2.5}>Thank You, Vertex!</StyledButton>
  </SceneWrapper>
);

const Scene9 = ({ onBack, onSceneClick }) => (
  <SceneWrapper sceneNumber={9} onBack={onBack} onSceneClick={onSceneClick}>
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
const scenes = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8, Scene9];

// Timer Component
const Timer = () => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        bottom: '0rem',
        right: '2rem',
        background: theme.cardBg,
        backdropFilter: 'blur(15px)',
        padding: '0.75rem 1rem',
        borderRadius: '20px',
        boxShadow: '0 8px 25px rgba(0, 102, 204, 0.3)',
        border: `2px solid rgba(0, 102, 204, 0.3)`,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: "'Orbitron', monospace",
        fontSize: '0.9rem',
        color: theme.primary,
        fontWeight: 'bold'
      }}
      initial={{ opacity: 0, scale: 0, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: theme.secondary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        ⏱️
      </motion.div>
      {formatTime(timeElapsed)}
    </motion.div>
  );
};

// Scene Navigator Component
const SceneNavigator = ({ currentScene, onSceneSelect, onClose }) => {
  const sceneNames = [
    "Introduction",
    "Certificate Center Team",
    "Observability",
    "Development Team",
    "Spring Boot & Security Experience",
    "Security Team",
    "Automated Certificate Ingestion and Validation",
    "Launchpad & Lessons Learned",
    "Thank You"
  ];

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        style={{
          background: theme.cardBg,
          borderRadius: '25px',
          padding: '3rem',
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px rgba(0, 102, 204, 0.5)',
          border: `2px solid ${theme.primary}30`
        }}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: theme.primary,
            fontFamily: "'Orbitron', monospace",
            fontSize: '2rem',
            margin: 0
          }}>
            🎬 Scene Navigator
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: `2px solid ${theme.primary}`,
              color: theme.primary,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          maxHeight: '60vh',
          overflow: 'auto'
        }}>
          {sceneNames.map((name, index) => (
            <motion.div
              key={index}
              style={{
                background: currentScene === index 
                  ? `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)`
                  : 'rgba(255, 255, 255, 0.1)',
                border: currentScene === index 
                  ? `2px solid ${theme.primary}`
                  : '2px solid transparent',
                borderRadius: '15px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(5px)'
              }}
              whileHover={{
                scale: 1.05,
                background: `linear-gradient(135deg, ${theme.primary}30, ${theme.secondary}30)`
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSceneSelect(index)}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: currentScene === index 
                    ? theme.primary 
                    : `${theme.primary}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: "'Orbitron', monospace"
                }}>
                  {index + 1}
                </div>
                <div>
                  <h3 style={{
                    color: theme.primary,
                    margin: 0,
                    fontSize: '1.1rem',
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}>
                    {name}
                  </h3>
                  {currentScene === index && (
                    <p style={{
                      color: theme.secondary,
                      margin: '0.5rem 0 0 0',
                      fontSize: '0.9rem',
                      fontStyle: 'italic'
                    }}>
                      Currently viewing
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const VertexJourneyApp = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSceneNavigator, setShowSceneNavigator] = useState(false);

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

  const jumpToScene = (sceneIndex) => {
    if (sceneIndex !== currentScene && !isTransitioning) {
      setCurrentScene(sceneIndex);
      setShowSceneNavigator(false);
    }
  };

  const toggleSceneNavigator = () => {
    setShowSceneNavigator(!showSceneNavigator);
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
            <CurrentScene 
              onNext={handleNext} 
              onBack={handleBack} 
              onSceneClick={toggleSceneNavigator}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene Navigator Overlay */}
      <AnimatePresence>
        {showSceneNavigator && (
          <SceneNavigator
            currentScene={currentScene}
            onSceneSelect={jumpToScene}
            onClose={() => setShowSceneNavigator(false)}
          />
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

      {/* Timer Component - Always visible */}
      <Timer />

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
          
          /* Timer responsive styles */
          div[style*="position: fixed"][style*="bottom: '2rem'"][style*="right: '2rem'"] {
            bottom: 1rem !important;
            right: 1rem !important;
            padding: 0.5rem 0.75rem !important;
            font-size: 0.8rem !important;
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