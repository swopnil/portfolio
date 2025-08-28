import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Zap, Brain, Eye, Cpu, ArrowRight, BookOpen, Home, User, GraduationCap } from 'lucide-react';
import { BlockMath } from 'react-katex';
import * as d3 from 'd3';
import 'katex/dist/katex.min.css';

const TokenizationJourney = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [inputText, setInputText] = useState("Hello world! How are you today?");
  const [isAnimating, setIsAnimating] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [encodedTokens, setEncodedTokens] = useState([]);
  const [embeddings, setEmbeddings] = useState([]);
  const [attentionWeights, setAttentionWeights] = useState([]);
  const [totalPoints, setTotalPoints] = useState(75);
  const svgRef = useRef();
  const embeddingRef = useRef();
  const attentionRef = useRef();

  // Simulate tokenization process
  const tokenizeText = (text) => {
    const words = text.toLowerCase().split(/(\s+|[.!?])/);
    const tokenList = words.filter(word => word.trim()).map((word, index) => ({
      id: index,
      text: word,
      tokenId: Math.floor(Math.random() * 50000) + 1000,
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
    setTotalPoints(prev => prev + 100); // Award points for completion
  };

  // Draw embedding visualization
  const drawEmbeddingVisualization = (embeddedTokens) => {
    const svg = d3.select(embeddingRef.current);
    svg.selectAll("*").remove();
    
    const width = 500;
    const height = 300;
    
    // Project 3D embeddings to 2D
    const projectedTokens = embeddedTokens.map(token => ({
      ...token,
      x: token.embedding[0] * 80 + width/2,
      y: token.embedding[1] * 80 + height/2
    }));
    
    // Draw embedding space background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#embeddingGradient)")
      .attr("rx", 8);
    
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
          
          if (distance < 120) {
            svg.append("line")
              .attr("x1", token1.x)
              .attr("y1", token1.y)
              .attr("x2", token2.x)
              .attr("y2", token2.y)
              .attr("stroke", "#888")
              .attr("stroke-width", Math.max(1, 4 - distance/30))
              .attr("opacity", Math.max(0.1, 0.6 - distance/120));
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
          .attr("r", 10)
          .attr("opacity", 1);
        
        // Add token text
        svg.append("text")
          .attr("x", token.x)
          .attr("y", token.y - 18)
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
    
    const width = 500;
    const height = 300;
    const margin = 40;
    
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
          .attr("fill", `rgba(59, 130, 246, ${weight})`)
          .attr("stroke", "white")
          .attr("stroke-width", 1)
          .attr("rx", 2);
        
        rect.transition()
          .delay((i + j) * 50)
          .duration(300)
          .attr("width", cellSize)
          .attr("height", cellSize);
      });
    });
    
    // Add token labels
    tokenList.forEach((token, i) => {
      if (i < 8) { // Limit labels to prevent crowding
        // Row labels
        svg.append("text")
          .attr("x", margin - 5)
          .attr("y", margin + i * cellSize + cellSize/2)
          .attr("text-anchor", "end")
          .attr("alignment-baseline", "middle")
          .attr("font-size", "9px")
          .attr("fill", "#374151")
          .text(token.text.substring(0, 6));
        
        // Column labels
        svg.append("text")
          .attr("x", margin + i * cellSize + cellSize/2)
          .attr("y", margin - 8)
          .attr("text-anchor", "middle")
          .attr("font-size", "9px")
          .attr("fill", "#374151")
          .attr("transform", `rotate(-45, ${margin + i * cellSize + cellSize/2}, ${margin - 8})`)
          .text(token.text.substring(0, 6));
      }
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
    { id: 'tokenize', title: 'Tokenize', icon: Zap },
    { id: 'encode', title: 'Encode', icon: Cpu },
    { id: 'embed', title: 'Embed', icon: Brain },
    { id: 'attention', title: 'Attention', icon: Eye }
  ];

  return (
    <div className="flex flex-col h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-blue-100 p-4 flex justify-between items-center border-b border-blue-200">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 text-white p-2 rounded-lg">
            <Zap size={20} />
          </div>
          <h1 className="text-2xl font-bold text-blue-700">AI Tokenization Journey</h1>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-blue-800 font-semibold">AI Explorer</span>
          
          <div className="flex items-center">
            <GraduationCap className="text-yellow-500 mr-2" size={24} />
            <div className="text-sm">
              <span className="font-bold">{totalPoints}</span>
              <span className="text-gray-500"> pts</span>
            </div>
          </div>

          <button 
            className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-200 transition"
            onClick={() => window.history.back()}
          >
            <Home size={16} className="inline mr-2" />
            Back
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
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
                          ? 'bg-blue-500 text-white shadow-lg scale-110' 
                          : isCompleted
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                      whileHover={isClickable ? { scale: 1.05, y: -2 } : {}}
                      whileTap={isClickable ? { scale: 0.95 } : {}}
                      onClick={() => {
                        if (isClickable) {
                          jumpToStep(index);
                        }
                      }}
                    >
                      <Icon className="w-8 h-8 mb-2" />
                      <span className="text-sm font-semibold">{step.title}</span>
                    </motion.div>
                    
                    {index < steps.length - 1 && (
                      <motion.div
                        animate={{ 
                          opacity: index < maxReachedStep ? 1 : 0.3,
                          scale: index < maxReachedStep ? 1 : 0.8
                        }}
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
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter your text to tokenize:
                </label>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  placeholder="Type something interesting..."
                  disabled={isAnimating}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={runAnimation}
                  disabled={isAnimating}
                  className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {isAnimating ? 'Processing...' : 'Start Demo'}
                </button>
                
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Visualization and Explanation */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Visualization Panel */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Live Visualization</h3>
              
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="raw-text"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl"
                  >
                    <h4 className="text-lg font-semibold mb-4">Raw Text Input</h4>
                    <div className="text-xl text-gray-800 font-mono bg-white p-4 rounded-lg shadow-inner">
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
                          className="px-3 py-2 rounded-lg text-white font-semibold shadow-md"
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
                    <div className="grid grid-cols-2 gap-2">
                      {encodedTokens.slice(0, 8).map((token, index) => (
                        <motion.div
                          key={token.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex justify-between items-center p-2 bg-gray-100 rounded-lg text-sm"
                        >
                          <span className="font-mono">{token.text}</span>
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
                    <h4 className="text-lg font-semibold mb-3">Vector Embeddings</h4>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
                      <svg ref={embeddingRef} width="500" height="300" className="border rounded-lg bg-white shadow-inner mx-auto"></svg>
                      <div className="mt-3 text-xs text-gray-600">
                        <p><strong>📍</strong> Each dot represents a token positioned by semantic similarity</p>
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
                    <h4 className="text-lg font-semibold mb-3">Attention Heatmap</h4>
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg border-2 border-red-200">
                      <svg ref={attentionRef} width="500" height="300" className="border rounded-lg bg-white shadow-inner mx-auto"></svg>
                      <div className="mt-3 text-xs text-gray-600">
                        <p><strong>🔥</strong> Darker colors show stronger attention between words</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Explanation Panel */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Step Explanation</h3>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {activeStep === 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-3">🔤 Raw Text Input</h4>
                      <p className="text-gray-700 mb-4">
                        This is where it all begins! Your text: <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">"{inputText}"</code>
                      </p>
                      <p className="text-gray-600">
                        To an AI, this is just a sequence of characters with no inherent meaning. 
                        The challenge is transforming these symbols into mathematical representations 
                        that neural networks can process and understand.
                      </p>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-3">⚡ Tokenization</h4>
                      <p className="text-gray-700 mb-4">
                        Watch your text break into colorful tokens! Each piece represents a 
                        meaningful unit that AI can work with.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Why tokens?</strong> They're the perfect size - not too big, not too small. 
                          Words like "running" might become "run" + "ning" to help AI understand word patterns.
                        </p>
                      </div>
                      <div className="mt-3">
                        <BlockMath math="\\text{Text} \\rightarrow [\\text{token}_1, \\text{token}_2, ..., \\text{token}_n]" />
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-3">🔢 Token Encoding</h4>
                      <p className="text-gray-700 mb-4">
                        Each token gets a unique ID number from AI's vocabulary dictionary. 
                        This is like giving every word in the language a passport number!
                      </p>
                      <div className="bg-yellow-50 p-4 rounded-lg mb-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Fun fact:</strong> Modern AI models have vocabularies of 50,000+ tokens! 
                          Same tokens always get the same ID, ensuring consistency.
                        </p>
                      </div>
                      <div>
                        <BlockMath math="\\text{token} \\rightarrow \\text{ID} \\in \\{1, 2, ..., 50000+\\}" />
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-3">🧠 Vector Embeddings</h4>
                      <p className="text-gray-700 mb-4">
                        The real magic! Those ID numbers transform into vectors - mathematical arrows 
                        that capture the actual MEANING of words in high-dimensional space.
                      </p>
                      <div className="bg-purple-50 p-4 rounded-lg mb-3">
                        <p className="text-sm text-purple-800">
                          <strong>Amazing fact:</strong> Similar words cluster together naturally! 
                          The AI learned that "king - man + woman ≈ queen" just by reading text.
                        </p>
                      </div>
                      <div>
                        <BlockMath math="\\text{ID} \\rightarrow \\vec{embedding} \\in \\mathbb{R}^{512}" />
                      </div>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-3">👁️ Attention Mechanism</h4>
                      <p className="text-gray-700 mb-4">
                        The secret sauce behind ChatGPT! This shows how AI decides which words 
                        to "pay attention to" when processing each word. It's like AI's focus spotlight!
                      </p>
                      <div className="bg-red-50 p-4 rounded-lg mb-3">
                        <p className="text-sm text-red-800">
                          <strong>This changes everything:</strong> Instead of processing words in isolation, 
                          AI looks at the WHOLE sentence to understand each part. Revolutionary!
                        </p>
                      </div>
                      <div>
                        <BlockMath math="\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V" />
                      </div>
                      {maxReachedStep >= 4 && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                          <h5 className="font-bold text-green-800 mb-2 text-center">
                            🎉 Congratulations! Journey Complete!
                          </h5>
                          <p className="text-center text-green-700 text-sm">
                            You now understand exactly how AI processes language! 
                            This is the foundation of every modern AI system.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenizationJourney;