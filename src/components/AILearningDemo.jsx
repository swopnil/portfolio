import React, { useState } from 'react';
import { Brain, Zap, Home, Target, Calculator, TrendingUp, Star, Award, BarChart3, User, GraduationCap } from 'lucide-react';
import TokenizationDemo from './ai-education/TokenizationDemo';
import LinearAlgebra from './ai-education/LinearAlgebra';
import CalculusForAI from './ai-education/CalculusForAI';
import ProbabilityStats from './ai-education/ProbabilityStats';
import OptimizationTheory from './ai-education/OptimizationTheory';
import HowAILearns from './HowAILearns';
import NeuralNetworkSimulator from '../pages/NeuralNetworkSimulator';
import ModelEvaluationModule from './ModelEvaluation';
const AILearningDemo = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [progress, setProgress] = useState({
    howAILearns: 0,
    tokenization: 0,
    linearAlgebra: 0,
    calculus: 0,
    probability: 0,
    optimization: 0
  });
  const [totalPoints, setTotalPoints] = useState(450);

  const learningModules = [
    {
      id: 'howAILearns',
      title: 'How AI Learns',
      description: 'Complete AI learning journey from text to trained model',
      icon: Brain,
      difficulty: 'Comprehensive',
      duration: '45 min',
      color: 'from-indigo-500 to-purple-500',
      points: 300,
      completed: progress.howAILearns >= 100
    },
    {
      id: 'tokenization',
      title: 'Text Tokenization',
      description: 'Learn how AI processes human language into tokens',
      icon: Zap,
      difficulty: 'Beginner',
      duration: '15 min',
      color: 'from-blue-500 to-cyan-500',
      points: 100,
      completed: progress.tokenization >= 100
    },
    {
      id: 'linearAlgebra',
      title: 'Linear Algebra',
      description: 'Mathematical foundations for AI computations',
      icon: Calculator,
      difficulty: 'Intermediate',
      duration: '25 min',
      color: 'from-green-500 to-emerald-500',
      points: 150,
      completed: progress.linearAlgebra >= 100
    },
    {
      id: 'calculus',
      title: 'Calculus for AI',
      description: 'Derivatives and optimization for neural networks',
      icon: TrendingUp,
      difficulty: 'Intermediate',
      duration: '30 min',
      color: 'from-purple-500 to-pink-500',
      points: 150,
      completed: progress.calculus >= 100
    },
    {
      id: 'probability',
      title: 'Probability & Statistics',
      description: 'Uncertainty modeling and data analysis',
      icon: BarChart3,
      difficulty: 'Advanced',
      duration: '35 min',
      color: 'from-amber-500 to-orange-500',
      points: 200,
      completed: progress.probability >= 100
    },
    {
      id: 'optimization',
      title: 'Optimization Theory',
      description: 'Advanced training and gradient descent',
      icon: Target,
      difficulty: 'Advanced',
      duration: '40 min',
      color: 'from-red-500 to-pink-500',
      points: 250,
      completed: progress.optimization >= 100
    },
    {
      id: 'neuralnetworksimulator',
      title: 'Neural Network Simulator',
      description: 'Try my neural network simulator to visualize training',
      icon: Brain,
      difficulty: 'Advanced',
      duration: '40 min',
      color: 'from-blue-500 to-cyan-500',
      points: 5000,
      completed: progress.optimization >= 100
    }
  ];

  const updateProgress = (moduleId, progressValue) => {
    setProgress(prev => ({
      ...prev,
      [moduleId]: progressValue
    }));
  };

  const renderModule = () => {
    switch(currentPage) {
      case 'howAILearns':
        return <HowAILearns updateProgress={(p) => updateProgress('howAILearns', p)} />;
      case 'tokenization':
        return <TokenizationDemo updateProgress={(p) => updateProgress('tokenization', p)} />;
      case 'linearAlgebra':
        return <LinearAlgebra updateProgress={(p) => updateProgress('linearAlgebra', p)} />;
      case 'calculus':
        return <CalculusForAI updateProgress={(p) => updateProgress('calculus', p)} />;
      case 'probability':
        return <ProbabilityStats updateProgress={(p) => updateProgress('probability', p)} />;
      case 'optimization':
        return <OptimizationTheory updateProgress={(p) => updateProgress('optimization', p)} />;
        case 'neuralnetworksimulator':
          return <NeuralNetworkSimulator updateProgress={(p) => updateProgress('neuralnetworksimulator', p)} />;
  
      default:
        return renderHomePage();
    }
  };

  const renderHomePage = () => (
    <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Learning Progress Card */}
      <div className="bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your AI Learning Journey</h2>
          <div className="flex items-center">
            <Star className="text-yellow-500 mr-2" size={20} />
            <span className="text-xl font-bold">{totalPoints} pts</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Overall Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-500 h-4 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((Object.values(progress).reduce((a, b) => a + b, 0) / 500) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">
            {Math.floor((Object.values(progress).reduce((a, b) => a + b, 0) / 500) * 100)}% Complete
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{learningModules.filter(m => m.completed).length}</div>
            <div className="text-sm text-blue-600">Modules Completed</div>
          </div>
          <div className="text-center p-3 bg-green-100 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{totalPoints}</div>
            <div className="text-sm text-green-600">Total Points</div>
          </div>
        </div>
      </div>

      {/* Certificate Progress */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <GraduationCap className="text-yellow-500 mr-2" size={24} />
          <h2 className="text-2xl font-bold">AI Fundamentals Certificate</h2>
        </div>
        
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((totalPoints / 1000) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-500">0</span>
            <span className="font-bold text-yellow-600">{totalPoints}</span>
            <span className="text-gray-500">1000</span>
          </div>
        </div>
        
        <div className="text-center">
          <span className="font-bold text-yellow-700">{1000 - totalPoints} points left</span> to earn your certificate
        </div>

        <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm">
          <p className="text-gray-700">Complete all learning modules to earn your AI Fundamentals Certificate!</p>
        </div>
      </div>

      {/* Learning Modules */}
      {learningModules.map((module) => {
        const Icon = module.icon;
        return (
          <div key={module.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-3 rounded-full bg-gradient-to-r ${module.color} mr-4`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{module.title}</h3>
                  <p className="text-gray-600 text-sm">{module.description}</p>
                </div>
              </div>
              {module.completed && (
                <div className="bg-green-500 text-white p-2 rounded-full">
                  <Award size={16} />
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  module.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                  module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {module.difficulty}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {module.duration}
                </span>
              </div>
              <span className="font-bold text-blue-600">+{module.points} pts</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progress[module.id]}%` }}
              ></div>
            </div>

            <button 
              className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                module.completed 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              onClick={() => setCurrentPage(module.id)}
            >
              {module.completed ? 'Review Module' : 'Start Learning'}
            </button>
          </div>
        );
      })}

      {/* AI Learning Tips */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 shadow-sm text-white col-span-1 md:col-span-2">
        <div className="flex items-center mb-4">
          <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-full">
            <Brain size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">Today's AI Learning Tip</h2>
        </div>
        
        <p className="text-lg mb-4">Master the fundamentals before diving deep!</p>
        <p className="text-white text-opacity-90 mb-6">
          Understanding tokenization is crucial before exploring neural networks. Each concept builds upon the previous one,
          creating a strong foundation for advanced AI concepts.
        </p>
        
        <div className="bg-white bg-opacity-10 p-4 rounded-md">
          <h3 className="font-bold mb-2">Learning Path Recommendation:</h3>
          <p className="text-sm">1. Text Tokenization → 2. Linear Algebra → 3. Calculus → 4. Probability → 5. Optimization</p>
        </div>
      </div>
    </div>
  );

  if (currentPage !== 'home') {
    return (
      <div className="flex flex-col h-screen bg-blue-50">
        {/* Header with Navigation */}
        <header className="bg-blue-100 p-4 flex justify-between items-center border-b border-blue-200">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <Brain size={20} />
            </div>
            <h1 className="text-2xl font-bold text-blue-700">AI Learning Center</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              {learningModules.map((module) => (
                <button
                  key={module.id}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentPage === module.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setCurrentPage(module.id)}
                >
                  {module.title}
                </button>
              ))}
            </div>

            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={() => setCurrentPage('home')}
            >
              <Home size={16} className="inline mr-2" />
              Home
            </button>
          </div>
        </header>

        {renderModule()}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-blue-100 p-4 flex justify-between items-center border-b border-blue-200">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 text-white p-2 rounded-lg">
            <Brain size={20} />
          </div>
          <h1 className="text-2xl font-bold text-blue-700">AI Learning Center</h1>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-blue-800 font-semibold">AI Student</span>
          
          <div className="flex items-center">
            <GraduationCap className="text-yellow-500 mr-2" size={24} />
            <div className="text-sm">
              <span className="font-bold">{totalPoints}</span>
              <span className="text-gray-500">/1000</span>
            </div>
          </div>

          <button className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-200 transition">
            Profile
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="bg-blue-400 w-64 text-white p-4 flex flex-col gap-6">
          <div className="flex items-center gap-3 p-2 bg-blue-500 rounded-md">
            <Home size={24} />
            <span className="font-medium">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-3 p-2 hover:bg-blue-500 rounded-md cursor-pointer"
               onClick={() => setCurrentPage('howAILearns')}>
            <Brain size={24} />
            <span className="font-medium">How AI Learns</span>
          </div>
          
          <div className="flex items-center gap-3 p-2 hover:bg-blue-500 rounded-md cursor-pointer"
               onClick={() => setCurrentPage('tokenization')}>
            <Zap size={24} />
            <span className="font-medium">Tokenization</span>
          </div>
          
          <div className="flex items-center gap-3 p-2 hover:bg-blue-500 rounded-md cursor-pointer"
               onClick={() => setCurrentPage('linearAlgebra')}>
            <Calculator size={24} />
            <span className="font-medium">Linear Algebra</span>
          </div>
          
          <div className="flex items-center gap-3 p-2 hover:bg-blue-500 rounded-md cursor-pointer"
               onClick={() => setCurrentPage('calculus')}>
            <TrendingUp size={24} />
            <span className="font-medium">Calculus</span>
          </div>

          <div className="flex items-center gap-3 p-2 hover:bg-blue-500 rounded-md cursor-pointer"
               onClick={() => setCurrentPage('probability')}>
            <BarChart3 size={24} />
            <span className="font-medium">Probability</span>
          </div>

          <div className="flex items-center gap-3 p-2 hover:bg-blue-500 rounded-md cursor-pointer"
               onClick={() => setCurrentPage('optimization')}>
            <Target size={24} />
            <span className="font-medium">Optimization</span>
          </div>
          
          <div className="flex items-center gap-3 p-2 hover:bg-blue-500 rounded-md cursor-pointer">
            <Award size={24} />
            <span className="font-medium">Certificates</span>
          </div>
          
          <div className="flex items-center gap-3 p-2 hover:bg-blue-500 rounded-md cursor-pointer">
            <User size={24} />
            <span className="font-medium">Profile</span>
          </div>
        </div>
        
        {renderHomePage()}
      </div>
    </div>
  );
};

export default AILearningDemo;