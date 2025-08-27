import React, { useState, useEffect, useRef } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { evaluate, derivative, parse } from 'mathjs';
import { TrendingUp, Zap, Target, Brain, Play } from 'lucide-react';

const CalculusForAI = ({ updateProgress }) => {
  const [activeSection, setActiveSection] = useState('derivatives');
  const [functionStr, setFunctionStr] = useState('x^2 + 2*x + 1');
  const [learningRate, setLearningRate] = useState(0.1);
  const [currentX, setCurrentX] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const svgRef = useRef();
  const gradientSvgRef = useRef();
  const backpropSvgRef = useRef();

  // Function visualization
  useEffect(() => {
    if (activeSection === 'derivatives') {
      drawFunctionAndDerivative();
    }
  }, [activeSection, functionStr]);

  // Gradient descent visualization
  useEffect(() => {
    if (activeSection === 'gradients') {
      drawGradientDescent();
    }
  }, [activeSection, learningRate, currentX]);

  // Neural network backprop visualization
  useEffect(() => {
    if (activeSection === 'backprop') {
      drawBackpropagation();
    }
  }, [activeSection]);

  const drawFunctionAndDerivative = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    
    const xScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([margin.left, width - margin.right]);
    
    const yScale = d3.scaleLinear()
      .domain([-10, 20])
      .range([height - margin.bottom, margin.top]);
    
    // Generate function points
    const points = [];
    const derivativePoints = [];
    
    try {
      const expr = parse(functionStr);
      const derivativeExpr = derivative(expr, 'x');
      
      for (let x = -5; x <= 5; x += 0.1) {
        try {
          const y = expr.evaluate({ x });
          const dy = derivativeExpr.evaluate({ x });
          
          if (isFinite(y) && isFinite(dy)) {
            points.push([xScale(x), yScale(y)]);
            derivativePoints.push([xScale(x), yScale(dy)]);
          }
        } catch (e) {
          // Skip invalid points
        }
      }
    } catch (error) {
      console.error('Function parsing error:', error);
      return;
    }
    
    // Draw axes
    svg.append("g")
      .attr("transform", `translate(0,${yScale(0)})`)
      .call(d3.axisBottom(xScale));
    
    svg.append("g")
      .attr("transform", `translate(${xScale(0)},0)`)
      .call(d3.axisLeft(yScale));
    
    // Draw grid
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height + margin.top + margin.bottom)
        .tickFormat("")
      );
    
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat("")
      );
    
    svg.selectAll(".grid line")
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 0.5);
    
    // Draw function
    if (points.length > 1) {
      const line = d3.line().curve(d3.curveCardinal);
      
      svg.append("path")
        .datum(points)
        .attr("fill", "none")
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 3)
        .attr("d", line);
    }
    
    // Draw derivative
    if (derivativePoints.length > 1) {
      const derivativeLine = d3.line().curve(d3.curveCardinal);
      
      svg.append("path")
        .datum(derivativePoints)
        .attr("fill", "none")
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("d", derivativeLine);
    }
    
    // Legend
    svg.append("text")
      .attr("x", width - 120)
      .attr("y", 40)
      .attr("fill", "#3b82f6")
      .attr("font-size", "14px")
      .text("f(x)");
    
    svg.append("text")
      .attr("x", width - 120)
      .attr("y", 60)
      .attr("fill", "#ef4444")
      .attr("font-size", "14px")
      .text("f'(x)");
    
    // Axis labels
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("x", -height/2)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("f(x)");
    
    svg.append("text")
      .attr("x", width/2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("x");
  };

  const drawGradientDescent = () => {
    const svg = d3.select(gradientSvgRef.current);
    svg.selectAll("*").remove();
    
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    
    const xScale = d3.scaleLinear()
      .domain([-3, 3])
      .range([margin.left, width - margin.right]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 15])
      .range([height - margin.bottom, margin.top]);
    
    // Quadratic function for visualization
    const f = (x) => x * x + 2;
    const df = (x) => 2 * x;
    
    // Draw function
    const functionPoints = [];
    for (let x = -3; x <= 3; x += 0.1) {
      functionPoints.push([xScale(x), yScale(f(x))]);
    }
    
    const line = d3.line().curve(d3.curveCardinal);
    
    svg.append("path")
      .datum(functionPoints)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 3)
      .attr("d", line);
    
    // Draw axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));
    
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));
    
    // Current point
    svg.append("circle")
      .attr("cx", xScale(currentX))
      .attr("cy", yScale(f(currentX)))
      .attr("r", 6)
      .attr("fill", "#ef4444");
    
    // Tangent line at current point
    const slope = df(currentX);
    const tangentLength = 1;
    const x1 = currentX - tangentLength;
    const x2 = currentX + tangentLength;
    const y1 = f(currentX) - slope * tangentLength;
    const y2 = f(currentX) + slope * tangentLength;
    
    svg.append("line")
      .attr("x1", xScale(x1))
      .attr("y1", yScale(y1))
      .attr("x2", xScale(x2))
      .attr("y2", yScale(y2))
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2);
    
    // Gradient arrow
    const arrowX = currentX - learningRate * slope;
    svg.append("line")
      .attr("x1", xScale(currentX))
      .attr("y1", yScale(f(currentX)))
      .attr("x2", xScale(arrowX))
      .attr("y2", yScale(f(currentX)))
      .attr("stroke", "#10b981")
      .attr("stroke-width", 3)
      .attr("marker-end", "url(#arrow)");
    
    // Define arrow marker
    svg.append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#10b981");
    
    // Labels
    svg.append("text")
      .attr("x", xScale(currentX))
      .attr("y", yScale(f(currentX)) - 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#ef4444")
      .text(`(${currentX.toFixed(2)}, ${f(currentX).toFixed(2)})`);
  };

  const drawBackpropagation = () => {
    const svg = d3.select(backpropSvgRef.current);
    svg.selectAll("*").remove();
    
    const width = 800;
    const height = 500;
    
    // Neural network structure
    const layers = [
      { x: 100, neurons: [{ y: 200 }, { y: 300 }] },
      { x: 300, neurons: [{ y: 150 }, { y: 250 }, { y: 350 }] },
      { x: 500, neurons: [{ y: 200 }, { y: 300 }] },
      { x: 700, neurons: [{ y: 250 }] }
    ];
    
    // Draw connections
    for (let i = 0; i < layers.length - 1; i++) {
      layers[i].neurons.forEach(neuron1 => {
        layers[i + 1].neurons.forEach(neuron2 => {
          svg.append("line")
            .attr("x1", neuron1.x || layers[i].x)
            .attr("y1", neuron1.y)
            .attr("x2", neuron2.x || layers[i + 1].x)
            .attr("y2", neuron2.y)
            .attr("stroke", "#d1d5db")
            .attr("stroke-width", 2);
        });
      });
    }
    
    // Draw neurons
    layers.forEach((layer, layerIndex) => {
      layer.neurons.forEach((neuron, neuronIndex) => {
        svg.append("circle")
          .attr("cx", layer.x)
          .attr("cy", neuron.y)
          .attr("r", 20)
          .attr("fill", layerIndex === 0 ? "#3b82f6" : 
                       layerIndex === layers.length - 1 ? "#ef4444" : 
                       "#10b981")
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);
      });
    });
    
    // Forward pass arrows
    for (let i = 0; i < layers.length - 1; i++) {
      svg.append("line")
        .attr("x1", layers[i].x + 30)
        .attr("y1", 100)
        .attr("x2", layers[i + 1].x - 30)
        .attr("y2", 100)
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 3)
        .attr("marker-end", "url(#forward-arrow)");
    }
    
    // Backward pass arrows
    for (let i = layers.length - 1; i > 0; i--) {
      svg.append("line")
        .attr("x1", layers[i].x - 30)
        .attr("y1", 450)
        .attr("x2", layers[i - 1].x + 30)
        .attr("y2", 450)
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 3)
        .attr("marker-end", "url(#backward-arrow)");
    }
    
    // Define arrow markers
    const defs = svg.append("defs");
    
    defs.append("marker")
      .attr("id", "forward-arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#3b82f6");
    
    defs.append("marker")
      .attr("id", "backward-arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#ef4444");
    
    // Labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 80)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#3b82f6")
      .text("Forward Pass");
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 480)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#ef4444")
      .text("Backward Pass (Backpropagation)");
    
    // Layer labels
    const layerNames = ["Input", "Hidden", "Hidden", "Output"];
    layers.forEach((layer, index) => {
      svg.append("text")
        .attr("x", layer.x)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#6b7280")
        .text(layerNames[index]);
    });
  };

  const performGradientDescentStep = () => {
    const f = (x) => x * x + 2;
    const df = (x) => 2 * x;
    
    const newX = currentX - learningRate * df(currentX);
    setCurrentX(newX);
  };

  const animateGradientDescent = () => {
    setIsAnimating(true);
    let x = 3;
    const interval = setInterval(() => {
      const df = (x) => 2 * x;
      x = x - learningRate * df(x);
      setCurrentX(x);
      
      if (Math.abs(x) < 0.01 || Math.abs(x) > 5) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 500);
  };

  const resetGradientDescent = () => {
    setCurrentX(3);
    setIsAnimating(false);
  };

  const sections = [
    { id: 'derivatives', title: 'Multivariable Calculus', icon: TrendingUp },
    { id: 'gradients', title: 'Gradient Descent', icon: Target },
    { id: 'backprop', title: 'Backpropagation', icon: Zap },
    { id: 'optimization', title: 'Optimization Landscapes', icon: Brain }
  ];

  const renderDerivativesSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Multivariable Calculus</h2>
        <p className="text-lg text-gray-600">Understanding derivatives and their applications in AI</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Function Visualizer</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Function f(x):</label>
            <input
              type="text"
              value={functionStr}
              onChange={(e) => setFunctionStr(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter function (e.g., x^2 + 2*x + 1)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use * for multiplication, ^ for powers, sin(), cos(), etc.
            </p>
          </div>
          
          <svg ref={svgRef} width="600" height="400" className="border rounded w-full"></svg>
          <p className="mt-2 text-sm text-gray-600">
            Blue: f(x), Red dashed: f'(x) (derivative)
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Key Concepts</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Chain Rule</h4>
              <BlockMath math="\frac{d}{dx}f(g(x)) = f'(g(x)) \cdot g'(x)" />
              <p className="text-sm text-gray-600 mt-2">
                Essential for backpropagation in neural networks
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Partial Derivatives</h4>
              <BlockMath math="\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h, y) - f(x, y)}{h}" />
              <p className="text-sm text-gray-600 mt-2">
                Rate of change with respect to one variable
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Gradient Vector</h4>
              <BlockMath math="\nabla f = \begin{pmatrix} \frac{\partial f}{\partial x_1} \\ \frac{\partial f}{\partial x_2} \\ \vdots \\ \frac{\partial f}{\partial x_n} \end{pmatrix}" />
              <p className="text-sm text-gray-600 mt-2">
                Points in direction of steepest increase
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold mb-3">🧠 AI Connection</h4>
        <p className="text-gray-700">
          Neural networks learn by computing gradients of the loss function with respect to weights. 
          The chain rule enables backpropagation, allowing us to efficiently compute these gradients 
          even in very deep networks with millions of parameters.
        </p>
      </div>
    </div>
  );

  const renderGradientSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Gradient Descent Visualization</h2>
        <p className="text-lg text-gray-600">See how optimization algorithms find minima</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Interactive Gradient Descent</h3>
          
          <div className="mb-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Learning Rate: {learningRate}</label>
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={performGradientDescentStep}
                disabled={isAnimating}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                One Step
              </button>
              <button
                onClick={animateGradientDescent}
                disabled={isAnimating}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                <Play className="w-4 h-4 inline mr-1" />
                Animate
              </button>
              <button
                onClick={resetGradientDescent}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Reset
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              Current position: x = {currentX.toFixed(3)}
            </div>
          </div>
          
          <svg ref={gradientSvgRef} width="600" height="400" className="border rounded w-full"></svg>
          <p className="mt-2 text-sm text-gray-600">
            Red point: current position, Green arrow: gradient step, Red line: tangent
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Gradient Descent Algorithm</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Update Rule</h4>
              <BlockMath math="x_{t+1} = x_t - \alpha \nabla f(x_t)" />
              <p className="text-sm text-gray-600">
                Where α is the learning rate
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Convergence</h4>
              <ul className="text-sm space-y-1">
                <li>• Too small α: slow convergence</li>
                <li>• Too large α: may overshoot minimum</li>
                <li>• Just right α: efficient convergence</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Variants</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>SGD:</strong> Use random subsets</li>
                <li>• <strong>Momentum:</strong> Add velocity term</li>
                <li>• <strong>Adam:</strong> Adaptive learning rates</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-semibold mb-2">💡 Key Insight</h4>
              <p className="text-sm">
                The negative gradient points toward the steepest descent direction. 
                By following this direction with small steps, we can find local minima 
                of complex functions, even in high-dimensional spaces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackpropSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Backpropagation Mathematics</h2>
        <p className="text-lg text-gray-600">How neural networks learn through gradient computation</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Neural Network Flow</h3>
        <svg ref={backpropSvgRef} width="800" height="500" className="border rounded w-full"></svg>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Forward Pass</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Layer Computation</h4>
              <BlockMath math="z^{(l)} = W^{(l)} a^{(l-1)} + b^{(l)}" />
              <BlockMath math="a^{(l)} = \sigma(z^{(l)})" />
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Loss Function</h4>
              <BlockMath math="L = \frac{1}{2}(y - \hat{y})^2" />
              <p className="text-sm text-gray-600">
                Where ŷ is the predicted output
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Backward Pass</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Output Layer Error</h4>
              <BlockMath math="\delta^{(L)} = \frac{\partial L}{\partial z^{(L)}}" />
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Hidden Layer Error</h4>
              <BlockMath math="\delta^{(l)} = (W^{(l+1)})^T \delta^{(l+1)} \odot \sigma'(z^{(l)})" />
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Weight Updates</h4>
              <BlockMath math="\frac{\partial L}{\partial W^{(l)}} = \delta^{(l)} (a^{(l-1)})^T" />
              <BlockMath math="\frac{\partial L}{\partial b^{(l)}} = \delta^{(l)}" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold mb-3">🎯 The Magic of Backprop</h4>
        <p className="text-gray-700">
          Backpropagation efficiently computes gradients by applying the chain rule recursively. 
          Instead of computing derivatives for each parameter independently (which would be computationally 
          prohibitive), it reuses intermediate computations, making training of deep networks feasible.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'derivatives':
        return renderDerivativesSection();
      case 'gradients':
        return renderGradientSection();
      case 'backprop':
        return renderBackpropSection();
      case 'optimization':
        return (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Optimization Landscapes</h2>
            <p className="text-lg text-gray-600">Coming soon...</p>
          </div>
        );
      default:
        return renderDerivativesSection();
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 relative">
      {/* Floating particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 80 - 40],
              y: [0, Math.random() * 80 - 40],
              rotate: [0, 360],
              scale: [1, Math.random() * 0.5 + 0.5, 1],
            }}
            transition={{
              duration: Math.random() * 8 + 4,
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

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity
            }}
            className="inline-block mb-6"
          >
            <TrendingUp className="w-16 h-16 text-green-600" />
          </motion.div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Calculus for AI
          </h1>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Master derivatives, gradients, and optimization algorithms that power machine learning
          </p>
        </motion.div>

        {/* Enhanced Navigation */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-xl border border-white/30">
              <div className="flex flex-wrap gap-2">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        activeSection === section.id 
                          ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg transform scale-105' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {section.title}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CalculusForAI;