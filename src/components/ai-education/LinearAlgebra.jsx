import React, { useState, useEffect, useRef } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { evaluate, matrix, multiply, add, subtract, transpose, det, inv } from 'mathjs';
import { Calculator, Play, RotateCcw, Eye, BookOpen, Sparkles, Zap } from 'lucide-react';

const LinearAlgebra = ({ updateProgress }) => {
  const [activeSection, setActiveSection] = useState('vectors');
  const [matrixA, setMatrixA] = useState([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState([[2, 0], [1, 3]]);
  const [operation, setOperation] = useState('multiply');
  const [result, setResult] = useState(null);
  const svgRef = useRef();
  const transformSvgRef = useRef();

  // Vector visualization
  useEffect(() => {
    if (activeSection === 'vectors') {
      drawVectorSpace();
    }
  }, [activeSection]);

  // Matrix transformation visualization
  useEffect(() => {
    if (activeSection === 'transformations') {
      drawMatrixTransformation();
    }
  }, [activeSection, matrixA]);

  const drawVectorSpace = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = 400;
    const height = 400;
    const margin = 50;
    
    // Create scales
    const xScale = d3.scaleLinear().domain([-5, 5]).range([margin, width - margin]);
    const yScale = d3.scaleLinear().domain([-5, 5]).range([height - margin, margin]);
    
    // Draw axes
    svg.append("g")
      .append("line")
      .attr("x1", xScale(-5))
      .attr("x2", xScale(5))
      .attr("y1", yScale(0))
      .attr("y2", yScale(0))
      .attr("stroke", "#666")
      .attr("stroke-width", 1);
      
    svg.append("g")
      .append("line")
      .attr("x1", xScale(0))
      .attr("x2", xScale(0))
      .attr("y1", yScale(-5))
      .attr("y2", yScale(5))
      .attr("stroke", "#666")
      .attr("stroke-width", 1);
    
    // Draw grid
    for (let i = -5; i <= 5; i++) {
      if (i !== 0) {
        svg.append("line")
          .attr("x1", xScale(i))
          .attr("x2", xScale(i))
          .attr("y1", yScale(-5))
          .attr("y2", yScale(5))
          .attr("stroke", "#eee")
          .attr("stroke-width", 0.5);
          
        svg.append("line")
          .attr("x1", xScale(-5))
          .attr("x2", xScale(5))
          .attr("y1", yScale(i))
          .attr("y2", yScale(i))
          .attr("stroke", "#eee")
          .attr("stroke-width", 0.5);
      }
    }
    
    // Draw vectors
    const vectors = [
      { x: 3, y: 2, color: "#3b82f6", label: "u" },
      { x: 1, y: 4, color: "#ef4444", label: "v" },
      { x: 4, y: 6, color: "#10b981", label: "u+v" }
    ];
    
    vectors.forEach(vector => {
      // Arrow line
      svg.append("line")
        .attr("x1", xScale(0))
        .attr("x2", xScale(vector.x))
        .attr("y1", yScale(0))
        .attr("y2", yScale(vector.y))
        .attr("stroke", vector.color)
        .attr("stroke-width", 3)
        .attr("marker-end", "url(#arrowhead)");
      
      // Vector label
      svg.append("text")
        .attr("x", xScale(vector.x) + 10)
        .attr("y", yScale(vector.y) - 10)
        .attr("fill", vector.color)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .text(vector.label);
    });
    
    // Define arrow marker
    svg.append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .append("path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#999");
  };

  const drawMatrixTransformation = () => {
    const svg = d3.select(transformSvgRef.current);
    svg.selectAll("*").remove();
    
    const width = 800;
    const height = 400;
    const margin = 50;
    
    // Original space (left)
    const leftXScale = d3.scaleLinear().domain([-3, 3]).range([margin, width/2 - 20]);
    const leftYScale = d3.scaleLinear().domain([-3, 3]).range([height - margin, margin]);
    
    // Transformed space (right)  
    const rightXScale = d3.scaleLinear().domain([-6, 6]).range([width/2 + 20, width - margin]);
    const rightYScale = d3.scaleLinear().domain([-6, 6]).range([height - margin, margin]);
    
    // Draw original grid
    drawGrid(svg, leftXScale, leftYScale, "#e0e0e0");
    drawAxes(svg, leftXScale, leftYScale);
    
    // Draw transformed grid
    drawGrid(svg, rightXScale, rightYScale, "#e0e0e0");
    drawAxes(svg, rightXScale, rightYScale);
    
    // Original unit vectors
    const unitVectors = [
      { x: 1, y: 0, color: "#3b82f6", label: "e₁" },
      { x: 0, y: 1, color: "#ef4444", label: "e₂" }
    ];
    
    // Draw original vectors
    unitVectors.forEach(vector => {
      drawVector(svg, leftXScale, leftYScale, 0, 0, vector.x, vector.y, vector.color, vector.label);
    });
    
    // Transform vectors
    const transformedVectors = unitVectors.map(vector => {
      const transformed = multiply(matrix(matrixA), matrix([[vector.x], [vector.y]]));
      return {
        x: transformed.get([0, 0]),
        y: transformed.get([1, 0]),
        color: vector.color,
        label: `T(${vector.label})`
      };
    });
    
    // Draw transformed vectors
    transformedVectors.forEach(vector => {
      drawVector(svg, rightXScale, rightYScale, 0, 0, vector.x, vector.y, vector.color, vector.label);
    });
    
    // Labels
    svg.append("text")
      .attr("x", width/4)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text("Original Space");
      
    svg.append("text")
      .attr("x", 3*width/4)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text("Transformed Space");
  };

  const drawGrid = (svg, xScale, yScale, color) => {
    for (let i = -5; i <= 5; i++) {
      svg.append("line")
        .attr("x1", xScale(i))
        .attr("x2", xScale(i))
        .attr("y1", yScale(-5))
        .attr("y2", yScale(5))
        .attr("stroke", color)
        .attr("stroke-width", 0.5);
        
      svg.append("line")
        .attr("x1", xScale(-5))
        .attr("x2", xScale(5))
        .attr("y1", yScale(i))
        .attr("y2", yScale(i))
        .attr("stroke", color)
        .attr("stroke-width", 0.5);
    }
  };

  const drawAxes = (svg, xScale, yScale) => {
    svg.append("line")
      .attr("x1", xScale(-5))
      .attr("x2", xScale(5))
      .attr("y1", yScale(0))
      .attr("y2", yScale(0))
      .attr("stroke", "#666")
      .attr("stroke-width", 2);
      
    svg.append("line")
      .attr("x1", xScale(0))
      .attr("x2", xScale(0))
      .attr("y1", yScale(-5))
      .attr("y2", yScale(5))
      .attr("stroke", "#666")
      .attr("stroke-width", 2);
  };

  const drawVector = (svg, xScale, yScale, x1, y1, x2, y2, color, label) => {
    svg.append("line")
      .attr("x1", xScale(x1))
      .attr("x2", xScale(x2))
      .attr("y1", yScale(y1))
      .attr("y2", yScale(y2))
      .attr("stroke", color)
      .attr("stroke-width", 3)
      .attr("marker-end", "url(#arrowhead)");
    
    svg.append("text")
      .attr("x", xScale(x2) + 10)
      .attr("y", yScale(y2) - 10)
      .attr("fill", color)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text(label);
  };

  const performMatrixOperation = () => {
    try {
      const mA = matrix(matrixA);
      const mB = matrix(matrixB);
      let res;
      
      switch (operation) {
        case 'multiply':
          res = multiply(mA, mB);
          break;
        case 'add':
          res = add(mA, mB);
          break;
        case 'subtract':
          res = subtract(mA, mB);
          break;
        case 'transpose':
          res = transpose(mA);
          break;
        case 'inverse':
          res = inv(mA);
          break;
        case 'determinant':
          res = det(mA);
          break;
        default:
          res = mA;
      }
      
      setResult(res);
    } catch (error) {
      setResult({ error: error.message });
    }
  };

  const updateMatrixCell = (matrix, row, col, value, setMatrix) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrix(newMatrix);
  };

  const sections = [
    { id: 'vectors', title: 'Vector Spaces & Operations', icon: Calculator },
    { id: 'matrices', title: 'Matrix Operations', icon: Play },
    { id: 'transformations', title: 'Linear Transformations', icon: RotateCcw },
    { id: 'eigenvalues', title: 'Eigenvalues & Eigenvectors', icon: Eye },
    { id: 'applications', title: 'AI Applications', icon: BookOpen }
  ];

  const renderVectorSection = () => (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="text-center"
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="inline-block mb-4"
        >
          <Sparkles className="w-12 h-12 text-blue-500" />
        </motion.div>
        
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Vector Spaces & Operations
        </h2>
        <p className="text-xl text-gray-600">Understanding the foundation of linear algebra</p>
      </motion.div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div 
          className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/30"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-blue-500" />
              Interactive Vector Visualization
            </h3>
            <div className="relative">
              <svg ref={svgRef} width="400" height="400" className="border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50"></svg>
              <motion.div 
                className="absolute top-2 right-2 bg-blue-100 px-2 py-1 rounded-lg text-xs font-semibold text-blue-700"
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Live Demo
              </motion.div>
            </div>
            <motion.p 
              className="mt-6 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <strong>Interactive Elements:</strong> Vectors u (blue), v (red), and their sum u+v (green) in 2D space
            </motion.p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/30"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Calculator className="w-6 h-6 mr-2 text-indigo-500" />
            Vector Operations
          </h3>
          
          <div className="space-y-6">
            {[
              {
                title: "Vector Addition",
                formula: "\\vec{u} + \\vec{v} = \\begin{pmatrix} u_1 + v_1 \\\\ u_2 + v_2 \\end{pmatrix}",
                color: "from-blue-400 to-blue-600"
              },
              {
                title: "Dot Product", 
                formula: "\\vec{u} \\cdot \\vec{v} = u_1v_1 + u_2v_2 = |\\vec{u}||\\vec{v}|\\cos\\theta",
                color: "from-green-400 to-green-600"
              },
              {
                title: "Vector Magnitude",
                formula: "|\\vec{v}| = \\sqrt{v_1^2 + v_2^2}",
                color: "from-purple-400 to-purple-600"
              }
            ].map((operation, index) => (
              <motion.div
                key={operation.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.2 }}
                className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center mb-3"
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${operation.color} mr-3`}></div>
                  <h4 className="font-bold text-gray-800">{operation.title}</h4>
                </motion.div>
                <div className="bg-white p-3 rounded-lg">
                  <BlockMath math={operation.formula} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 p-8 rounded-2xl shadow-xl border border-blue-200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.01 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="inline-block mb-4"
        >
          <span className="text-3xl">🧠</span>
        </motion.div>
        
        <h4 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          Connection to AI
        </h4>
        
        <motion.p 
          className="text-lg text-gray-700 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          In neural networks, each neuron's input is a weighted sum of previous layer outputs - 
          essentially a <strong className="text-blue-600">dot product</strong> between weight and input vectors. 
          Understanding vector operations is fundamental to understanding how neural networks process information.
        </motion.p>
        
        <motion.div 
          className="mt-6 grid md:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[
            { icon: "⚡", title: "Fast Computation", desc: "Vector operations enable parallel processing" },
            { icon: "📐", title: "Geometric Intuition", desc: "Vectors represent directions and magnitudes" },
            { icon: "🎯", title: "Feature Representation", desc: "Data points as vectors in high-dimensional space" }
          ].map((point, index) => (
            <motion.div
              key={point.title}
              className="bg-white/60 backdrop-blur-sm p-4 rounded-xl text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-2xl mb-2">{point.icon}</div>
              <div className="font-semibold text-gray-800">{point.title}</div>
              <div className="text-sm text-gray-600 mt-1">{point.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const renderMatrixSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Matrix Operations</h2>
        <p className="text-lg text-gray-600">Interactive matrix calculator with step-by-step solutions</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Matrix A</h3>
          <div className="grid grid-cols-2 gap-2">
            {matrixA.map((row, i) =>
              row.map((cell, j) => (
                <input
                  key={`A-${i}-${j}`}
                  type="number"
                  value={cell}
                  onChange={(e) => updateMatrixCell(matrixA, i, j, e.target.value, setMatrixA)}
                  className="w-full p-2 border rounded text-center"
                />
              ))
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Matrix B</h3>
          <div className="grid grid-cols-2 gap-2">
            {matrixB.map((row, i) =>
              row.map((cell, j) => (
                <input
                  key={`B-${i}-${j}`}
                  type="number"
                  value={cell}
                  onChange={(e) => updateMatrixCell(matrixB, i, j, e.target.value, setMatrixB)}
                  className="w-full p-2 border rounded text-center"
                />
              ))
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Operation</h3>
          <select 
            value={operation} 
            onChange={(e) => setOperation(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="multiply">A × B</option>
            <option value="add">A + B</option>
            <option value="subtract">A - B</option>
            <option value="transpose">Transpose A</option>
            <option value="inverse">Inverse A</option>
            <option value="determinant">Det(A)</option>
          </select>
          
          <button
            onClick={performMatrixOperation}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Calculate
          </button>
          
          {result && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Result:</h4>
              {result.error ? (
                <p className="text-red-600">{result.error}</p>
              ) : (
                <div className="bg-gray-100 p-3 rounded">
                  <pre className="text-sm">{
                    typeof result === 'object' && result._data ? 
                      JSON.stringify(result._data, null, 2) : 
                      result.toString()
                  }</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold mb-3">💡 Key Concepts</h4>
        <ul className="space-y-2 text-gray-700">
          <li>• Matrix multiplication represents composition of linear transformations</li>
          <li>• The determinant tells us about area/volume scaling and invertibility</li>
          <li>• Matrix inverse is crucial for solving linear systems</li>
          <li>• In neural networks, each layer applies a matrix transformation to inputs</li>
        </ul>
      </div>
    </div>
  );

  const renderTransformationSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Linear Transformations</h2>
        <p className="text-lg text-gray-600">Visualizing how matrices transform space</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Transformation Visualization</h3>
        <svg ref={transformSvgRef} width="800" height="400" className="border rounded w-full"></svg>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Matrix A transforms the unit vectors e₁ and e₂ to show how the entire coordinate system changes
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Common Transformations</h3>
          <div className="space-y-3">
            <button
              onClick={() => setMatrixA([[2, 0], [0, 2]])}
              className="w-full text-left p-3 border rounded hover:bg-gray-50"
            >
              <strong>Scaling:</strong> [[2, 0], [0, 2]]
            </button>
            <button
              onClick={() => setMatrixA([[Math.cos(Math.PI/4), -Math.sin(Math.PI/4)], [Math.sin(Math.PI/4), Math.cos(Math.PI/4)]])}
              className="w-full text-left p-3 border rounded hover:bg-gray-50"
            >
              <strong>Rotation (45°):</strong> cos/sin matrix
            </button>
            <button
              onClick={() => setMatrixA([[1, 0.5], [0, 1]])}
              className="w-full text-left p-3 border rounded hover:bg-gray-50"
            >
              <strong>Shear:</strong> [[1, 0.5], [0, 1]]
            </button>
            <button
              onClick={() => setMatrixA([[1, 0], [0, -1]])}
              className="w-full text-left p-3 border rounded hover:bg-gray-50"
            >
              <strong>Reflection:</strong> [[1, 0], [0, -1]]
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Mathematical Foundation</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Linear Transformation</h4>
              <BlockMath math="T(\vec{x}) = A\vec{x}" />
            </div>
            <div>
              <h4 className="font-medium mb-2">Properties</h4>
              <ul className="text-sm space-y-1">
                <li>• <InlineMath math="T(\vec{u} + \vec{v}) = T(\vec{u}) + T(\vec{v})" /></li>
                <li>• <InlineMath math="T(c\vec{u}) = cT(\vec{u})" /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'vectors':
        return renderVectorSection();
      case 'matrices':
        return renderMatrixSection();
      case 'transformations':
        return renderTransformationSection();
      case 'eigenvalues':
        return (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Eigenvalues & Eigenvectors</h2>
            <p className="text-lg text-gray-600">Coming soon...</p>
          </div>
        );
      case 'applications':
        return (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Applications</h2>
            <p className="text-lg text-gray-600">Coming soon...</p>
          </div>
        );
      default:
        return renderVectorSection();
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      {/* Floating particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
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
            <Calculator className="w-16 h-16 text-blue-600" />
          </motion.div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Linear Algebra Deep Dive
          </h1>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Explore the mathematical foundation of AI through interactive visualizations and hands-on calculations
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
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
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

export default LinearAlgebra;