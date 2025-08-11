import React, { useState, useEffect } from 'react';
import { ChevronRight, Code, Database, Shield, Zap, Users, Rocket, Star, Award, Heart, Terminal, Bug, Lock, Scan, Building, Lightbulb, ArrowDown, Network, Moon, Sparkles } from 'lucide-react';

const VertexJourney = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isRocketAnimating, setIsRocketAnimating] = useState(false);
  const [showRocket, setShowRocket] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const vertexColors = {
    primary: '#0074B8',
    secondary: '#1976D2', 
    accent: '#FF6F00',
    green: '#4CAF50',
    light: '#F8FCFF',
    dark: '#0D47A1'
  };

  const scenes = [
    // Scene 1 - Intro with large personal photo
    {
      id: 'intro',
      content: (
        <div className="min-h-screen w-full relative flex items-center justify-center">
          {/* Background with Vertex colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 opacity-90"></div>
          
          {/* Large personal photo with overlay */}
          <div className="absolute inset-0">
            <img src="/cg.png" alt="Swopnil Panday" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
          </div>
          
          {/* Content overlay */}
          <div className="relative z-10 text-white max-w-4xl mx-auto px-8">
            <div className="text-left">
              <h1 className="text-7xl font-bold mb-6 leading-tight">
                Swopnil
                <br />
                <span className="text-orange-400">Panday</span>
              </h1>
              <h2 className="text-2xl font-light mb-8 text-blue-100">
                Villanova Senior • CS & Math • Full-Stack Developer
              </h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl">
                <p className="text-xl leading-relaxed">
                  From discovering Vertex through alumni connections to becoming 
                  a full-stack developer - this is my journey of growth, challenges, 
                  and achievements.
                </p>
              </div>
              <button 
                onClick={() => setCurrentScene(1)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 flex items-center space-x-3"
              >
                <span>Start My Vertex Journey</span>
                <Rocket className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Small rocket icon */}
          <div className="absolute bottom-10 right-10">
            <Rocket className="w-8 h-8 text-orange-400 animate-bounce" />
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>
      )
    },

    // Scene 2 - Rocket Launch with full-screen animation
    {
      id: 'rocket-launch',
      content: (
        <div className="min-h-screen w-full relative flex items-center justify-center bg-gradient-to-b from-white via-blue-100 to-blue-600">
          {/* Rocket animation taking full screen */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-8">
              <Rocket className="w-64 h-64 text-blue-600 animate-bounce" style={{animationDuration: '3s'}} />
              {/* Rocket trail effects */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-32 bg-gradient-to-t from-orange-500 via-red-500 to-yellow-400 rounded-full opacity-80 animate-pulse"></div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-yellow-300 rounded-full animate-ping"></div>
              </div>
              {/* Smoke particles */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                {Array.from({length: 6}).map((_, i) => (
                  <div key={i} className={`absolute w-4 h-4 bg-gray-300 rounded-full opacity-60 animate-ping`} 
                       style={{
                         left: `${(i * 20) - 50}px`,
                         animationDelay: `${i * 0.3}s`,
                         animationDuration: '2s'
                       }}></div>
                ))}
              </div>
            </div>
            <h1 className="text-6xl font-bold text-white text-center mb-4 animate-pulse">
              Taking Off! 🚀
            </h1>
            <p className="text-2xl text-white/80 text-center max-w-2xl">
              My journey at Vertex begins...
            </p>
          </div>
          
          {/* Background stars */}
          {Array.from({length: 20}).map((_, i) => (
            <div key={i} 
                 className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
                 style={{
                   left: `${Math.random() * 100}%`,
                   top: `${Math.random() * 100}%`,
                   animationDelay: `${Math.random() * 3}s`,
                   animationDuration: `${2 + Math.random() * 2}s`
                 }}
            ></div>
          ))}
        </div>
      )
    },

    // Scene 3 - Vertex Launchpad Event with photo collage
    {
      id: 'vertex-launchpad',
      content: (
        <div className="min-h-screen w-full relative flex items-center justify-center">
          {/* Background collage with low opacity */}
          <div className="absolute inset-0">
            <div className="relative w-full h-full">
              <img src="/cg.png" alt="Vertex Launchpad Event" className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-blue-800/80"></div>
            </div>
          </div>
          
          {/* Foreground content */}
          <div className="relative z-10 max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h1 className="text-7xl font-bold text-white mb-6">
                Vertex <span className="text-orange-400">Launchpad</span>
              </h1>
              <p className="text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                In-person experience at King of Prussia headquarters - 
                meeting people, understanding company culture, and building connections
              </p>
            </div>
            
            {/* Large vibrant photo */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <img src="/cg.png" alt="Launchpad Event" className="w-full h-64 object-cover rounded-2xl shadow-2xl" />
                </div>
                <div className="text-white">
                  <h2 className="text-4xl font-bold mb-6">The Experience</h2>
                  <div className="space-y-4 text-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-6 h-6 text-orange-400" />
                      <span>Connected with fellow interns</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building className="w-6 h-6 text-orange-400" />
                      <span>Explored company culture</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Heart className="w-6 h-6 text-orange-400" />
                      <span>Felt the energy of innovation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Network of connections visualization */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8">
              <h3 className="text-3xl font-bold text-white text-center mb-8">Building Connections</h3>
              <div className="flex justify-center items-center space-x-8">
                {['Interns', 'Mentors', 'Teams', 'Leaders'].map((group, i) => (
                  <div key={group} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-3 mx-auto animate-pulse" style={{animationDelay: `${i * 0.5}s`}}>
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-semibold">{group}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Scene 4 - Hackathon Project with project screenshots
    {
      id: 'hackathon-project',
      content: (
        <div className="min-h-screen w-full relative flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          {/* Code scrolling background animation */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="animate-pulse text-green-400 font-mono text-xs leading-relaxed whitespace-pre">
              {Array.from({length: 50}).map((_, i) => (
                <div key={i} className="mb-2">
                  {`function eInvoiceVerifier() {\n  const [invoice, setInvoice] = useState();\n  return <div>Verifying...</div>;\n}`}
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-8">
            {/* Main project showcase */}
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold text-white mb-6">
                eInvoice <span className="text-orange-400">Verifier</span>
              </h1>
              <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
                Hackathon project built in real-time - a practical tool for Vertex operations
              </p>
            </div>
            
            {/* Project screenshot panel */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Main screenshot */}
                <div className="md:col-span-2">
                  <div className="bg-black rounded-2xl p-4 shadow-2xl">
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <img src="/cg.png" alt="eInvoice Verifier Screenshot" className="w-full h-48 object-cover rounded" />
                    </div>
                  </div>
                </div>
                
                {/* Teamwork images */}
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-2xl p-4">
                    <h3 className="text-white font-bold mb-3">Team Collaboration</h3>
                    <div className="space-y-3">
                      <img src="/cg.png" alt="Team Discussion" className="w-full h-20 object-cover rounded-lg" />
                      <img src="/cg.png" alt="Coding Session" className="w-full h-20 object-cover rounded-lg" />
                      <img src="/cg.png" alt="Presentation" className="w-full h-20 object-cover rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Project details */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6">
                <Code className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Real-time Development</h3>
                <p className="text-gray-300">Built from scratch during the hackathon with live problem-solving</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6">
                <Zap className="w-12 h-12 text-orange-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Practical Solution</h3>
                <p className="text-gray-300">Addresses real Vertex operational needs for invoice verification</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6">
                <Users className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Team Experience</h3>
                <p className="text-gray-300">Collaborative development with fellow interns</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Scene 5 - Collaboration & People with network graphics
    {
      id: 'collaboration-people',
      content: (
        <div className="min-h-screen w-full relative flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
          {/* Background with group discussion photo */}
          <div className="absolute inset-0">
            <img src="/cg.png" alt="Team Collaboration" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90"></div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-8">
            {/* Main title */}
            <div className="text-center mb-16">
              <h1 className="text-7xl font-bold text-white mb-6">
                People & <span className="text-orange-400">Collaboration</span>
              </h1>
              <p className="text-2xl text-purple-100 max-w-3xl mx-auto">
                The heart of Vertex - amazing people, shared innovation, and collaborative spirit
              </p>
            </div>
            
            {/* Animated network graphic */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 mb-12">
              <div className="relative">
                {/* Central hub */}
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                {/* Connection nodes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                  {[
                    {icon: Users, label: 'Mentors', color: 'from-blue-400 to-blue-600'},
                    {icon: Code, label: 'Developers', color: 'from-green-400 to-green-600'},
                    {icon: Building, label: 'Teams', color: 'from-purple-400 to-purple-600'},
                    {icon: Star, label: 'Leaders', color: 'from-pink-400 to-pink-600'}
                  ].map((item, i) => (
                    <div key={item.label} className="text-center relative">
                      {/* Connection lines */}
                      <div className={`absolute top-1/2 ${i < 2 ? 'left-full' : 'right-full'} w-16 h-0.5 bg-gradient-to-r from-orange-400 to-transparent transform -translate-y-1/2 animate-pulse`} style={{animationDelay: `${i * 0.5}s`}}></div>
                      
                      <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg animate-bounce`} style={{animationDelay: `${i * 0.3}s`, animationDuration: '3s'}}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white font-semibold">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Key insights */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6">
                <Users className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Team Spirit</h3>
                <p className="text-gray-300">Working across Dragon Keepers and Night Watch taught me collaboration</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6">
                <Lightbulb className="w-12 h-12 text-orange-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Shared Innovation</h3>
                <p className="text-gray-300">Every project was a team effort with shared learning and growth</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6">
                <Network className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Connected Network</h3>
                <p className="text-gray-300">Built lasting connections that extend beyond the internship</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Scene 6 - Closing with night sky and twinkling stars
    {
      id: 'closing',
      content: (
        <div className="min-h-screen w-full relative flex items-center justify-center bg-gradient-to-b from-gray-900 via-blue-900 to-black">
          {/* Night sky background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-black"></div>
            {/* Twinkling stars */}
            {Array.from({length: 50}).map((_, i) => (
              <div key={i}
                   className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                   style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`,
                     animationDelay: `${Math.random() * 3}s`,
                     animationDuration: `${2 + Math.random() * 2}s`
                   }}
              ></div>
            ))}
            {/* Larger twinkling stars */}
            {Array.from({length: 20}).map((_, i) => (
              <div key={i}
                   className="absolute w-2 h-2 bg-blue-200 rounded-full animate-ping"
                   style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`,
                     animationDelay: `${Math.random() * 4}s`,
                     animationDuration: `${3 + Math.random() * 2}s`
                   }}
              ></div>
            ))}
          </div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
            {/* Floating Vertex logo */}
            <div className="mb-12">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl animate-bounce mb-8" style={{animationDuration: '4s'}}>
                <img src="/cg.png" alt="Vertex Logo" className="w-16 h-16 object-contain" />
              </div>
            </div>
            
            {/* Main message */}
            <div className="text-white space-y-8">
              <h1 className="text-7xl font-bold mb-8">
                The Journey
                <br />
                <span className="text-orange-400">Continues...</span>
              </h1>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-12">
                <p className="text-2xl leading-relaxed mb-6">
                  From a curious computer science student to a confident full-stack developer,
                  from individual contributor to collaborative team member.
                </p>
                <p className="text-xl text-blue-200">
                  This internship has been more than just work - it's been a transformative journey
                  of growth, learning, and building lasting connections.
                </p>
              </div>
              
              {/* Achievement highlights */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6">
                  <Code className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Technical Growth</h3>
                  <p className="text-gray-300">Full-stack development mastery</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6">
                  <Users className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Team Experience</h3>
                  <p className="text-gray-300">Multi-team collaboration</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6">
                  <Heart className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Personal Growth</h3>
                  <p className="text-gray-300">Problem solver mindset</p>
                </div>
              </div>
              
              {/* Final gratitude */}
              <div className="text-3xl font-bold text-center space-y-4">
                <p className="text-blue-200">Thank you, Vertex,</p>
                <p className="text-white">for this incredible</p>
                <p className="text-orange-400 flex items-center justify-center space-x-3">
                  <span>rocket journey!</span>
                  <Rocket className="w-10 h-10 animate-bounce" />
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      setIsRocketAnimating(true);
      setIsTransitioning(true);
      setShowRocket(true);
      
      setTimeout(() => {
        setCurrentScene(currentScene + 1);
        setIsRocketAnimating(false);
      }, 2000);
      
      setTimeout(() => {
        setShowRocket(false);
        setIsTransitioning(false);
      }, 2500);
    } else {
      // Reset to beginning
      setCurrentScene(0);
    }
  };

  // Enhanced rocket animation with zigzag motion
  const RocketAnimation = () => (
    <div className={`fixed inset-0 pointer-events-none z-50 ${showRocket ? 'block' : 'hidden'}`}>
      <div 
        className={`absolute transition-all duration-[2000ms] ease-in-out ${
          isRocketAnimating 
            ? 'transform translate-x-[120vw] translate-y-[-30vh] rotate-45 opacity-0 scale-150' 
            : 'transform -translate-x-[200px] rotate-0 opacity-100 scale-100'
        }`}
        style={{
          left: '5%',
          top: '60%',
          filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
        }}
      >
        <div className="relative">
          <Rocket className="w-24 h-24 text-blue-500 transform rotate-45" />
          {/* Rocket trail effect */}
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 rounded-full opacity-80 animate-ping"></div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30 animate-ping" style={{animationDelay: '0.5s'}}></div>
          {/* Sparkle effects */}
          <div className="absolute -top-2 -left-2 w-3 h-3 bg-white rounded-full animate-ping opacity-70"></div>
          <div className="absolute -top-4 left-6 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-60" style={{animationDelay: '0.3s'}}></div>
        </div>
      </div>
    </div>
  );

  // Minimal particles animation
  const ParticleField = () => {
    const particles = Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${5 + Math.random() * 6}s`
        }}
      />
    ));
    return <div className="fixed inset-0 pointer-events-none">{particles}</div>;
  };

  // Progress indicator
  const ProgressBar = () => (
    <div className="fixed top-0 left-0 w-full h-2 bg-gray-200 z-40">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-500 ease-out"
        style={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
      ></div>
    </div>
  );

  // Scene navigation dots
  const NavigationDots = () => (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
      {scenes.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentScene(index)}
          className={`transition-all duration-300 rounded-full ${
            index === currentScene 
              ? 'bg-blue-600 w-8 h-3' 
              : 'bg-gray-400 hover:bg-gray-600 w-3 h-3'
          }`}
        />
      ))}
    </div>
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextScene();
      } else if (e.key === 'ArrowLeft') {
        setCurrentScene(prev => prev > 0 ? prev - 1 : scenes.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentScene]);

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      <ParticleField />
      <ProgressBar />
      <RocketAnimation />
      
      {/* Vertex Logo/Branding */}
      <div className="fixed top-4 left-4 z-30">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-white/30">
          <div className="flex items-center space-x-2">
            <img src="/cg.png" alt="Vertex" className="w-8 h-8" />
            <div>
              <span className="font-bold text-blue-700 text-base">VERTEX</span>
              <p className="text-xs text-gray-600">Intern Journey</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main scene container */}
      <div className="w-full h-screen overflow-hidden">
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            className={`${index === currentScene ? 'block' : 'hidden'} ${isTransitioning ? 'opacity-50' : 'opacity-100'} transition-opacity duration-500 w-full h-full`}
          >
            {scene.content}
          </div>
        ))}
      </div>

      <NavigationDots />
      
      {/* Navigation button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={nextScene}
          disabled={isTransitioning}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 px-6 rounded-full text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center">
            Next
            <ChevronRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
      
      {/* Clean background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-1/4 right-10 w-2 h-2 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-1/4 left-10 w-1 h-1 bg-green-400 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
      </div>

      {/* Keyboard navigation hint */}
      <div className="fixed bottom-16 right-4 text-xs text-gray-500 z-30">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-white/30">
          <p className="font-medium">Use ← → arrows or dots</p>
        </div>
      </div>
    </div>
  );
};

export default VertexJourney;