import React, { useState, useEffect } from 'react';
import { Book, Calculator, TrendingUp, Brain, ChevronRight, ChevronDown, Sparkles, Zap, Target, Rocket, Star, Atom } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';
import '../components/ai-education/ai-education.css';
import '../components/neural-network/neural-network.css';
import LinearAlgebra from '../components/ai-education/LinearAlgebra';
import CalculusForAI from '../components/ai-education/CalculusForAI';
import ProbabilityStats from '../components/ai-education/ProbabilityStats';
import OptimizationTheory from '../components/ai-education/OptimizationTheory';
import TokenizationDemo from '../components/ai-education/TokenizationDemo';
import NeuralNetworkSimulator from '../pages/NeuralNetworkSimulator';

const AIEducation = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [progress, setProgress] = useState({});
  const [expandedSection, setExpandedSection] = useState(null);
  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('ai-education-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('ai-education-progress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (module, topic, score) => {
    setProgress(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [topic]: score
      }
    }));
  };

  const modules = [
   
    {
      id: 'tokenization',
      title: 'AI Tokenization Demo',
      icon: Atom,
      description: 'See how AI processes human language step by step',
      topics: [
        'Text to Tokens',
        'Encoding Process',
        'Vector Embeddings',
        'Attention Mechanisms',
        'Real-world Applications'
      ],
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },
    {
      id: 'linear-algebra',
      title: 'Linear Algebra Deep Dive',
      icon: Calculator,
      description: 'Master vector spaces, matrix operations, and their connections to neural networks',
      topics: [
        'Vector Spaces & Operations',
        'Matrix Decompositions',
        'Eigenvalues & Eigenvectors',
        'Singular Value Decomposition',
        'Neural Network Connections'
      ],
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    },
    {
      id: 'calculus',
      title: 'Calculus for AI',
      icon: TrendingUp,
      description: 'Understand derivatives, gradients, and optimization in machine learning',
      topics: [
        'Multivariable Calculus',
        'Partial Derivatives',
        'Gradient & Chain Rule',
        'Backpropagation Mathematics',
        'Optimization Landscapes'
      ],
      gradient: 'from-green-500 via-teal-500 to-blue-500',
      bgPattern: 'bg-gradient-to-br from-green-50 to-teal-50'
    },
    {
      id: 'probability',
      title: 'Probability & Statistics',
      icon: Brain,
      description: 'Learn probability theory, distributions, and statistical learning',
      topics: [
        'Probability Fundamentals',
        'Bayesian Inference',
        'Distributions & Sampling',
        'Information Theory',
        'Statistical Learning Theory'
      ],
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      bgPattern: 'bg-gradient-to-br from-orange-50 to-red-50'
    },
    {
      id: 'optimization',
      title: 'Optimization Theory',
      icon: Target,
      description: 'Explore optimization algorithms used in machine learning',
      topics: [
        'Convex Optimization',
        'Gradient Methods',
        'Second-Order Methods',
        'Constrained Optimization',
        'Stochastic Methods'
      ],
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      bgPattern: 'bg-gradient-to-br from-yellow-50 to-orange-50'
    },
    {
      id: 'neural-network',
      title: 'Neural Network Simulator',
      icon: Brain,
      description: 'Build, train, and visualize neural networks interactively',
      topics: [
        'Network Architecture Builder',
        'Real-time Training Visualization',
        'Data Flow Animation',
        'Performance Analysis',
        'Educational Tutorials'
      ],
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      bgPattern: 'bg-gradient-to-br from-indigo-50 to-purple-50'
    },
  ];

  const calculateModuleProgress = (moduleId) => {
    const moduleProgress = progress[moduleId] || {};
    const topics = modules.find(m => m.id === moduleId)?.topics || [];
    const completedTopics = topics.filter(topic => moduleProgress[topic] >= 80);
    return topics.length > 0 ? (completedTopics.length / topics.length) * 100 : 0;
  };

  const FloatingParticles = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, Math.random() * 0.5 + 0.5, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );

  const renderOverview = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, 
          rgba(99, 102, 241, 0.1) 0%, 
          transparent 50%),
          linear-gradient(135deg, #667eea 0%, #764ba2 100%)
        `
      }}
    >
      <FloatingParticles />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: 'loop'
            }}
            className="inline-block mb-6"
          >
          </motion.div>
          
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 mb-6 drop-shadow-2xl">
            Complete AI Education Platform
          </h1>
          
          <motion.p 
            className="text-2xl text-blue-100 max-w-4xl mx-auto mb-8 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Master the mathematical foundations of Artificial Intelligence through interactive 
            visualizations, hands-on exercises, and real-world applications.
          </motion.p>
          
          <motion.div 
            className="mt-8 p-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <BlockMath math="AI = \text{Math} + \text{Data} + \text{Computation}" />
          </motion.div>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {modules.map((module, index) => {
            const Icon = module.icon;
            const progressPercent = calculateModuleProgress(module.id);
            
            return (
              <motion.div
                key={module.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
                whileTap={{ scale: 0.98 }}
                className={`${module.bgPattern} rounded-3xl shadow-2xl border border-white/30 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 cursor-pointer overflow-hidden relative group`}
                onClick={() => setActiveModule(module.id)}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Floating icon animation */}
                <motion.div
                  className="absolute top-4 right-4 opacity-20"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: 'loop'
                  }}
                >
                  <Icon className="w-24 h-24 text-gray-400" />
                </motion.div>
                
                <div className="p-8 relative z-10">
                  <div className="flex items-center mb-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`p-4 rounded-2xl bg-gradient-to-br ${module.gradient} shadow-lg mr-4`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800">{module.title}</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">{module.description}</p>
                  
                  {/* Animated Progress bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Progress</span>
                      <motion.span
                        key={progressPercent}
                        initial={{ scale: 1.2, color: '#3b82f6' }}
                        animate={{ scale: 1, color: '#6b7280' }}
                        transition={{ duration: 0.3 }}
                      >
                        {Math.round(progressPercent)}%
                      </motion.span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                      <motion.div 
                        className={`h-3 rounded-full bg-gradient-to-r ${module.gradient} shadow-lg`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                  
                  {/* Topics with animations */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <motion.button
                      className="flex items-center text-lg font-semibold text-gray-700 mb-3 hover:text-gray-900 transition-colors"
                      onClick={() => setExpandedSection(expandedSection === module.id ? null : module.id)}
                      whileHover={{ x: 5 }}
                    >
                      Topics
                      <motion.div
                        animate={{ rotate: expandedSection === module.id ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </motion.div>
                    </motion.button>
                    
                    <AnimatePresence>
                      {expandedSection === module.id && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2 overflow-hidden"
                        >
                          {module.topics.map((topic, topicIndex) => {
                            const isCompleted = (progress[module.id]?.[topic] || 0) >= 80;
                            return (
                              <motion.li 
                                key={topic}
                                className="flex items-center text-gray-600"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: topicIndex * 0.05 }}
                              >
                                <motion.div 
                                  className={`w-3 h-3 rounded-full mr-3 ${
                                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                                  animate={{ 
                                    scale: isCompleted ? [1, 1.2, 1] : 1,
                                  }}
                                  transition={{ duration: 0.5 }}
                                />
                                {topic}
                              </motion.li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <motion.button 
                    className={`mt-6 w-full bg-gradient-to-r ${module.gradient} text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group`}
                    onClick={() => setActiveModule(module.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Start Learning
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Learning Path Visualization */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-8 text-center">🚀 Recommended Learning Path</h2>
          
          <div className="flex flex-wrap justify-center items-center gap-6">
            {modules.map((module, index) => (
              <React.Fragment key={module.id}>
                <motion.div 
                  className="text-center group cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setActiveModule(module.id)}
                >
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r ${module.gradient} rounded-full flex items-center justify-center shadow-xl mb-3 relative`}
                    animate={{ 
                      boxShadow: [
                        '0 0 20px rgba(59, 130, 246, 0.3)',
                        '0 0 40px rgba(99, 102, 241, 0.5)',
                        '0 0 20px rgba(59, 130, 246, 0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-2xl font-bold text-white">{index + 1}</span>
                    

                  </motion.div>
                  
                  <p className="text-sm font-semibold text-white group-hover:text-yellow-300 transition-colors">
                    {module.title}
                  </p>
                </motion.div>
                
                {index < modules.length - 1 && (
                  <motion.div
                    animate={{ 
                      x: [0, 10, 0],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  >
                    <ChevronRight className="w-8 h-8 text-white/60" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderModule = () => {
    switch (activeModule) {
      case 'neural-network':
        return <NeuralNetworkSimulator updateProgress={updateProgress} />;
      case 'tokenization':
        return <TokenizationDemo updateProgress={updateProgress} />;
      case 'linear-algebra':
        return <LinearAlgebra updateProgress={updateProgress} />;
      case 'calculus':
        return <CalculusForAI updateProgress={updateProgress} />;
      case 'probability':
        return <ProbabilityStats updateProgress={updateProgress} />;
      case 'optimization':
        return <OptimizationTheory updateProgress={updateProgress} />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="ai-education-container w-full min-h-screen">
      {/* Enhanced Navigation Header */}
      <motion.nav 
        className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2 overflow-x-auto"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={() => setActiveModule('overview')}
                className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${
                  activeModule === 'overview' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Overview
              </motion.button>
              
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <motion.button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`px-3 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center whitespace-nowrap text-sm ${
                      activeModule === module.id 
                        ? `bg-gradient-to-r ${module.gradient} text-white shadow-lg transform scale-105` 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">{module.title}</span>
                    <span className="sm:hidden">{module.title.split(' ')[0]}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content with proper scrolling */}
      <main className="ai-education-content w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {renderModule()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AIEducation;