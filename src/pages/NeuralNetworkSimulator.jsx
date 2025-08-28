import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Brain, Network, Zap, Target, TrendingUp, Settings, Play, Pause, 
  RotateCcw, Download, Upload, Eye, BarChart3, Layers, 
  GitBranch, Activity, Cpu, Database, BookOpen, Award,
  ChevronRight, ChevronDown, Sparkles, Atom, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NetworkBuilder from '../components/neural-network/NetworkBuilder';
import TrainingLab from '../components/neural-network/TrainingLab';
import DataFlowVisualizer from '../components/neural-network/DataFlowVisualizer';
import PerformanceAnalyzer from '../components/neural-network/PerformanceAnalyzer';
import EducationalTutorials from '../components/neural-network/EducationalTutorials';
import '../components/neural-network/neural-network.css';

const NeuralNetworkSimulator = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [networkArchitecture, setNetworkArchitecture] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingData, setTrainingData] = useState(null);
  const [modelMetrics, setModelMetrics] = useState({});
  const [expandedSection, setExpandedSection] = useState(null);

  const modules = [
    {
      id: 'educational',
      title: 'Learning Hub',
      icon: BookOpen,
      description: 'Guided tutorials, challenges, and research paper implementations',
      features: [
        'Interactive Tutorials',
        'Architecture Challenges',
        'Research Paper Demos',
        'Debugging Tools',
        'Best Practices Guide'
      ],
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      bgPattern: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      status: 'ready'
    },
    {
      id: 'network-builder',
      title: 'Architecture Designer',
      icon: Network,
      description: 'Drag-and-drop neural network architecture builder with real-time validation',
      features: [
        'Visual Layer Construction',
        'Automatic Dimension Checking',
        'Architecture Templates',
        'Custom Layer Creation',
        'Framework Export'
      ],
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      status: networkArchitecture ? 'ready' : 'empty'
    },
    {
      id: 'training-lab',
      title: 'Training Laboratory',
      icon: Activity,
      description: 'Real-time training visualization with multiple optimizers and loss functions',
      features: [
        'Live Training Visualization',
        'Multiple Optimizers',
        'Learning Rate Scheduling',
        'Regularization Techniques',
        'Batch Processing Simulation'
      ],
      gradient: 'from-green-500 via-teal-500 to-blue-500',
      bgPattern: 'bg-gradient-to-br from-green-50 to-teal-50',
      status: isTraining ? 'active' : 'ready'
    },
    {
      id: 'data-flow',
      title: 'Data Flow Visualizer',
      icon: GitBranch,
      description: 'Track tensor shapes, activations, and gradients through your network',
      features: [
        'Tensor Shape Tracking',
        'Activation Visualization',
        'Gradient Flow Analysis',
        'Weight Distribution',
        'Feature Map Explorer'
      ],
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      bgPattern: 'bg-gradient-to-br from-orange-50 to-red-50',
      status: networkArchitecture ? 'ready' : 'locked'
    },
    {
      id: 'performance-analyzer',
      title: 'Performance Suite',
      icon: BarChart3,
      description: 'Comprehensive analysis tools for model performance and behavior',
      features: [
        'Training Curves',
        'Confusion Matrices',
        'Attention Visualization',
        'Overfitting Detection',
        'Model Comparison'
      ],
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-pink-50',
      status: Object.keys(modelMetrics).length > 0 ? 'ready' : 'locked'
    },
  ];

  const FloatingNeurons = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            scale: [1, Math.random() * 1.5 + 0.5, 1],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      {/* Neural connections */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`connection-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-10"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            width: `${Math.random() * 200 + 50}px`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scaleX: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 8 + 4,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );

  const StatusIndicator = ({ status }) => {
    const statusConfig = {
      ready: { color: 'bg-green-400', pulse: false },
      active: { color: 'bg-blue-400', pulse: true },
      empty: { color: 'bg-gray-400', pulse: false },
      locked: { color: 'bg-orange-400', pulse: false }
    };
    
    const config = statusConfig[status] || statusConfig.ready;
    
    return (
      <div className="relative">
        <div className={`w-3 h-3 ${config.color} rounded-full ${config.pulse ? 'animate-pulse' : ''}`} />
        {config.pulse && (
          <div className={`absolute inset-0 ${config.color} rounded-full animate-ping`} />
        )}
      </div>
    );
  };

  const renderOverview = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full min-h-screen"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, 
          rgba(59, 130, 246, 0.1) 0%, 
          transparent 50%),
          linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)
        `
      }}
    >
      <FloatingNeurons />
      
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
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              repeatType: 'loop'
            }}
            className="inline-block mb-6"
          >
            <Brain className="w-20 h-20 text-blue-400 drop-shadow-2xl" />
          </motion.div>
          
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 drop-shadow-2xl">
            Neural Network Simulator
          </h1>
          
          <motion.p 
            className="text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Build, train, and analyze neural networks from scratch. Watch your models learn 
            in real-time with advanced visualization and debugging tools.
          </motion.p>
          
          <motion.div 
            className="mt-8 p-8 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-4xl font-bold text-blue-400 mb-2">f(x) = σ(Wx + b)</div>
            <div className="text-gray-400">The foundation of all neural computation</div>
          </motion.div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { label: 'Network Layers', value: networkArchitecture?.layers?.length || 0, icon: Layers },
            { label: 'Training Steps', value: modelMetrics.steps || 0, icon: Target },
            { label: 'Parameters', value: networkArchitecture?.parameters || 0, icon: Cpu },
            { label: 'Accuracy', value: modelMetrics.accuracy ? `${(modelMetrics.accuracy * 100).toFixed(1)}%` : '0%', icon: Award }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <stat.icon className="w-8 h-8 text-blue-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modules Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {modules.map((module, index) => {
            const Icon = module.icon;
            
            return (
              <motion.div
                key={module.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.8 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
                whileTap={{ scale: 0.98 }}
                className={`${module.bgPattern} rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 cursor-pointer overflow-hidden relative group`}
                onClick={() => module.status !== 'locked' && setActiveModule(module.id)}
              >
                {/* Status indicator */}
                <div className="absolute top-4 right-4 z-20">
                  <StatusIndicator status={module.status} />
                </div>
                
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Lock overlay for locked modules */}
                {module.status === 'locked' && (
                  <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center text-gray-300">
                      <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Complete previous modules</p>
                    </div>
                  </div>
                )}
                
                {/* Floating icon animation */}
                <motion.div
                  className="absolute top-4 left-4 opacity-10"
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    repeatType: 'loop'
                  }}
                >
                  <Icon className="w-32 h-32 text-gray-600" />
                </motion.div>
                
                <div className="p-8 relative z-10">
                  <div className="flex items-center mb-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                      className={`p-4 rounded-2xl bg-gradient-to-br ${module.gradient} shadow-lg mr-4`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800">{module.title}</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">{module.description}</p>
                  
                  {/* Features with animations */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <motion.button
                      className="flex items-center text-lg font-semibold text-gray-700 mb-3 hover:text-gray-900 transition-colors"
                      onClick={() => setExpandedSection(expandedSection === module.id ? null : module.id)}
                      whileHover={{ x: 5 }}
                    >
                      Features
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
                          transition={{ duration: 0.4 }}
                          className="space-y-2 overflow-hidden mb-6"
                        >
                          {module.features.map((feature, featureIndex) => (
                            <motion.li 
                              key={feature}
                              className="flex items-center text-gray-600"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: featureIndex * 0.08 }}
                            >
                              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                              {feature}
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <motion.button 
                    className={`w-full bg-gradient-to-r ${module.gradient} text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group ${module.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => module.status !== 'locked' && setActiveModule(module.id)}
                    whileHover={module.status !== 'locked' ? { scale: 1.02 } : {}}
                    whileTap={module.status !== 'locked' ? { scale: 0.98 } : {}}
                    disabled={module.status === 'locked'}
                  >
                    <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    {module.status === 'locked' ? 'Locked' : 'Launch Module'}
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Neural Network Architecture Showcase */}
        <motion.div 
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 shadow-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-4xl font-bold text-white mb-8 text-center">🧠 Build Any Architecture</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { name: 'MLP', description: 'Multi-Layer Perceptron', complexity: 'Beginner' },
              { name: 'CNN', description: 'Convolutional Networks', complexity: 'Intermediate' },
              { name: 'RNN/LSTM', description: 'Recurrent Networks', complexity: 'Advanced' },
              { name: 'Transformer', description: 'Attention Models', complexity: 'Expert' }
            ].map((arch, index) => (
              <motion.div
                key={arch.name}
                className="group cursor-pointer"
                whileHover={{ scale: 1.1 }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                onClick={() => setActiveModule('network-builder')}
              >
                <motion.div 
                  className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl mb-4 relative overflow-hidden"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.3)',
                      '0 0 40px rgba(147, 51, 234, 0.4)',
                      '0 0 20px rgba(59, 130, 246, 0.3)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-2xl font-black text-white">{arch.name}</span>
                  
                  {/* Animated particles inside */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                      animate={{
                        x: [0, Math.random() * 40 - 20],
                        y: [0, Math.random() * 40 - 20],
                        opacity: [0.6, 0, 0.6],
                      }}
                      transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                    />
                  ))}
                </motion.div>
                
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  {arch.description}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{arch.complexity}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderModule = () => {
    switch (activeModule) {
      case 'network-builder':
        return <NetworkBuilder 
          architecture={networkArchitecture}
          onArchitectureChange={setNetworkArchitecture}
        />;
      case 'training-lab':
        return <TrainingLab 
          architecture={networkArchitecture}
          onTrainingStateChange={setIsTraining}
          onMetricsUpdate={setModelMetrics}
          trainingData={trainingData}
        />;
      case 'data-flow':
        return <DataFlowVisualizer 
          architecture={networkArchitecture}
          trainingData={trainingData}
        />;
      case 'performance-analyzer':
        return <PerformanceAnalyzer 
          metrics={modelMetrics}
          architecture={networkArchitecture}
        />;
      case 'educational':
        return <EducationalTutorials 
          onArchitectureLoad={setNetworkArchitecture}
        />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="neural-network-container w-full min-h-screen bg-gray-900">
      {/* Enhanced Navigation Header */}
      <motion.nav 
        className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl"
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
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-4 h-4 inline mr-2" />
                Overview
              </motion.button>
              
              {modules.map((module, index) => {
                const Icon = module.icon;
                const isLocked = module.status === 'locked';
                
                return (
                  <motion.button
                    key={module.id}
                    onClick={() => !isLocked && setActiveModule(module.id)}
                    className={`px-3 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center whitespace-nowrap text-sm relative ${
                      activeModule === module.id 
                        ? `bg-gradient-to-r ${module.gradient} text-white shadow-lg transform scale-105` 
                        : isLocked 
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={!isLocked ? { scale: 1.05, y: -2 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    disabled={isLocked}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">{module.title}</span>
                    <span className="sm:hidden">{module.title.split(' ')[0]}</span>
                    
                    {/* Status indicator */}
                    <div className="absolute -top-1 -right-1">
                      <StatusIndicator status={module.status} />
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
            
            {/* Training status indicator */}
            {isTraining && (
              <motion.div
                className="flex items-center space-x-2 text-blue-400"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
                <span className="text-sm font-semibold">Training Active</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="neural-network-content w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {renderModule()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default NeuralNetworkSimulator;