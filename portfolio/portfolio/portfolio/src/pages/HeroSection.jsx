import React from 'react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon, Mail, Download, Brain, Code, Briefcase, Book } from 'lucide-react';

const HeroSection = () => {
  const sectionButtons = [
    {
      id: 'skills',
      label: 'My Skills',
      description: 'Discover my journey in tech',
      icon: Brain,
      position: 'left-[20%] top-[30%]',
      line: 'M100,150 C150,150 200,100 250,100'
    },
    {
      id: 'projects',
      label: 'Projects',
      description: 'See what I\'ve built',
      icon: Code,
      position: 'right-[20%] top-[40%]',
      line: 'M300,200 C250,200 200,150 150,150'
    },
    {
      id: 'experience',
      label: 'Experience',
      description: 'Where I\'ve worked',
      icon: Briefcase,
      position: 'left-[25%] bottom-[30%]',
      line: 'M100,250 C150,250 200,300 250,300'
    },
    {
      id: 'education',
      label: 'Education',
      description: 'My academic journey',
      icon: Book,
      position: 'right-[25%] bottom-[25%]',
      line: 'M300,300 C250,300 200,250 150,250'
    }
  ];

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen px-8">
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* Profile and Name */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl mb-8"
          >
            <img
              src="portfolio/public/per.jpeg"
              alt="Swopnil Panday"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-7xl font-bold text-center mb-4"
          >
            Swopnil Panday
          </motion.h1>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl max-w-2xl text-center mb-8"
          >
            Passionate about building technology that better lives, combining my love for AI/ML and software development to turn creative ideas into real solutions.
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-4 flex-wrap mb-12"
          >
            <a href="https://github.com/swopnil" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <GithubIcon size={24} />
            </a>
            <a href="https://linkedin.com/in/swopnil" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <LinkedinIcon size={24} />
            </a>
            <a href="mailto:spanday@villanova.edu" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <Mail size={24} />
            </a>
            <a href="/resume.pdf" className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              <Download size={20} />
              Resume
            </a>
          </motion.div>

          {/* Interactive Character and Buttons */}
          <div className="relative w-full max-w-4xl h-[400px] mt-8">
            {/* Character SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="white" />
                </marker>
              </defs>
              
              {/* Simple character illustration */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <path
                  d="M200,150 C180,150 170,160 170,180 L170,250 C170,270 180,280 200,280 C220,280 230,270 230,250 L230,180 C230,160 220,150 200,150"
                  fill="white"
                  opacity="0.9"
                />
                <circle cx="200" cy="120" r="30" fill="white" opacity="0.9" />
              </motion.g>

              {/* Connection lines */}
              {sectionButtons.map((button, index) => (
                <motion.path
                  key={index}
                  d={button.line}
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.5"
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 1, delay: 1 + index * 0.2 }}
                />
              ))}
            </svg>

            {/* Interactive Buttons */}
            {sectionButtons.map((button, index) => (
              <Link
                key={button.id}
                to={button.id}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 + index * 0.2 }}
                  className={`absolute ${button.position} transform -translate-x-1/2 -translate-y-1/2`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="p-4 bg-white/10 backdrop-blur-lg rounded-xl hover:bg-white/20 transition-colors cursor-pointer group">
                      <button.icon size={24} className="text-white" />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="font-semibold">{button.label}</p>
                      <p className="text-sm text-white/80">{button.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;