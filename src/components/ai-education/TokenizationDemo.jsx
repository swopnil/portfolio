import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Zap, Brain, Eye, Cpu, ArrowRight, Sparkles, Target, BookOpen } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import * as d3 from 'd3';

const TokenizationDemo = ({ updateProgress }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [inputText, setInputText] = useState("Hello world! How are you today?");
  const [isAnimating, setIsAnimating] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [encodedTokens, setEncodedTokens] = useState([]);
  const [embeddings, setEmbeddings] = useState([]);
  const [attentionWeights, setAttentionWeights] = useState([]);
  const svgRef = useRef();
  const embeddingRef = useRef();
  const attentionRef = useRef();

  // Simulate tokenization process
  const tokenizeText = (text) => {
    // Simple tokenization for demo (in reality, this would use BPE, WordPiece, etc.)
    const words = text.toLowerCase().split(/(\s+|[.!?])/);
    const tokenList = words.filter(word => word.trim()).map((word, index) => ({
      id: index,
      text: word,
      tokenId: Math.floor(Math.random() * 50000) + 1000, // Mock token IDs
      position: index,
      color: `hsl(${(index * 60) % 360}, 70%, 60%)`
    }));
    return tokenList;
  };

  // Generate embeddings (mock 3D vectors for visualization)
  const generateEmbeddings = (tokenList) => {
    return tokenList.map(token => ({
      ...token,
      embedding: [
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ]
    }));
  };

  // Generate attention weights
  const generateAttentionWeights = (tokenList) => {
    const size = tokenList.length;
    const weights = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        // Create more realistic attention patterns
        const distance = Math.abs(i - j);
        const base = Math.exp(-distance * 0.5);
        const randomFactor = Math.random() * 0.5 + 0.5;
        row.push(base * randomFactor);
      }
      weights.push(row);
    }
    return weights;
  };

  // Animation steps
  const animationSteps = [
    {
      title: "Raw Text Input",
      description: "Human language as written text",
      duration: 1000
    },
    {
      title: "Tokenization",
      description: "Breaking text into meaningful units",
      duration: 2000
    },
    {
      title: "Token Encoding",
      description: "Converting tokens to numerical IDs",
      duration: 1500
    },
    {
      title: "Vector Embeddings",
      description: "Mapping tokens to dense vector representations",
      duration: 2000
    },
    {
      title: "Attention Mechanism",
      description: "Computing relationships between tokens",
      duration: 2500
    }
  ];

  // Run the animation sequence
  const runAnimation = async () => {
    setIsAnimating(true);
    setActiveStep(0);
    setMaxReachedStep(0);
    
    const tokenList = tokenizeText(inputText);
    setTokens([]);
    setEncodedTokens([]);
    setEmbeddings([]);
    setAttentionWeights([]);
    
    // Step 1: Show raw text
    await new Promise(resolve => setTimeout(resolve, animationSteps[0].duration));
    setActiveStep(1);
    setMaxReachedStep(1);
    
    // Step 2: Tokenize
    setTokens(tokenList);
    await new Promise(resolve => setTimeout(resolve, animationSteps[1].duration));
    setActiveStep(2);
    setMaxReachedStep(2);
    
    // Step 3: Encode
    setEncodedTokens(tokenList);
    await new Promise(resolve => setTimeout(resolve, animationSteps[2].duration));
    setActiveStep(3);
    setMaxReachedStep(3);
    
    // Step 4: Embeddings
    const embeddedTokens = generateEmbeddings(tokenList);
    setEmbeddings(embeddedTokens);
    drawEmbeddingVisualization(embeddedTokens);
    await new Promise(resolve => setTimeout(resolve, animationSteps[3].duration));
    setActiveStep(4);
    setMaxReachedStep(4);
    
    // Step 5: Attention
    const weights = generateAttentionWeights(tokenList);
    setAttentionWeights(weights);
    drawAttentionVisualization(tokenList, weights);
    await new Promise(resolve => setTimeout(resolve, animationSteps[4].duration));
    
    setIsAnimating(false);
  };

  // Draw embedding visualization
  const drawEmbeddingVisualization = (embeddedTokens) => {
    const svg = d3.select(embeddingRef.current);
    svg.selectAll("*").remove();
    
    const width = 600;
    const height = 400;
    const margin = 50;
    
    // Project 3D embeddings to 2D using PCA-like transformation
    const projectedTokens = embeddedTokens.map(token => ({
      ...token,
      x: token.embedding[0] * 100 + width/2,
      y: token.embedding[1] * 100 + height/2
    }));
    
    // Draw embedding space
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#embeddingGradient)");
    
    // Define gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "embeddingGradient");
    
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#667eea")
      .attr("stop-opacity", 0.1);
    
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#764ba2")
      .attr("stop-opacity", 0.1);
    
    // Draw connections between similar tokens
    projectedTokens.forEach((token1, i) => {
      projectedTokens.forEach((token2, j) => {
        if (i < j) {
          const distance = Math.sqrt(
            Math.pow(token1.x - token2.x, 2) + 
            Math.pow(token1.y - token2.y, 2)
          );
          
          if (distance < 150) {
            svg.append("line")
              .attr("x1", token1.x)
              .attr("y1", token1.y)
              .attr("x2", token2.x)
              .attr("y2", token2.y)
              .attr("stroke", "#888")
              .attr("stroke-width", Math.max(1, 5 - distance/30))
              .attr("opacity", Math.max(0.1, 0.8 - distance/150));
          }
        }
      });
    });
    
    // Draw token points
    projectedTokens.forEach((token, index) => {
      setTimeout(() => {
        const circle = svg.append("circle")
          .attr("cx", token.x)
          .attr("cy", token.y)
          .attr("r", 0)
          .attr("fill", token.color)
          .attr("stroke", "white")
          .attr("stroke-width", 2)
          .attr("opacity", 0);
        
        circle.transition()
          .duration(500)
          .attr("r", 12)
          .attr("opacity", 1);
        
        // Add token text
        svg.append("text")
          .attr("x", token.x)
          .attr("y", token.y - 20)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("fill", "#333")
          .attr("font-weight", "bold")
          .attr("opacity", 0)
          .text(token.text)
          .transition()
          .delay(300)
          .duration(300)
          .attr("opacity", 1);
      }, index * 200);
    });
  };

  // Draw attention visualization
  const drawAttentionVisualization = (tokenList, weights) => {
    const svg = d3.select(attentionRef.current);
    svg.selectAll("*").remove();
    
    const width = 600;
    const height = 400;
    const margin = 50;
    
    const size = tokenList.length;
    const cellSize = Math.min((width - 2 * margin) / size, (height - 2 * margin) / size);
    
    // Normalize attention weights
    const maxWeight = Math.max(...weights.flat());
    const normalizedWeights = weights.map(row => 
      row.map(weight => weight / maxWeight)
    );
    
    // Draw heatmap
    normalizedWeights.forEach((row, i) => {
      row.forEach((weight, j) => {
        const rect = svg.append("rect")
          .attr("x", margin + j * cellSize)
          .attr("y", margin + i * cellSize)
          .attr("width", 0)
          .attr("height", 0)
          .attr("fill", `rgba(255, 99, 132, ${weight})`)
          .attr("stroke", "white")
          .attr("stroke-width", 1);
        
        rect.transition()
          .delay((i + j) * 50)
          .duration(300)
          .attr("width", cellSize)
          .attr("height", cellSize);
      });
    });
    
    // Add token labels
    tokenList.forEach((token, i) => {
      // Row labels
      svg.append("text")
        .attr("x", margin - 10)
        .attr("y", margin + i * cellSize + cellSize/2)
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#333")
        .text(token.text);
      
      // Column labels
      svg.append("text")
        .attr("x", margin + i * cellSize + cellSize/2)
        .attr("y", margin - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#333")
        .attr("transform", `rotate(-45, ${margin + i * cellSize + cellSize/2}, ${margin - 10})`)
        .text(token.text);
    });
  };

  const reset = () => {
    setActiveStep(0);
    setMaxReachedStep(0);
    setTokens([]);
    setEncodedTokens([]);
    setEmbeddings([]);
    setAttentionWeights([]);
    setIsAnimating(false);
  };

  const jumpToStep = (stepIndex) => {
    if (stepIndex > maxReachedStep || isAnimating) return;
    
    setActiveStep(stepIndex);
    
    // Show appropriate data for the step
    const tokenList = tokenizeText(inputText);
    
    switch(stepIndex) {
      case 0:
        setTokens([]);
        setEncodedTokens([]);
        setEmbeddings([]);
        setAttentionWeights([]);
        break;
      case 1:
        setTokens(tokenList);
        setEncodedTokens([]);
        setEmbeddings([]);
        setAttentionWeights([]);
        break;
      case 2:
        setTokens(tokenList);
        setEncodedTokens(tokenList);
        setEmbeddings([]);
        setAttentionWeights([]);
        break;
      case 3:
        setTokens(tokenList);
        setEncodedTokens(tokenList);
        const embeddedTokens = generateEmbeddings(tokenList);
        setEmbeddings(embeddedTokens);
        setTimeout(() => drawEmbeddingVisualization(embeddedTokens), 100);
        setAttentionWeights([]);
        break;
      case 4:
        setTokens(tokenList);
        setEncodedTokens(tokenList);
        const embeddedTokens2 = generateEmbeddings(tokenList);
        setEmbeddings(embeddedTokens2);
        setTimeout(() => drawEmbeddingVisualization(embeddedTokens2), 100);
        const weights = generateAttentionWeights(tokenList);
        setAttentionWeights(weights);
        setTimeout(() => drawAttentionVisualization(tokenList, weights), 200);
        break;
    }
  };

  const steps = [
    { id: 'input', title: 'Text Input', icon: BookOpen },
    { id: 'tokenize', title: 'Tokenization', icon: Zap },
    { id: 'encode', title: 'Encoding', icon: Cpu },
    { id: 'embed', title: 'Embeddings', icon: Brain },
    { id: 'attention', title: 'Attention', icon: Eye }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity
            }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-16 h-16 text-purple-600" />
          </motion.div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6">
            AI Tokenization Process
          </h1>
          
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Discover how AI transforms human language into mathematical representations 
            that neural networks can understand and process.
          </p>
        </motion.div>

        {/* Clickable Progress Steps */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-center items-center space-x-4 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= maxReachedStep;
              const isCurrent = index === activeStep;
              const isClickable = !isAnimating && isCompleted;
              
              return (
                <React.Fragment key={step.id}>
                  <motion.div
                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-500 ${
                      isClickable ? 'cursor-pointer' : isCompleted ? 'cursor-pointer' : 'cursor-not-allowed'
                    } ${
                      isCurrent 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl scale-110' 
                        : isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    animate={{ 
                      scale: isCurrent ? [1, 1.05, 1] : 1,
                      boxShadow: isCurrent 
                        ? ['0 0 20px rgba(168, 85, 247, 0.4)', '0 0 40px rgba(168, 85, 247, 0.6)', '0 0 20px rgba(168, 85, 247, 0.4)']
                        : '0 0 0px rgba(0,0,0,0)'
                    }}
                    transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                    whileHover={isClickable ? { scale: 1.05, y: -2 } : {}}
                    whileTap={isClickable ? { scale: 0.95 } : {}}
                    onClick={() => {
                      if (isClickable) {
                        jumpToStep(index);
                      }
                    }}
                    title={isClickable ? `Click to view ${step.title}` : step.title}
                  >
                    <Icon className="w-8 h-8 mb-2" />
                    <span className="text-sm font-semibold">{step.title}</span>
                    {isClickable && (
                      <motion.div 
                        className="text-xs text-center mt-1 opacity-70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                      >
                        {isCurrent ? 'Current step' : 'Click to revisit'}
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {index < steps.length - 1 && (
                    <motion.div
                      animate={{ 
                        opacity: index < maxReachedStep ? 1 : 0.3,
                        scale: index < maxReachedStep ? 1 : 0.8
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <ArrowRight className={`w-6 h-6 ${
                        index < maxReachedStep ? 'text-green-500' : 'text-gray-300'
                      }`} />
                    </motion.div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter your text to tokenize:
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                placeholder="Type something interesting..."
                disabled={isAnimating}
              />
            </div>
            
            <div className="flex gap-3">
              <motion.button
                onClick={runAnimation}
                disabled={isAnimating}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5 mr-2" />
                {isAnimating ? 'Processing...' : 'Start Demo'}
              </motion.button>
              
              <motion.button
                onClick={reset}
                className="px-6 py-3 bg-gray-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Step Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Visualization Panel */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-6"
            layout
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-purple-600" />
              Live Visualization
            </h3>
            
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="raw-text"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl"
                >
                  <h4 className="text-xl font-semibold mb-4">Raw Text Input</h4>
                  <div className="text-2xl text-gray-800 font-mono bg-white p-4 rounded-lg shadow-inner">
                    "{inputText}"
                  </div>
                </motion.div>
              )}

              {activeStep >= 1 && tokens.length > 0 && (
                <motion.div
                  key="tokens"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <h4 className="text-lg font-semibold mb-3">Tokens:</h4>
                  <div className="flex flex-wrap gap-2">
                    {tokens.map((token, index) => (
                      <motion.div
                        key={token.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-2 rounded-lg text-white font-semibold shadow-lg"
                        style={{ backgroundColor: token.color }}
                      >
                        {token.text}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeStep >= 2 && encodedTokens.length > 0 && (
                <motion.div
                  key="encoded"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <h4 className="text-lg font-semibold mb-3">Token IDs:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {encodedTokens.map((token, index) => (
                      <motion.div
                        key={token.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
                      >
                        <span className="font-mono text-sm">{token.text}</span>
                        <span className="font-bold text-blue-600">#{token.tokenId}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeStep >= 3 && embeddings.length > 0 && (
                <motion.div
                  key="embeddings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6"
                >
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-500" />
                    Vector Embeddings (2D Projection)
                  </h4>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
                    <svg ref={embeddingRef} width="600" height="300" className="border rounded-lg bg-white shadow-inner"></svg>
                    <div className="mt-3 text-sm text-gray-600">
                      <p><strong>📍 What you're seeing:</strong> Each colored dot represents a token from your text, positioned based on semantic similarity. Connected dots have related meanings!</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep >= 4 && attentionWeights.length > 0 && (
                <motion.div
                  key="attention"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-red-500" />
                    Attention Heatmap
                  </h4>
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg border-2 border-red-200">
                    <svg ref={attentionRef} width="600" height="400" className="border rounded-lg bg-white shadow-inner"></svg>
                    <div className="mt-3 text-sm text-gray-600">
                      <p><strong>🔥 What you're seeing:</strong> Brighter colors show which words the AI "pays attention" to when processing each word. This is how AI understands context and relationships!</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="flex items-center"><div className="w-3 h-3 bg-red-200 rounded mr-2"></div>Low Attention</span>
                        <span className="flex items-center"><div className="w-3 h-3 bg-red-600 rounded mr-2"></div>High Attention</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Explanation Panel */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-6"
            layout
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-purple-600" />
              Step Explanation
            </h3>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {activeStep === 0 && (
                  <div>
                    <h4 className="text-xl font-semibold text-purple-600 mb-3 flex items-center">
                      💬 Chapter 1: The Human Language Mystery
                    </h4>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                        Imagine you're an AI seeing human text for the first time. You see: <code className="bg-gray-100 px-2 py-1 rounded text-purple-600">"{inputText}"</code>
                      </p>
                      <p className="text-gray-700 mb-4">
                        To you, this is just a mysterious string of symbols! Humans effortlessly understand 
                        meaning, emotions, and context from these squiggles, but how can a computer brain 
                        make sense of it all? 🤔
                      </p>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400 mb-4">
                        <h5 className="font-bold text-blue-800 mb-3 flex items-center">
                          🧠 The AI's Challenge:
                        </h5>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-semibold text-blue-700 mb-2">What Humans See:</p>
                            <ul className="text-sm space-y-1 text-blue-600">
                              <li>• Words with meanings</li>
                              <li>• Emotions and tone</li>
                              <li>• Context and relationships</li>
                              <li>• Intent and purpose</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold text-blue-700 mb-2">What AI Initially Sees:</p>
                            <ul className="text-sm space-y-1 text-blue-600">
                              <li>• Random character sequence</li>
                              <li>• No inherent structure</li>
                              <li>• No mathematical meaning</li>
                              <li>• Pure confusion! 😵</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 italic">
                        🚀 <strong>Next:</strong> Let's begin the magical transformation from human language to AI understanding...
                      </p>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div>
                    <h4 className="text-xl font-semibold text-purple-600 mb-3 flex items-center">
                      ⚙️ Chapter 2: Breaking the Code
                    </h4>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                        Just like how we break a complex puzzle into smaller pieces, AI breaks your text into 
                        <strong> tokens</strong> - meaningful chunks that it can work with! 🧩
                      </p>
                      <p className="text-gray-700 mb-4">
                        Look at the colorful tokens above! Each one represents a piece of your message that 
                        carries meaning. Sometimes it's a whole word, sometimes it's part of a word - 
                        the AI is smart about choosing the best way to split things up.
                      </p>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-400 mb-4">
                        <h5 className="font-bold text-green-800 mb-3 flex items-center">
                          🎯 Why This Magic Step Matters:
                        </h5>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <span className="text-green-600 font-bold">•</span>
                              <p className="text-sm text-green-700"><strong>Manageable Pieces:</strong> Like cutting a pizza into slices - easier to handle!</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="text-green-600 font-bold">•</span>
                              <p className="text-sm text-green-700"><strong>Smart Splitting:</strong> Handles new words by breaking them into known parts</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <span className="text-green-600 font-bold">•</span>
                              <p className="text-sm text-green-700"><strong>Meaning Preserved:</strong> Each token carries semantic information</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="text-green-600 font-bold">•</span>
                              <p className="text-sm text-green-700"><strong>Efficiency:</strong> Perfect size for AI processing</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="text-center">
                          <BlockMath math="\\text{Text Input} \\rightarrow [\\text{token}_1, \\text{token}_2, ..., \\text{token}_n]" />
                        </div>
                      </div>
                      <p className="text-gray-600 italic">
                        🚀 <strong>Next:</strong> Now that we have tokens, let's give each one a unique ID number...
                      </p>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div>
                    <h4 className="text-xl font-semibold text-purple-600 mb-3 flex items-center">
                      🔢 Chapter 3: The Great Translation
                    </h4>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                        Now comes the crucial bridge! 🌉 Each token gets a unique ID number from AI's massive 
                        "dictionary" (vocabulary). This is like giving every word in every language a unique 
                        passport number!
                      </p>
                      <p className="text-gray-700 mb-4">
                        Look at the Token IDs above - each of your words now has its own special number. 
                        The AI has a vocabulary of tens of thousands (sometimes millions!) of these numbers, 
                        each representing a different token it has learned.
                      </p>
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-l-4 border-yellow-400 mb-4">
                        <h5 className="font-bold text-yellow-800 mb-3 flex items-center">
                          🎭 The Encoding Theater:
                        </h5>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                            <span className="bg-yellow-200 px-3 py-1 rounded font-mono text-sm">"hello"</span>
                            <span className="text-yellow-600">→</span>
                            <span className="bg-yellow-400 px-3 py-1 rounded font-bold text-white">#1523</span>
                            <span className="text-sm text-gray-600">Unique ID in vocabulary</span>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                            <span className="bg-yellow-200 px-3 py-1 rounded font-mono text-sm">"world"</span>
                            <span className="text-yellow-600">→</span>
                            <span className="bg-yellow-400 px-3 py-1 rounded font-bold text-white">#2847</span>
                            <span className="text-sm text-gray-600">Different token, different ID</span>
                          </div>
                        </div>
                        <p className="text-sm text-yellow-700 mt-3 italic">
                          💡 Pro tip: Same words always get the same ID! This consistency is key to AI learning.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="text-center">
                          <BlockMath math="\text{token} \rightarrow \text{ID} \in \{1, 2, ..., 50,000+\}" />
                        </div>
                      </div>
                      <p className="text-gray-600 italic">
                        🚀 <strong>Next:</strong> Time to give these numbers some real mathematical superpowers...
                      </p>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div>
                    <h4 className="text-xl font-semibold text-purple-600 mb-3 flex items-center">
                      🧠 Chapter 4: The Meaning Space
                    </h4>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                        Here's where the REAL magic happens! ✨ Those simple ID numbers transform into 
                        <strong>vectors</strong> - mathematical arrows that capture the actual MEANING of words!
                      </p>
                      <p className="text-gray-700 mb-4">
                        Look at the beautiful visualization above! Each colored dot is one of your tokens, 
                        floating in "meaning space". Words that mean similar things cluster together, 
                        while different concepts spread apart. It's like a map of human language! 🗺️
                      </p>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-400 mb-4">
                        <h5 className="font-bold text-purple-800 mb-3 flex items-center">
                          🌌 The Embedding Universe:
                        </h5>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="bg-white p-3 rounded-lg">
                              <p className="font-semibold text-purple-700 mb-1">📍 Positioning Magic:</p>
                              <p className="text-sm text-purple-600">Similar words live in similar neighborhoods</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg">
                              <p className="font-semibold text-purple-700 mb-1">📊 High Dimensions:</p>
                              <p className="text-sm text-purple-600">Real embeddings have 100s-1000s of dimensions!</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="bg-white p-3 rounded-lg">
                              <p className="font-semibold text-purple-700 mb-1">🧮 Learned Relationships:</p>
                              <p className="text-sm text-purple-600">AI discovers patterns like "king - man + woman = queen"</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg">
                              <p className="font-semibold text-purple-700 mb-1">⚡ Computational Power:</p>
                              <p className="text-sm text-purple-600">Math operations reveal semantic relationships</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                          <p className="text-sm text-purple-800">
                            🤯 <strong>Mind-blowing fact:</strong> The AI learned these relationships just by reading millions of texts. 
                            No human told it that "happy" and "joyful" should be close together!
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="text-center">
                          <BlockMath math="\text{ID} \rightarrow \vec{embedding} \in \mathbb{R}^{512}" />
                          <p className="text-sm text-gray-600 mt-2">
                            🔍 What you see above is a 2D slice of a 512-dimensional meaning space!
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 italic">
                        🚀 <strong>Next:</strong> Now let's see how AI decides which words to focus on...
                      </p>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div>
                    <h4 className="text-xl font-semibold text-purple-600 mb-3 flex items-center">
                      👁️ Chapter 5: The Focus Engine
                    </h4>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                        The grand finale! 🎆 This is the <strong>attention mechanism</strong> - the AI's way of 
                        deciding "What should I focus on when understanding this word?"
                      </p>
                      <p className="text-gray-700 mb-4">
                        Look at that glowing heatmap above! It's like an X-ray of the AI's mind. When the AI 
                        processes the word "world", which other words does it pay attention to? Maybe "hello" 
                        to understand it's a greeting context? This is how AI builds understanding! 🧐
                      </p>
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border-l-4 border-red-400 mb-4">
                        <h5 className="font-bold text-red-800 mb-3 flex items-center">
                          🔍 The Attention Revolution:
                        </h5>
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg">
                              <p className="font-bold text-red-700 mb-2">🎯 Selective Focus:</p>
                              <p className="text-sm text-red-600">
                                Instead of processing words in isolation, AI looks at the WHOLE sentence 
                                to understand each part. Genius!
                              </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <p className="font-bold text-red-700 mb-2">🔗 Relationship Discovery:</p>
                              <p className="text-sm text-red-600">
                                Words that depend on each other light up the heatmap. 
                                "The cat sat on the MAT" - which "the" goes with "mat"?
                              </p>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg">
                            <p className="font-bold text-red-800 mb-2">🤯 The ChatGPT Connection:</p>
                            <p className="text-sm text-red-700">
                              This attention mechanism is THE secret sauce behind ChatGPT, GPT-4, and all modern 
                              language AI! It's called the "Transformer" architecture, and it changed everything.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="text-center">
                          <BlockMath math="\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V" />
                          <p className="text-sm text-gray-600 mt-2">
                            💫 This formula calculates exactly how much each word should pay attention to every other word!
                          </p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-300 mt-4">
                        <h5 className="font-bold text-green-800 mb-3 text-center">
                          🎉 Congratulations! You've witnessed the complete AI language pipeline!
                        </h5>
                        <p className="text-center text-green-700">
                          From your human words to mathematical understanding - you now know exactly how 
                          ChatGPT, Google Translate, and every modern AI processes language! 🤖✨
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Real-world Applications */}
        <motion.div 
          className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🌟 Real-World Applications
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Language Translation",
                description: "Google Translate uses tokenization to break down sentences across languages",
                example: "English → Tokens → French",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Chatbots & AI Assistants",
                description: "ChatGPT processes your messages through this exact tokenization pipeline",
                example: "Your question → Tokens → AI Response",
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "Search Engines",
                description: "Search queries are tokenized to understand intent and match relevant documents",
                example: "Search query → Tokens → Relevant results",
                color: "from-purple-500 to-pink-500"
              }
            ].map((app, index) => (
              <motion.div
                key={app.title}
                className={`bg-gradient-to-br ${app.color} p-6 rounded-xl text-white shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <h4 className="text-xl font-bold mb-3">{app.title}</h4>
                <p className="text-white/90 mb-3">{app.description}</p>
                <div className="bg-white/20 p-2 rounded font-mono text-sm">
                  {app.example}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TokenizationDemo;