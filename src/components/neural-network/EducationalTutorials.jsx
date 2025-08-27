import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Play, CheckCircle, Clock, Star, Award,
  Brain, Network, Zap, Target, Layers, GitBranch,
  ChevronRight, ChevronLeft, Info, Code, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EducationalTutorials = ({ onArchitectureLoad }) => {
  const [activeCategory, setActiveCategory] = useState('fundamentals');
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTutorials, setCompletedTutorials] = useState([]);
  const [userProgress, setUserProgress] = useState({ level: 1, xp: 0 });

  const tutorials = {
    fundamentals: [
      {
        id: 'nn-basics',
        title: 'Neural Network Fundamentals',
        description: 'Learn the core concepts of neural networks from neurons to layers',
        difficulty: 'Beginner',
        duration: '15 min',
        xpReward: 100,
        icon: Brain,
        color: 'from-blue-500 to-blue-600',
        steps: [
          {
            title: 'What is a Neural Network?',
            content: 'A neural network is a computational model inspired by biological neural networks. It consists of interconnected nodes (neurons) that process information.',
            visual: 'neuron-diagram',
            interactive: true
          },
          {
            title: 'The Perceptron',
            content: 'The simplest neural network unit that takes inputs, applies weights, adds bias, and produces an output through an activation function.',
            visual: 'perceptron-math',
            formula: 'y = f(Σ(xi × wi) + b)'
          },
          {
            title: 'Activation Functions',
            content: 'Functions that determine the output of a neuron. Common ones include ReLU, Sigmoid, and Tanh.',
            visual: 'activation-functions',
            interactive: true
          },
          {
            title: 'Building Your First Network',
            content: 'Let\'s create a simple 2-layer neural network for classification.',
            visual: 'network-builder',
            hands_on: true
          }
        ]
      },
      {
        id: 'backpropagation',
        title: 'Understanding Backpropagation',
        description: 'Deep dive into how neural networks learn through backpropagation',
        difficulty: 'Intermediate',
        duration: '25 min',
        xpReward: 150,
        icon: GitBranch,
        color: 'from-green-500 to-green-600',
        steps: [
          {
            title: 'The Learning Problem',
            content: 'How do neural networks adjust their weights to minimize prediction errors?',
            visual: 'loss-landscape'
          },
          {
            title: 'Forward Pass',
            content: 'Data flows from input to output, computing predictions.',
            visual: 'forward-pass-animation',
            interactive: true
          },
          {
            title: 'Computing Loss',
            content: 'Measuring how wrong our predictions are using loss functions.',
            visual: 'loss-functions',
            formula: 'L = 1/n Σ(yi - ŷi)²'
          },
          {
            title: 'Backward Pass',
            content: 'Using calculus to compute gradients and update weights.',
            visual: 'gradient-computation',
            interactive: true
          }
        ]
      }
    ],
    architectures: [
      {
        id: 'cnn-tutorial',
        title: 'Convolutional Neural Networks',
        description: 'Master CNNs for image processing and computer vision',
        difficulty: 'Intermediate',
        duration: '30 min',
        xpReward: 200,
        icon: Network,
        color: 'from-purple-500 to-purple-600',
        architecture: {
          layers: [
            { type: 'Conv2D', config: { filters: 32, kernelSize: 3, activation: 'relu' } },
            { type: 'Conv2D', config: { filters: 64, kernelSize: 3, activation: 'relu' } },
            { type: 'Dense', config: { units: 128, activation: 'relu' } },
            { type: 'Dense', config: { units: 10, activation: 'softmax' } }
          ]
        }
      },
      {
        id: 'rnn-tutorial',
        title: 'Recurrent Neural Networks',
        description: 'Learn RNNs and LSTMs for sequence processing',
        difficulty: 'Advanced',
        duration: '35 min',
        xpReward: 250,
        icon: Zap,
        color: 'from-orange-500 to-orange-600',
        architecture: {
          layers: [
            { type: 'LSTM', config: { units: 50, returnSequences: true } },
            { type: 'LSTM', config: { units: 50, returnSequences: false } },
            { type: 'Dense', config: { units: 1, activation: 'sigmoid' } }
          ]
        }
      },
      {
        id: 'transformer-tutorial',
        title: 'Transformer Architecture',
        description: 'Understanding attention mechanisms and transformer models',
        difficulty: 'Expert',
        duration: '45 min',
        xpReward: 300,
        icon: Star,
        color: 'from-pink-500 to-pink-600',
        architecture: {
          layers: [
            { type: 'Attention', config: { heads: 8, keyDim: 64 } },
            { type: 'Dense', config: { units: 512, activation: 'relu' } },
            { type: 'Dense', config: { units: 10, activation: 'softmax' } }
          ]
        }
      }
    ],
    challenges: [
      {
        id: 'xor-challenge',
        title: 'XOR Problem Challenge',
        description: 'Solve the classic XOR problem that single perceptrons cannot solve',
        difficulty: 'Beginner',
        duration: '20 min',
        xpReward: 175,
        icon: Target,
        color: 'from-red-500 to-red-600',
        challenge: {
          objective: 'Build a network that can learn the XOR function',
          data: 'XOR truth table',
          targetAccuracy: 0.95,
          maxEpochs: 100
        }
      },
      {
        id: 'overfitting-challenge',
        title: 'Overfitting Prevention',
        description: 'Learn to identify and prevent overfitting in your models',
        difficulty: 'Intermediate',
        duration: '25 min',
        xpReward: 200,
        icon: Award,
        color: 'from-yellow-500 to-yellow-600',
        challenge: {
          objective: 'Build a model that generalizes well without overfitting',
          constraint: 'Limited training data',
          targetGeneralization: 0.85
        }
      }
    ],
    research: [
      {
        id: 'resnet-paper',
        title: 'ResNet: Deep Residual Learning',
        description: 'Implement and understand the breakthrough ResNet architecture',
        difficulty: 'Expert',
        duration: '60 min',
        xpReward: 400,
        icon: Layers,
        color: 'from-indigo-500 to-indigo-600',
        paper: {
          title: 'Deep Residual Learning for Image Recognition',
          authors: 'He et al., 2016',
          keyContributions: ['Skip connections', 'Residual blocks', 'Very deep networks']
        }
      }
    ]
  };

  const categories = [
    { id: 'fundamentals', name: 'Fundamentals', icon: Brain, count: tutorials.fundamentals.length },
    { id: 'architectures', name: 'Architectures', icon: Network, count: tutorials.architectures.length },
    { id: 'challenges', name: 'Challenges', icon: Target, count: tutorials.challenges.length },
    { id: 'research', name: 'Research Papers', icon: BookOpen, count: tutorials.research.length }
  ];

  useEffect(() => {
    // Load user progress from localStorage
    const saved = localStorage.getItem('neural-tutorial-progress');
    if (saved) {
      const progress = JSON.parse(saved);
      setCompletedTutorials(progress.completed || []);
      setUserProgress(progress.user || { level: 1, xp: 0 });
    }
  }, []);

  const saveProgress = () => {
    localStorage.setItem('neural-tutorial-progress', JSON.stringify({
      completed: completedTutorials,
      user: userProgress
    }));
  };

  const completeTutorial = (tutorialId, xpReward) => {
    if (!completedTutorials.includes(tutorialId)) {
      setCompletedTutorials(prev => [...prev, tutorialId]);
      setUserProgress(prev => ({
        level: Math.floor((prev.xp + xpReward) / 500) + 1,
        xp: prev.xp + xpReward
      }));
      saveProgress();
    }
  };

  const loadTutorialArchitecture = (tutorial) => {
    if (tutorial.architecture && onArchitectureLoad) {
      onArchitectureLoad(tutorial.architecture);
    }
  };

  const TutorialCard = ({ tutorial, category }) => {
    const Icon = tutorial.icon;
    const isCompleted = completedTutorials.includes(tutorial.id);
    
    return (
      <motion.div
        className={`bg-gradient-to-br ${tutorial.color} rounded-2xl p-6 cursor-pointer relative overflow-hidden group`}
        onClick={() => setSelectedTutorial({ ...tutorial, category })}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Completion badge */}
        {isCompleted && (
          <motion.div
            className="absolute top-4 right-4 bg-green-500 rounded-full p-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CheckCircle className="w-5 h-5 text-white" />
          </motion.div>
        )}
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <Icon className="w-32 h-32 absolute -bottom-8 -right-8 transform rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-white/80">{tutorial.difficulty}</div>
              <div className="flex items-center space-x-2 text-white/60 text-xs">
                <Clock className="w-3 h-3" />
                <span>{tutorial.duration}</span>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{tutorial.title}</h3>
          <p className="text-white/80 text-sm mb-4 line-clamp-2">{tutorial.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-yellow-300">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">{tutorial.xpReward} XP</span>
            </div>
            
            <motion.div
              className="flex items-center space-x-1 text-white/80"
              whileHover={{ x: 5 }}
            >
              <span className="text-sm">Start</span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  const TutorialViewer = ({ tutorial }) => {
    const currentStepData = tutorial.steps?.[currentStep];
    
    return (
      <motion.div
        className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-4xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedTutorial(null)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-white">{tutorial.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{tutorial.duration}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{tutorial.xpReward} XP</span>
                </span>
              </div>
            </div>
          </div>
          
          {tutorial.architecture && (
            <button
              onClick={() => loadTutorialArchitecture(tutorial)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Load Architecture</span>
            </button>
          )}
        </div>
        
        {/* Progress bar */}
        {tutorial.steps && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{currentStep + 1} / {tutorial.steps.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / tutorial.steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
        
        {/* Content */}
        {tutorial.steps ? (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">{currentStepData?.title}</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">{currentStepData?.content}</p>
            
            {currentStepData?.formula && (
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <div className="text-center text-2xl font-mono text-blue-400">
                  {currentStepData.formula}
                </div>
              </div>
            )}
            
            {currentStepData?.visual && (
              <div className="bg-gray-900 rounded-lg p-8 mb-6 text-center">
                <div className="text-gray-400 text-lg">
                  {currentStepData.visual === 'neuron-diagram' && (
                    <div className="space-y-4">
                      <div className="text-xl font-semibold mb-4">Neural Network Visualization</div>
                      <svg className="w-full max-w-lg mx-auto" viewBox="0 0 400 200">
                        {/* Input neurons */}
                        {[0, 1, 2].map(i => (
                          <motion.circle
                            key={`input-${i}`}
                            cx={50}
                            cy={50 + i * 40}
                            r={15}
                            fill="#3b82f6"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                          />
                        ))}
                        
                        {/* Hidden layer neurons */}
                        {[0, 1, 2, 3].map(i => (
                          <motion.circle
                            key={`hidden-${i}`}
                            cx={200}
                            cy={30 + i * 35}
                            r={15}
                            fill="#8b5cf6"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 + i * 0.2 }}
                          />
                        ))}
                        
                        {/* Output neuron */}
                        <motion.circle
                          cx={350}
                          cy={100}
                          r={15}
                          fill="#10b981"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                        />
                        
                        {/* Connections */}
                        {[0, 1, 2].map(i => 
                          [0, 1, 2, 3].map(j => (
                            <motion.line
                              key={`conn-${i}-${j}`}
                              x1={65}
                              y1={50 + i * 40}
                              x2={185}
                              y2={30 + j * 35}
                              stroke="#6b7280"
                              strokeWidth="2"
                              opacity={0.6}
                              animate={{ opacity: [0.3, 0.8, 0.3] }}
                              transition={{ duration: 3, repeat: Infinity, delay: Math.random() }}
                            />
                          ))
                        )}
                      </svg>
                    </div>
                  )}
                  
                  {currentStepData.visual === 'activation-functions' && (
                    <div className="space-y-4">
                      <div className="text-xl font-semibold mb-4">Activation Functions</div>
                      <div className="grid grid-cols-3 gap-4">
                        {['ReLU', 'Sigmoid', 'Tanh'].map((func, index) => (
                          <div key={func} className="bg-gray-800 rounded-lg p-4">
                            <div className="text-lg font-semibold text-white mb-2">{func}</div>
                            <svg className="w-full h-20" viewBox="0 0 100 50">
                              <motion.path
                                d={
                                  func === 'ReLU' ? 'M 10 40 L 50 40 L 90 10' :
                                  func === 'Sigmoid' ? 'M 10 40 Q 30 35, 50 25 Q 70 15, 90 10' :
                                  'M 10 35 Q 30 45, 50 25 Q 70 5, 90 15'
                                }
                                stroke="#3b82f6"
                                strokeWidth="2"
                                fill="none"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: index * 0.3 }}
                              />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!['neuron-diagram', 'activation-functions'].includes(currentStepData.visual) && (
                    <div className="text-lg text-gray-400">
                      Interactive visualization: {currentStepData.visual}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {currentStepData?.interactive && (
              <div className="bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex items-center space-x-2 text-blue-400 mb-2">
                  <Play className="w-5 h-5" />
                  <span className="font-semibold">Interactive Element</span>
                </div>
                <p className="text-blue-300">Try adjusting the parameters to see how they affect the network behavior.</p>
              </div>
            )}
            
            {currentStepData?.hands_on && (
              <div className="bg-green-900/20 border-l-4 border-green-400 p-4 mb-6">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <Code className="w-5 h-5" />
                  <span className="font-semibold">Hands-On Exercise</span>
                </div>
                <p className="text-green-300">Time to apply what you've learned! Build the network described in this step.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-gray-300 text-lg leading-relaxed">{tutorial.description}</p>
            
            {tutorial.challenge && (
              <div className="mt-6 bg-orange-900/20 border border-orange-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-orange-400 mb-4">Challenge Objective</h4>
                <p className="text-orange-300 mb-4">{tutorial.challenge.objective}</p>
                
                {tutorial.challenge.targetAccuracy && (
                  <div className="text-sm text-orange-400">
                    Target Accuracy: {tutorial.challenge.targetAccuracy * 100}%
                  </div>
                )}
              </div>
            )}
            
            {tutorial.paper && (
              <div className="mt-6 bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-purple-400 mb-2">{tutorial.paper.title}</h4>
                <p className="text-purple-300 mb-4">By {tutorial.paper.authors}</p>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-purple-400">Key Contributions:</div>
                  <ul className="list-disc list-inside space-y-1 text-purple-300">
                    {tutorial.paper.keyContributions.map((contrib, index) => (
                      <li key={index}>{contrib}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          {tutorial.steps && currentStep === tutorial.steps.length - 1 ? (
            <button
              onClick={() => {
                completeTutorial(tutorial.id, tutorial.xpReward);
                setSelectedTutorial(null);
              }}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Tutorial</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (tutorial.steps) {
                  setCurrentStep(Math.min(tutorial.steps.length - 1, currentStep + 1));
                } else {
                  completeTutorial(tutorial.id, tutorial.xpReward);
                  setSelectedTutorial(null);
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  const ProgressHeader = () => (
    <motion.div
      className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-8"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Learning Progress</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-white">Level {userProgress.level}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white">{userProgress.xp} XP</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">{completedTutorials.length} Completed</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-semibold text-white mb-2">
            Next Level: {(500 - (userProgress.xp % 500))} XP
          </div>
          <div className="w-48 bg-white/20 rounded-full h-3">
            <motion.div
              className="h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((userProgress.xp % 500) / 500) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (selectedTutorial) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <TutorialViewer tutorial={selectedTutorial} />
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <ProgressHeader />
        
        {/* Category Navigation */}
        <motion.div 
          className="flex space-x-2 mb-8 overflow-x-auto"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <category.icon className="w-5 h-5" />
              <span>{category.name}</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {category.count}
              </span>
            </motion.button>
          ))}
        </motion.div>
        
        {/* Tutorial Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence>
            {tutorials[activeCategory]?.map((tutorial, index) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <TutorialCard tutorial={tutorial} category={activeCategory} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default EducationalTutorials;