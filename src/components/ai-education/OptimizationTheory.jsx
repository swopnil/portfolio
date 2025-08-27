import React, { useState, useEffect, useRef } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import * as d3 from 'd3';
import { Book, Target, Zap, TrendingUp, Play, Pause, RotateCcw } from 'lucide-react';

const OptimizationTheory = ({ updateProgress }) => {
  const [activeSection, setActiveSection] = useState('convex');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [learningRate, setLearningRate] = useState(0.1);
  const [algorithm, setAlgorithm] = useState('sgd');
  const [currentPoint, setCurrentPoint] = useState({ x: 2, y: 2 });
  const [history, setHistory] = useState([]);
  const svgRef = useRef();
  const comparisonSvgRef = useRef();
  const constrainedSvgRef = useRef();

  // Optimization landscape
  const objectiveFunction = (x, y) => {
    return 0.5 * (x * x + 2 * y * y) + 0.3 * Math.sin(3 * x) * Math.cos(2 * y);
  };

  const gradientFunction = (x, y) => {
    const dx = x + 0.9 * Math.cos(3 * x) * Math.cos(2 * y);
    const dy = 4 * y - 0.6 * Math.sin(3 * x) * Math.sin(2 * y);
    return { dx, dy };
  };

  // Draw optimization landscape
  useEffect(() => {
    if (activeSection === 'convex') {
      drawOptimizationLandscape();
    }
  }, [activeSection, currentPoint, history]);

  // Animation for gradient descent
  useEffect(() => {
    let interval;
    if (isAnimating) {
      interval = setInterval(() => {
        performOptimizationStep();
        setAnimationStep(prev => prev + 1);
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isAnimating, algorithm, learningRate, currentPoint]);

  const drawOptimizationLandscape = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    
    const xScale = d3.scaleLinear().domain([-3, 3]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([-3, 3]).range([height - margin.bottom, margin.top]);
    
    // Create contour data
    const contourData = [];
    const resolution = 0.2;
    for (let x = -3; x <= 3; x += resolution) {
      for (let y = -3; y <= 3; y += resolution) {
        contourData.push({
          x: x,
          y: y,
          z: objectiveFunction(x, y)
        });
      }
    }
    
    // Color scale for contours
    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain(d3.extent(contourData, d => d.z));
    
    // Draw contour plot
    contourData.forEach(d => {
      svg.append("rect")
        .attr("x", xScale(d.x))
        .attr("y", yScale(d.y))
        .attr("width", xScale(d.x + resolution) - xScale(d.x))
        .attr("height", yScale(d.y - resolution) - yScale(d.y))
        .attr("fill", colorScale(d.z))
        .attr("opacity", 0.6);
    });
    
    // Draw axes
    svg.append("g")
      .attr("transform", `translate(0,${yScale(0)})`)
      .call(d3.axisBottom(xScale));
    
    svg.append("g")
      .attr("transform", `translate(${xScale(0)},0)`)
      .call(d3.axisLeft(yScale));
    
    // Draw optimization path
    if (history.length > 1) {
      const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));
      
      svg.append("path")
        .datum(history)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .attr("d", line);
    }
    
    // Draw current point
    svg.append("circle")
      .attr("cx", xScale(currentPoint.x))
      .attr("cy", yScale(currentPoint.y))
      .attr("r", 8)
      .attr("fill", "red")
      .attr("stroke", "white")
      .attr("stroke-width", 2);
    
    // Draw gradient arrow
    const gradient = gradientFunction(currentPoint.x, currentPoint.y);
    const arrowLength = 0.5;
    const normalizedGradient = Math.sqrt(gradient.dx * gradient.dx + gradient.dy * gradient.dy);
    const arrowX = currentPoint.x - arrowLength * gradient.dx / normalizedGradient;
    const arrowY = currentPoint.y - arrowLength * gradient.dy / normalizedGradient;
    
    svg.append("line")
      .attr("x1", xScale(currentPoint.x))
      .attr("y1", yScale(currentPoint.y))
      .attr("x2", xScale(arrowX))
      .attr("y2", yScale(arrowY))
      .attr("stroke", "yellow")
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
      .attr("fill", "yellow");
    
    // Axis labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("x");
    
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("y");
    
    // Function value
    svg.append("text")
      .attr("x", 10)
      .attr("y", 30)
      .attr("font-size", "12px")
      .attr("fill", "black")
      .text(`f(${currentPoint.x.toFixed(2)}, ${currentPoint.y.toFixed(2)}) = ${objectiveFunction(currentPoint.x, currentPoint.y).toFixed(3)}`);
  };

  const performOptimizationStep = () => {
    const gradient = gradientFunction(currentPoint.x, currentPoint.y);
    let newPoint;
    
    switch (algorithm) {
      case 'sgd':
        newPoint = {
          x: currentPoint.x - learningRate * gradient.dx,
          y: currentPoint.y - learningRate * gradient.dy
        };
        break;
      case 'momentum':
        // Simplified momentum (would need velocity state in real implementation)
        newPoint = {
          x: currentPoint.x - learningRate * gradient.dx * 1.1,
          y: currentPoint.y - learningRate * gradient.dy * 1.1
        };
        break;
      case 'adam':
        // Simplified Adam (would need moment estimates in real implementation)
        newPoint = {
          x: currentPoint.x - learningRate * gradient.dx * 0.9,
          y: currentPoint.y - learningRate * gradient.dy * 0.9
        };
        break;
      default:
        newPoint = currentPoint;
    }
    
    setHistory(prev => [...prev, currentPoint]);
    setCurrentPoint(newPoint);
    
    // Stop if converged or out of bounds
    const gradientNorm = Math.sqrt(gradient.dx * gradient.dx + gradient.dy * gradient.dy);
    if (gradientNorm < 0.01 || Math.abs(newPoint.x) > 4 || Math.abs(newPoint.y) > 4) {
      setIsAnimating(false);
    }
  };

  const resetOptimization = () => {
    setCurrentPoint({ x: 2, y: 2 });
    setHistory([]);
    setAnimationStep(0);
    setIsAnimating(false);
  };

  const sections = [
    { id: 'convex', title: 'Convex Optimization', icon: Target },
    { id: 'gradient', title: 'Gradient Methods', icon: TrendingUp },
    { id: 'second-order', title: 'Second-Order Methods', icon: Zap },
    { id: 'constrained', title: 'Constrained Optimization', icon: Book }
  ];

  const renderConvexSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Convex Optimization</h2>
        <p className="text-lg text-gray-600">Understanding optimization landscapes</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Interactive Optimization Landscape</h3>
          
          <div className="mb-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Algorithm: {algorithm.toUpperCase()}
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="sgd">Stochastic Gradient Descent</option>
                <option value="momentum">Momentum</option>
                <option value="adam">Adam</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Learning Rate: {learningRate}
              </label>
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
                onClick={() => setIsAnimating(!isAnimating)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isAnimating ? <Pause className="w-4 h-4 inline mr-1" /> : <Play className="w-4 h-4 inline mr-1" />}
                {isAnimating ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetOptimization}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              Step: {animationStep}, Path length: {history.length}
            </div>
          </div>
          
          <svg ref={svgRef} width="600" height="400" className="border rounded w-full"></svg>
          <p className="mt-2 text-sm text-gray-600">
            Red dot: current position, White line: optimization path, Yellow arrow: gradient direction
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Convex Functions</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Definition</h4>
              <p className="text-sm text-gray-600 mb-2">
                A function f is convex if for all x, y and λ ∈ [0,1]:
              </p>
              <BlockMath math="f(\lambda x + (1-\lambda) y) \leq \lambda f(x) + (1-\lambda) f(y)" />
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Properties</h4>
              <ul className="text-sm space-y-1">
                <li>• Any local minimum is a global minimum</li>
                <li>• First-order condition: ∇f(x*) = 0</li>
                <li>• Second-order condition: ∇²f ⪰ 0</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Common Convex Functions</h4>
              <ul className="text-sm space-y-1">
                <li>• Linear: <InlineMath math="a^T x + b" /></li>
                <li>• Quadratic: <InlineMath math="x^T Q x" /> (Q ⪰ 0)</li>
                <li>• Norms: <InlineMath math="||x||_p" /> (p ≥ 1)</li>
                <li>• Log-sum-exp: <InlineMath math="\log(\sum e^{x_i})" /></li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-semibold mb-2">🎯 Why Convexity Matters</h4>
              <p className="text-sm">
                Convex optimization problems have guaranteed global optima and efficient 
                algorithms. Many ML problems (linear regression, SVMs, logistic regression) 
                can be formulated as convex optimization problems.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold mb-3">🧠 ML Applications</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold mb-2">Convex Problems:</h5>
            <ul className="space-y-1">
              <li>• Linear/Ridge Regression</li>
              <li>• Logistic Regression</li>
              <li>• Support Vector Machines</li>
              <li>• LASSO Regularization</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Non-Convex Problems:</h5>
            <ul className="space-y-1">
              <li>• Neural Networks</li>
              <li>• Matrix Factorization</li>
              <li>• K-means Clustering</li>
              <li>• Deep Learning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGradientSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Gradient Methods</h2>
        <p className="text-lg text-gray-600">First-order optimization algorithms</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Gradient Descent Variants</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Vanilla Gradient Descent</h4>
              <BlockMath math="x_{k+1} = x_k - \alpha \nabla f(x_k)" />
              <ul className="text-sm space-y-1 mt-2">
                <li>• Simple and intuitive</li>
                <li>• Can be slow on ill-conditioned problems</li>
                <li>• Sensitive to learning rate choice</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Momentum</h4>
              <BlockMath math="v_{k+1} = \beta v_k + (1-\beta) \nabla f(x_k)" />
              <BlockMath math="x_{k+1} = x_k - \alpha v_{k+1}" />
              <ul className="text-sm space-y-1 mt-2">
                <li>• Accelerates in consistent directions</li>
                <li>• Dampens oscillations</li>
                <li>• Typically β = 0.9</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Adam (Adaptive Moments)</h4>
              <BlockMath math="m_{k+1} = \beta_1 m_k + (1-\beta_1) \nabla f(x_k)" />
              <BlockMath math="v_{k+1} = \beta_2 v_k + (1-\beta_2) (\nabla f(x_k))^2" />
              <BlockMath math="x_{k+1} = x_k - \alpha \frac{\hat{m}_{k+1}}{\sqrt{\hat{v}_{k+1}} + \epsilon}" />
              <ul className="text-sm space-y-1 mt-2">
                <li>• Adapts learning rate per parameter</li>
                <li>• Combines momentum and RMSprop</li>
                <li>• Very popular in deep learning</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Convergence Analysis</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Convergence Rates</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Strongly Convex:</strong> Linear convergence O(ρᵏ)</p>
                <p><strong>Convex:</strong> Sublinear convergence O(1/k)</p>
                <p><strong>Non-convex:</strong> To critical points</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Step Size Selection</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>Fixed:</strong> α constant</li>
                <li>• <strong>Diminishing:</strong> αₖ → 0, Σαₖ = ∞</li>
                <li>• <strong>Line Search:</strong> Backtracking, Exact</li>
                <li>• <strong>Adaptive:</strong> Based on gradient history</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Stochastic Variants</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>SGD:</strong> Single sample gradient</li>
                <li>• <strong>Mini-batch:</strong> Small batch average</li>
                <li>• <strong>Variance Reduction:</strong> SVRG, SAGA</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded">
              <h4 className="font-semibold mb-2">⚡ Practical Tips</h4>
              <ul className="text-sm space-y-1">
                <li>• Start with learning rate 0.01 or 0.001</li>
                <li>• Use learning rate schedules</li>
                <li>• Monitor gradient norms</li>
                <li>• Try different optimizers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecondOrderSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Second-Order Methods</h2>
        <p className="text-lg text-gray-600">Using curvature information for faster convergence</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Newton's Method</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Update Rule</h4>
              <BlockMath math="x_{k+1} = x_k - (\nabla^2 f(x_k))^{-1} \nabla f(x_k)" />
              <p className="text-sm text-gray-600">
                Uses second-order Taylor approximation
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Advantages</h4>
              <ul className="text-sm space-y-1">
                <li>• Quadratic convergence near optimum</li>
                <li>• Scale-invariant</li>
                <li>• No learning rate tuning</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Disadvantages</h4>
              <ul className="text-sm space-y-1">
                <li>• O(n³) complexity per iteration</li>
                <li>• Requires positive definite Hessian</li>
                <li>• Not suitable for large-scale problems</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Quasi-Newton Methods</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">BFGS Algorithm</h4>
              <BlockMath math="B_{k+1} = B_k + \frac{y_k y_k^T}{y_k^T s_k} - \frac{B_k s_k s_k^T B_k}{s_k^T B_k s_k}" />
              <p className="text-sm text-gray-600">
                Approximates Hessian using gradient differences
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">L-BFGS</h4>
              <ul className="text-sm space-y-1">
                <li>• Limited-memory version of BFGS</li>
                <li>• Stores only recent gradient pairs</li>
                <li>• O(n) memory complexity</li>
                <li>• Popular for large-scale optimization</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Natural Gradients</h4>
              <BlockMath math="x_{k+1} = x_k - \alpha F^{-1} \nabla f(x_k)" />
              <p className="text-sm text-gray-600">
                Uses Fisher information matrix F
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded">
              <h4 className="font-semibold mb-2">🔬 Modern Variants</h4>
              <ul className="text-sm space-y-1">
                <li>• K-FAC: Kronecker approximation</li>
                <li>• Shampoo: Preconditioning for deep learning</li>
                <li>• AdaHessian: Hessian-based adaptive methods</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConstrainedSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Constrained Optimization</h2>
        <p className="text-lg text-gray-600">Optimization with equality and inequality constraints</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Lagrangian Methods</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Problem Formulation</h4>
              <div className="text-sm space-y-1">
                <p>Minimize: f(x)</p>
                <p>Subject to: gᵢ(x) = 0, hⱼ(x) ≤ 0</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Lagrangian</h4>
              <BlockMath math="L(x, \lambda, \mu) = f(x) + \sum_i \lambda_i g_i(x) + \sum_j \mu_j h_j(x)" />
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">KKT Conditions</h4>
              <ul className="text-sm space-y-1">
                <li>• Stationarity: ∇ₓL = 0</li>
                <li>• Primal feasibility: gᵢ(x) = 0, hⱼ(x) ≤ 0</li>
                <li>• Dual feasibility: μⱼ ≥ 0</li>
                <li>• Complementary slackness: μⱼhⱼ(x) = 0</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Solution Methods</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Penalty Methods</h4>
              <BlockMath math="P(x) = f(x) + \frac{\rho}{2} \sum_i g_i(x)^2 + \frac{\rho}{2} \sum_j \max(0, h_j(x))^2" />
              <p className="text-sm text-gray-600">
                Convert constrained to unconstrained problem
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Interior Point Methods</h4>
              <ul className="text-sm space-y-1">
                <li>• Stay strictly inside feasible region</li>
                <li>• Use barrier functions</li>
                <li>• Polynomial-time algorithms</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Sequential Quadratic Programming</h4>
              <ul className="text-sm space-y-1">
                <li>• Solve sequence of quadratic subproblems</li>
                <li>• Approximate Hessian of Lagrangian</li>
                <li>• Superlinear convergence</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-semibold mb-2">🎯 ML Applications</h4>
              <ul className="text-sm space-y-1">
                <li>• Support Vector Machines (SVM)</li>
                <li>• Portfolio optimization</li>
                <li>• Neural network training with constraints</li>
                <li>• Fairness-constrained learning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'convex':
        return renderConvexSection();
      case 'gradient':
        return renderGradientSection();
      case 'second-order':
        return renderSecondOrderSection();
      case 'constrained':
        return renderConstrainedSection();
      default:
        return renderConvexSection();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === section.id 
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {section.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default OptimizationTheory;