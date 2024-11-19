import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = [
  { text: "HIKING", color: "text-blue-300", side: "left", delay: 0 },
  { text: "MOTORBIKES", color: "text-purple-300", side: "right", delay: 0 },
  { text: "SOFTWARE DEVELOPMENT", color: "text-indigo-300", side: "top", delay: 1.5 },
  { text: "CYBERSECURITY", color: "text-cyan-300", side: "left", delay: 1.5 },
  { text: "SOCCER", color: "text-teal-300", side: "right", delay: 3 },
  { text: "INNOVATION", color: "text-green-300", side: "top", delay:3  },
  { text: "AI", color: "text-yellow-300", side: "left", delay: 4.5 },
  { text: "TEACH", color: "text-orange-300", side: "right", delay: 4.5 }
];

const getStartPosition = (side) => {
  switch(side) {
    case 'left': return { x: -window.innerWidth, y: Math.random() * 400 - 200 };
    case 'right': return { x: window.innerWidth, y: Math.random() * 400 - 200 };
    case 'top': return { x: Math.random() * 800 - 400, y: -window.innerHeight };
    default: return { x: 0, y: 0 };
  }
};

// Explosion particles
const Explosion = () => {
  const particles = Array.from({ length: 30 });
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const radius = Math.random() * 200 + 100;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-2 h-2 bg-white rounded-full"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: x,
              y: y,
              opacity: 0,
              scale: [1, 0]
            }}
            transition={{
              duration: 1,
              ease: "easeOut"
            }}
          />
        );
      })}
    </div>
  );
};

const WordCloud = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  
  useEffect(() => {
    const explosionTimer = setTimeout(() => {
      setShowExplosion(true);
      setTimeout(() => setShowProfile(true), 200);
    }, 9000); // 4500ms (word animations) + 200ms buffer
    return () => clearTimeout(explosionTimer);
  }, []);

  return (
    <>
      <div className="absolute inset-0">
        {words.map((word, i) => {
          const start = getStartPosition(word.side);
          
          return (
            <motion.div
              key={i}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${word.color} font-bold text-4xl md:text-5xl`}
              initial={{ 
                x: start.x,
                y: start.y,
                opacity: 0,
                scale: 1.5
              }}
              animate={{
                x: [start.x, 0],
                y: [start.y, 0],
                opacity: [0, 1, 1, 0],
                scale: [1.5, 1, 1, 0.5],
              }}
              transition={{
                duration: 5, // Increased from 3
                delay: word.delay,
                times: [0, 0.3, 0.8, 1], // Added pause in middle
                ease: "easeInOut"
              }}
            >
              {word.text}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showExplosion && <Explosion />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showProfile ? 1 : 0,
          scale: showProfile ? 1 : 0
        }}
        transition={{ 
          duration: 1,
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
      >
        <motion.div
          className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl mx-auto mb-8"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="s.jpeg"
            alt="Swopnil Panday"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={showProfile ? {
            y: 0,
            opacity: 1
          } : {}}
          transition={{ 
            delay: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="text-7xl font-bold"
        >
          Swopnil Panday
        </motion.h1>
      </motion.div>
    </>
  );
};

export default WordCloud;