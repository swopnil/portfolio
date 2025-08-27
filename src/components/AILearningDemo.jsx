import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, ArrowRight, Play, Pause, RotateCcw, 
  Zap, Target, TrendingUp, BookOpen, 
  ChevronLeft, ChevronRight, Eye, Settings, 
  Activity, BarChart3, Calculator, Hash, Sparkles, Star, Rocket
} from 'lucide-react';
import '../components/ai-education/ai-education.css';
import '../components/neural-network/neural-network.css';

const AILearningDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [tokens, setTokens] = useState([]);
  const [numberTokens, setNumberTokens] = useState([]);
  const [trainingParams, setTrainingParams] = useState({
    learningRate: 0.01,
    batchSize: 32,
    epochs: 10,
    hiddenNodes: 64
  });
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelPredictions, setModelPredictions] = useState([]);

  // Pre-defined example texts with different complexity levels
  const exampleTexts = [
    {
      id: 1,
      title: "Simple Greeting",
      text: "Hello world! How are you today?",
      difficulty: "Beginner",
      description: "Basic tokenization with common words and punctuation"
    },
    {
      id: 2,
      title: "Sentiment Analysis",
      text: "I love this amazing product! It makes me so happy and excited.",
      difficulty: "Intermediate", 
      description: "Emotional words that help AI understand sentiment"
    },
    {
      id: 3,
      title: "Technical Text",
      text: "The neural network processes input through multiple layers using backpropagation algorithms.",
      difficulty: "Advanced",
      description: "Complex vocabulary requiring larger token vocabulary"
    },
    {
      id: 4,
      title: "Mixed Content",
      text: "AI will transform healthcare by 2030. Studies show 85% improvement in diagnosis accuracy!",
      difficulty: "Expert",
      description: "Numbers, percentages, and domain-specific terms"
    }
  ];

  const steps = [
    {
      id: 0,
      title: "Choose Your Text",
      description: "Select text to see how AI processes human language",
      component: "textSelection"
    },
    {
      id: 1,
      title: "Text Tokenization", 
      description: "Watch AI break down text into smaller pieces called 'tokens'",
      component: "tokenization"
    },
    {
      id: 2,
      title: "Convert to Numbers",
      description: "See how words become numbers that computers can understand",
      component: "numberConversion"
    },
    {
      id: 3,
      title: "Create Training Data",
      description: "Learn how AI needs examples to learn from",
      component: "trainingData"
    },
    {
      id: 4,
      title: "Neural Network Architecture",
      description: "Build the brain structure that will learn patterns",
      component: "networkArchitecture"
    },
    {
      id: 5,
      title: "Forward Pass",
      description: "Follow data flowing through the neural network",
      component: "forwardPass"
    },
    {
      id: 6,
      title: "Loss Function",
      description: "Understand how AI measures its mistakes",
      component: "lossFunction"
    },
    {
      id: 7,
      title: "Backpropagation",
      description: "See how AI learns from its mistakes",
      component: "backpropagation"
    },
    {
      id: 8,
      title: "Gradient Descent",
      description: "Watch AI find the best solution step by step",
      component: "gradientDescent"
    },
    {
      id: 9,
      title: "Training Parameters",
      description: "Experiment with settings that control how AI learns",
      component: "trainingParams"
    },
    {
      id: 10,
      title: "Batch Processing",
      description: "See how AI learns from multiple examples at once",
      component: "batchProcessing"
    },
    {
      id: 11,
      title: "Model Training",
      description: "Watch the complete learning process in action",
      component: "training"
    },
    {
      id: 12,
      title: "Validation & Testing",
      description: "Learn how to check if AI really learned well",
      component: "validation"
    },
    {
      id: 13,
      title: "Overfitting vs Underfitting",
      description: "Understand when AI learns too much or too little",
      component: "overfitting"
    },
    {
      id: 14,
      title: "Final Results",
      description: "See what your trained model learned and test it",
      component: "results"
    }
  ];

  // Simple tokenization function (real-world uses more sophisticated methods)
  const tokenizeText = (text) => {
    if (!text) return [];
    
    const tokens = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0)
      .map((token, index) => ({
        id: index,
        text: token,
        type: getTokenType(token)
      }));
    
    return tokens;
  };

  const getTokenType = (token) => {
    if (!isNaN(token)) return 'number';
    if (token.length <= 2) return 'short';
    if (['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'].includes(token)) return 'common';
    if (token.length > 8) return 'complex';
    return 'normal';
  };

  // Convert tokens to numbers (simplified word embedding)
  const convertToNumbers = (tokens) => {
    const vocabulary = ['hello', 'world', 'how', 'are', 'you', 'today', 'love', 'amazing', 'product', 'happy', 'excited', 'neural', 'network', 'processes', 'input', 'layers', 'backpropagation', 'algorithms', 'ai', 'transform', 'healthcare', 'studies', 'show', 'improvement', 'diagnosis', 'accuracy'];
    
    return tokens.map(token => {
      let index = vocabulary.indexOf(token.text);
      if (index === -1) {
        // Unknown word - assign based on hash for consistency
        index = Math.abs(token.text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 1000;
      }
      
      return {
        ...token,
        number: index,
        embedding: generateEmbedding(index)
      };
    });
  };

  const generateEmbedding = (index) => {
    // Simplified 4-dimensional embedding
    return [
      Math.sin(index * 0.1) * 0.5,
      Math.cos(index * 0.15) * 0.5,
      Math.sin(index * 0.2) * 0.3,
      Math.cos(index * 0.25) * 0.3
    ];
  };

  // Simulate neural network calculation
  const simulateNeuralCalculation = (embeddings) => {
    const weights = [
      [0.5, -0.3, 0.8, 0.2],
      [0.1, 0.7, -0.4, 0.6],
      [0.9, -0.1, 0.3, -0.5]
    ];
    
    const results = embeddings.map(embedding => {
      const hiddenLayer = weights.map(weight => {
        const sum = embedding.reduce((acc, val, idx) => acc + val * weight[idx], 0);
        return Math.max(0, sum); // ReLU activation
      });
      
      const output = hiddenLayer.reduce((acc, val) => acc + val, 0) / hiddenLayer.length;
      return { hiddenLayer, output };
    });
    
    return results;
  };

  // Training simulation
  useEffect(() => {
    if (isPlaying && currentStep === 5) {
      const interval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentStep]);

  // Process selected text when it changes
  useEffect(() => {
    if (selectedText) {
      const newTokens = tokenizeText(selectedText);
      setTokens(newTokens);
      
      const newNumberTokens = convertToNumbers(newTokens);
      setNumberTokens(newNumberTokens);
      
      // Generate sample predictions
      const predictions = [
        { input: selectedText.slice(0, 20) + '...', confidence: 0.87, label: 'Positive' },
        { input: 'How are you feeling?', confidence: 0.92, label: 'Question' },
        { input: 'This is great news!', confidence: 0.95, label: 'Positive' }
      ];
      setModelPredictions(predictions);
    }
  }, [selectedText]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setSelectedText('');
    setTokens([]);
    setNumberTokens([]);
    setTrainingProgress(0);
    setIsPlaying(false);
  };

  const TextSelectionStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
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
          className="inline-block mb-4"
        >
          <BookOpen className="w-12 h-12 text-cyan-400 drop-shadow-lg" />
        </motion.div>
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100">
          Choose Text to Analyze
        </h3>
        <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Select one of these examples or write your own text. Watch how AI breaks down human language into pieces it can understand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exampleTexts.map((example, index) => (
          <motion.button
            key={example.id}
            onClick={() => {
              setSelectedText(example.text);
              setTimeout(nextStep, 500);
            }}
            className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl text-left border border-white/20 hover:bg-white/20 transition-all duration-300 group relative overflow-hidden"
            whileHover={{ 
              scale: 1.02,
              rotateY: 5,
              z: 50
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-white text-lg">{example.title}</h4>
                <motion.span 
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    example.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                    example.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    example.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 
                    'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {example.difficulty}
                </motion.span>
              </div>
              <p className="text-cyan-400 mb-3 italic">"{example.text}"</p>
              <p className="text-white/70 text-sm leading-relaxed">{example.description}</p>
              
              {/* Animated indicator */}
              <motion.div
                className="mt-4 flex items-center text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-sm font-medium">Click to select</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h4 className="text-xl font-bold text-white mb-4 flex items-center">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mr-3"
          >
            <Zap className="w-6 h-6 text-yellow-400" />
          </motion.div>
          Or Write Your Own
        </h4>
        <textarea
          value={selectedText}
          onChange={(e) => setSelectedText(e.target.value)}
          placeholder="Type any text here to see how AI processes it..."
          className="w-full p-4 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 focus:border-blue-400 focus:outline-none placeholder-white/50 transition-colors"
          rows="4"
        />
        {selectedText && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={nextStep}
            className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-colors font-semibold shadow-lg group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket className="w-5 h-5 group-hover:animate-bounce" />
            Analyze This Text
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </motion.div>
    </div>
  );

  const TokenizationStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
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
          className="inline-block mb-4"
        >
          <Hash className="w-12 h-12 text-green-400 drop-shadow-lg" />
        </motion.div>
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100">
          Text Tokenization
        </h3>
        <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">
          AI cannot understand words directly. First, it breaks text into "tokens" - smaller pieces like words or parts of words.
        </p>
      </div>

      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              <Eye className="w-6 h-6 text-cyan-400" />
            </motion.div>
            Original Text
          </h4>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <p className="text-cyan-300 text-lg font-medium italic">"{selectedText}"</p>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mr-3"
            >
              <Zap className="w-6 h-6 text-yellow-400" />
            </motion.div>
            Tokenized Result
          </h4>
          <div className="flex flex-wrap gap-3">
            {tokens.map((token, index) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.1, 
                  rotateZ: 5,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
                }}
                className={`px-4 py-3 rounded-xl border-2 backdrop-blur-sm shadow-lg cursor-pointer transition-all duration-300 ${
                  token.type === 'number' ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200' :
                  token.type === 'common' ? 'bg-green-500/20 border-green-400/50 text-green-200' :
                  token.type === 'complex' ? 'bg-red-500/20 border-red-400/50 text-red-200' :
                  'bg-blue-500/20 border-blue-400/50 text-blue-200'
                }`}
              >
                <div className="font-bold text-center">{token.text}</div>
                <div className="text-xs opacity-75 capitalize text-center mt-1">{token.type}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-l-4 border-blue-400 rounded-xl backdrop-blur-sm"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center mb-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Target className="w-6 h-6 text-blue-400 mr-3" />
            </motion.div>
            <h5 className="font-bold text-blue-300 text-lg">Why Tokenization?</h5>
          </div>
          <p className="text-white/80 leading-relaxed">
            Computers work with numbers, not words. Tokenization breaks text into manageable pieces that can be converted to numbers. 
            Different colored tokens show different types:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-green-300 text-sm">Common words</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-red-300 text-sm">Complex words</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-cyan-500"></div>
              <span className="text-cyan-300 text-sm">Numbers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-blue-300 text-sm">Regular words</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );

  const NumberConversionStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
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
          className="inline-block mb-4"
        >
          <Calculator className="w-12 h-12 text-blue-400 drop-shadow-lg" />
        </motion.div>
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100">
          Converting Words to Numbers
        </h3>
        <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Each token gets converted to numbers. This creates "word embeddings" - mathematical representations that capture meaning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          initial={{ y: 20, opacity: 0, x: -20 }}
          animate={{ y: 0, opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              <Hash className="w-6 h-6 text-green-400" />
            </motion.div>
            Token → Number Mapping
          </h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {numberTokens.map((token, index) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(59, 130, 246, 0.1)"
                }}
                className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-blue-400/50 transition-all duration-300 cursor-pointer"
              >
                <span className="text-cyan-300 font-mono font-bold">"{token.text}"</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="text-blue-400" size={20} />
                </motion.div>
                <span className="text-green-300 font-mono font-bold bg-green-500/20 px-3 py-1 rounded-lg">
                  {token.number}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          initial={{ y: 20, opacity: 0, x: 20 }}
          animate={{ y: 0, opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mr-3"
            >
              <Activity className="w-6 h-6 text-cyan-400" />
            </motion.div>
            Word Embeddings (4D)
          </h4>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {numberTokens.slice(0, 6).map((token, index) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5
                }}
                className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className="text-cyan-300 font-bold mb-3">"{token.text}"</div>
                <div className="grid grid-cols-4 gap-2">
                  {token.embedding.map((value, i) => (
                    <motion.div 
                      key={i} 
                      className="text-center p-2 bg-cyan-500/20 rounded-lg border border-cyan-400/30"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="text-xs text-cyan-300 font-semibold">Dim {i+1}</div>
                      <div className="text-cyan-200 font-mono text-sm font-bold">
                        {value.toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-l-4 border-green-400 rounded-xl backdrop-blur-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center mb-4">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Brain className="w-8 h-8 text-green-400 mr-4" />
          </motion.div>
          <h5 className="font-bold text-green-300 text-xl">Understanding Embeddings</h5>
        </div>
        <p className="text-white/80 leading-relaxed mb-4">
          Each word becomes a list of numbers (here 4 numbers, but real AI uses 100-1000+). Similar words have similar numbers. 
          For example, "happy" and "excited" would have similar embeddings because they have similar meanings.
        </p>
        <div className="flex flex-wrap gap-4 mt-4">
          <motion.div 
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-green-300 text-sm font-semibold">Semantic meaning captured</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-blue-300 text-sm font-semibold">Similar words cluster together</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
            <span className="text-cyan-300 text-sm font-semibold">Relationships preserved</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  const NeuralProcessingStep = () => {
    const [activeCalculation, setActiveCalculation] = useState(0);
    const calculations = numberTokens.slice(0, 3).map(token => {
      const weights = [0.5, -0.3, 0.8, 0.2];
      const sum = token.embedding.reduce((acc, val, idx) => acc + val * weights[idx], 0);
      const activation = Math.max(0, sum); // ReLU
      
      return {
        token: token.text,
        embedding: token.embedding,
        weights,
        sum,
        activation
      };
    });

    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">Neural Network Processing</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Watch step-by-step how the neural network processes each word through mathematical calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculation Steps */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Step-by-Step Calculation</h4>
            
            {calculations.length > 0 && (
              <div className="space-y-4">
                {/* Token Selection */}
                <div className="flex gap-2 mb-4">
                  {calculations.map((calc, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveCalculation(index)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeCalculation === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      "{calc.token}"
                    </button>
                  ))}
                </div>

                {/* Active Calculation */}
                <div className="bg-gray-900 p-4 rounded-lg">
                  <h5 className="text-blue-400 font-semibold mb-3">
                    Processing: "{calculations[activeCalculation].token}"
                  </h5>
                  
                  {/* Step 1: Input */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Step 1: Input Embedding</div>
                    <div className="grid grid-cols-4 gap-2">
                      {calculations[activeCalculation].embedding.map((val, i) => (
                        <div key={i} className="text-center p-2 bg-cyan-600/20 rounded">
                          <div className="text-xs text-cyan-400">x{i+1}</div>
                          <div className="text-cyan-300 font-mono">{val.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Weights */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Step 2: Neural Weights</div>
                    <div className="grid grid-cols-4 gap-2">
                      {calculations[activeCalculation].weights.map((weight, i) => (
                        <div key={i} className="text-center p-2 bg-orange-600/20 rounded">
                          <div className="text-xs text-orange-400">w{i+1}</div>
                          <div className="text-orange-300 font-mono">{weight.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Multiplication */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Step 3: Multiply & Sum</div>
                    <div className="bg-gray-800 p-3 rounded">
                      <div className="text-center text-green-400 font-mono">
                        {calculations[activeCalculation].embedding.map((val, i) => (
                          <span key={i}>
                            {val.toFixed(2)} × {calculations[activeCalculation].weights[i].toFixed(2)}
                            {i < 3 ? ' + ' : ' = '}
                          </span>
                        ))}
                        <span className="text-yellow-400">
                          {calculations[activeCalculation].sum.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Activation */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Step 4: ReLU Activation</div>
                    <div className="bg-gray-800 p-3 rounded text-center">
                      <div className="text-green-400 font-mono">
                        max(0, {calculations[activeCalculation].sum.toFixed(3)}) = 
                        <span className="text-cyan-400 ml-2">
                          {calculations[activeCalculation].activation.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Visual Network */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Neural Network Visualization</h4>
            
            <div className="flex items-center justify-center">
              <svg className="w-full max-w-md" viewBox="0 0 300 200">
                {/* Input Layer */}
                {[0, 1, 2, 3].map(i => (
                  <motion.circle
                    key={`input-${i}`}
                    cx={50}
                    cy={30 + i * 35}
                    r={12}
                    fill="#8b5cf6"
                    animate={{ 
                      scale: calculations.length > 0 ? [1, 1.2, 1] : 1,
                      fill: calculations.length > 0 ? "#3b82f6" : "#8b5cf6"
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
                
                {/* Hidden Layer */}
                <motion.circle
                  cx={150}
                  cy={100}
                  r={15}
                  fill="#10b981"
                  animate={{ 
                    scale: calculations.length > 0 ? [1, 1.3, 1] : 1 
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                />
                
                {/* Output Layer */}
                <motion.circle
                  cx={250}
                  cy={100}
                  r={12}
                  fill="#f59e0b"
                  animate={{ 
                    scale: calculations.length > 0 ? [1, 1.2, 1] : 1 
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                />
                
                {/* Connections */}
                {[0, 1, 2, 3].map(i => (
                  <motion.line
                    key={`conn1-${i}`}
                    x1={62}
                    y1={30 + i * 35}
                    x2={135}
                    y2={100}
                    stroke="#6b7280"
                    strokeWidth="2"
                    animate={{ 
                      opacity: calculations.length > 0 ? [0.3, 1, 0.3] : 0.3 
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
                
                <motion.line
                  x1={165}
                  y1={100}
                  x2={235}
                  y2={100}
                  stroke="#6b7280"
                  strokeWidth="2"
                  animate={{ 
                    opacity: calculations.length > 0 ? [0.3, 1, 0.3] : 0.3 
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-4 bg-cyan-900/30 border-l-4 border-cyan-400 rounded">
          <h5 className="font-semibold text-cyan-400 mb-2">Understanding the Calculation</h5>
          <p className="text-gray-300 text-sm mb-2">
            This is how every neuron in a neural network processes information:
          </p>
          <ul className="text-gray-300 text-sm space-y-1 ml-4">
            <li>• <strong>Input:</strong> Word embedding (4 numbers representing meaning)</li>
            <li>• <strong>Weights:</strong> Learned parameters that determine importance</li>
            <li>• <strong>Sum:</strong> Multiply each input by its weight and add them up</li>
            <li>• <strong>Activation:</strong> Apply ReLU function (removes negative values)</li>
          </ul>
        </div>
      </div>
    );
  };

  const TrainingParamsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Training Parameters</h3>
        <p className="text-gray-300 max-w-2xl mx-auto">
          These are the "settings" that control how AI learns. Experiment with different values to see their effects!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parameter Controls */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-6">Adjust Parameters</h4>
          
          <div className="space-y-6">
            {/* Learning Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white font-medium">Learning Rate</label>
                <span className="text-blue-400 font-mono">{trainingParams.learningRate}</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.1"
                step="0.001"
                value={trainingParams.learningRate}
                onChange={(e) => setTrainingParams(prev => ({
                  ...prev,
                  learningRate: parseFloat(e.target.value)
                }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <p className="text-xs text-gray-400 mt-1">
                How big steps the AI takes when learning. Too high = unstable, too low = slow
              </p>
            </div>

            {/* Batch Size */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white font-medium">Batch Size</label>
                <span className="text-green-400 font-mono">{trainingParams.batchSize}</span>
              </div>
              <input
                type="range"
                min="1"
                max="128"
                step="1"
                value={trainingParams.batchSize}
                onChange={(e) => setTrainingParams(prev => ({
                  ...prev,
                  batchSize: parseInt(e.target.value)
                }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">
                How many examples AI processes at once. Larger = faster but needs more memory
              </p>
            </div>

            {/* Epochs */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white font-medium">Epochs</label>
                <span className="text-cyan-400 font-mono">{trainingParams.epochs}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={trainingParams.epochs}
                onChange={(e) => setTrainingParams(prev => ({
                  ...prev,
                  epochs: parseInt(e.target.value)
                }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">
                How many times AI sees the entire dataset. More epochs = more learning time
              </p>
            </div>

            {/* Hidden Nodes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white font-medium">Hidden Nodes</label>
                <span className="text-orange-400 font-mono">{trainingParams.hiddenNodes}</span>
              </div>
              <input
                type="range"
                min="8"
                max="512"
                step="8"
                value={trainingParams.hiddenNodes}
                onChange={(e) => setTrainingParams(prev => ({
                  ...prev,
                  hiddenNodes: parseInt(e.target.value)
                }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">
                Size of the AI's "brain". More nodes = can learn complex patterns but slower
              </p>
            </div>
          </div>
        </div>

        {/* Effects Explanation */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-6">Parameter Effects</h4>
          
          <div className="space-y-4">
            {/* Learning Rate Effects */}
            <div className="p-4 border-l-4 border-blue-400 bg-blue-900/20">
              <h5 className="text-blue-400 font-semibold mb-2">Learning Rate: {trainingParams.learningRate}</h5>
              <p className="text-sm text-gray-300">
                {trainingParams.learningRate < 0.01 ? 
                  "🐌 Very careful learning - will take longer but more stable" :
                  trainingParams.learningRate < 0.05 ? 
                  "⚡ Good balance - reasonable speed and stability" :
                  "🚨 Aggressive learning - fast but might miss optimal solution"}
              </p>
            </div>

            {/* Batch Size Effects */}
            <div className="p-4 border-l-4 border-green-400 bg-green-900/20">
              <h5 className="text-green-400 font-semibold mb-2">Batch Size: {trainingParams.batchSize}</h5>
              <p className="text-sm text-gray-300">
                {trainingParams.batchSize < 16 ? 
                  "🔍 Small batches - more updates but noisier learning" :
                  trainingParams.batchSize < 64 ? 
                  "✅ Good size - balanced updates and efficiency" :
                  "🚀 Large batches - smoother updates but needs more memory"}
              </p>
            </div>

            {/* Epochs Effects */}
            <div className="p-4 border-l-4 border-cyan-400 bg-cyan-900/20">
              <h5 className="text-cyan-400 font-semibold mb-2">Epochs: {trainingParams.epochs}</h5>
              <p className="text-sm text-gray-300">
                {trainingParams.epochs < 20 ? 
                  "⏱️ Quick training - might not learn enough" :
                  trainingParams.epochs < 50 ? 
                  "📈 Good training time - should learn well" :
                  "⏰ Long training - thorough but risk of overfitting"}
              </p>
            </div>

            {/* Hidden Nodes Effects */}
            <div className="p-4 border-l-4 border-orange-400 bg-orange-900/20">
              <h5 className="text-orange-400 font-semibold mb-2">Hidden Nodes: {trainingParams.hiddenNodes}</h5>
              <p className="text-sm text-gray-300">
                {trainingParams.hiddenNodes < 32 ? 
                  "🧠 Small brain - fast but limited learning capacity" :
                  trainingParams.hiddenNodes < 128 ? 
                  "🤖 Good size - can learn most patterns efficiently" :
                  "🔬 Large brain - can learn complex patterns but slower"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-900/30 border-l-4 border-yellow-400 rounded">
        <h5 className="font-semibold text-yellow-400 mb-2">💡 Pro Tip</h5>
        <p className="text-gray-300 text-sm">
          In real AI development, finding the right parameters is like tuning a musical instrument. 
          Start with standard values (Learning Rate: 0.01, Batch Size: 32, Epochs: 20-50) and adjust based on results!
        </p>
      </div>
    </div>
  );

  const TrainingStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Model Training Simulation</h3>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Watch your AI model train! See how it improves over time by adjusting its internal parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Controls & Progress */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-white">Training Progress</h4>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  if (!isPlaying && trainingProgress >= 100) {
                    setTrainingProgress(0);
                  }
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isPlaying ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white" />}
              </button>
              
              <button
                onClick={() => {
                  setTrainingProgress(0);
                  setIsPlaying(false);
                }}
                className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                <RotateCcw size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Epoch Progress</span>
              <span>{Math.floor(trainingProgress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <motion.div
                className="h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                style={{ width: `${trainingProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Training Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Current Epoch</div>
              <div className="text-2xl font-bold text-blue-400">
                {Math.floor((trainingProgress / 100) * trainingParams.epochs)}
              </div>
              <div className="text-xs text-gray-500">of {trainingParams.epochs}</div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Accuracy</div>
              <div className="text-2xl font-bold text-green-400">
                {(0.45 + (trainingProgress / 100) * 0.45).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">improving...</div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Loss</div>
              <div className="text-2xl font-bold text-red-400">
                {(2.5 - (trainingProgress / 100) * 2.0).toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">decreasing</div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Learning Rate</div>
              <div className="text-2xl font-bold text-cyan-400">
                {trainingParams.learningRate}
              </div>
              <div className="text-xs text-gray-500">fixed</div>
            </div>
          </div>
        </div>

        {/* Training Visualization */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Learning Curves</h4>
          
          {/* Simple ASCII-style chart */}
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">Accuracy Over Time</div>
            <div className="space-y-1">
              {Array.from({ length: 10 }, (_, i) => {
                const progress = Math.min(trainingProgress, (i + 1) * 10);
                const accuracy = 0.45 + (progress / 100) * 0.45;
                const barWidth = (accuracy * 100);
                
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-8 text-xs text-gray-400">E{i+1}</div>
                    <div className="flex-1 bg-gray-800 h-2 rounded">
                      <motion.div
                        className="h-2 bg-gradient-to-r from-red-500 to-green-500 rounded"
                        style={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <div className="w-12 text-xs text-gray-400">
                      {accuracy.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {trainingProgress >= 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-green-900/30 border border-green-600 rounded-lg"
            >
              <div className="text-green-400 font-semibold mb-2">🎉 Training Complete!</div>
              <p className="text-green-300 text-sm">
                Your model has finished training! Final accuracy: {(0.45 + 0.45).toFixed(1)}%
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-4 bg-blue-900/30 border-l-4 border-blue-400 rounded">
        <h5 className="font-semibold text-blue-400 mb-2">What's Happening During Training?</h5>
        <ul className="text-gray-300 text-sm space-y-1 ml-4">
          <li>• The AI looks at examples and makes predictions</li>
          <li>• It compares its predictions to correct answers</li>
          <li>• When wrong, it adjusts its internal weights (learning!)</li>
          <li>• This process repeats thousands of times</li>
          <li>• Over time, predictions get more accurate</li>
        </ul>
      </div>
    </div>
  );

  const ResultsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Your Trained AI Model</h3>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Congratulations! Your AI has learned. See what it can do and test it with new examples.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Performance */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Model Performance</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-300">Final Accuracy</span>
              <span className="text-green-400 font-bold">89.5%</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-300">Training Time</span>
              <span className="text-blue-400 font-bold">{trainingParams.epochs} epochs</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-300">Parameters Used</span>
              <span className="text-cyan-400 font-bold">{(trainingParams.hiddenNodes * 4 + trainingParams.hiddenNodes).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-6">
            <h5 className="text-white font-semibold mb-3">What Your AI Learned:</h5>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Words like "love", "amazing", "happy" usually mean positive sentiment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Technical terms like "neural", "algorithm" indicate tech content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Question words like "how", "what", "when" usually mean questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Numbers and percentages often indicate factual content</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Test Your Model */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Test Your Model</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Enter text to classify:</label>
              <textarea
                className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Type something for your AI to analyze..."
                rows="3"
              />
            </div>
            
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Classify Text
            </button>
          </div>

          <div className="mt-6">
            <h5 className="text-white font-semibold mb-3">Example Predictions:</h5>
            <div className="space-y-3">
              {modelPredictions.map((pred, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="p-3 bg-gray-900 rounded-lg"
                >
                  <div className="text-blue-400 text-sm mb-1">"{pred.input}"</div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 font-medium">{pred.label}</span>
                    <span className="text-gray-400 text-sm">{(pred.confidence * 100).toFixed(1)}% confident</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                    <div 
                      className="bg-green-400 h-1 rounded-full"
                      style={{ width: `${pred.confidence * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-600 rounded-xl">
        <h5 className="font-semibold text-green-400 mb-4 text-center">🚀 Congratulations!</h5>
        <p className="text-gray-300 text-center mb-4">
          You've successfully walked through the entire AI learning process! You now understand how AI:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Tokenizes text into manageable pieces</span>
            </div>
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Converts words to numerical representations</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-300">Processes through mathematical calculations</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-400" />
              <span className="text-gray-300">Learns patterns through training</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-blue-300 text-sm">
            Ready to explore more AI? Try the advanced Neural Network Simulator!
          </p>
        </div>
      </div>
    </div>
  );

  // New step components for comprehensive AI learning
  const TrainingDataStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
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
          className="inline-block mb-4"
        >
          <BarChart3 className="w-12 h-12 text-orange-400 drop-shadow-lg" />
        </motion.div>
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100">
          Create Training Data
        </h3>
        <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">
          AI needs examples to learn from, just like how you learned language from hearing conversations. Let's create training examples!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          initial={{ y: 20, opacity: 0, x: -20 }}
          animate={{ y: 0, opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              <BookOpen className="w-6 h-6 text-cyan-400" />
            </motion.div>
            Input Examples
          </h4>
          <div className="space-y-4">
            {[
              { text: "I love this amazing product!", label: "Positive" },
              { text: "This is terrible and disappointing.", label: "Negative" },
              { text: "The weather is nice today.", label: "Neutral" },
              { text: "How are you doing?", label: "Question" }
            ].map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className="text-cyan-300 font-medium mb-2">"{example.text}"</div>
                <div className="text-xs text-white/60">Input Text</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          initial={{ y: 20, opacity: 0, x: 20 }}
          animate={{ y: 0, opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mr-3"
            >
              <Target className="w-6 h-6 text-green-400" />
            </motion.div>
            Correct Labels
          </h4>
          <div className="space-y-4">
            {[
              { text: "I love this amazing product!", label: "Positive" },
              { text: "This is terrible and disappointing.", label: "Negative" },
              { text: "The weather is nice today.", label: "Neutral" },
              { text: "How are you doing?", label: "Question" }
            ].map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={`p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-green-400/50 transition-all duration-300 ${
                  example.label === 'Positive' ? 'hover:bg-green-500/10' :
                  example.label === 'Negative' ? 'hover:bg-red-500/10' :
                  example.label === 'Question' ? 'hover:bg-blue-500/10' :
                  'hover:bg-gray-500/10'
                }`}
              >
                <div className={`font-bold mb-2 ${
                  example.label === 'Positive' ? 'text-green-300' :
                  example.label === 'Negative' ? 'text-red-300' :
                  example.label === 'Question' ? 'text-blue-300' :
                  'text-gray-300'
                }`}>
                  {example.label}
                </div>
                <div className="text-xs text-white/60">Correct Answer</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="p-6 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-l-4 border-orange-400 rounded-xl backdrop-blur-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center mb-4">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-orange-400 mr-4" />
          </motion.div>
          <h5 className="font-bold text-orange-300 text-xl">Why Training Data Matters</h5>
        </div>
        <p className="text-white/80 leading-relaxed mb-4">
          AI learns by finding patterns in examples, just like how you learned to recognize cats by seeing many different cats. 
          The more diverse and accurate the training data, the better the AI becomes at making predictions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span className="text-orange-300 text-sm font-semibold">Quality over quantity</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-yellow-300 text-sm font-semibold">Diverse examples</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-green-300 text-sm font-semibold">Correct labels</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  const NetworkArchitectureStep = () => {
    const [selectedLayer, setSelectedLayer] = useState(0);
    const networkLayers = [
      { name: "Input Layer", neurons: 4, description: "Receives word embeddings", color: "blue" },
      { name: "Hidden Layer 1", neurons: 6, description: "Finds simple patterns", color: "cyan" },
      { name: "Hidden Layer 2", neurons: 4, description: "Combines patterns", color: "green" },
      { name: "Output Layer", neurons: 3, description: "Makes final prediction", color: "orange" }
    ];

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
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
            className="inline-block mb-4"
          >
            <Brain className="w-12 h-12 text-cyan-400 drop-shadow-lg" />
          </motion.div>
          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100">
            Neural Network Architecture
          </h3>
          <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Think of this as building the brain structure. Each layer has "neurons" that will learn different patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-xl font-bold text-white mb-6 flex items-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="mr-3"
              >
                <Settings className="w-6 h-6 text-cyan-400" />
              </motion.div>
              Network Layers
            </h4>
            
            <div className="space-y-3">
              {networkLayers.map((layer, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedLayer(index)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedLayer === index 
                      ? `border-${layer.color}-400 bg-${layer.color}-500/20` 
                      : 'border-white/20 bg-white/10 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{layer.name}</div>
                      <div className="text-sm text-white/70">{layer.description}</div>
                    </div>
                    <div className={`text-2xl font-bold text-${layer.color}-300`}>
                      {layer.neurons}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-xl font-bold text-white mb-6">Network Visualization</h4>
            
            <div className="flex justify-center items-center min-h-[300px]">
              <svg viewBox="0 0 400 300" className="w-full max-w-md">
                {/* Network visualization */}
                {networkLayers.map((layer, layerIndex) => (
                  <g key={layerIndex}>
                    {/* Neurons */}
                    {Array.from({ length: layer.neurons }).map((_, neuronIndex) => {
                      const x = (layerIndex + 1) * 80;
                      const y = 50 + (neuronIndex * 40) + (4 - layer.neurons) * 20;
                      
                      return (
                        <motion.circle
                          key={`${layerIndex}-${neuronIndex}`}
                          cx={x}
                          cy={y}
                          r={12}
                          fill={selectedLayer === layerIndex ? 
                            (layer.color === 'blue' ? '#3b82f6' :
                             layer.color === 'cyan' ? '#06b6d4' :
                             layer.color === 'green' ? '#10b981' : '#f59e0b') : '#6b7280'}
                          stroke="#fff"
                          strokeWidth="2"
                          animate={{ 
                            scale: selectedLayer === layerIndex ? [1, 1.2, 1] : 1,
                            fill: selectedLayer === layerIndex ? 
                              [
                                layer.color === 'blue' ? '#3b82f6' :
                                layer.color === 'cyan' ? '#06b6d4' :
                                layer.color === 'green' ? '#10b981' : '#f59e0b',
                                layer.color === 'blue' ? '#60a5fa' :
                                layer.color === 'cyan' ? '#67e8f9' :
                                layer.color === 'green' ? '#34d399' : '#fbbf24',
                                layer.color === 'blue' ? '#3b82f6' :
                                layer.color === 'cyan' ? '#06b6d4' :
                                layer.color === 'green' ? '#10b981' : '#f59e0b'
                              ] : '#6b7280'
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      );
                    })}
                    
                    {/* Connections to next layer */}
                    {layerIndex < networkLayers.length - 1 && 
                      Array.from({ length: layer.neurons }).map((_, fromNeuron) =>
                        Array.from({ length: networkLayers[layerIndex + 1].neurons }).map((_, toNeuron) => {
                          const x1 = (layerIndex + 1) * 80 + 12;
                          const y1 = 50 + (fromNeuron * 40) + (4 - layer.neurons) * 20;
                          const x2 = (layerIndex + 2) * 80 - 12;
                          const y2 = 50 + (toNeuron * 40) + (4 - networkLayers[layerIndex + 1].neurons) * 20;
                          
                          return (
                            <motion.line
                              key={`${layerIndex}-${fromNeuron}-${toNeuron}`}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke="#6b7280"
                              strokeWidth="1"
                              opacity={selectedLayer === layerIndex || selectedLayer === layerIndex + 1 ? 0.6 : 0.2}
                              animate={{
                                opacity: selectedLayer === layerIndex || selectedLayer === layerIndex + 1 ? [0.6, 1, 0.6] : 0.2
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          );
                        })
                      )
                    }
                  </g>
                ))}
              </svg>
            </div>
            
            <div className="mt-6 p-4 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
              <h5 className="font-bold text-cyan-300 mb-2">
                {networkLayers[selectedLayer].name}
              </h5>
              <p className="text-white/80 text-sm">
                {networkLayers[selectedLayer].description}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-cyan-300 text-sm font-semibold">
                  {networkLayers[selectedLayer].neurons} neurons
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-l-4 border-cyan-400 rounded-xl backdrop-blur-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center mb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Brain className="w-8 h-8 text-cyan-400 mr-4" />
            </motion.div>
            <h5 className="font-bold text-cyan-300 text-xl">How Network Architecture Works</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/80 leading-relaxed mb-4">
                <strong>Input Layer:</strong> Receives the word embeddings (numbers representing words)
              </p>
              <p className="text-white/80 leading-relaxed mb-4">
                <strong>Hidden Layers:</strong> Learn increasingly complex patterns. First layer finds simple features, deeper layers combine them.
              </p>
            </div>
            <div>
              <p className="text-white/80 leading-relaxed mb-4">
                <strong>Output Layer:</strong> Makes the final prediction based on all learned patterns
              </p>
              <p className="text-white/80 leading-relaxed mb-4">
                <strong>Connections:</strong> Each line represents a "weight" that gets adjusted during learning
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Loss Function Step
  const LossFunctionStep = () => {
    const [selectedPrediction, setSelectedPrediction] = useState(0);
    const predictions = [
      { text: "I love this!", actual: "Positive", predicted: "Positive", confidence: 0.95, loss: 0.05 },
      { text: "This is terrible", actual: "Negative", predicted: "Neutral", confidence: 0.60, loss: 0.85 },
      { text: "How are you?", actual: "Question", predicted: "Question", confidence: 0.88, loss: 0.12 }
    ];

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
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
            className="inline-block mb-4"
          >
            <Target className="w-12 h-12 text-red-400 drop-shadow-lg" />
          </motion.div>
          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100">
            Loss Function - Measuring Mistakes
          </h3>
          <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">
            AI needs to know how wrong it is to improve. The loss function is like a report card that tells AI how far off its guesses are.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-xl font-bold text-white mb-6 flex items-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="mr-3"
              >
                <Eye className="w-6 h-6 text-cyan-400" />
              </motion.div>
              Predictions vs Reality
            </h4>
            
            <div className="space-y-4">
              {predictions.map((pred, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedPrediction(index)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedPrediction === index 
                      ? 'border-red-400 bg-red-500/20' 
                      : 'border-white/20 bg-white/10 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-cyan-300 font-medium mb-2">"{pred.text}"</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-green-300 text-sm">Actual: {pred.actual}</div>
                      <div className="text-yellow-300 text-sm">Predicted: {pred.predicted}</div>
                    </div>
                    <div className={`font-bold text-lg ${
                      pred.loss < 0.2 ? 'text-green-400' : pred.loss < 0.5 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      Loss: {pred.loss.toFixed(2)}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-xl font-bold text-white mb-6">Loss Calculation</h4>
            
            <div className="space-y-6">
              <div className="p-4 bg-red-500/20 rounded-xl border border-red-400/30">
                <h5 className="font-bold text-red-300 mb-3">
                  Example: "{predictions[selectedPrediction].text}"
                </h5>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Correct Answer:</span>
                    <span className="text-green-300 font-bold">{predictions[selectedPrediction].actual}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">AI's Guess:</span>
                    <span className="text-yellow-300 font-bold">{predictions[selectedPrediction].predicted}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Confidence:</span>
                    <span className="text-blue-300 font-bold">{(predictions[selectedPrediction].confidence * 100).toFixed(0)}%</span>
                  </div>
                  
                  <hr className="border-white/20" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Loss Score:</span>
                    <span className={`font-bold text-lg ${
                      predictions[selectedPrediction].loss < 0.2 ? 'text-green-400' : 
                      predictions[selectedPrediction].loss < 0.5 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {predictions[selectedPrediction].loss.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Visual loss indicator */}
              <div className="space-y-2">
                <div className="text-sm text-white/70">Loss Visualization</div>
                <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden">
                  <motion.div
                    className={`h-4 rounded-full ${
                      predictions[selectedPrediction].loss < 0.2 ? 'bg-green-500' :
                      predictions[selectedPrediction].loss < 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${predictions[selectedPrediction].loss * 100}%` }}
                    animate={{ 
                      width: `${predictions[selectedPrediction].loss * 100}%`,
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/60">
                  <span>Perfect (0.0)</span>
                  <span>Terrible (1.0)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-l-4 border-red-400 rounded-xl backdrop-blur-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center mb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Target className="w-8 h-8 text-red-400 mr-4" />
            </motion.div>
            <h5 className="font-bold text-red-300 text-xl">Why Loss Functions Matter</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/80 leading-relaxed mb-4">
                <strong>Goal:</strong> Minimize the loss to make better predictions. Lower loss = better AI performance.
              </p>
              <p className="text-white/80 leading-relaxed">
                <strong>Learning Signal:</strong> Loss tells the AI which direction to adjust its internal weights.
              </p>
            </div>
            <div>
              <p className="text-white/80 leading-relaxed mb-4">
                <strong>Types:</strong> Different problems use different loss functions (classification, regression, etc.)
              </p>
              <p className="text-white/80 leading-relaxed">
                <strong>Training:</strong> AI repeatedly tries to reduce this loss score during learning.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Backpropagation Step
  const BackpropagationStep = () => {
    const [animationStep, setAnimationStep] = useState(0);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
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
            className="inline-block mb-4"
          >
            <ArrowRight className="w-12 h-12 text-cyan-400 drop-shadow-lg transform rotate-180" />
          </motion.div>
          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100">
            Backpropagation - Learning from Mistakes
          </h3>
          <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">
            After AI makes a mistake, it needs to figure out which parts of its "brain" caused the error and fix them.
          </p>
        </div>

        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-xl font-bold text-white mb-6 text-center">Error Flowing Backwards Through Network</h4>
          
          <div className="flex justify-center items-center min-h-[400px]">
            <svg viewBox="0 0 500 300" className="w-full max-w-2xl">
              {/* Network layers */}
              {[
                { x: 100, neurons: 3, label: "Input", color: "#3b82f6" },
                { x: 200, neurons: 4, label: "Hidden 1", color: "#8b5cf6" },
                { x: 300, neurons: 3, label: "Hidden 2", color: "#10b981" },
                { x: 400, neurons: 2, label: "Output", color: "#f59e0b" }
              ].map((layer, layerIndex) => (
                <g key={layerIndex}>
                  {/* Layer label */}
                  <text x={layer.x} y={30} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                    {layer.label}
                  </text>
                  
                  {/* Neurons */}
                  {Array.from({ length: layer.neurons }).map((_, neuronIndex) => {
                    const y = 80 + (neuronIndex * 50) + (4 - layer.neurons) * 12.5;
                    const isActive = animationStep >= (3 - layerIndex);
                    
                    return (
                      <motion.circle
                        key={`${layerIndex}-${neuronIndex}`}
                        cx={layer.x}
                        cy={y}
                        r={15}
                        fill={layer.color}
                        stroke="white"
                        strokeWidth="2"
                        animate={{ 
                          scale: isActive ? [1, 1.3, 1] : 1,
                          fill: isActive ? [layer.color, "#ff6b6b", layer.color] : layer.color
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    );
                  })}
                  
                  {/* Connections with error flow */}
                  {layerIndex < 3 && 
                    Array.from({ length: layer.neurons }).map((_, fromNeuron) =>
                      Array.from({ length: [3, 4, 3, 2][layerIndex + 1] }).map((_, toNeuron) => {
                        const y1 = 80 + (fromNeuron * 50) + (4 - layer.neurons) * 12.5;
                        const y2 = 80 + (toNeuron * 50) + (4 - [3, 4, 3, 2][layerIndex + 1]) * 12.5;
                        const isErrorFlowing = animationStep >= (3 - layerIndex);
                        
                        return (
                          <motion.line
                            key={`${layerIndex}-${fromNeuron}-${toNeuron}`}
                            x1={layer.x + 15}
                            y1={y1}
                            x2={[200, 300, 400][layerIndex] - 15}
                            y2={y2}
                            stroke={isErrorFlowing ? "#ff6b6b" : "#6b7280"}
                            strokeWidth={isErrorFlowing ? "3" : "1"}
                            animate={{
                              opacity: isErrorFlowing ? [0.3, 1, 0.3] : 0.3,
                              strokeWidth: isErrorFlowing ? ["1", "3", "1"] : "1"
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        );
                      })
                    )
                  }
                </g>
              ))}
              
              {/* Error arrow */}
              <motion.path
                d="M 420 150 L 380 150"
                stroke="#ff6b6b"
                strokeWidth="4"
                markerEnd="url(#arrowhead)"
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Arrow marker */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#ff6b6b" />
                </marker>
              </defs>
              
              {/* Error text */}
              <text x={430} y={140} fill="#ff6b6b" fontSize="14" fontWeight="bold">
                Error!
              </text>
              
              {/* Step indicator */}
              <text x={250} y={280} textAnchor="middle" fill="white" fontSize="12">
                Step {animationStep + 1}: Error flows from {
                  ['Output', 'Hidden 2', 'Hidden 1', 'Input'][animationStep]
                } layer backwards
              </text>
            </svg>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: 1, title: "Error Detected", desc: "AI notices wrong prediction" },
              { step: 2, title: "Blame Output", desc: "Which output neurons were wrong?" },
              { step: 3, title: "Blame Hidden", desc: "Which hidden neurons caused this?" },
              { step: 4, title: "Update Weights", desc: "Adjust connections to reduce error" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-xl border-2 ${
                  animationStep === index 
                    ? 'border-red-400 bg-red-500/20' 
                    : 'border-white/20 bg-white/10'
                }`}
                animate={{
                  scale: animationStep === index ? [1, 1.05, 1] : 1,
                  borderColor: animationStep === index ? ["#f87171", "#ef4444", "#f87171"] : "rgba(255, 255, 255, 0.2)"
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="text-center">
                  <div className="font-bold text-white mb-2">{item.title}</div>
                  <div className="text-sm text-white/70">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="p-6 bg-gradient-to-r from-cyan-500/10 to-red-500/10 border-l-4 border-cyan-400 rounded-xl backdrop-blur-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotateY: [0, 180, 360]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <ArrowRight className="w-8 h-8 text-cyan-400 mr-4 transform rotate-180" />
            </motion.div>
            <h5 className="font-bold text-cyan-300 text-xl">How Backpropagation Works</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/80 leading-relaxed mb-4">
                <strong>Chain Rule:</strong> Uses calculus to figure out how much each connection contributed to the error.
              </p>
              <p className="text-white/80 leading-relaxed">
                <strong>Backward Flow:</strong> Starts from the output error and works backwards through all layers.
              </p>
            </div>
            <div>
              <p className="text-white/80 leading-relaxed mb-4">
                <strong>Gradient Calculation:</strong> Computes how to adjust each weight to reduce the error.
              </p>
              <p className="text-white/80 leading-relaxed">
                <strong>Weight Updates:</strong> All connections get slightly adjusted based on their blame for the mistake.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Validation Step
  const ValidationStep = () => {
    const [selectedDataset, setSelectedDataset] = useState(0);
    const datasets = [
      { 
        name: "Training Set", 
        accuracy: 0.98, 
        purpose: "Learn patterns", 
        color: "blue",
        description: "Data the AI practices on"
      },
      { 
        name: "Validation Set", 
        accuracy: 0.87, 
        purpose: "Tune parameters", 
        color: "green",
        description: "Data to check if learning is going well"
      },
      { 
        name: "Test Set", 
        accuracy: 0.85, 
        purpose: "Final evaluation", 
        color: "cyan",
        description: "Data AI has never seen - true test!"
      }
    ];

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
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
            className="inline-block mb-4"
          >
            <Eye className="w-12 h-12 text-green-400 drop-shadow-lg" />
          </motion.div>
          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100">
            Validation & Testing
          </h3>
          <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">
            How do we know if our AI really learned? We test it on data it has never seen before!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {datasets.map((dataset, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedDataset(index)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center ${
                selectedDataset === index 
                  ? `border-${dataset.color}-400 bg-${dataset.color}-500/20` 
                  : 'border-white/20 bg-white/10 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                animate={{ 
                  scale: selectedDataset === index ? [1, 1.2, 1] : 1 
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  dataset.color === 'blue' ? 'bg-blue-500/30' :
                  dataset.color === 'green' ? 'bg-green-500/30' : 'bg-cyan-500/30'
                }`}
              >
                <BarChart3 className={`w-8 h-8 ${
                  dataset.color === 'blue' ? 'text-blue-400' :
                  dataset.color === 'green' ? 'text-green-400' : 'text-cyan-400'
                }`} />
              </motion.div>
              
              <h4 className="text-xl font-bold text-white mb-2">{dataset.name}</h4>
              <p className="text-white/70 text-sm mb-4">{dataset.description}</p>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">
                  {(dataset.accuracy * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-white/60">Accuracy</div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      dataset.color === 'blue' ? 'bg-blue-500' :
                      dataset.color === 'green' ? 'bg-green-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${dataset.accuracy * 100}%` }}
                    animate={{ 
                      width: `${dataset.accuracy * 100}%`,
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h4 className="text-xl font-bold text-white mb-6 text-center">Why We Need Different Datasets</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <h5 className="font-bold text-blue-300 mb-2">🎓 Training (70%)</h5>
              <p className="text-white/80 text-sm mb-2">
                Like studying for an exam - AI learns patterns from these examples
              </p>
              <div className="text-blue-400 font-bold">High accuracy is expected!</div>
            </div>
            
            <div className="text-center p-4 bg-green-500/20 rounded-xl border border-green-400/30">
              <h5 className="font-bold text-green-300 mb-2">🔧 Validation (15%)</h5>
              <p className="text-white/80 text-sm mb-2">
                Like practice tests - helps tune the learning process
              </p>
              <div className="text-green-400 font-bold">Should be reasonably good</div>
            </div>
            
            <div className="text-center p-4 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
              <h5 className="font-bold text-cyan-300 mb-2">🏆 Test (15%)</h5>
              <p className="text-white/80 text-sm mb-2">
                Like the final exam - AI has never seen these examples
              </p>
              <div className="text-cyan-400 font-bold">The real performance!</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-l-4 border-green-400 rounded-xl backdrop-blur-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center mb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Eye className="w-8 h-8 text-green-400 mr-4" />
            </motion.div>
            <h5 className="font-bold text-green-300 text-xl">Key Insights</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/80 leading-relaxed mb-4">
                <strong>Gap Check:</strong> If training accuracy is much higher than test accuracy, the AI might have memorized instead of learned.
              </p>
              <p className="text-white/80 leading-relaxed">
                <strong>Real Performance:</strong> Test set accuracy is what matters - it shows how AI will perform in the real world.
              </p>
            </div>
            <div>
              <p className="text-white/80 leading-relaxed mb-4">
                <strong>Never Cheat:</strong> AI should never see test data during training, or the results won't be meaningful.
              </p>
              <p className="text-white/80 leading-relaxed">
                <strong>Cross-Validation:</strong> Advanced technique that creates multiple validation sets for more reliable testing.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (steps[currentStep].component) {
      case 'textSelection':
        return <TextSelectionStep />;
      case 'tokenization':
        return <TokenizationStep />;
      case 'numberConversion':
        return <NumberConversionStep />;
      case 'trainingData':
        return <TrainingDataStep />;
      case 'networkArchitecture':
        return <NetworkArchitectureStep />;
      case 'forwardPass':
        return <NeuralProcessingStep />; // Reuse existing for now
      case 'lossFunction':
        return <LossFunctionStep />;
      case 'backpropagation':
        return <BackpropagationStep />;
      case 'validation':
        return <ValidationStep />;
      case 'trainingParams':
        return <TrainingParamsStep />;
      case 'training':
        return <TrainingStep />;
      case 'results':
        return <ResultsStep />;
      case 'gradientDescent':
      case 'batchProcessing':
      case 'overfitting':
      default:
        return (
          <div className="text-center py-12">
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: 'loop'
              }}
              className="text-6xl mb-4"
            >
              🚧
            </motion.div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100 mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-blue-100">Coming soon with interactive visualizations!</p>
            <div className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-400/30 max-w-md mx-auto">
              <p className="text-blue-300 text-sm">
                This comprehensive step will help you understand {steps[currentStep].description.toLowerCase()}
              </p>
            </div>
          </div>
        );
    }
  };

  // Floating particles animation component
  const FloatingParticles = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20"
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
              className="flex items-center space-x-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
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
                className="inline-block"
              >
                <Brain className="w-8 h-8 text-blue-400 drop-shadow-lg" />
              </motion.div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300">
                How AI Learns
              </h1>
            </motion.div>
            
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-sm">Step {currentStep + 1} of {steps.length}</span>
              <motion.button
                onClick={resetDemo}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Reset Demo"
              >
                <RotateCcw size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="ai-education-content w-full">
        <motion.div 
          className="relative w-full min-h-screen"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, 
              rgba(99, 102, 241, 0.1) 0%, 
              transparent 50%),
              linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 100%)
            `
          }}
        >
          <FloatingParticles />
          
          <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
            {/* Hero Section */}
            <motion.div 
              className="text-center mb-12"
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
              
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100 mb-6 drop-shadow-2xl">
                Interactive AI Learning Journey
              </h1>
              
              <motion.p 
                className="text-xl text-blue-100 max-w-4xl mx-auto mb-8 leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Take a journey through AI's mind! See exactly how artificial intelligence processes text, 
                learns patterns, and makes predictions. No technical background needed.
              </motion.p>
            </motion.div>

            {/* Progress Steps */}
            <motion.div 
              className="mb-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-6">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex-1 h-3 rounded-full transition-all duration-500 ${
                      index <= currentStep 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg' 
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex justify-between text-sm text-blue-100">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`flex-1 text-center transition-all duration-300 ${
                      index === currentStep ? 'text-yellow-400 font-bold scale-105' : ''
                    }`}
                    animate={{ 
                      scale: index === currentStep ? 1.05 : 1,
                      color: index === currentStep ? '#fbbf24' : '#dbeafe'
                    }}
                  >
                    <div className="font-semibold">{step.title}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Main Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-12"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <motion.div 
              className="flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 text-white rounded-xl transition-colors backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={20} />
                Previous
              </motion.button>

              <div className="text-center">
                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                  {steps[currentStep].title}
                </div>
                <div className="text-sm text-white/70">
                  {steps[currentStep].description}
                </div>
              </div>

              <motion.button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1 || (currentStep === 0 && !selectedText)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-white/10 disabled:to-white/10 disabled:text-white/30 text-white rounded-xl transition-colors shadow-lg disabled:shadow-none font-semibold"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AILearningDemo;