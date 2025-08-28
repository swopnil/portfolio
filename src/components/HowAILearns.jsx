import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, ArrowRight, ArrowLeft, Play, Pause, RotateCcw, 
  Zap, Target, TrendingUp, Calculator, 
  Hash, Star, Rocket, Activity, BarChart3,
  Eye, Settings, Network, Layers, Database,
  GitBranch, Shuffle, Code, LineChart, PieChart,
  Gauge, Sparkles, Award, Trophy, Medal,
  ChevronUp, ChevronDown, Menu, X, Search,
  Volume2, VolumeX, Lock, Unlock, Shield,
  CheckCircle, XCircle, Info, HelpCircle,
  Clock, Maximize2, Minimize2, RefreshCw,
  BookOpen, Lightbulb, AlertCircle, Home,
  FastForward, Rewind, SkipForward, SkipBack,TrendingDown, BarChart
} from 'lucide-react';
import ModelEvaluationModule from './ModelEvaluation';

const HowAILearns = ({ updateProgress }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [selectedText, setSelectedText] = useState("The quick brown fox jumps over the lazy dog.");
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStep, setTrainingStep] = useState(0);
  
  // Real mathematical states
  const [vocabulary, setVocabulary] = useState(new Map());
  const [tokenIds, setTokenIds] = useState([]);
  const [embeddings, setEmbeddings] = useState([]);
  const [weights, setWeights] = useState({
    W1: [], W2: [], b1: [], b2: []
  });
  const [loss, setLoss] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [learningRate, setLearningRate] = useState(0.01);
  const [batchSize, setBatchSize] = useState(4);
  const [attentionWeights, setAttentionWeights] = useState([]);
  const [queryMatrix, setQueryMatrix] = useState([]);
  const [keyMatrix, setKeyMatrix] = useState([]);
  const [valueMatrix, setValueMatrix] = useState([]);

  // Comprehensive AI Learning Steps
  const learningSteps = [
    {
      id: 0,
      title: "Welcome to AI Learning",
      subtitle: "Your Journey into Artificial Intelligence",
      icon: Brain,
      color: "from-purple-500 to-indigo-600",
      duration: "5 min",
      difficulty: "Beginner",
      importance: "Foundation",
      description: "Understanding what AI is and how machines learn from data"
    },
    {
      id: 1,
      title: "Text Tokenization",
      subtitle: "Breaking Language into AI-Understandable Pieces",
      icon: Hash,
      color: "from-blue-500 to-cyan-600",
      duration: "8 min",
      difficulty: "Beginner",
      importance: "Essential",
      description: "How AI converts human language into processable tokens"
    },
    {
      id: 2,
      title: "Word Embeddings",
      subtitle: "Converting Words into Mathematical Vectors",
      icon: Network,
      color: "from-cyan-500 to-teal-600",
      duration: "10 min",
      difficulty: "Intermediate",
      importance: "Critical",
      description: "Transform tokens into dense numerical representations"
    },
    {
      id: 3,
      title: "Neural Network Architecture",
      subtitle: "Building the AI Brain Structure",
      icon: Layers,
      color: "from-teal-500 to-green-600",
      duration: "12 min",
      difficulty: "Intermediate",
      importance: "Fundamental",
      description: "Design and understand neural network layers and connections"
    },
    {
      id: 4,
      title: "Forward Propagation",
      subtitle: "How Data Flows Through Neural Networks",
      icon: ArrowRight,
      color: "from-green-500 to-lime-600",
      duration: "10 min",
      difficulty: "Intermediate",
      importance: "Core",
      description: "Follow information as it moves through the network layers"
    },
    {
      id: 5,
      title: "Loss Functions",
      subtitle: "Measuring AI Prediction Accuracy",
      icon: Target,
      color: "from-lime-500 to-yellow-600",
      duration: "8 min",
      difficulty: "Intermediate",
      importance: "Essential",
      description: "Understand how AI measures and quantifies its mistakes"
    },
    {
      id: 6,
      title: "Backpropagation",
      subtitle: "How AI Learns from Its Mistakes",
      icon: GitBranch,
      color: "from-yellow-500 to-orange-600",
      duration: "15 min",
      difficulty: "Advanced",
      importance: "Critical",
      description: "The mathematical process that enables learning in neural networks"
    },
    {
      id: 7,
      title: "Gradient Descent",
      subtitle: "Finding the Optimal Solution",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      duration: "12 min",
      difficulty: "Advanced",
      importance: "Fundamental",
      description: "The optimization algorithm that drives AI learning"
    },
    {
      id: 8,
      title: "Batch Processing",
      subtitle: "Efficient Learning from Multiple Examples",
      icon: Database,
      color: "from-red-500 to-pink-600",
      duration: "10 min",
      difficulty: "Intermediate",
      importance: "Practical",
      description: "How AI processes multiple examples simultaneously for better learning"
    },
    {
      id: 9,
      title: "Attention Mechanisms",
      subtitle: "Teaching AI to Focus on What Matters",
      icon: Eye,
      color: "from-pink-500 to-purple-600",
      duration: "15 min",
      difficulty: "Advanced",
      importance: "Modern",
      description: "The breakthrough technology behind ChatGPT and modern AI"
    },
    {
      id: 10,
      title: "Training & Optimization",
      subtitle: "Putting It All Together",
      icon: Settings,
      color: "from-purple-500 to-indigo-600",
      duration: "20 min",
      difficulty: "Advanced",
      importance: "Complete",
      description: "Real training process with hyperparameter tuning"
    },
    {
      id: 11,
      title: "Model Evaluation",
      subtitle: "Testing AI Performance",
      icon: BarChart3,
      color: "from-indigo-500 to-blue-600",
      duration: "12 min",
      difficulty: "Intermediate",
      importance: "Validation",
      description: "How to properly evaluate and validate AI model performance"
    }
  ];

  // Real vocabulary with embeddings
  const createVocabulary = (text) => {
    const tokens = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 0);
    
    const vocab = new Map();
    const uniqueTokens = [...new Set(tokens)];
    
    uniqueTokens.forEach((token, index) => {
      const embedding = [];
      for (let i = 0; i < 4; i++) {
        const charSum = token.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        embedding.push(Math.sin(charSum * (i + 1) * 0.1) * 0.5 + Math.cos(index * (i + 1) * 0.2) * 0.5);
      }
      vocab.set(token, {
        id: index,
        embedding,
        frequency: tokens.filter(t => t === token).length
      });
    });
    
    return { vocab, tokens };
  };

  // Initialize neural network weights
  const initializeWeights = (inputSize, hiddenSize, outputSize) => {
    const xavier = (fanIn, fanOut) => Math.sqrt(6 / (fanIn + fanOut));
    
    const W1 = Array(hiddenSize).fill().map(() => 
      Array(inputSize).fill().map(() => 
        (Math.random() - 0.5) * 2 * xavier(inputSize, hiddenSize)
      )
    );
    
    const W2 = Array(outputSize).fill().map(() => 
      Array(hiddenSize).fill().map(() => 
        (Math.random() - 0.5) * 2 * xavier(hiddenSize, outputSize)
      )
    );
    
    const b1 = Array(hiddenSize).fill(0);
    const b2 = Array(outputSize).fill(0);
    
    return { W1, W2, b1, b2 };
  };

  // Activation functions
  const activationFunctions = {
    relu: (x) => Math.max(0, x),
    reluDerivative: (x) => x > 0 ? 1 : 0,
    sigmoid: (x) => 1 / (1 + Math.exp(-x)),
    sigmoidDerivative: (x) => {
      const s = 1 / (1 + Math.exp(-x));
      return s * (1 - s);
    },
    softmax: (arr) => {
      const maxVal = Math.max(...arr);
      const exps = arr.map(x => Math.exp(x - maxVal));
      const sumExps = exps.reduce((sum, exp) => sum + exp, 0);
      return exps.map(exp => exp / sumExps);
    }
  };

  // Forward pass calculation
  const forwardPass = (input, weights) => {
    const z1 = weights.W1.map((row, i) => {
      const sum = row.reduce((acc, w, j) => acc + w * input[j], 0) + weights.b1[i];
      return sum;
    });
    
    const a1 = z1.map(z => activationFunctions.relu(z));
    
    const z2 = weights.W2.map((row, i) => {
      const sum = row.reduce((acc, w, j) => acc + w * a1[j], 0) + weights.b2[i];
      return sum;
    });
    
    const a2 = activationFunctions.softmax(z2);
    
    return { z1, a1, z2, a2 };
  };

  // Attention mechanism
  const calculateAttention = (embeddings) => {
    const d_k = embeddings[0].length;
    const queries = embeddings.map(emb => emb.map(x => x * 0.8));
    const keys = embeddings.map(emb => emb.map(x => x * 0.6));
    const values = embeddings.map(emb => emb.map(x => x * 1.2));
    
    const scores = queries.map((q, i) => 
      keys.map((k, j) => {
        const dotProduct = q.reduce((sum, val, idx) => sum + val * k[idx], 0);
        return dotProduct / Math.sqrt(d_k);
      })
    );
    
    const attentionWeights = scores.map(row => activationFunctions.softmax(row));
    
    return { attentionWeights, queries, keys, values };
  };

  // Process text when it changes
  useEffect(() => {
    if (selectedText) {
      const { vocab, tokens } = createVocabulary(selectedText);
      setVocabulary(vocab);
      
      const ids = tokens.map(token => vocab.get(token).id);
      setTokenIds(ids);
      
      const embs = tokens.map(token => vocab.get(token).embedding);
      setEmbeddings(embs);
      
      const networkWeights = initializeWeights(4, 8, 3);
      setWeights(networkWeights);
      
      if (embs.length > 1) {
        const attention = calculateAttention(embs);
        setAttentionWeights(attention.attentionWeights);
        setQueryMatrix(attention.queries);
        setKeyMatrix(attention.keys);
        setValueMatrix(attention.values);
      }
    }
  }, [selectedText]);

  // Training simulation
  useEffect(() => {
    if (isTraining && trainingStep < 100) {
      const interval = setInterval(() => {
        setTrainingStep(prev => {
          const newStep = prev + 1;
          const newLoss = 2.5 * Math.exp(-newStep / 30) + 0.1 * Math.random();
          const newAccuracy = Math.min(95, 20 + (newStep / 100) * 70 + Math.random() * 5);
          
          setLoss(newLoss);
          setAccuracy(newAccuracy);
          setEpoch(Math.floor(newStep / 10));
          
          if (newStep >= 100) {
            setIsTraining(false);
          }
          
          return newStep;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isTraining, trainingStep]);

  // Navigation functions
  const nextStep = () => {
    if (currentStep < learningSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepId) => {
    setCurrentStep(stepId);
  };

  const completeStep = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (updateProgress) {
      const progress = ((completedSteps.size + 1) / learningSteps.length) * 100;
      updateProgress(progress);
    }
  };

  // Step Components
  const WelcomeStep = () => (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div 
          className="inline-flex items-center gap-6 mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-3xl shadow-2xl">
            <Brain className="w-10 h-10" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to AI Learning</h1>
            <p className="text-2xl text-gray-600">Your comprehensive journey into Artificial Intelligence</p>
          </div>
        </motion.div>
      </div>

      {/* Why This Matters */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500 text-white rounded-xl">
              <Lightbulb className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Why Learn AI?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 rounded-2xl p-6 border border-blue-200">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Future-Proof Your Career</h3>
              <p className="text-gray-600">AI is transforming every industry. Understanding AI fundamentals gives you a competitive edge in any field.</p>
            </div>
            
            <div className="bg-white/80 rounded-2xl p-6 border border-purple-200">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Understand Modern Technology</h3>
              <p className="text-gray-600">From ChatGPT to self-driving cars, learn how the technology shaping our world actually works.</p>
            </div>
            
            <div className="bg-white/80 rounded-2xl p-6 border border-orange-200">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Build Real Solutions</h3>
              <p className="text-gray-600">Apply AI knowledge to solve real-world problems in healthcare, finance, education, and more.</p>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-12">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-500 text-white rounded-xl">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Your Learning Journey</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Mathematical Foundations</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Text Processing & Tokenization</h4>
                    <p className="text-sm text-gray-600">Learn how AI converts human language into mathematical representations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Neural Network Architecture</h4>
                    <p className="text-sm text-gray-600">Understand how artificial neurons process and transform information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Learning Algorithms</h4>
                    <p className="text-sm text-gray-600">Discover how machines learn through backpropagation and optimization</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Hands-On Experience</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Interactive Experiments</h4>
                    <p className="text-sm text-gray-600">Run real calculations, adjust parameters, and see immediate results</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Real-Time Visualizations</h4>
                    <p className="text-sm text-gray-600">Watch neural networks learn and see mathematical formulas in action</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Modern AI Techniques</h4>
                    <p className="text-sm text-gray-600">Explore attention mechanisms and transformer architectures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path Preview */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500 text-white rounded-xl">
              <Star className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">12-Step Learning Path</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningSteps.slice(1).map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="bg-white/80 rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${step.color} text-white`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">{step.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{step.duration}</span>
                        <span>•</span>
                        <span>{step.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Get Started Button */}
      <div className="text-center mt-12">
        <button
          onClick={() => {
            completeStep();
            nextStep();
          }}
          className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-xl hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-2xl"
        >
          <Rocket className="w-8 h-8" />
          Start Your AI Learning Journey
          <ArrowRight className="w-8 h-8" />
        </button>
        <p className="text-gray-600 mt-4">Begin with Text Tokenization - the foundation of AI language understanding</p>
      </div>
    </div>
  );

  const TokenizationStep = () => (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg">
            <Hash className="w-12 h-12" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Text Tokenization</h1>
            <p className="text-xl text-gray-600">Breaking Language into AI-Understandable Pieces</p>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-200 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-blue-500 text-white rounded-xl flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Tokenization is Crucial for Beginners</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Imagine trying to teach a math student who only understands numbers, but you're speaking in sentences. 
              That's exactly the challenge AI faces with human language. Computers work with numbers, not words.
            </p>
            <div className="bg-white/80 rounded-xl p-4 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">🎯 What You'll Learn:</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• How AI converts "Hello world!" into numbers like [1, 2]</li>
                <li>• Why every word needs a unique numerical ID</li>
                <li>• Real mathematical formulas used in tokenization</li>
                <li>• Interactive experiments with your own text</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Code className="w-7 h-7 text-blue-600" />
            Interactive Tokenization Lab
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Enter Your Text (try different languages, numbers, symbols):
              </label>
              <textarea
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                placeholder="Type anything here and watch the magic happen..."
                className="w-full h-32 p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none bg-white font-mono text-lg"
              />
              <p className="text-sm text-gray-600 mt-2">
                💡 Try: "Hello AI! How are you today? 😊" or "The price is $99.99"
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">{selectedText.split(' ').length}</div>
                <div className="text-sm text-gray-600">Total Words</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-cyan-200">
                <div className="text-3xl font-bold text-cyan-600">{vocabulary.size}</div>
                <div className="text-sm text-gray-600">Unique Tokens</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-green-200">
                <div className="text-3xl font-bold text-green-600">{selectedText.length}</div>
                <div className="text-sm text-gray-600">Characters</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Step 1: Raw Text */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              Raw Human Text
            </h3>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200 font-serif text-xl text-center">
                "{selectedText}"
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center">
                This is how humans naturally communicate - with words, punctuation, and meaning
              </p>
            </div>
          </div>

          {/* Step 2: Tokenization Process */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              Breaking into Tokens
            </h3>
            <div className="bg-green-50 rounded-2xl p-6">
              <div className="mb-4">
                <h4 className="font-bold text-gray-800 mb-2">Tokenization Algorithm:</h4>
                <div className="bg-white p-4 rounded-xl border border-green-200 font-mono text-sm">
                  text.toLowerCase() → "{selectedText.toLowerCase()}"<br/>
                  .replace(/[^\w\s]/g, '') → "{selectedText.toLowerCase().replace(/[^\w\s]/g, '')}"<br/>
                  .split(/\s+/) → [tokens]
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {Array.from(vocabulary.keys()).map((token, index) => (
                  <motion.div
                    key={index}
                    className="bg-white border-2 border-green-300 px-4 py-3 rounded-xl shadow-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="font-bold text-green-800 font-mono text-lg">"{token}"</div>
                    <div className="text-xs text-green-600 text-center mt-1">
                      Token #{index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Number Assignment */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              Converting to Numbers
            </h3>
            <div className="bg-purple-50 rounded-2xl p-6">
              <div className="mb-4">
                <h4 className="font-bold text-gray-800 mb-2">Why Numbers?</h4>
                <p className="text-gray-700 mb-4">
                  Computers can only process numbers. Each unique token gets a permanent ID number that the AI will always use to recognize that word.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from(vocabulary.entries()).map(([token, data], index) => (
                  <div key={index} className="bg-white rounded-xl p-4 border border-purple-200 text-center">
                    <div className="text-lg font-bold text-purple-800 font-mono mb-2">"{token}"</div>
                    <div className="text-4xl font-bold text-purple-600 my-3">↓</div>
                    <div className="text-3xl font-bold bg-purple-600 text-white rounded-lg py-3 mb-2">
                      {data.id}
                    </div>
                    <div className="text-sm text-gray-600">Token ID</div>
                    <div className="text-xs text-purple-600 mt-1">Used {data.frequency} time(s)</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mathematical Insight */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500 text-white rounded-xl">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mathematical Foundation</h3>
                <p className="text-gray-700 mb-4">
                  This process creates a <strong>vocabulary mapping</strong>: V: words → ℕ (natural numbers)
                </p>
                <div className="bg-white/80 rounded-lg p-4 font-mono text-sm">
                  <div className="font-bold mb-2">Tokenization Function:</div>
                  <div>f(text) = [token₁, token₂, ..., tokenₙ]</div>
                  <div>g(token) = unique_id ∈ [0, vocabulary_size)</div>
                  <div className="mt-2 text-blue-600">
                    Result: "{selectedText}" → [{Array.from(vocabulary.keys()).map(token => vocabulary.get(token).id).join(', ')}]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EmbeddingsStep = () => (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-cyan-500 to-teal-500 text-white rounded-2xl shadow-lg">
            <Network className="w-12 h-12" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Word Embeddings</h1>
            <p className="text-xl text-gray-600">Converting Tokens into Mathematical Vectors</p>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-3xl p-8 border border-cyan-200 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-cyan-500 text-white rounded-xl flex-shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Embeddings Are Game-Changing</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Having numbers for words is just the start. The breakthrough is turning each word into a <strong>vector</strong> - 
              a list of numbers that captures the word's meaning, relationships, and context.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 rounded-xl p-4 border border-cyan-200">
                <h3 className="font-bold text-cyan-900 mb-2">🤔 The Problem with Simple IDs:</h3>
                <p className="text-gray-700 text-sm">
                  ID #5 = "king", ID #10 = "queen" - the AI can't tell these words are related!
                </p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 border border-teal-200">
                <h3 className="font-bold text-teal-900 mb-2">✨ The Embedding Solution:</h3>
                <p className="text-gray-700 text-sm">
                  "king" = [0.2, 0.8, -0.3, 0.9] - now AI can see relationships and similarities!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Embedding Mathematics in Action</h2>
          
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-3">Our Embedding Formula:</h4>
            <div className="bg-white p-4 rounded-xl border-2 border-cyan-200 font-mono text-lg">
              E(token) = [sin(charSum × 0.1), cos(id × 0.2), sin(charSum × 0.2), cos(id × 0.3)]
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Where charSum = sum of ASCII values of all characters in the token
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-cyan-200 bg-cyan-50">
                  <th className="text-left p-4 font-bold">Token</th>
                  <th className="text-left p-4 font-bold">ID</th>
                  <th className="text-left p-4 font-bold">CharSum</th>
                  <th className="text-left p-4 font-bold">Embedding Vector [4D]</th>
                  <th className="text-left p-4 font-bold">Magnitude</th>
                  <th className="text-left p-4 font-bold">Calculation</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(vocabulary.entries()).map(([token, data], index) => {
                  const charSum = token.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
                  const magnitude = Math.sqrt(data.embedding.reduce((sum, val) => sum + val * val, 0));
                  return (
                    <tr key={index} className="border-b border-cyan-100 hover:bg-cyan-50">
                      <td className="p-4 font-mono font-bold text-cyan-800">"{token}"</td>
                      <td className="p-4 font-mono">{data.id}</td>
                      <td className="p-4 font-mono">{charSum}</td>
                      <td className="p-4 font-mono text-xs">
                        [{data.embedding.map(val => val.toFixed(3)).join(', ')}]
                      </td>
                      <td className="p-4 font-mono">{magnitude.toFixed(3)}</td>
                      <td className="p-4 font-mono text-xs text-gray-600">
                        [sin({charSum}×0.1), cos({data.id}×0.2), ...]
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Vector Relationships */}
      {embeddings.length > 1 && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-50 to-green-50 p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vector Relationships & Similarities</h2>
            <p className="text-gray-600">
              Now we can measure how similar words are using mathematical distance!
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Cosine Similarity Matrix</h3>
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="p-2 text-left">Token</th>
                        {Array.from(vocabulary.keys()).slice(0, 4).map((token, i) => (
                          <th key={i} className="p-2 text-center font-mono">"{token}"</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(vocabulary.entries()).slice(0, 4).map(([token1, data1], i) => (
                        <tr key={i}>
                          <td className="p-2 font-mono font-bold">"{token1}"</td>
                          {Array.from(vocabulary.entries()).slice(0, 4).map(([token2, data2], j) => {
                            // Calculate cosine similarity
                            const dot = data1.embedding.reduce((sum, val, idx) => sum + val * data2.embedding[idx], 0);
                            const mag1 = Math.sqrt(data1.embedding.reduce((sum, val) => sum + val * val, 0));
                            const mag2 = Math.sqrt(data2.embedding.reduce((sum, val) => sum + val * val, 0));
                            const similarity = dot / (mag1 * mag2);
                            
                            return (
                              <td 
                                key={j} 
                                className="p-2 text-center font-mono text-xs"
                                style={{
                                  backgroundColor: `rgba(20, 184, 166, ${Math.abs(similarity)})`,
                                  color: Math.abs(similarity) > 0.5 ? 'white' : 'black'
                                }}
                              >
                                {similarity.toFixed(3)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Values closer to 1.0 mean words are more similar in meaning
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Mathematical Formula</h3>
                <div className="bg-white rounded-xl p-4 border border-teal-200">
                  <div className="space-y-4 font-mono text-sm">
                    <div>
                      <div className="font-bold text-teal-600">Cosine Similarity:</div>
                      <div className="text-gray-700">similarity = (A · B) / (||A|| × ||B||)</div>
                    </div>
                    <div>
                      <div className="font-bold text-teal-600">Where:</div>
                      <div className="text-gray-700">A · B = Σ(aᵢ × bᵢ) (dot product)</div>
                      <div className="text-gray-700">||A|| = √(Σaᵢ²) (vector magnitude)</div>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <div className="font-bold text-teal-700">Example:</div>
                      <div className="text-xs text-gray-600">
                        For tokens "{Array.from(vocabulary.keys())[0]}" and "{Array.from(vocabulary.keys())[1]}":<br/>
                        Similarity = {(() => {
                          if (embeddings.length < 2) return "N/A";
                          const emb1 = embeddings[0];
                          const emb2 = embeddings[1];
                          const dot = emb1.reduce((sum, val, idx) => sum + val * emb2[idx], 0);
                          const mag1 = Math.sqrt(emb1.reduce((sum, val) => sum + val * val, 0));
                          const mag2 = Math.sqrt(emb2.reduce((sum, val) => sum + val * val, 0));
                          return (dot / (mag1 * mag2)).toFixed(4);
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Neural Network Architecture Step
  const NeuralNetworkStep = () => (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-teal-500 to-green-500 text-white rounded-2xl shadow-lg">
            <Layers className="w-12 h-12" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Neural Network Architecture</h1>
            <p className="text-xl text-gray-600">Building the AI Brain Structure</p>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-3xl p-8 border border-teal-200 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-teal-500 text-white rounded-xl flex-shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">The Foundation of AI Intelligence</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              A neural network's architecture is like the blueprint of a building. It defines how information flows, 
              where decisions are made, and how the AI processes complex patterns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 rounded-xl p-4 border border-teal-200">
                <h3 className="font-bold text-teal-900 mb-2">🧠 Inspired by Biology:</h3>
                <p className="text-gray-700 text-sm">
                  Just like neurons in your brain connect to form networks, artificial neurons form layers that process information.
                </p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 border border-green-200">
                <h3 className="font-bold text-green-900 mb-2">⚡ Mathematical Precision:</h3>
                <p className="text-gray-700 text-sm">
                  Each connection has a weight, each layer has an activation function, and the entire network follows mathematical rules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Architecture Visualization */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-50 to-green-50 p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Neural Network</h2>
          <p className="text-gray-600">
            Explore how data flows through layers. Each neuron performs: output = activation(Σ(weight × input) + bias)
          </p>
        </div>

        <div className="p-8">
          {/* Network Visualization */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 mb-8">
            <div className="flex justify-between items-center mb-8">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Input Layer</h3>
                <p className="text-sm text-gray-600">4 Features</p>
                <div className="space-y-3 mt-4">
                  {embeddings[0] && embeddings[0].map((value, i) => (
                    <div key={i} className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {value.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 px-8">
                {/* Connections Visualization */}
                <div className="relative h-64">
                  <svg className="absolute inset-0 w-full h-full">
                    {/* Draw connections from input to hidden */}
                    {embeddings[0] && weights.W1.map((hiddenWeights, hiddenIdx) => 
                      hiddenWeights.map((weight, inputIdx) => (
                        <line
                          key={`input-hidden-${inputIdx}-${hiddenIdx}`}
                          x1="10%"
                          y1={`${15 + inputIdx * 20}%`}
                          x2="50%"
                          y2={`${5 + hiddenIdx * 12}%`}
                          stroke={weight > 0 ? "#10B981" : "#EF4444"}
                          strokeWidth={Math.abs(weight) * 3}
                          opacity={0.6}
                        />
                      ))
                    )}
                    {/* Draw connections from hidden to output */}
                    {weights.W2.map((outputWeights, outputIdx) => 
                      outputWeights.map((weight, hiddenIdx) => (
                        <line
                          key={`hidden-output-${hiddenIdx}-${outputIdx}`}
                          x1="50%"
                          y1={`${5 + hiddenIdx * 12}%`}
                          x2="90%"
                          y2={`${25 + outputIdx * 25}%`}
                          stroke={weight > 0 ? "#10B981" : "#EF4444"}
                          strokeWidth={Math.abs(weight) * 3}
                          opacity={0.6}
                        />
                      ))
                    )}
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Hidden Layer</h3>
                <p className="text-sm text-gray-600">8 Neurons</p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {weights.W1.map((_, i) => (
                    <div key={i} className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      H{i+1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 px-8">
                {/* Second set of connections visualization would go here */}
              </div>

              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Output Layer</h3>
                <p className="text-sm text-gray-600">3 Classes</p>
                <div className="space-y-3 mt-4">
                  {weights.W2.map((_, i) => (
                    <div key={i} className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      O{i+1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Layer Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full" />
                  <h4 className="font-bold text-gray-800">Input Layer</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Size:</strong> 4 neurons</div>
                  <div><strong>Function:</strong> Receive embeddings</div>
                  <div><strong>Activation:</strong> None (linear)</div>
                  <div><strong>Purpose:</strong> Entry point for data</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full" />
                  <h4 className="font-bold text-gray-800">Hidden Layer</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Size:</strong> 8 neurons</div>
                  <div><strong>Function:</strong> Feature extraction</div>
                  <div><strong>Activation:</strong> ReLU</div>
                  <div><strong>Purpose:</strong> Learn complex patterns</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full" />
                  <h4 className="font-bold text-gray-800">Output Layer</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Size:</strong> 3 neurons</div>
                  <div><strong>Function:</strong> Classification</div>
                  <div><strong>Activation:</strong> Softmax</div>
                  <div><strong>Purpose:</strong> Final predictions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Foundation */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Calculator className="w-6 h-6 text-yellow-600" />
              Mathematical Foundations
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Layer Computation Formula</h4>
                <div className="bg-white rounded-lg p-4 font-mono text-sm border border-yellow-200">
                  <div className="space-y-2">
                    <div><span className="text-blue-600">Input → Hidden:</span></div>
                    <div>z₁ = W₁ᵀ × x + b₁</div>
                    <div>a₁ = ReLU(z₁) = max(0, z₁)</div>
                    <div className="mt-3"><span className="text-green-600">Hidden → Output:</span></div>
                    <div>z₂ = W₂ᵀ × a₁ + b₂</div>
                    <div>ŷ = softmax(z₂)</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Current Network Parameters</h4>
                <div className="bg-white rounded-lg p-4 text-sm border border-yellow-200">
                  <div className="space-y-2">
                    <div><strong>Total Parameters:</strong> {weights.W1.length * weights.W1[0].length + weights.W2.length * weights.W2[0].length + weights.b1.length + weights.b2.length}</div>
                    <div><strong>W₁ Shape:</strong> {weights.W1.length} × {weights.W1[0] ? weights.W1[0].length : 0}</div>
                    <div><strong>W₂ Shape:</strong> {weights.W2.length} × {weights.W2[0] ? weights.W2[0].length : 0}</div>
                    <div><strong>b₁ Shape:</strong> {weights.b1.length} × 1</div>
                    <div><strong>b₂ Shape:</strong> {weights.b2.length} × 1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weight Matrix Visualization */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Weight Matrices Heatmap</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">W₁ (Input → Hidden)</h4>
                <div className="grid grid-cols-4 gap-1">
                  {weights.W1.map((row, i) => 
                    row.map((weight, j) => (
                      <div
                        key={`w1-${i}-${j}`}
                        className="w-8 h-8 rounded text-xs flex items-center justify-center font-mono"
                        style={{
                          backgroundColor: weight > 0 ? 
                            `rgba(34, 197, 94, ${Math.abs(weight) * 2})` : 
                            `rgba(239, 68, 68, ${Math.abs(weight) * 2})`,
                          color: Math.abs(weight) > 0.3 ? 'white' : 'black'
                        }}
                        title={`W₁[${i}][${j}] = ${weight.toFixed(3)}`}
                      >
                        {weight.toFixed(1)}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-800 mb-3">W₂ (Hidden → Output)</h4>
                <div className="grid grid-cols-8 gap-1">
                  {weights.W2.map((row, i) => 
                    row.map((weight, j) => (
                      <div
                        key={`w2-${i}-${j}`}
                        className="w-6 h-6 rounded text-xs flex items-center justify-center font-mono"
                        style={{
                          backgroundColor: weight > 0 ? 
                            `rgba(34, 197, 94, ${Math.abs(weight) * 2})` : 
                            `rgba(239, 68, 68, ${Math.abs(weight) * 2})`,
                          color: Math.abs(weight) > 0.3 ? 'white' : 'black'
                        }}
                        title={`W₂[${i}][${j}] = ${weight.toFixed(3)}`}
                      >
                        {weight.toFixed(1)}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              Green = positive weights, Red = negative weights. Intensity shows magnitude.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  const ForwardPropagationStep = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [inputValues, setInputValues] = useState([0.8, 0.6, 0.4]);
    const [weights1, setWeights1] = useState([
      [0.2, 0.3, -0.1],
      [0.4, -0.2, 0.5],
      [0.1, 0.6, 0.3]
    ]);
    const [weights2, setWeights2] = useState([
      [0.7, -0.3],
      [0.2, 0.8],
      [-0.1, 0.4]
    ]);
    const [biases1] = useState([0.1, -0.2, 0.3]);
    const [biases2] = useState([0.2, -0.1]);
    const [hiddenValues, setHiddenValues] = useState([0, 0, 0]);
    const [outputValues, setOutputValues] = useState([0, 0]);
    const [hiddenRaw, setHiddenRaw] = useState([0, 0, 0]);
    const [outputRaw, setOutputRaw] = useState([0, 0]);
    const [prediction, setPrediction] = useState('');
    const [confidence, setConfidence] = useState(0);
  
    // Activation functions
    const relu = (x) => Math.max(0, x);
    const softmax = (arr) => {
      const max = Math.max(...arr);
      const exps = arr.map(x => Math.exp(x - max));
      const sum = exps.reduce((a, b) => a + b, 0);
      return exps.map(x => x / sum);
    };
  
    // Forward propagation calculation
    const calculateForwardProp = () => {
      // Input to Hidden layer
      const hidden_raw = [];
      for (let i = 0; i < 3; i++) {
        let sum = biases1[i];
        for (let j = 0; j < 3; j++) {
          sum += inputValues[j] * weights1[i][j];
        }
        hidden_raw.push(sum);
      }
      
      const hidden_activated = hidden_raw.map(relu);
      
      // Hidden to Output layer
      const output_raw = [];
      for (let i = 0; i < 2; i++) {
        let sum = biases2[i];
        for (let j = 0; j < 3; j++) {
          sum += hidden_activated[j] * weights2[j][i];
        }
        output_raw.push(sum);
      }
      
      const output_activated = softmax(output_raw);
      
      setHiddenRaw(hidden_raw);
      setHiddenValues(hidden_activated);
      setOutputRaw(output_raw);
      setOutputValues(output_activated);
      
      // Determine prediction
      const maxIdx = output_activated.indexOf(Math.max(...output_activated));
      setPrediction(maxIdx === 0 ? 'Cat' : 'Dog');
      setConfidence(Math.max(...output_activated));
    };
  
    // Animation control
    useEffect(() => {
      if (isRunning) {
        const interval = setInterval(() => {
          setCurrentStep(prev => (prev + 1) % 4);
        }, 2000);
        return () => clearInterval(interval);
      }
    }, [isRunning]);
  
    useEffect(() => {
      calculateForwardProp();
    }, [inputValues, weights1, weights2]);
  
    const steps = [
      "Input Layer: Raw data enters the network",
      "Weighted Sum: Multiply inputs by weights and add bias",
      "Activation: Apply ReLU to introduce non-linearity", 
      "Output: Generate final prediction with softmax"
    ];
  
    return (
      <div className="space-y-8 max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl shadow-lg">
              <ArrowRight className="w-12 h-12" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Forward Propagation</h1>
              <p className="text-xl text-gray-600">How AI Makes Predictions</p>
            </div>
          </div>
        </div>
  
        {/* Why This Matters */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-500 text-white rounded-xl flex-shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">The Foundation of AI Thinking</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Forward propagation is how neural networks <strong>make predictions</strong>. It's the process of 
                feeding data through the network layer by layer to produce an output.
              </p>
              <div className="bg-white/80 rounded-xl p-4 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">🎯 Think of it like this:</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Imagine you're a detective examining clues to solve a case. You gather evidence (input), 
                  analyze each piece carefully (hidden layers), and reach a conclusion (output).
                </p>
                <p className="text-gray-700 text-sm font-semibold">
                  That's exactly how forward propagation works in neural networks!
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Mathematical Foundation */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Mathematical Process</h2>
            <p className="text-gray-600">
              Forward propagation involves matrix multiplication, bias addition, and activation functions.
            </p>
          </div>
  
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Layer 1: Input to Hidden */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">1. Input → Hidden Layer</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="font-mono text-sm">
                      <div className="font-bold text-green-600">Linear Transformation:</div>
                      <div>z₁ = W₁ᵀx + b₁</div>
                      <div className="text-xs text-gray-500 mt-1">Weighted sum + bias</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="font-mono text-sm">
                      <div className="font-bold text-green-600">Activation Function:</div>
                      <div>a₁ = ReLU(z₁) = max(0, z₁)</div>
                      <div className="text-xs text-gray-500 mt-1">Introduces non-linearity</div>
                    </div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3">
                    <div className="font-mono text-sm">
                      <div className="font-bold text-green-600">Current Values:</div>
                      {hiddenRaw.map((val, i) => (
                        <div key={i} className="flex justify-between">
                          <span>h{i+1}_raw:</span>
                          <span>{val.toFixed(3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Layer 2: Hidden to Output */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4">2. Hidden → Output Layer</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="font-mono text-sm">
                      <div className="font-bold text-purple-600">Linear Transformation:</div>
                      <div>z₂ = W₂ᵀa₁ + b₂</div>
                      <div className="text-xs text-gray-500 mt-1">Hidden layer output × weights</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="font-mono text-sm">
                      <div className="font-bold text-purple-600">Softmax Function:</div>
                      <div>ŷ = softmax(z₂)</div>
                      <div className="text-xs text-gray-500 mt-1">Converts to probabilities</div>
                    </div>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-3">
                    <div className="font-mono text-sm">
                      <div className="font-bold text-purple-600">Final Prediction:</div>
                      <div className="flex justify-between">
                        <span>Cat:</span>
                        <span>{(outputValues[0] * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dog:</span>
                        <span>{(outputValues[1] * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Interactive Demo */}
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Live Forward Propagation Demo</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="px-4 py-2 rounded-xl font-semibold transition-all bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      isRunning 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isRunning ? 'Pause' : 'Start'} Animation
                  </button>
                </div>
              </div>
  
              {/* Current Step Indicator */}
              <div className="mb-6 bg-white rounded-xl p-4 border border-indigo-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-500 text-white rounded-lg">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-800">Current Step: {currentStep + 1}/4</h4>
                </div>
                <p className="text-gray-700 font-semibold">{steps[currentStep]}</p>
                <div className="flex mt-3">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 mx-1 rounded ${
                        i <= currentStep ? 'bg-indigo-500' : 'bg-gray-200'
                      } transition-colors duration-500`}
                    />
                  ))}
                </div>
              </div>
  
              {/* Input Controls */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3">Adjust Input Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {inputValues.map((val, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-indigo-200">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Input {i + 1}: {val.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={val}
                        onChange={(e) => {
                          const newInputs = [...inputValues];
                          newInputs[i] = parseFloat(e.target.value);
                          setInputValues(newInputs);
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Feature {i + 1} intensity
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Network Visualization */}
              <div className="bg-white rounded-xl p-6 border border-indigo-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Network Flow Visualization
                </h4>
                
                <div className="grid grid-cols-4 gap-6 items-center">
                  {/* Input Layer */}
                  <div className="text-center">
                    <h5 className="font-semibold text-gray-700 mb-3">Input</h5>
                    <div className="space-y-2">
                      {inputValues.map((val, i) => (
                        <motion.div
                          key={i}
                          className={`w-12 h-12 mx-auto rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                            currentStep >= 0 ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300'
                          }`}
                          animate={{
                            scale: currentStep >= 0 ? [1, 1.1, 1] : 1,
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: isRunning && currentStep >= 0 ? Infinity : 0,
                            repeatDelay: 1
                          }}
                        >
                          {val.toFixed(1)}
                        </motion.div>
                      ))}
                    </div>
                  </div>
  
                  {/* Arrows 1 */}
                  <div className="flex justify-center">
                    <motion.div
                      animate={{
                        x: currentStep >= 1 ? [0, 10, 0] : 0,
                        opacity: currentStep >= 1 ? [0.5, 1, 0.5] : 0.3
                      }}
                      transition={{
                        duration: 1,
                        repeat: isRunning && currentStep >= 1 ? Infinity : 0
                      }}
                    >
                      <ArrowRight className={`w-8 h-8 ${currentStep >= 1 ? 'text-blue-500' : 'text-gray-300'}`} />
                    </motion.div>
                  </div>
  
                  {/* Hidden Layer */}
                  <div className="text-center">
                    <h5 className="font-semibold text-gray-700 mb-3">Hidden</h5>
                    <div className="space-y-2">
                      {hiddenValues.map((val, i) => (
                        <motion.div
                          key={i}
                          className={`w-12 h-12 mx-auto rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                            currentStep >= 2 ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-gray-300'
                          }`}
                          animate={{
                            scale: currentStep >= 2 ? [1, 1.1, 1] : 1,
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: isRunning && currentStep >= 2 ? Infinity : 0,
                            repeatDelay: 1
                          }}
                        >
                          {val.toFixed(1)}
                        </motion.div>
                      ))}
                    </div>
                  </div>
  
                  {/* Arrows 2 */}
                  <div className="flex justify-center">
                    <motion.div
                      animate={{
                        x: currentStep >= 3 ? [0, 10, 0] : 0,
                        opacity: currentStep >= 3 ? [0.5, 1, 0.5] : 0.3
                      }}
                      transition={{
                        duration: 1,
                        repeat: isRunning && currentStep >= 3 ? Infinity : 0
                      }}
                    >
                      <ArrowRight className={`w-8 h-8 ${currentStep >= 3 ? 'text-purple-500' : 'text-gray-300'}`} />
                    </motion.div>
                  </div>
                </div>
  
                {/* Output Section */}
                <div className="mt-8 text-center">
                  <h5 className="font-semibold text-gray-700 mb-3">Output</h5>
                  <div className="flex justify-center gap-4">
                    {['Cat', 'Dog'].map((label, i) => (
                      <motion.div
                        key={i}
                        className={`px-6 py-4 rounded-xl border-2 ${
                          currentStep >= 3 ? 'bg-purple-100 border-purple-500' : 'bg-gray-100 border-gray-300'
                        }`}
                        animate={{
                          scale: currentStep >= 3 ? [1, 1.05, 1] : 1,
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: isRunning && currentStep >= 3 ? Infinity : 0,
                          repeatDelay: 1.2
                        }}
                      >
                        <div className="text-lg font-bold text-gray-800">{label}</div>
                        <div className={`text-2xl font-bold ${
                          currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'
                        }`}>
                          {(outputValues[i] * 100).toFixed(1)}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
  
              {/* Final Prediction */}
              <div className="mt-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500 text-white rounded-xl">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">Final Prediction</h4>
                      <p className="text-gray-600">Based on current input values</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">{prediction}</div>
                    <div className="text-sm text-gray-600">
                      Confidence: {(confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <strong>How it works:</strong> The network processes your input values through weighted connections, 
                    applies activation functions to introduce non-linearity, and outputs probability distributions 
                    for each class. The class with the highest probability becomes the prediction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LossFunctionsStep = () => {
    const [selectedLoss, setSelectedLoss] = useState('crossentropy');
    const [predictions, setPredictions] = useState([0.7, 0.2, 0.1]);
    const [actualLabels, setActualLabels] = useState([1, 0, 0]); // One-hot encoded
    const [isAnimating, setIsAnimating] = useState(false);
    const [showMath, setShowMath] = useState(false);
    const [regressionPred, setRegressionPred] = useState(4.2);
    const [regressionActual, setRegressionActual] = useState(5.0);
    const [currentExample, setCurrentExample] = useState(0);
  
    // Loss function calculations
    const calculateCrossEntropy = (pred, actual) => {
      const epsilon = 1e-15; // Prevent log(0)
      const clippedPred = pred.map(p => Math.max(epsilon, Math.min(1 - epsilon, p)));
      return -actual.reduce((sum, y, i) => sum + y * Math.log(clippedPred[i]), 0);
    };
  
    const calculateMSE = (pred, actual) => {
      return Math.pow(pred - actual, 2);
    };
  
    const calculateMAE = (pred, actual) => {
      return Math.abs(pred - actual);
    };
  
    const calculateHuber = (pred, actual, delta = 1.0) => {
      const diff = Math.abs(pred - actual);
      return diff <= delta ? 0.5 * diff * diff : delta * (diff - 0.5 * delta);
    };
  
    const calculateBinaryCrossEntropy = (pred, actual) => {
      const epsilon = 1e-15;
      const clippedPred = Math.max(epsilon, Math.min(1 - epsilon, pred));
      return -(actual * Math.log(clippedPred) + (1 - actual) * Math.log(1 - clippedPred));
    };
  
    // Get current loss value
    const getCurrentLoss = () => {
      switch (selectedLoss) {
        case 'crossentropy':
          return calculateCrossEntropy(predictions, actualLabels);
        case 'mse':
          return calculateMSE(regressionPred, regressionActual);
        case 'mae':
          return calculateMAE(regressionPred, regressionActual);
        case 'huber':
          return calculateHuber(regressionPred, regressionActual);
        case 'binarycrossentropy':
          return calculateBinaryCrossEntropy(predictions[0], actualLabels[0]);
        default:
          return 0;
      }
    };
  
    // Example scenarios
    const examples = [
      {
        name: "Perfect Prediction",
        predictions: [1.0, 0.0, 0.0],
        labels: [1, 0, 0],
        regPred: 5.0,
        regActual: 5.0
      },
      {
        name: "Good Prediction",
        predictions: [0.8, 0.15, 0.05],
        labels: [1, 0, 0],
        regPred: 4.8,
        regActual: 5.0
      },
      {
        name: "Poor Prediction",
        predictions: [0.4, 0.4, 0.2],
        labels: [1, 0, 0],
        regPred: 3.2,
        regActual: 5.0
      },
      {
        name: "Wrong Prediction",
        predictions: [0.1, 0.2, 0.7],
        labels: [1, 0, 0],
        regPred: 1.5,
        regActual: 5.0
      }
    ];
  
    const lossTypes = {
      crossentropy: {
        name: "Cross-Entropy Loss",
        type: "Classification",
        formula: "L = -Σ(y × log(ŷ))",
        description: "Measures the difference between predicted and actual probability distributions",
        color: "from-red-500 to-pink-500",
        bgColor: "from-red-50 to-pink-50",
        borderColor: "border-red-200"
      },
      mse: {
        name: "Mean Squared Error",
        type: "Regression",
        formula: "L = (y - ŷ)²",
        description: "Penalizes large errors more heavily due to squaring",
        color: "from-blue-500 to-cyan-500",
        bgColor: "from-blue-50 to-cyan-50",
        borderColor: "border-blue-200"
      },
      mae: {
        name: "Mean Absolute Error",
        type: "Regression",
        formula: "L = |y - ŷ|",
        description: "Linear penalty for errors, more robust to outliers",
        color: "from-green-500 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-200"
      },
      huber: {
        name: "Huber Loss",
        type: "Regression",
        formula: "L = ½(y-ŷ)² if |y-ŷ|≤δ, else δ(|y-ŷ|-½δ)",
        description: "Combines benefits of MSE and MAE - quadratic for small errors, linear for large ones",
        color: "from-purple-500 to-indigo-500",
        bgColor: "from-purple-50 to-indigo-50",
        borderColor: "border-purple-200"
      },
      binarycrossentropy: {
        name: "Binary Cross-Entropy",
        type: "Binary Classification",
        formula: "L = -[y×log(ŷ) + (1-y)×log(1-ŷ)]",
        description: "Specialized for binary classification problems",
        color: "from-orange-500 to-red-500",
        bgColor: "from-orange-50 to-red-50",
        borderColor: "border-orange-200"
      }
    };
  
    // Animation control
    useEffect(() => {
      if (isAnimating) {
        const interval = setInterval(() => {
          setCurrentExample(prev => (prev + 1) % examples.length);
        }, 3000);
        return () => clearInterval(interval);
      }
    }, [isAnimating]);
  
    // Update values when example changes
    useEffect(() => {
      const example = examples[currentExample];
      setPredictions(example.predictions);
      setActualLabels(example.labels);
      setRegressionPred(example.regPred);
      setRegressionActual(example.regActual);
    }, [currentExample]);
  
    const currentLossInfo = lossTypes[selectedLoss];
  
    return (
      <div className="space-y-8 max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className={`p-4 bg-gradient-to-br ${currentLossInfo.color} text-white rounded-2xl shadow-lg`}>
              <TrendingUp className="w-12 h-12" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Loss Functions</h1>
              <p className="text-xl text-gray-600">How AI Measures Its Mistakes</p>
            </div>
          </div>
        </div>
  
        {/* Why This Matters */}
        <div className={`bg-gradient-to-r ${currentLossInfo.bgColor} rounded-3xl p-8 border ${currentLossInfo.borderColor} mb-8`}>
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 bg-gradient-to-br ${currentLossInfo.color} text-white rounded-xl flex-shrink-0`}>
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">The Compass of AI Learning</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Loss functions are the <strong>guiding compass</strong> that tells AI how far off its predictions are. 
                They convert the difference between predictions and reality into a single number that can be minimized.
              </p>
              <div className="bg-white/80 rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">🎯 Think of it like this:</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Imagine you're playing darts. The loss function is like measuring how far your dart lands from the bullseye. 
                  Different loss functions are like different scoring systems - some penalize big misses more harshly than others.
                </p>
                <p className="text-gray-700 text-sm font-semibold">
                  The goal is always the same: get that loss as close to zero as possible!
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Loss Function Selector */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className={`bg-gradient-to-r ${currentLossInfo.bgColor} p-6 border-b border-gray-100`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Loss Function</h2>
            <p className="text-gray-600">
              Different problems require different ways of measuring errors.
            </p>
          </div>
  
          <div className="p-8">
            {/* Loss Function Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {Object.entries(lossTypes).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLoss(key)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all border-2 ${
                    selectedLoss === key
                      ? `bg-gradient-to-r ${info.color} text-white border-transparent shadow-lg`
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm">{info.name}</div>
                  <div className="text-xs opacity-80">{info.type}</div>
                </button>
              ))}
            </div>
  
            {/* Current Loss Function Details */}
            <div className={`bg-gradient-to-r ${currentLossInfo.bgColor} rounded-2xl p-6 border ${currentLossInfo.borderColor} mb-8`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{currentLossInfo.name}</h3>
                  <p className="text-gray-700 mb-4">{currentLossInfo.description}</p>
                  <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
                    <div className="font-mono text-lg font-bold text-gray-800">
                      {currentLossInfo.formula}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-lg">
                    <div className="text-sm text-gray-600 mb-1">Current Loss Value</div>
                    <div className={`text-4xl font-bold bg-gradient-to-r ${currentLossInfo.color} bg-clip-text text-transparent`}>
                      {getCurrentLoss().toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {getCurrentLoss() < 0.1 ? "Excellent!" : getCurrentLoss() < 0.5 ? "Good" : getCurrentLoss() < 1.0 ? "Needs work" : "Poor"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Interactive Demo */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Interactive Loss Calculation</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowMath(!showMath)}
                    className="px-4 py-2 rounded-xl font-semibold bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
                  >
                    <Calculator className="w-4 h-4" />
                    {showMath ? 'Hide' : 'Show'} Math
                  </button>
                  <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      isAnimating 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isAnimating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isAnimating ? 'Stop' : 'Auto'} Examples
                  </button>
                </div>
              </div>
  
              {/* Example Selector */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3">Prediction Scenarios</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {examples.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentExample(i);
                        setIsAnimating(false);
                      }}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        currentExample === i
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-sm">{example.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Loss: {selectedLoss === 'mse' || selectedLoss === 'mae' || selectedLoss === 'huber' 
                          ? selectedLoss === 'mse' 
                            ? calculateMSE(example.regPred, example.regActual).toFixed(3)
                            : selectedLoss === 'mae'
                            ? calculateMAE(example.regPred, example.regActual).toFixed(3)
                            : calculateHuber(example.regPred, example.regActual).toFixed(3)
                          : selectedLoss === 'binarycrossentropy'
                          ? calculateBinaryCrossEntropy(example.predictions[0], example.labels[0]).toFixed(3)
                          : calculateCrossEntropy(example.predictions, example.labels).toFixed(3)
                        }
                      </div>
                    </button>
                  ))}
                </div>
              </div>
  
              {/* Classification vs Regression Controls */}
              {(selectedLoss === 'mse' || selectedLoss === 'mae' || selectedLoss === 'huber') ? (
                /* Regression Controls */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Predicted Value: {regressionPred.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={regressionPred}
                      onChange={(e) => setRegressionPred(parseFloat(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Actual Value: {regressionActual.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={regressionActual}
                      onChange={(e) => setRegressionActual(parseFloat(e.target.value))}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Classification Controls */
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3">Adjust Predictions (Class Probabilities)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {predictions.map((val, i) => (
                      <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Class {i + 1}: {val.toFixed(3)}
                          {actualLabels[i] === 1 && <span className="text-green-600 ml-2">✓ True</span>}
                        </label>
                        <input
                          type="range"
                          min="0.001"
                          max="0.999"
                          step="0.001"
                          value={val}
                          onChange={(e) => {
                            const newPreds = [...predictions];
                            newPreds[i] = parseFloat(e.target.value);
                            // Normalize to sum to 1
                            const sum = newPreds.reduce((a, b) => a + b, 0);
                            const normalized = newPreds.map(p => p / sum);
                            setPredictions(normalized);
                          }}
                          className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-600">
                    Probabilities sum to: {predictions.reduce((a, b) => a + b, 0).toFixed(3)}
                  </div>
                </div>
              )}
  
              {/* Mathematical Breakdown */}
              <AnimatePresence>
                {showMath && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 mb-6"
                  >
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Step-by-Step Calculation
                    </h4>
                    
                    {selectedLoss === 'crossentropy' && (
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="font-mono text-sm">
                            <div className="font-bold mb-2">Cross-Entropy Formula: L = -Σ(y × log(ŷ))</div>
                            {actualLabels.map((y, i) => (
                              <div key={i} className="ml-4">
                                Class {i + 1}: {y} × log({predictions[i].toFixed(3)}) = {y > 0 ? (y * Math.log(predictions[i])).toFixed(4) : '0.0000'}
                              </div>
                            ))}
                            <div className="border-t pt-2 mt-2 font-bold">
                              Total: -{actualLabels.reduce((sum, y, i) => sum + y * Math.log(predictions[i]), 0).toFixed(4)} = {getCurrentLoss().toFixed(4)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
  
                    {selectedLoss === 'mse' && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="font-mono text-sm">
                          <div className="font-bold mb-2">MSE Formula: L = (y - ŷ)²</div>
                          <div className="ml-4">
                            ({regressionActual.toFixed(2)} - {regressionPred.toFixed(2)})² = {(regressionActual - regressionPred).toFixed(2)}² = {getCurrentLoss().toFixed(4)}
                          </div>
                        </div>
                      </div>
                    )}
  
                    {selectedLoss === 'mae' && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="font-mono text-sm">
                          <div className="font-bold mb-2">MAE Formula: L = |y - ŷ|</div>
                          <div className="ml-4">
                            |{regressionActual.toFixed(2)} - {regressionPred.toFixed(2)}| = |{(regressionActual - regressionPred).toFixed(2)}| = {getCurrentLoss().toFixed(4)}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
  
              {/* Visual Loss Comparison */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4">Loss Function Comparison</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {Object.entries(lossTypes).map(([key, info]) => {
                    let lossValue;
                    if (key === 'mse' || key === 'mae' || key === 'huber') {
                      lossValue = key === 'mse' 
                        ? calculateMSE(regressionPred, regressionActual)
                        : key === 'mae'
                        ? calculateMAE(regressionPred, regressionActual)
                        : calculateHuber(regressionPred, regressionActual);
                    } else if (key === 'binarycrossentropy') {
                      lossValue = calculateBinaryCrossEntropy(predictions[0], actualLabels[0]);
                    } else {
                      lossValue = calculateCrossEntropy(predictions, actualLabels);
                    }
  
                    return (
                      <motion.div
                        key={key}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedLoss === key 
                            ? `bg-gradient-to-br ${info.color} text-white border-transparent shadow-lg`
                            : `bg-gray-50 border-gray-200 hover:border-gray-300`
                        }`}
                        animate={{
                          scale: selectedLoss === key ? 1.05 : 1
                        }}
                        onClick={() => setSelectedLoss(key)}
                      >
                        <div className="text-center">
                          <div className={`text-sm font-semibold ${selectedLoss === key ? 'text-white' : 'text-gray-700'}`}>
                            {info.name.split(' ')[0]}
                          </div>
                          <div className={`text-2xl font-bold mt-2 ${selectedLoss === key ? 'text-white' : 'text-gray-900'}`}>
                            {lossValue.toFixed(3)}
                          </div>
                          <div className={`text-xs mt-1 ${selectedLoss === key ? 'text-white/80' : 'text-gray-500'}`}>
                            {info.type}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // Continue with more step components...
  const BackpropagationStep = () => (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl shadow-lg">
            <GitBranch className="w-12 h-12" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Backpropagation</h1>
            <p className="text-xl text-gray-600">How AI Learns from Its Mistakes</p>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 border border-orange-200 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-orange-500 text-white rounded-xl flex-shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">The Heart of AI Learning</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Backpropagation is the <strong>most important algorithm</strong> in AI. It's how neural networks learn by 
              figuring out which parts of the network made mistakes and adjusting them accordingly.
            </p>
            <div className="bg-white/80 rounded-xl p-4 border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-2">🧠 Think of it like this:</h3>
              <p className="text-gray-700 text-sm mb-2">
                Imagine you're learning to play basketball and keep missing shots. A good coach doesn't just say "try harder" - 
                they analyze your form, identify what specific part of your technique is wrong, and give targeted feedback.
              </p>
              <p className="text-gray-700 text-sm font-semibold">
                That's exactly what backpropagation does for neural networks!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Foundation */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Mathematical Process</h2>
          <p className="text-gray-600">
            Backpropagation uses the chain rule of calculus to calculate how much each weight contributed to the error.
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Forward Pass */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4">1. Forward Pass (Make Prediction)</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="font-mono text-sm">
                    <div className="font-bold text-blue-600">Input → Hidden:</div>
                    <div>z₁ = W₁ᵀx + b₁</div>
                    <div>a₁ = ReLU(z₁) = max(0, z₁)</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="font-mono text-sm">
                    <div className="font-bold text-blue-600">Hidden → Output:</div>
                    <div>z₂ = W₂ᵀa₁ + b₂</div>
                    <div>ŷ = softmax(z₂)</div>
                  </div>
                </div>
                <div className="bg-blue-100 rounded-lg p-3">
                  <div className="font-mono text-sm">
                    <div className="font-bold text-blue-600">Loss:</div>
                    <div>L = -Σ(y × log(ŷ))</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Backward Pass */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <h3 className="text-xl font-bold text-red-800 mb-4">2. Backward Pass (Learn from Error)</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <div className="font-mono text-sm">
                    <div className="font-bold text-red-600">Output Layer Gradients:</div>
                    <div>∂L/∂z₂ = ŷ - y</div>
                    <div>∂L/∂W₂ = a₁ ⊗ (∂L/∂z₂)</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <div className="font-mono text-sm">
                    <div className="font-bold text-red-600">Hidden Layer Gradients:</div>
                    <div>∂L/∂a₁ = W₂ × (∂L/∂z₂)</div>
                    <div>∂L/∂z₁ = (∂L/∂a₁) ⊙ ReLU'(z₁)</div>
                  </div>
                </div>
                <div className="bg-red-100 rounded-lg p-3">
                  <div className="font-mono text-sm">
                    <div className="font-bold text-red-600">Weight Updates:</div>
                    <div>W = W - α × ∇W</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Live Backpropagation Demo</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsTraining(!isTraining);
                    if (!isTraining) setTrainingStep(0);
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    isTraining 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isTraining ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isTraining ? 'Pause' : 'Start'} Learning
                </button>
              </div>
            </div>

            {/* Training Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
                <div className="text-3xl font-bold text-purple-600">{loss.toFixed(4)}</div>
                <div className="text-sm text-gray-600">Current Loss</div>
                <div className="text-xs text-purple-600 mt-1">Error magnitude</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
                <div className="text-3xl font-bold text-green-600">{accuracy.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
                <div className="text-xs text-green-600 mt-1">Correct predictions</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
                <div className="text-3xl font-bold text-blue-600">{epoch}</div>
                <div className="text-sm text-gray-600">Epoch</div>
                <div className="text-xs text-blue-600 mt-1">Training cycles</div>
              </div>
            </div>

            {/* Learning Rate Control */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Learning Rate (α): {learningRate}
              </label>
              <input
                type="range"
                min="0.001"
                max="0.1"
                step="0.001"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Conservative (0.001)</span>
                <span>Balanced (0.01)</span>
                <span>Aggressive (0.1)</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Controls how big steps the AI takes when adjusting weights. Too high = unstable, too low = slow learning.
              </p>
            </div>

            {/* Gradient Flow Visualization */}
            {isTraining && (
              <div className="bg-white rounded-xl p-4 border border-purple-200">
                <h4 className="font-bold text-gray-800 mb-3">Gradient Flow Animation</h4>
                <div className="space-y-3">
                  {['Output Layer → Hidden Layer', 'Hidden Layer → Input Layer'].map((layer, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-purple-500 rounded animate-pulse" />
                      <span className="text-sm font-semibold flex-shrink-0 w-48">{layer}</span>
                      <div className="flex-1 h-3 bg-gray-200 rounded relative overflow-hidden">
                        <motion.div
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{
                            duration: 2,
                            delay: i * 0.5,
                            repeat: Infinity,
                            repeatType: 'loop'
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-16">
                        {(Math.random() * 0.01).toFixed(4)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Watch gradients flow backward through the network, updating weights layer by layer
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  const GradientDescentStep = () => {
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [currentX, setCurrentX] = useState(8);
    const [currentY, setCurrentY] = useState(0);
    const [learningRate, setLearningRate] = useState(0.1);
    const [iteration, setIteration] = useState(0);
    const [path, setPath] = useState([]);
    const [gradient, setGradient] = useState(0);
    const [loss, setLoss] = useState(0);
    const [momentum, setMomentum] = useState(0.9);
    const [useMomentum, setUseMomentum] = useState(false);
    const [velocity, setVelocity] = useState(0);
    const [algorithm, setAlgorithm] = useState('sgd');
  
    // Simple quadratic function: f(x) = (x-2)² + 1
    const objectiveFunction = (x) => Math.pow(x - 2, 2) + 1;
    
    // Derivative: f'(x) = 2(x-2)
    const derivative = (x) => 2 * (x - 2);
  
    useEffect(() => {
      const newLoss = objectiveFunction(currentX);
      const newGradient = derivative(currentX);
      setLoss(newLoss);
      setGradient(newGradient);
      setCurrentY(newLoss);
    }, [currentX]);
  
    useEffect(() => {
      let interval;
      if (isOptimizing) {
        interval = setInterval(() => {
          setCurrentX(prevX => {
            const grad = derivative(prevX);
            let newX;
            
            if (algorithm === 'sgd') {
              newX = prevX - learningRate * grad;
            } else if (algorithm === 'momentum') {
              setVelocity(prevVel => {
                const newVel = momentum * prevVel + learningRate * grad;
                return newVel;
              });
              newX = prevX - velocity;
            } else if (algorithm === 'adam') {
              // Simplified Adam (just for demo)
              newX = prevX - learningRate * grad;
            }
            
            // Add to path
            setPath(prevPath => [...prevPath.slice(-49), { x: prevX, y: objectiveFunction(prevX) }]);
            
            return newX;
          });
          
          setIteration(prev => prev + 1);
          
          // Stop if converged
          if (Math.abs(derivative(currentX)) < 0.01) {
            setIsOptimizing(false);
          }
        }, 200);
      }
      
      return () => clearInterval(interval);
    }, [isOptimizing, learningRate, currentX, algorithm, momentum, velocity]);
  
    const reset = () => {
      setCurrentX(8);
      setIteration(0);
      setPath([]);
      setVelocity(0);
      setIsOptimizing(false);
    };
  
    // Generate function curve points
    const curvePoints = [];
    for (let x = -2; x <= 12; x += 0.1) {
      curvePoints.push({ x, y: objectiveFunction(x) });
    }
  
    const maxY = Math.max(...curvePoints.map(p => p.y));
    const minY = Math.min(...curvePoints.map(p => p.y));
  
    // SVG dimensions
    const svgWidth = 600;
    const svgHeight = 300;
    const margin = 50;
  
    // Scale functions
    const scaleX = (x) => ((x + 2) / 14) * (svgWidth - 2 * margin) + margin;
    const scaleY = (y) => svgHeight - margin - ((y - minY) / (maxY - minY)) * (svgHeight - 2 * margin);
  
    return (
      <div className="space-y-8 max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg">
              <TrendingDown className="w-12 h-12" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Gradient Descent</h1>
              <p className="text-xl text-gray-600">The Universal Optimization Algorithm</p>
            </div>
          </div>
        </div>
  
        {/* Why This Matters */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-500 text-white rounded-xl flex-shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">The Foundation of AI Learning</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Gradient descent is the <strong>optimization engine</strong> that powers almost every AI system. 
                It's how machines find the best solution by following the "steepest downhill path" to minimize errors.
              </p>
              <div className="bg-white/80 rounded-xl p-4 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">🏔️ Think of it like this:</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Imagine you're blindfolded on a mountain and need to reach the bottom. You can only feel the slope 
                  beneath your feet. You'd naturally take steps in the steepest downward direction.
                </p>
                <p className="text-gray-700 text-sm font-semibold">
                  That's exactly how gradient descent finds optimal solutions!
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Mathematical Foundation */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Mathematical Process</h2>
            <p className="text-gray-600">
              Gradient descent uses calculus to find the direction of steepest decrease and takes steps in that direction.
            </p>
          </div>
  
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Algorithm Steps */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">1. The Algorithm</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="font-mono text-sm">
                      <div className="font-bold text-green-600">Initialize:</div>
                      <div>θ₀ = random starting point</div>
                      <div>α = learning rate</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="font-mono text-sm">
                      <div className="font-bold text-green-600">Repeat until convergence:</div>
                      <div>1. Calculate gradient: ∇f(θ)</div>
                      <div>2. Update: θ = θ - α∇f(θ)</div>
                    </div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3">
                    <div className="font-mono text-sm">
                      <div className="font-bold text-green-600">Stop when:</div>
                      <div>|∇f(θ)| ≈ 0 (gradient is near zero)</div>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Variants */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4">2. Popular Variants</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="font-mono text-sm">
                      <div className="font-bold text-purple-600">SGD (Stochastic):</div>
                      <div>θ = θ - α∇f(θᵢ)</div>
                      <div className="text-xs text-gray-600">Uses single sample</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="font-mono text-sm">
                      <div className="font-bold text-purple-600">Momentum:</div>
                      <div>v = βv + α∇f(θ)</div>
                      <div>θ = θ - v</div>
                      <div className="text-xs text-gray-600">Remembers previous steps</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="font-mono text-sm">
                      <div className="font-bold text-purple-600">Adam:</div>
                      <div>Adaptive moments</div>
                      <div className="text-xs text-gray-600">Self-adjusting learning rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Interactive Visualization */}
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Live Optimization Demo</h3>
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={() => setIsOptimizing(!isOptimizing)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      isOptimizing 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isOptimizing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isOptimizing ? 'Pause' : 'Start'} Optimization
                  </button>
                </div>
              </div>
  
              {/* Current Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-indigo-200 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{currentX.toFixed(3)}</div>
                  <div className="text-sm text-gray-600">Current Position</div>
                  <div className="text-xs text-indigo-600 mt-1">θ parameter</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-indigo-200 text-center">
                  <div className="text-2xl font-bold text-red-600">{loss.toFixed(4)}</div>
                  <div className="text-sm text-gray-600">Loss Value</div>
                  <div className="text-xs text-red-600 mt-1">f(θ)</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-indigo-200 text-center">
                  <div className="text-2xl font-bold text-orange-600">{gradient.toFixed(4)}</div>
                  <div className="text-sm text-gray-600">Gradient</div>
                  <div className="text-xs text-orange-600 mt-1">∇f(θ)</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-indigo-200 text-center">
                  <div className="text-2xl font-bold text-blue-600">{iteration}</div>
                  <div className="text-sm text-gray-600">Iterations</div>
                  <div className="text-xs text-blue-600 mt-1">Steps taken</div>
                </div>
              </div>
  
              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Learning Rate (α): {learningRate}
                  </label>
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow (0.01)</span>
                    <span>Fast (0.5)</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Algorithm
                  </label>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="sgd">Standard SGD</option>
                    <option value="momentum">SGD with Momentum</option>
                    <option value="adam">Adam (Simplified)</option>
                  </select>
                </div>
              </div>
  
              {/* Visualization */}
              <div className="bg-white rounded-xl p-4 border border-indigo-200 mb-6">
                <h4 className="font-bold text-gray-800 mb-3 text-center">Function Landscape: f(x) = (x-2)² + 1</h4>
                <div className="flex justify-center">
                  <svg width={svgWidth} height={svgHeight} className="border border-gray-200 rounded-lg">
                    {/* Grid lines */}
                    {[-2, 0, 2, 4, 6, 8, 10, 12].map(x => (
                      <line
                        key={x}
                        x1={scaleX(x)}
                        y1={margin}
                        x2={scaleX(x)}
                        y2={svgHeight - margin}
                        stroke="#f3f4f6"
                        strokeWidth="1"
                      />
                    ))}
                    
                    {/* Function curve */}
                    <path
                      d={`M ${curvePoints.map(p => `${scaleX(p.x)},${scaleY(p.y)}`).join(' L ')}`}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                    />
                    
                    {/* Optimization path */}
                    {path.length > 1 && (
                      <path
                        d={`M ${path.map(p => `${scaleX(p.x)},${scaleY(p.y)}`).join(' L ')}`}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.7"
                      />
                    )}
                    
                    {/* Current position */}
                    <circle
                      cx={scaleX(currentX)}
                      cy={scaleY(currentY)}
                      r="8"
                      fill="#ef4444"
                      stroke="white"
                      strokeWidth="2"
                    />
                    
                    {/* Gradient arrow */}
                    {gradient !== 0 && (
                      <g>
                        <defs>
                          <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="10"
                            refY="3.5"
                            orient="auto"
                          >
                            <polygon
                              points="0 0, 10 3.5, 0 7"
                              fill="#f59e0b"
                            />
                          </marker>
                        </defs>
                        <line
                          x1={scaleX(currentX)}
                          y1={scaleY(currentY)}
                          x2={scaleX(currentX) - Math.sign(gradient) * 30}
                          y2={scaleY(currentY)}
                          stroke="#f59e0b"
                          strokeWidth="3"
                          markerEnd="url(#arrowhead)"
                        />
                      </g>
                    )}
                    
                    {/* Target (minimum) */}
                    <circle
                      cx={scaleX(2)}
                      cy={scaleY(1)}
                      r="6"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="2"
                    />
                    
                    {/* Labels */}
                    <text x={scaleX(currentX)} y={scaleY(currentY) - 15} textAnchor="middle" className="text-xs fill-red-600 font-bold">
                      Current
                    </text>
                    <text x={scaleX(2)} y={scaleY(1) - 15} textAnchor="middle" className="text-xs fill-green-600 font-bold">
                      Target
                    </text>
                    
                    {/* Axes */}
                    <line x1={margin} y1={svgHeight - margin} x2={svgWidth - margin} y2={svgHeight - margin} stroke="#374151" strokeWidth="2"/>
                    <line x1={margin} y1={margin} x2={margin} y2={svgHeight - margin} stroke="#374151" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
  
              {/* Step-by-step explanation */}
              {isOptimizing && (
                <div className="bg-white rounded-xl p-4 border border-indigo-200">
                  <h4 className="font-bold text-gray-800 mb-3">What's Happening Right Now</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="font-bold text-blue-600 mb-1">1. Calculate Gradient</div>
                      <div className="font-mono text-xs">∇f({currentX.toFixed(2)}) = {gradient.toFixed(4)}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {gradient > 0 ? "Slope goes up → move left" : gradient < 0 ? "Slope goes down → move right" : "At minimum!"}
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <div className="font-bold text-orange-600 mb-1">2. Calculate Step</div>
                      <div className="font-mono text-xs">
                        Step = {learningRate} × {gradient.toFixed(4)} = {(learningRate * gradient).toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Learning rate × gradient</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="font-bold text-green-600 mb-1">3. Update Position</div>
                      <div className="font-mono text-xs">
                        New x = {currentX.toFixed(4)} - {(learningRate * gradient).toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Move opposite to gradient</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
                    <div className="text-sm">
                      <span className="font-bold">Progress:</span> Distance to target = {Math.abs(currentX - 2).toFixed(4)}
                      {Math.abs(currentX - 2) < 0.1 && (
                        <span className="ml-2 text-green-600 font-bold">🎯 Nearly converged!</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const BatchProcessingModule = () => {
    const [isTraining, setIsTraining] = useState(false);
    const [batchSize, setBatchSize] = useState(4);
    const [currentBatch, setCurrentBatch] = useState(0);
    const [epoch, setEpoch] = useState(0);
    const [totalSamples] = useState(20);
    const [processedSamples, setProcessedSamples] = useState(0);
    const [avgLoss, setAvgLoss] = useState(0);
    const [batchLoss, setBatchLoss] = useState(0);
    const [learningRate] = useState(0.01);
    const [gradientNorm, setGradientNorm] = useState(0);
    const [processingMode, setProcessingMode] = useState('batch');
    const [convergenceHistory, setConvergenceHistory] = useState([]);
    const [currentSamples, setCurrentSamples] = useState([]);
    const [batchTime, setBatchTime] = useState(0);
  
    // Generate synthetic training data
    const generateData = () => {
      const data = [];
      for (let i = 0; i < totalSamples; i++) {
        const x = Math.random() * 10 - 5;
        const y = Math.random() * 10 - 5;
        const label = x * 2 + y * 1.5 + Math.random() * 2 - 1; // Linear with noise
        data.push({ id: i, x, y, label, loss: Math.random() * 2 + 0.5 });
      }
      return data;
    };
  
    const [trainingData] = useState(generateData());
  
    // Calculate batch statistics
    useEffect(() => {
      if (currentBatch >= 0) {
        const startIdx = currentBatch * batchSize;
        const endIdx = Math.min(startIdx + batchSize, totalSamples);
        const batch = trainingData.slice(startIdx, endIdx);
        setCurrentSamples(batch);
        
        // Calculate batch loss and gradient
        const losses = batch.map(sample => sample.loss);
        const batchLossValue = losses.reduce((sum, loss) => sum + loss, 0) / losses.length;
        setBatchLoss(batchLossValue);
        
        // Simulate gradient calculation
        const gradNorm = Math.sqrt(losses.reduce((sum, loss) => sum + loss * loss, 0) / losses.length);
        setGradientNorm(gradNorm);
      }
    }, [currentBatch, batchSize, trainingData, totalSamples]);
  
    // Training loop
    useEffect(() => {
      let interval;
      if (isTraining) {
        interval = setInterval(() => {
          const startTime = Date.now();
          
          setCurrentBatch(prevBatch => {
            const nextBatch = prevBatch + 1;
            const maxBatches = Math.ceil(totalSamples / batchSize);
            
            if (nextBatch >= maxBatches) {
              // End of epoch
              setEpoch(prevEpoch => prevEpoch + 1);
              setProcessedSamples(totalSamples);
              
              // Update convergence history
              setConvergenceHistory(prev => [...prev.slice(-19), {
                epoch: epoch + 1,
                loss: avgLoss,
                samples: totalSamples
              }]);
              
              return 0; // Reset to first batch
            } else {
              setProcessedSamples((nextBatch + 1) * batchSize);
              return nextBatch;
            }
          });
          
          // Simulate processing time
          setBatchTime(Date.now() - startTime + Math.random() * 50 + 10);
          
          // Update running average loss (with decay)
          setAvgLoss(prev => prev * 0.9 + batchLoss * 0.1);
          
        }, processingMode === 'single' ? 100 : processingMode === 'mini' ? 300 : 800);
      }
      
      return () => clearInterval(interval);
    }, [isTraining, batchLoss, avgLoss, epoch, totalSamples, batchSize, processingMode]);
  
    const reset = () => {
      setCurrentBatch(0);
      setEpoch(0);
      setProcessedSamples(0);
      setAvgLoss(2.5);
      setBatchLoss(0);
      setGradientNorm(0);
      setConvergenceHistory([]);
      setIsTraining(false);
      setBatchTime(0);
    };
  
    const getBatchColor = (mode) => {
      switch(mode) {
        case 'single': return 'bg-red-100 border-red-300 text-red-800';
        case 'mini': return 'bg-blue-100 border-blue-300 text-blue-800';
        case 'batch': return 'bg-green-100 border-green-300 text-green-800';
        default: return 'bg-gray-100 border-gray-300 text-gray-800';
      }
    };
  
    const maxBatches = Math.ceil(totalSamples / batchSize);
    const progress = ((currentBatch + 1) / maxBatches) * 100;
  
    return (
      <div className="space-y-8 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-green-500 to-blue-600 text-white rounded-2xl shadow-lg">
              <Layers className="w-12 h-12" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Batch Processing</h1>
              <p className="text-xl text-gray-600">Efficient Training Through Smart Grouping</p>
            </div>
          </div>
        </div>
  
        {/* Why This Matters */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 border border-green-200 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-green-500 text-white rounded-xl flex-shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">The Efficiency Revolution</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Batch processing is the <strong>secret sauce</strong> that makes modern AI training possible. 
                Instead of learning from one example at a time, we group samples together for massive speedup and stability.
              </p>
              <div className="bg-white/80 rounded-xl p-4 border border-green-200">
                <h3 className="font-bold text-green-900 mb-2">🚀 Think of it like this:</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Imagine grading homework. You could grade each paper individually and adjust your teaching after each one, 
                  or you could grade a stack of papers and adjust based on the overall patterns.
                </p>
                <p className="text-gray-700 text-sm font-semibold">
                  Batch processing does the latter - it's faster and gives more stable insights!
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Core Concepts */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Batch Processing Strategies</h2>
            <p className="text-gray-600">
              Different batch sizes create different trade-offs between speed, stability, and memory usage.
            </p>
          </div>
  
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Single Sample (SGD) */}
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-red-800">Single Sample</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="font-bold text-red-600 mb-1">Batch Size: 1</div>
                    <div className="text-sm text-gray-700">Update after every sample</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-red-600 mb-2">Pros:</div>
                    <div className="text-gray-700 mb-3">• Fast updates • Low memory • Can escape local minima</div>
                    <div className="font-bold text-red-600 mb-2">Cons:</div>
                    <div className="text-gray-700">• Noisy gradients • Slower convergence</div>
                  </div>
                </div>
              </div>
  
              {/* Mini-batch */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-blue-800">Mini-batch</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="font-bold text-blue-600 mb-1">Batch Size: 16-256</div>
                    <div className="text-sm text-gray-700">Sweet spot for most tasks</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-blue-600 mb-2">Pros:</div>
                    <div className="text-gray-700 mb-3">• Balanced trade-offs • Good GPU utilization • Stable gradients</div>
                    <div className="font-bold text-blue-600 mb-2">Best for:</div>
                    <div className="text-gray-700">Most deep learning tasks</div>
                  </div>
                </div>
              </div>
  
              {/* Full Batch */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-800">Full Batch</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="font-bold text-green-600 mb-1">Batch Size: All data</div>
                    <div className="text-sm text-gray-700">Use entire dataset</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-green-600 mb-2">Pros:</div>
                    <div className="text-gray-700 mb-3">• Most stable gradients • True gradient descent</div>
                    <div className="font-bold text-green-600 mb-2">Cons:</div>
                    <div className="text-gray-700">• High memory • Slow updates • Can get stuck</div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Interactive Demo */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Live Batch Training Demo</h3>
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={() => setIsTraining(!isTraining)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      isTraining 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isTraining ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isTraining ? 'Pause' : 'Start'} Training
                  </button>
                </div>
              </div>
  
              {/* Training Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
                  <div className="text-2xl font-bold text-purple-600">{epoch}</div>
                  <div className="text-sm text-gray-600">Epoch</div>
                  <div className="text-xs text-purple-600 mt-1">Full data passes</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
                  <div className="text-2xl font-bold text-blue-600">{currentBatch + 1}/{maxBatches}</div>
                  <div className="text-sm text-gray-600">Current Batch</div>
                  <div className="text-xs text-blue-600 mt-1">Progress in epoch</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
                  <div className="text-2xl font-bold text-green-600">{batchSize}</div>
                  <div className="text-sm text-gray-600">Batch Size</div>
                  <div className="text-xs text-green-600 mt-1">Samples per batch</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
                  <div className="text-2xl font-bold text-red-600">{avgLoss.toFixed(3)}</div>
                  <div className="text-sm text-gray-600">Avg Loss</div>
                  <div className="text-xs text-red-600 mt-1">Running average</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
                  <div className="text-2xl font-bold text-orange-600">{batchTime.toFixed(0)}ms</div>
                  <div className="text-sm text-gray-600">Batch Time</div>
                  <div className="text-xs text-orange-600 mt-1">Processing speed</div>
                </div>
              </div>
  
              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Batch Size: {batchSize} samples
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={totalSamples}
                    step="1"
                    value={batchSize}
                    onChange={(e) => setBatchSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={isTraining}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Single (1)</span>
                    <span>Mini-batch ({Math.floor(totalSamples/4)})</span>
                    <span>Full ({totalSamples})</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Processing Mode
                  </label>
                  <select
                    value={processingMode}
                    onChange={(e) => setProcessingMode(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    disabled={isTraining}
                  >
                    <option value="single">Single Sample (Fast)</option>
                    <option value="mini">Mini-batch (Balanced)</option>
                    <option value="batch">Full Batch (Slow)</option>
                  </select>
                </div>
              </div>
  
              {/* Progress Visualization */}
              <div className="bg-white rounded-xl p-4 border border-purple-200 mb-6">
                <h4 className="font-bold text-gray-800 mb-3">Training Progress</h4>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Epoch {epoch + 1} Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
  
                {/* Current Batch Visualization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">Current Batch Samples</h5>
                    <div className="grid grid-cols-4 gap-2">
                      {currentSamples.map((sample, idx) => (
                        <div 
                          key={sample.id}
                          className={`p-2 rounded-lg text-xs text-center ${getBatchColor(
                            batchSize === 1 ? 'single' : batchSize <= 8 ? 'mini' : 'batch'
                          )}`}
                        >
                          <div className="font-mono">#{sample.id}</div>
                          <div className="text-xs">L: {sample.loss.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">Batch Statistics</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Batch Loss:</span>
                        <span className="font-mono text-sm">{batchLoss.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Gradient Norm:</span>
                        <span className="font-mono text-sm">{gradientNorm.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Samples Processed:</span>
                        <span className="font-mono text-sm">{Math.min(processedSamples, totalSamples)}/{totalSamples}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Real-time Explanation */}
              {isTraining && (
                <div className="bg-white rounded-xl p-4 border border-purple-200">
                  <h4 className="font-bold text-gray-800 mb-3">What's Happening Now</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="font-bold text-blue-600 mb-1 flex items-center gap-1">
                        <ArrowRight className="w-4 h-4" />
                        1. Batch Loading
                      </div>
                      <div className="text-xs text-gray-600">
                        Processing samples {(currentBatch * batchSize) + 1} to {Math.min((currentBatch + 1) * batchSize, totalSamples)}
                      </div>
                      <div className="font-mono text-xs mt-1">
                        Batch size: {currentSamples.length}
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <div className="font-bold text-orange-600 mb-1 flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        2. Gradient Computation
                      </div>
                      <div className="text-xs text-gray-600">
                        Computing average gradient across batch
                      </div>
                      <div className="font-mono text-xs mt-1">
                        ||∇|| = {gradientNorm.toFixed(4)}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="font-bold text-green-600 mb-1 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        3. Parameter Update
                      </div>
                      <div className="text-xs text-gray-600">
                        Updating model parameters
                      </div>
                      <div className="font-mono text-xs mt-1">
                        θ = θ - α∇J_batch
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
                    <div className="text-sm flex items-center justify-between">
                      <div>
                        <span className="font-bold">Efficiency Gain:</span>
                        <span className="ml-2">
                          {batchSize > 1 
                            ? `${batchSize}x faster than single sample processing`
                            : 'Most frequent updates, but noisy gradients'
                          }
                        </span>
                      </div>
                      {progress > 95 && (
                        <span className="text-green-600 font-bold">🏁 Epoch almost complete!</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
  
            {/* Key Insights */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <h3 className="text-xl font-bold text-yellow-800 mb-4">💡 Key Insights</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Memory vs Speed:</strong> Larger batches use more memory but process faster per sample</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Gradient Quality:</strong> Larger batches give smoother, more accurate gradients</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Hardware Utilization:</strong> GPUs are optimized for parallel batch processing</div>
                  </div>
                </div>
              </div>
  
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">🎯 Best Practices</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Start Small:</strong> Begin with smaller batches, then increase as training stabilizes</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Power of 2:</strong> Use batch sizes like 32, 64, 128 for optimal GPU memory alignment</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Balance is Key:</strong> Mini-batches (16-256) usually work best in practice</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const AttentionMechanismModule = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedWord, setSelectedWord] = useState(2);
    const [attentionWeights, setAttentionWeights] = useState([]);
    const [queryVector, setQueryVector] = useState([]);
    const [keyVectors, setKeyVectors] = useState([]);
    const [valueVectors, setValueVectors] = useState([]);
    const [attentionScores, setAttentionScores] = useState([]);
    const [outputVector, setOutputVector] = useState([]);
    const [temperature, setTemperature] = useState(1.0);
    const [attentionType, setAttentionType] = useState('self');
    const [sequenceLength] = useState(6);
  
    // Sample sentence for demonstration
    const sentence = ["The", "cat", "sat", "on", "the", "mat"];
    const colors = [
      "bg-red-100 border-red-300 text-red-800",
      "bg-blue-100 border-blue-300 text-blue-800", 
      "bg-green-100 border-green-300 text-green-800",
      "bg-yellow-100 border-yellow-300 text-yellow-800",
      "bg-purple-100 border-purple-300 text-purple-800",
      "bg-indigo-100 border-indigo-300 text-indigo-800"
    ];
  
    // Initialize vectors
    useEffect(() => {
      // Generate random vectors for demo (in practice these come from embeddings)
      const newQueryVector = Array(4).fill().map(() => Math.random() * 2 - 1);
      const newKeyVectors = Array(sequenceLength).fill().map(() => 
        Array(4).fill().map(() => Math.random() * 2 - 1)
      );
      const newValueVectors = Array(sequenceLength).fill().map(() => 
        Array(4).fill().map(() => Math.random() * 2 - 1)
      );
      
      setQueryVector(newQueryVector);
      setKeyVectors(newKeyVectors);
      setValueVectors(newValueVectors);
      
      // Calculate attention scores and weights
      calculateAttention(newQueryVector, newKeyVectors, newValueVectors);
    }, [selectedWord, temperature, sequenceLength]);
  
    const calculateAttention = (q, k, v) => {
      // Calculate dot product attention scores
      const scores = k.map(keyVec => 
        q.reduce((sum, qi, i) => sum + qi * keyVec[i], 0) / temperature
      );
      
      // Apply softmax to get attention weights
      const maxScore = Math.max(...scores);
      const expScores = scores.map(score => Math.exp(score - maxScore));
      const sumExp = expScores.reduce((sum, exp) => sum + exp, 0);
      const weights = expScores.map(exp => exp / sumExp);
      
      // Calculate weighted sum of value vectors
      const output = Array(4).fill(0);
      weights.forEach((weight, i) => {
        v[i].forEach((val, j) => {
          output[j] += weight * val;
        });
      });
      
      setAttentionScores(scores);
      setAttentionWeights(weights);
      setOutputVector(output);
    };
  
    // Animation loop for stepping through the attention mechanism
    useEffect(() => {
      let interval;
      if (isAnimating) {
        interval = setInterval(() => {
          setCurrentStep(prev => (prev + 1) % 5); // 5 steps in attention process
        }, 1500);
      }
      
      return () => clearInterval(interval);
    }, [isAnimating]);
  
    const reset = () => {
      setCurrentStep(0);
      setIsAnimating(false);
    };
  
    const getAttentionColor = (weight) => {
      const intensity = Math.min(weight * 2, 1); // Scale for visibility
      const alpha = 0.2 + intensity * 0.6; // Min 0.2, max 0.8 opacity
      return `rgba(59, 130, 246, ${alpha})`; // Blue with variable opacity
    };
  
    const getStepDescription = (step) => {
      switch(step) {
        case 0: return "Select query word and generate Query vector (Q)";
        case 1: return "Generate Key vectors (K) for all words";
        case 2: return "Calculate attention scores: Q · K";
        case 3: return "Apply softmax to get attention weights";
        case 4: return "Compute weighted sum with Value vectors (V)";
        default: return "";
      }
    };
  
    return (
      <div className="space-y-8 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl shadow-lg">
              <Eye className="w-12 h-12" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Attention Mechanism</h1>
              <p className="text-xl text-gray-600">The Brain Behind Modern AI</p>
            </div>
          </div>
        </div>
  
        {/* Why This Matters */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-purple-500 text-white rounded-xl flex-shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">The Attention Revolution</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Attention is the <strong>breakthrough mechanism</strong> that revolutionized AI. 
                It allows models to focus on relevant parts of input, just like human attention works.
              </p>
              <div className="bg-white/80 rounded-xl p-4 border border-purple-200">
                <h3 className="font-bold text-purple-900 mb-2">🧠 Think of it like this:</h3>
                <p className="text-gray-700 text-sm mb-2">
                  When you read "The cat sat on the ___", your brain automatically focuses on words that help 
                  predict the next word. You pay more attention to "sat" and "on" than "the".
                </p>
                <p className="text-gray-700 text-sm font-semibold">
                  Attention mechanisms give AI this same selective focus superpower!
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Core Concepts */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Attention Works</h2>
            <p className="text-gray-600">
              Attention uses three key components: Queries (what we're looking for), Keys (what's available), and Values (the actual content).
            </p>
          </div>
  
          <div className="p-8">
            {/* The QKV Explanation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-blue-800">Query (Q)</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="font-bold text-blue-600 mb-1">"What am I looking for?"</div>
                    <div className="text-sm text-gray-700">Represents the current focus of attention</div>
                  </div>
                  <div className="text-sm text-gray-700">
                    Like a search query in your brain - it determines what information you want to focus on.
                    In translation: "What word should I pay attention to when translating this word?"
                  </div>
                </div>
              </div>
  
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-800">Key (K)</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="font-bold text-green-600 mb-1">"What's available to match?"</div>
                    <div className="text-sm text-gray-700">Represents what each word/token offers</div>
                  </div>
                  <div className="text-sm text-gray-700">
                    Like keywords or tags for each piece of information. The model compares the Query 
                    against all Keys to see which ones are most relevant.
                  </div>
                </div>
              </div>
  
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-orange-800">Value (V)</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-orange-200">
                    <div className="font-bold text-orange-600 mb-1">"What's the actual content?"</div>
                    <div className="text-sm text-gray-700">Contains the actual information to use</div>
                  </div>
                  <div className="text-sm text-gray-700">
                    The actual meaningful content that gets mixed together based on attention weights. 
                    This is what actually flows through the network.
                  </div>
                </div>
              </div>
            </div>
  
            {/* Interactive Demo */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Interactive Attention Demo</h3>
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      isAnimating 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isAnimating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isAnimating ? 'Pause' : 'Start'} Animation
                  </button>
                </div>
              </div>
  
              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Query Word: "{sentence[selectedWord]}"
                  </label>
                  <select
                    value={selectedWord}
                    onChange={(e) => setSelectedWord(parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    disabled={isAnimating}
                  >
                    {sentence.map((word, idx) => (
                      <option key={idx} value={idx}>{word} (position {idx + 1})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Temperature: {temperature.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Focused</span>
                    <span>Diffuse</span>
                  </div>
                </div>
  
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Attention Type
                  </label>
                  <select
                    value={attentionType}
                    onChange={(e) => setAttentionType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="self">Self-Attention</option>
                    <option value="cross">Cross-Attention</option>
                    <option value="masked">Masked Self-Attention</option>
                  </select>
                </div>
              </div>
  
              {/* Step-by-step visualization */}
              <div className="bg-white rounded-xl p-6 border border-indigo-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-bold">
                    {currentStep + 1}
                  </div>
                  <h4 className="font-bold text-gray-800">{getStepDescription(currentStep)}</h4>
                </div>
  
                {/* Sentence visualization */}
                <div className="mb-6">
                  <h5 className="font-bold text-gray-700 mb-3">Sentence: "The cat sat on the mat"</h5>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {sentence.map((word, idx) => (
                      <div
                        key={idx}
                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          idx === selectedWord 
                            ? 'bg-purple-200 border-purple-500 shadow-lg transform scale-105' 
                            : attentionWeights[idx] 
                              ? `border-blue-300 shadow-md`
                              : 'bg-gray-100 border-gray-300'
                        }`}
                        style={{
                          backgroundColor: attentionWeights[idx] ? getAttentionColor(attentionWeights[idx]) : undefined
                        }}
                      >
                        <div className="text-center">
                          <div className="font-bold text-gray-800">{word}</div>
                          <div className="text-xs text-gray-600 mt-1">pos {idx}</div>
                          {attentionWeights[idx] && (
                            <div className="text-xs font-bold text-blue-600 mt-1">
                              {(attentionWeights[idx] * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
  
                {/* Step-specific content */}
                {currentStep === 0 && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h5 className="font-bold text-purple-800 mb-2">Step 1: Query Generation</h5>
                    <p className="text-sm text-gray-700 mb-3">
                      For word "{sentence[selectedWord]}", we create a Query vector that represents 
                      "what information should I pay attention to?"
                    </p>
                    <div className="bg-white rounded p-3">
                      <div className="font-mono text-xs">
                        Q = [{queryVector.map(v => v.toFixed(2)).join(', ')}]
                      </div>
                    </div>
                  </div>
                )}
  
                {currentStep === 1 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-bold text-green-800 mb-2">Step 2: Key Generation</h5>
                    <p className="text-sm text-gray-700 mb-3">
                      Each word gets a Key vector representing what it can offer for attention.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {keyVectors.map((key, idx) => (
                        <div key={idx} className="bg-white rounded p-2">
                          <div className="text-xs font-bold text-gray-600 mb-1">{sentence[idx]}:</div>
                          <div className="font-mono text-xs">
                            [{key.map(v => v.toFixed(1)).join(',')}]
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
  
                {currentStep === 2 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-bold text-blue-800 mb-2">Step 3: Attention Scores</h5>
                    <p className="text-sm text-gray-700 mb-3">
                      Calculate how much each word should be attended to by computing Q · K for each word.
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {attentionScores.map((score, idx) => (
                        <div key={idx} className="bg-white rounded p-2 text-center">
                          <div className="text-xs font-bold text-gray-600">{sentence[idx]}</div>
                          <div className="font-mono text-xs text-blue-600">
                            {score.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
  
                {currentStep === 3 && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h5 className="font-bold text-orange-800 mb-2">Step 4: Softmax Normalization</h5>
                    <p className="text-sm text-gray-700 mb-3">
                      Apply softmax to convert scores into probabilities that sum to 1.
                    </p>
                    <div className="space-y-2">
                      {attentionWeights.map((weight, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-16 text-sm font-bold">{sentence[idx]}:</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                            <div 
                              className="bg-gradient-to-r from-orange-400 to-red-500 h-4 rounded-full transition-all duration-500"
                              style={{ width: `${weight * 100}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                              {(weight * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
  
                {currentStep === 4 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-bold text-green-800 mb-2">Step 5: Weighted Sum Output</h5>
                    <p className="text-sm text-gray-700 mb-3">
                      Compute the final output as a weighted combination of all Value vectors.
                    </p>
                    <div className="bg-white rounded p-3">
                      <div className="text-sm mb-2">
                        <strong>Output = </strong>
                        {attentionWeights.map((weight, idx) => (
                          <span key={idx} className="mr-2">
                            {weight.toFixed(2)} × V_{idx} {idx < attentionWeights.length - 1 ? '+' : ''}
                          </span>
                        ))}
                      </div>
                      <div className="font-mono text-xs bg-green-100 p-2 rounded">
                        Result = [{outputVector.map(v => v.toFixed(3)).join(', ')}]
                      </div>
                    </div>
                  </div>
                )}
              </div>
  
              {/* Mathematical Formula */}
              <div className="bg-white rounded-xl p-6 border border-indigo-200">
                <h4 className="font-bold text-gray-800 mb-4">The Attention Formula</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-gray-800">
                      Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>)V
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-blue-600">Q</div>
                      <div className="text-gray-600">Query matrix</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">K</div>
                      <div className="text-gray-600">Key matrix</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-orange-600">V</div>
                      <div className="text-gray-600">Value matrix</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600">√d<sub>k</sub></div>
                      <div className="text-gray-600">Scaling factor</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Applications */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
                <h3 className="text-xl font-bold text-cyan-800 mb-4">🚀 Real-World Applications</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Language Translation:</strong> Focus on relevant source words when generating target words</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Image Captioning:</strong> Attend to different image regions when generating description words</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Document Summarization:</strong> Focus on important sentences and key information</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Chatbots:</strong> Pay attention to relevant context from conversation history</div>
                  </div>
                </div>
              </div>
  
              <div className="bg-pink-50 rounded-2xl p-6 border border-pink-200">
                <h3 className="text-xl font-bold text-pink-800 mb-4">🎯 Key Benefits</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Parallel Processing:</strong> Unlike RNNs, attention can be computed in parallel</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Long-Range Dependencies:</strong> Can connect distant parts of sequences</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Interpretability:</strong> Attention weights show what the model is focusing on</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Flexibility:</strong> Can be applied to many different types of data</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const TrainingOptimizationModule = () => {
    const [isTraining, setIsTraining] = useState(false);
    const [epoch, setEpoch] = useState(0);
    const [optimizer, setOptimizer] = useState('sgd');
    const [learningRate, setLearningRate] = useState(0.01);
    const [momentum, setMomentum] = useState(0.9);
    const [beta1, setBeta1] = useState(0.9);
    const [beta2, setBeta2] = useState(0.999);
    const [weightDecay, setWeightDecay] = useState(0.0001);
    const [batchSize, setBatchSize] = useState(32);
    const [currentLoss, setCurrentLoss] = useState(2.5);
    const [validationLoss, setValidationLoss] = useState(2.8);
    const [trainAccuracy, setTrainAccuracy] = useState(0.2);
    const [valAccuracy, setValAccuracy] = useState(0.18);
    const [learningRateSchedule, setLearningRateSchedule] = useState('constant');
    const [currentLR, setCurrentLR] = useState(0.01);
    const [gradientNorm, setGradientNorm] = useState(1.2);
    const [lossHistory, setLossHistory] = useState([]);
    const [accuracyHistory, setAccuracyHistory] = useState([]);
    const [lrHistory, setLrHistory] = useState([]);
    const [isOverfitting, setIsOverfitting] = useState(false);
    const [convergenceStatus, setConvergenceStatus] = useState('training');
    
    // Training phases
    const [currentPhase, setCurrentPhase] = useState('warmup'); // warmup, training, plateau, convergence
  
    // Simulated model parameters
    const [parameters, setParameters] = useState({
      weights: Array(6).fill().map(() => Math.random() * 2 - 1),
      biases: Array(3).fill().map(() => Math.random() * 0.5),
      velocity: Array(6).fill(0),
      momentum_v: Array(6).fill(0),
      adam_m: Array(6).fill(0),
      adam_v: Array(6).fill(0)
    });
  
    // Initialize training data
    useEffect(() => {
      setLossHistory([{ epoch: 0, trainLoss: 2.5, valLoss: 2.8 }]);
      setAccuracyHistory([{ epoch: 0, trainAcc: 0.2, valAcc: 0.18 }]);
      setLrHistory([{ epoch: 0, lr: learningRate }]);
    }, []);
  
    // Learning rate scheduling
    const updateLearningRate = (currentEpoch) => {
      let newLR = learningRate;
      
      switch(learningRateSchedule) {
        case 'step':
          newLR = learningRate * Math.pow(0.5, Math.floor(currentEpoch / 10));
          break;
        case 'exponential':
          newLR = learningRate * Math.pow(0.95, currentEpoch);
          break;
        case 'cosine':
          newLR = learningRate * 0.5 * (1 + Math.cos(Math.PI * currentEpoch / 50));
          break;
        case 'plateau':
          // Reduce LR if validation loss hasn't improved
          if (currentEpoch > 5 && validationLoss >= 2.0) {
            newLR = learningRate * 0.8;
          }
          break;
        default:
          newLR = learningRate;
      }
      
      setCurrentLR(Math.max(newLR, 0.0001)); // Minimum LR
    };
  
    // Training simulation
    useEffect(() => {
      let interval;
      if (isTraining) {
        interval = setInterval(() => {
          setEpoch(prevEpoch => {
            const newEpoch = prevEpoch + 1;
            
            // Update learning rate
            updateLearningRate(newEpoch);
            
            // Simulate training progress with different optimizers
            let lossReduction = 0.02;
            let noiseLevel = 0.05;
            
            switch(optimizer) {
              case 'sgd':
                lossReduction = 0.015;
                noiseLevel = 0.08;
                break;
              case 'momentum':
                lossReduction = 0.025;
                noiseLevel = 0.06;
                break;
              case 'adam':
                lossReduction = 0.035;
                noiseLevel = 0.03;
                break;
              case 'adamw':
                lossReduction = 0.032;
                noiseLevel = 0.025;
                break;
            }
            
            // Training phase logic
            let phaseMultiplier = 1;
            if (newEpoch < 5) {
              setCurrentPhase('warmup');
              phaseMultiplier = 0.5;
            } else if (newEpoch < 30) {
              setCurrentPhase('training');
              phaseMultiplier = 1;
            } else if (newEpoch < 40) {
              setCurrentPhase('plateau');
              phaseMultiplier = 0.2;
            } else {
              setCurrentPhase('convergence');
              phaseMultiplier = 0.05;
            }
            
            // Update losses with realistic patterns
            const newTrainLoss = Math.max(0.1, currentLoss - (lossReduction * phaseMultiplier) + (Math.random() - 0.5) * noiseLevel);
            const newValLoss = Math.max(0.15, validationLoss - (lossReduction * phaseMultiplier * 0.8) + (Math.random() - 0.5) * noiseLevel * 1.2);
            
            setCurrentLoss(newTrainLoss);
            setValidationLoss(newValLoss);
            
            // Update accuracies (inverse relationship with loss)
            const newTrainAcc = Math.min(0.98, trainAccuracy + (lossReduction * phaseMultiplier * 8) + (Math.random() - 0.5) * 0.02);
            const newValAcc = Math.min(0.95, valAccuracy + (lossReduction * phaseMultiplier * 7) + (Math.random() - 0.5) * 0.025);
            
            setTrainAccuracy(newTrainAcc);
            setValAccuracy(newValAcc);
            
            // Check for overfitting
            if (newTrainLoss < newValLoss - 0.3 && newEpoch > 10) {
              setIsOverfitting(true);
            }
            
            // Update gradient norm
            setGradientNorm(Math.max(0.001, gradientNorm * 0.98 + (Math.random() - 0.5) * 0.1));
            
            // Update histories
            setLossHistory(prev => [...prev.slice(-49), { epoch: newEpoch, trainLoss: newTrainLoss, valLoss: newValLoss }]);
            setAccuracyHistory(prev => [...prev.slice(-49), { epoch: newEpoch, trainAcc: newTrainAcc, valAcc: newValAcc }]);
            setLrHistory(prev => [...prev.slice(-49), { epoch: newEpoch, lr: currentLR }]);
            
            // Stop training if converged
            if (newTrainLoss < 0.15 && Math.abs(newTrainLoss - newValLoss) < 0.05) {
              setIsTraining(false);
              setConvergenceStatus('converged');
            }
            
            return newEpoch;
          });
        }, 200);
      }
      
      return () => clearInterval(interval);
    }, [isTraining, optimizer, currentLoss, validationLoss, trainAccuracy, valAccuracy, currentLR, gradientNorm, learningRateSchedule, learningRate]);
  
    const reset = () => {
      setEpoch(0);
      setCurrentLoss(2.5);
      setValidationLoss(2.8);
      setTrainAccuracy(0.2);
      setValAccuracy(0.18);
      setCurrentLR(learningRate);
      setGradientNorm(1.2);
      setIsOverfitting(false);
      setCurrentPhase('warmup');
      setConvergenceStatus('training');
      setLossHistory([{ epoch: 0, trainLoss: 2.5, valLoss: 2.8 }]);
      setAccuracyHistory([{ epoch: 0, trainAcc: 0.2, valAcc: 0.18 }]);
      setLrHistory([{ epoch: 0, lr: learningRate }]);
      setIsTraining(false);
    };
  
    const getOptimizerColor = (opt) => {
      switch(opt) {
        case 'sgd': return 'text-red-600';
        case 'momentum': return 'text-blue-600';
        case 'adam': return 'text-green-600';
        case 'adamw': return 'text-purple-600';
        default: return 'text-gray-600';
      }
    };
  
    const getPhaseColor = (phase) => {
      switch(phase) {
        case 'warmup': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
        case 'training': return 'bg-blue-100 border-blue-300 text-blue-800';
        case 'plateau': return 'bg-orange-100 border-orange-300 text-orange-800';
        case 'convergence': return 'bg-green-100 border-green-300 text-green-800';
        default: return 'bg-gray-100 border-gray-300 text-gray-800';
      }
    };
  
    return (
      <div className="space-y-8 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-green-600 text-white rounded-2xl shadow-lg">
              <Settings className="w-12 h-12" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Training & Optimization</h1>
              <p className="text-xl text-gray-600">The Art and Science of Model Training</p>
            </div>
          </div>
        </div>
  
        {/* Why This Matters */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 border border-blue-200 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-500 text-white rounded-xl flex-shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">The Training Journey</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Training is where the <strong>magic happens</strong> - transforming random parameters into intelligent behavior. 
                It's a delicate balance of exploration, exploitation, and careful tuning.
              </p>
              <div className="bg-white/80 rounded-xl p-4 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">🎯 Think of it like this:</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Imagine teaching someone to ride a bike. You start with training wheels (high learning rate), 
                  gradually remove support (learning rate decay), and fine-tune balance (optimization).
                </p>
                <p className="text-gray-700 text-sm font-semibold">
                  Training AI models follows the same principle of guided, adaptive learning!
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Core Concepts */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Optimization Algorithms</h2>
            <p className="text-gray-600">
              Different optimizers use various strategies to navigate the loss landscape and find optimal parameters.
            </p>
          </div>
  
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* SGD */}
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold text-red-800">Stochastic Gradient Descent</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="font-mono text-sm">θ = θ - α∇J(θ)</div>
                    <div className="text-xs text-gray-600 mt-1">Simple but effective baseline</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-red-600 mb-2">Pros:</div>
                    <div className="text-gray-700 mb-3">• Simple to implement • Low memory usage • Good for large datasets</div>
                    <div className="font-bold text-red-600 mb-2">Cons:</div>
                    <div className="text-gray-700">• Can oscillate • Slow convergence • Struggles with saddle points</div>
                  </div>
                </div>
              </div>
  
              {/* SGD with Momentum */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-blue-800">SGD with Momentum</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="font-mono text-sm">
                      <div>v = βv + α∇J(θ)</div>
                      <div>θ = θ - v</div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Builds velocity for faster convergence</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-blue-600 mb-2">Pros:</div>
                    <div className="text-gray-700 mb-3">• Faster convergence • Dampens oscillations • Escapes shallow minima</div>
                    <div className="font-bold text-blue-600 mb-2">Best for:</div>
                    <div className="text-gray-700">Problems with consistent gradient directions</div>
                  </div>
                </div>
              </div>
  
              {/* Adam */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-800">Adam</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="font-mono text-sm">
                      <div>m = β₁m + (1-β₁)∇J(θ)</div>
                      <div>v = β₂v + (1-β₂)∇J(θ)²</div>
                      <div>θ = θ - α(m̂/√v̂ + ε)</div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Adaptive learning rates per parameter</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-green-600 mb-2">Pros:</div>
                    <div className="text-gray-700 mb-3">• Fast convergence • Handles sparse gradients • Self-tuning learning rates</div>
                    <div className="font-bold text-green-600 mb-2">Most popular for:</div>
                    <div className="text-gray-700">Deep learning and neural networks</div>
                  </div>
                </div>
              </div>
  
              {/* AdamW */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-purple-800">AdamW</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="font-mono text-sm">
                      <div>Adam + Weight Decay</div>
                      <div>θ = θ - α(m̂/√v̂ + λθ)</div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Adam with decoupled weight decay</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-purple-600 mb-2">Pros:</div>
                    <div className="text-gray-700 mb-3">• Better generalization • Fixes Adam's weight decay • State-of-the-art results</div>
                    <div className="font-bold text-purple-600 mb-2">Best for:</div>
                    <div className="text-gray-700">Large models like Transformers</div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Interactive Training Demo */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Live Training Simulation</h3>
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={() => setIsTraining(!isTraining)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      isTraining 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isTraining ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isTraining ? 'Pause' : 'Start'} Training
                  </button>
                </div>
              </div>
  
              {/* Training Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-indigo-200 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{epoch}</div>
                  <div className="text-sm text-gray-600">Epoch</div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-2 ${getPhaseColor(currentPhase)}`}>
                    {currentPhase}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-indigo-200 text-center">
                  <div className="text-2xl font-bold text-red-600">{currentLoss.toFixed(4)}</div>
                  <div className="text-sm text-gray-600">Train Loss</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Val: {validationLoss.toFixed(4)}
                    {isOverfitting && <span className="text-red-500 ml-1">⚠️</span>}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-indigo-200 text-center">
                  <div className="text-2xl font-bold text-green-600">{(trainAccuracy * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Train Acc</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Val: {(valAccuracy * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-indigo-200 text-center">
                  <div className={`text-2xl font-bold ${getOptimizerColor(optimizer)}`}>{currentLR.toFixed(6)}</div>
                  <div className="text-sm text-gray-600">Learning Rate</div>
                  <div className="text-xs text-gray-500 mt-1">
                    ||∇||: {gradientNorm.toFixed(4)}
                  </div>
                </div>
              </div>
  
              {/* Hyperparameter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Optimizer
                  </label>
                  <select
                    value={optimizer}
                    onChange={(e) => setOptimizer(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    disabled={isTraining}
                  >
                    <option value="sgd">SGD</option>
                    <option value="momentum">SGD + Momentum</option>
                    <option value="adam">Adam</option>
                    <option value="adamw">AdamW</option>
                  </select>
                </div>
  
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Learning Rate: {learningRate}
                  </label>
                  <input
                    type="range"
                    min="0.001"
                    max="0.1"
                    step="0.001"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={isTraining}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.001</span>
                    <span>0.1</span>
                  </div>
                </div>
  
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    LR Schedule
                  </label>
                  <select
                    value={learningRateSchedule}
                    onChange={(e) => setLearningRateSchedule(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    disabled={isTraining}
                  >
                    <option value="constant">Constant</option>
                    <option value="step">Step Decay</option>
                    <option value="exponential">Exponential</option>
                    <option value="cosine">Cosine Annealing</option>
                    <option value="plateau">Reduce on Plateau</option>
                  </select>
                </div>
  
                {(optimizer === 'momentum' || optimizer === 'adam' || optimizer === 'adamw') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Momentum/β₁: {momentum.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="0.99"
                      step="0.01"
                      value={momentum}
                      onChange={(e) => setMomentum(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      disabled={isTraining}
                    />
                  </div>
                )}
  
                {(optimizer === 'adam' || optimizer === 'adamw') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      β₂: {beta2.toFixed(3)}
                    </label>
                    <input
                      type="range"
                      min="0.9"
                      max="0.9999"
                      step="0.0001"
                      value={beta2}
                      onChange={(e) => setBeta2(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      disabled={isTraining}
                    />
                  </div>
                )}
  
                {optimizer === 'adamw' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Weight Decay: {weightDecay.toFixed(4)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.01"
                      step="0.0001"
                      value={weightDecay}
                      onChange={(e) => setWeightDecay(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      disabled={isTraining}
                    />
                  </div>
                )}
              </div>
  
              {/* Training Progress Visualization */}
              <div className="bg-white rounded-xl p-6 border border-indigo-200 mb-6">
                <h4 className="font-bold text-gray-800 mb-4">Training Progress</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Loss Chart */}
                  <div>
                    <h5 className="font-bold text-gray-700 mb-3">Loss Over Time</h5>
                    <div className="relative h-40 bg-gray-50 rounded-lg p-4">
                      <svg width="100%" height="100%" className="overflow-visible">
                        {lossHistory.length > 1 && (
                          <>
                            {/* Training loss line */}
                            <polyline
                              points={lossHistory.map((point, idx) => 
                                `${(idx / Math.max(lossHistory.length - 1, 1)) * 280},${140 - (point.trainLoss / 3) * 120}`
                              ).join(' ')}
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="2"
                            />
                            {/* Validation loss line */}
                            <polyline
                              points={lossHistory.map((point, idx) => 
                                `${(idx / Math.max(lossHistory.length - 1, 1)) * 280},${140 - (point.valLoss / 3) * 120}`
                              ).join(' ')}
                              fill="none"
                              stroke="#f97316"
                              strokeWidth="2"
                              strokeDasharray="5,5"
                            />
                          </>
                        )}
                      </svg>
                      <div className="absolute bottom-2 left-4 flex gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-0.5 bg-red-500"></div>
                          <span>Train</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-0.5 bg-orange-500" style={{ borderTop: "2px dashed" }}></div>
                          <span>Val</span>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  {/* Accuracy Chart */}
                  <div>
                    <h5 className="font-bold text-gray-700 mb-3">Accuracy Over Time</h5>
                    <div className="relative h-40 bg-gray-50 rounded-lg p-4">
                      <svg width="100%" height="100%" className="overflow-visible">
                        {accuracyHistory.length > 1 && (
                          <>
                            {/* Training accuracy line */}
                            <polyline
                              points={accuracyHistory.map((point, idx) => 
                                `${(idx / Math.max(accuracyHistory.length - 1, 1)) * 280},${140 - point.trainAcc * 120}`
                              ).join(' ')}
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="2"
                            />
                          {/* Validation accuracy line */}
                          <polyline
                            points={accuracyHistory.map((point, idx) => 
                              `${(idx / Math.max(accuracyHistory.length - 1, 1)) * 280},${140 - point.valAcc * 120}`
                            ).join(' ')}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />
                        </>
                      )}
                    </svg>
                    <div className="absolute bottom-2 left-4 flex gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-0.5 bg-green-500"></div>
                        <span>Train</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-0.5 bg-blue-500" style={{ borderTop: "2px dashed" }}></div>
                        <span>Val</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Convergence Status */}
            <div className="text-center">
              <span
                className={`px-4 py-2 rounded-full font-semibold ${
                  convergenceStatus === 'converged'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                }`}
              >
                {convergenceStatus === 'converged'
                  ? '✅ Model Converged'
                  : '⏳ Training in Progress'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ModelEvaluation1Module = () => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalStep, setEvalStep] = useState(0);

  const [precision, setPrecision] = useState(0.75);
  const [recall, setRecall] = useState(0.7);
  const [f1Score, setF1Score] = useState(0.72);
  const [auc, setAuc] = useState(0.82);
  const [confusionMatrix, setConfusionMatrix] = useState([
    [80, 20],
    [15, 85],
  ]);

  const [precisionHistory, setPrecisionHistory] = useState([]);
  const [recallHistory, setRecallHistory] = useState([]);
  const [f1History, setF1History] = useState([]);
  const [aucHistory, setAucHistory] = useState([]);

  // Start evaluation simulation
  useEffect(() => {
    let interval;
    if (isEvaluating) {
      interval = setInterval(() => {
        setEvalStep((prev) => {
          const newStep = prev + 1;

          // Simulate metrics improving
          const newPrecision = Math.min(0.95, precision + (Math.random() - 0.4) * 0.02);
          const newRecall = Math.min(0.93, recall + (Math.random() - 0.4) * 0.02);
          const newF1 = 2 * (newPrecision * newRecall) / (newPrecision + newRecall + 1e-9);
          const newAuc = Math.min(0.99, auc + (Math.random() - 0.5) * 0.01);

          setPrecision(newPrecision);
          setRecall(newRecall);
          setF1Score(newF1);
          setAuc(newAuc);

          // Update histories
          setPrecisionHistory((prev) => [...prev.slice(-49), { step: newStep, val: newPrecision }]);
          setRecallHistory((prev) => [...prev.slice(-49), { step: newStep, val: newRecall }]);
          setF1History((prev) => [...prev.slice(-49), { step: newStep, val: newF1 }]);
          setAucHistory((prev) => [...prev.slice(-49), { step: newStep, val: newAuc }]);

          // Update confusion matrix randomly
          setConfusionMatrix([
            [Math.floor(75 + Math.random() * 10), Math.floor(25 - Math.random() * 10)],
            [Math.floor(20 - Math.random() * 10), Math.floor(80 + Math.random() * 10)],
          ]);

          if (newStep >= 40) {
            setIsEvaluating(false);
          }

          return newStep;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isEvaluating, precision, recall, f1Score, auc]);

  const reset = () => {
    setEvalStep(0);
    setPrecision(0.75);
    setRecall(0.7);
    setF1Score(0.72);
    setAuc(0.82);
    setConfusionMatrix([
      [80, 20],
      [15, 85],
    ]);
    setPrecisionHistory([]);
    setRecallHistory([]);
    setF1History([]);
    setAucHistory([]);
    setIsEvaluating(false);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg">
            <BarChart className="w-12 h-12" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Model Evaluation</h1>
            <p className="text-xl text-gray-600">Measuring Success Beyond Training</p>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-200 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-purple-500 text-white rounded-xl flex-shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Beyond Loss & Accuracy</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              A model isn't just about getting low loss—it’s about <strong>reliability, fairness, and consistency</strong>. 
              Precision, Recall, F1-score, and AUC tell the <em>full story</em> of model quality.
            </p>
            <div className="bg-white/80 rounded-xl p-4 border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">📊 Think of it like this:</h3>
              <p className="text-gray-700 text-sm mb-2">
                Accuracy is like your GPA, but F1 is like balancing both <em>grades and extracurriculars</em>. 
                AUC shows consistency across thresholds, and the confusion matrix? 
                That’s your actual <strong>report card of decisions</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Evaluation Demo */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b border-gray-100 flex justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Evaluation Simulation</h2>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => setIsEvaluating(!isEvaluating)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                isEvaluating 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isEvaluating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isEvaluating ? 'Pause' : 'Start'} Eval
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
              <div className="text-2xl font-bold text-indigo-600">{(precision * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Precision</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
              <div className="text-2xl font-bold text-purple-600">{(recall * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Recall</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
              <div className="text-2xl font-bold text-green-600">{(f1Score * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-600">F1 Score</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
              <div className="text-2xl font-bold text-pink-600">{(auc * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-600">ROC AUC</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Precision/Recall/F1 Chart */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Metrics Over Time</h4>
              <div className="relative h-40 bg-gray-50 rounded-lg p-4">
                <svg width="100%" height="100%" className="overflow-visible">
                  {precisionHistory.length > 1 && (
                    <>
                      <polyline
                        points={precisionHistory.map((p, i) =>
                          `${(i / Math.max(precisionHistory.length - 1, 1)) * 280},${140 - p.val * 120}`
                        ).join(' ')}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                      />
                      <polyline
                        points={recallHistory.map((p, i) =>
                          `${(i / Math.max(recallHistory.length - 1, 1)) * 280},${140 - p.val * 120}`
                        ).join(' ')}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                      />
                      <polyline
                        points={f1History.map((p, i) =>
                          `${(i / Math.max(f1History.length - 1, 1)) * 280},${140 - p.val * 120}`
                        ).join(' ')}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </>
                  )}
                </svg>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Confusion Matrix</h4>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-lg w-64 mx-auto">
                {confusionMatrix.map((row, i) =>
                  row.map((val, j) => (
                    <div
                      key={`${i}-${j}`}
                      className={`p-4 text-center rounded-lg font-bold ${
                        i === j ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
              <div className="text-sm text-gray-600 text-center mt-2">TP / FP / FN / TN balance</div>
            </div>
          </div>

          {/* AUC Progress */}
          <div className="text-center">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-pink-500 h-4 transition-all"
                style={{ width: `${auc * 100}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">AUC showing how well the model separates classes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

  // Render the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <WelcomeStep />;
      case 1: return <TokenizationStep />;
      case 2: return <EmbeddingsStep />;
      case 3: return <NeuralNetworkStep />;
      case 4: return <ForwardPropagationStep />;
      case 5: return <LossFunctionsStep/>;
      case 6: return <BackpropagationStep />;
      case 7: return <GradientDescentStep />
      case 8: return <BatchProcessingModule />
      case 9: return <AttentionMechanismModule />
      case 10: return <TrainingOptimizationModule />
      case 11: return <ModelEvaluationModule />

      default: return <WelcomeStep />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Fixed Header with Progress */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
            

            <div className="flex items-center gap-4">
              
            
          </div>

          {/* Step Navigation Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {learningSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(index);
                const isCurrent = currentStep === index;
                const isAccessible = index <= Math.max(...completedSteps, currentStep);
                
                return (
                  <button
                    key={step.id}
                    onClick={() => isAccessible && goToStep(index)}
                    disabled={!isAccessible}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : isAccessible
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    <span className="hidden lg:inline">{step.title}</span>
                    <span className="lg:hidden">{index + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous Step"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextStep}
                disabled={currentStep === learningSteps.length - 1}
                className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next Step"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-full"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Step Navigation Footer */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {learningSteps[currentStep - 1]?.title || 'Previous'}
                </button>
              )}
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">
                {learningSteps[currentStep]?.title}
              </div>
              <div className="text-sm text-gray-600">
                {learningSteps[currentStep]?.duration} • {learningSteps[currentStep]?.difficulty}
              </div>
            </div>

            <div>
              {currentStep < learningSteps.length - 1 ? (
                <button
                  onClick={() => {
                    completeStep();
                    nextStep();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  {learningSteps[currentStep + 1]?.title || 'Next'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={completeStep}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Complete Journey
                  <Trophy className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Training Progress Indicator (when active) */}
      {isTraining && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="font-semibold text-gray-800">AI Training in Progress</span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Step {trainingStep}/100 | Loss: {loss.toFixed(4)} | Accuracy: {accuracy.toFixed(1)}%
          </div>
          <div className="w-48 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${trainingStep}%` }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HowAILearns;
