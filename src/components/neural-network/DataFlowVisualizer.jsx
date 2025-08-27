import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  GitBranch, Eye, Activity, Play, Pause, RotateCcw, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DataFlowVisualizer = ({ architecture }) => {
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [visualizationMode, setVisualizationMode] = useState('forward');
  const [showTensorShapes, setShowTensorShapes] = useState(true);
  const [showActivations, setShowActivations] = useState(true);
  const [showGradients, setShowGradients] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [layerOutputs, setLayerOutputs] = useState([]);
  const [tensorShapes, setTensorShapes] = useState([]);
  const [activationStats, setActivationStats] = useState([]);
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  const initializeVisualizationCallback = useCallback(() => {
    if (!architecture?.layers?.length) return;
    
    // Initialize tensor shapes based on architecture
    const shapes = [];
    let currentShape = [1, 2]; // Default input shape
    
    architecture.layers.forEach((layer, index) => {
      switch (layer.type) {
        case 'Dense':
          currentShape = [1, layer.config.units || 64];
          break;
        case 'Conv2D':
          // Simplified conv shape calculation
          currentShape = [1, layer.config.filters || 32, 28, 28];
          break;
        default:
          currentShape = [1, layer.config.units || 64];
      }
      
      shapes.push({
        layerIndex: index,
        inputShape: index === 0 ? [1, 2] : shapes[index - 1].outputShape,
        outputShape: currentShape,
        parameters: calculateLayerParameters(layer, shapes[index - 1]?.outputShape)
      });
    });
    
    setTensorShapes(shapes);
    generateSampleData(shapes);
  }, [architecture]);

  useEffect(() => {
    initializeVisualizationCallback();
  }, [initializeVisualizationCallback]);

  useEffect(() => {
    if (isPlaying && currentStep < getMaxSteps()) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000 / animationSpeed);
      return () => clearTimeout(timer);
    } else if (currentStep >= getMaxSteps()) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, animationSpeed]);


  const calculateLayerParameters = (layer, inputShape) => {
    switch (layer.type) {
      case 'Dense':
        const inputSize = inputShape ? inputShape[inputShape.length - 1] : 2;
        const outputSize = layer.config.units || 64;
        return inputSize * outputSize + outputSize;
      case 'Conv2D':
        const filters = layer.config.filters || 32;
        const kernelSize = layer.config.kernelSize || 3;
        return filters * kernelSize * kernelSize * 3 + filters;
      default:
        return 1000;
    }
  };

  const generateSampleData = useCallback((shapes) => {
    // Generate sample input data
    const sample = Array.from({ length: 2 }, () => Math.random() * 2 - 1);
    
    // Simulate forward pass
    simulateForwardPass(sample, shapes);
  }, [architecture]);

  const simulateForwardPass = useCallback((input, shapes) => {
    if (!architecture?.layers) return;
    
    const outputs = [];
    const stats = [];
    let currentOutput = input;
    
    architecture.layers.forEach((layer, index) => {
      // Simulate layer computation
      const layerOutput = simulateLayerComputation(layer, currentOutput);
      outputs.push(layerOutput);
      
      // Calculate activation statistics
      const mean = layerOutput.reduce((sum, val) => sum + val, 0) / layerOutput.length;
      const variance = layerOutput.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / layerOutput.length;
      
      stats.push({
        layerIndex: index,
        mean,
        std: Math.sqrt(variance),
        min: Math.min(...layerOutput),
        max: Math.max(...layerOutput),
        sparsity: layerOutput.filter(val => Math.abs(val) < 0.1).length / layerOutput.length
      });
      
      currentOutput = layerOutput;
    });
    
    setLayerOutputs(outputs);
    setActivationStats(stats);
  }, [architecture]);

  const simulateLayerComputation = (layer, input) => {
    switch (layer.type) {
      case 'Dense':
        const units = layer.config.units || 64;
        const output = Array.from({ length: units }, () => {
          const z = input.reduce((sum, val) => sum + val * (Math.random() - 0.5), 0) + Math.random() - 0.5;
          
          switch (layer.config.activation) {
            case 'relu':
              return Math.max(0, z);
            case 'sigmoid':
              return 1 / (1 + Math.exp(-z));
            case 'tanh':
              return Math.tanh(z);
            default:
              return z;
          }
        });
        return output;
        
      case 'Conv2D':
        // Simplified convolution simulation
        const filters = layer.config.filters || 32;
        return Array.from({ length: filters * 4 }, () => Math.random() * 2 - 1);
        
      default:
        return input;
    }
  };

  const getMaxSteps = () => {
    return architecture?.layers?.length * 2 || 0; // Forward + backward for each layer
  };

  const getCurrentLayerIndex = () => {
    return Math.floor(currentStep / 2);
  };

  const isBackwardPass = () => {
    return currentStep % 2 === 1;
  };

  const DataFlowCanvas = useMemo(() => (
    <div className="relative w-full h-96 bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        width={800}
        height={400}
      />
      
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 800 400"
      >
        <defs>
          <linearGradient id="dataFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
          </linearGradient>
          
          <linearGradient id="gradientFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Data flow visualization */}
        {architecture?.layers?.map((layer, index) => {
          const x = 100 + index * 150;
          const y = 200;
          const isActive = getCurrentLayerIndex() === index;
          const isCurrentFlow = currentStep >= index * 2;
          
          return (
            <g key={index}>
              {/* Layer representation */}
              <motion.rect
                x={x - 30}
                y={y - 40}
                width={60}
                height={80}
                rx={12}
                fill={isActive ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.1)"}
                stroke={isActive ? "#3b82f6" : "rgba(255, 255, 255, 0.3)"}
                strokeWidth={isActive ? 3 : 1}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  opacity: isCurrentFlow ? 1 : 0.5
                }}
              />
              
              {/* Layer label */}
              <text
                x={x}
                y={y + 60}
                textAnchor="middle"
                className="fill-white text-xs font-medium"
              >
                {layer.type}
              </text>
              
              {/* Tensor shape */}
              {showTensorShapes && tensorShapes[index] && (
                <text
                  x={x}
                  y={y + 75}
                  textAnchor="middle"
                  className="fill-gray-400 text-xs"
                >
                  {tensorShapes[index].outputShape.join('×')}
                </text>
              )}
              
              {/* Connection to next layer */}
              {index < architecture.layers.length - 1 && (
                <motion.line
                  x1={x + 30}
                  y1={y}
                  x2={x + 120}
                  y2={y}
                  stroke="url(#dataFlowGradient)"
                  strokeWidth={3}
                  opacity={isCurrentFlow ? 0.8 : 0.3}
                  animate={{
                    strokeDasharray: isCurrentFlow ? [5, 5] : [0, 0],
                    strokeDashoffset: isCurrentFlow ? [-10, 0] : [0, 0]
                  }}
                  transition={{
                    strokeDashoffset: {
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                />
              )}
              
              {/* Activation visualization */}
              {showActivations && activationStats[index] && (
                <g>
                  {layerOutputs[index]?.slice(0, 8).map((activation, neuronIndex) => (
                    <motion.circle
                      key={neuronIndex}
                      cx={x - 20 + (neuronIndex % 4) * 10}
                      cy={y - 20 + Math.floor(neuronIndex / 4) * 10}
                      r={3}
                      fill={activation > 0 ? "#3b82f6" : "#ef4444"}
                      opacity={Math.abs(activation) * 2}
                      animate={{
                        scale: isActive ? [1, 1.5, 1] : 1,
                        opacity: Math.abs(activation) * 2
                      }}
                      transition={{
                        scale: { duration: 0.5, repeat: Infinity }
                      }}
                    />
                  ))}
                </g>
              )}
              
              {/* Gradient flow visualization */}
              {showGradients && visualizationMode === 'backward' && isBackwardPass() && (
                <motion.line
                  x1={x + 120}
                  y1={y - 10}
                  x2={x + 30}
                  y2={y - 10}
                  stroke="url(#gradientFlowGradient)"
                  strokeWidth={2}
                  opacity={0.8}
                  strokeDasharray="3,3"
                  animate={{
                    strokeDashoffset: [-6, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
            </g>
          );
        })}
        
        {/* Data particles animation */}
        <AnimatePresence>
          {isPlaying && (
            <motion.circle
              r={4}
              fill="#60a5fa"
              initial={{ cx: 70, cy: 200, opacity: 0 }}
              animate={{
                cx: 100 + getCurrentLayerIndex() * 150,
                opacity: [0, 1, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </svg>
    </div>
  ), [architecture, currentStep, showTensorShapes, showActivations, showGradients, visualizationMode, tensorShapes, layerOutputs, activationStats, isPlaying]);

  const LayerInspector = useMemo(() => (
    <motion.div 
      className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Eye className="w-6 h-6 mr-2 text-cyan-400" />
        Layer Inspector
      </h3>
      
      {architecture?.layers && (
        <div className="space-y-4">
          <div className="flex space-x-2 mb-4">
            {architecture.layers.map((layer, index) => (
              <button
                key={index}
                onClick={() => setSelectedLayer(index)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedLayer === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Layer {index + 1}
              </button>
            ))}
          </div>
          
          {tensorShapes[selectedLayer] && (
            <div className="bg-gray-900 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Input Shape</div>
                  <div className="text-lg font-mono text-green-400">
                    [{tensorShapes[selectedLayer].inputShape?.join(', ') || 'N/A'}]
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Output Shape</div>
                  <div className="text-lg font-mono text-blue-400">
                    [{tensorShapes[selectedLayer].outputShape?.join(', ') || 'N/A'}]
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Parameters</div>
                <div className="text-lg font-mono text-purple-400">
                  {tensorShapes[selectedLayer].parameters.toLocaleString()}
                </div>
              </div>
              
              {activationStats[selectedLayer] && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-400">Mean Activation</div>
                    <div className="text-lg font-mono text-yellow-400">
                      {activationStats[selectedLayer].mean.toFixed(4)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Std Deviation</div>
                    <div className="text-lg font-mono text-orange-400">
                      {activationStats[selectedLayer].std.toFixed(4)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Sparsity</div>
                    <div className="text-lg font-mono text-red-400">
                      {(activationStats[selectedLayer].sparsity * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Range</div>
                    <div className="text-lg font-mono text-cyan-400">
                      [{activationStats[selectedLayer].min.toFixed(2)}, {activationStats[selectedLayer].max.toFixed(2)}]
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  ), [architecture, selectedLayer, tensorShapes, activationStats]);

  const ActivationHeatmap = useMemo(() => (
    <motion.div 
      className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Activity className="w-6 h-6 mr-2 text-orange-400" />
        Activation Heatmap
      </h3>
      
      {layerOutputs[selectedLayer] && (
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="grid grid-cols-8 gap-1 mb-4">
            {layerOutputs[selectedLayer].slice(0, 64).map((activation, index) => {
              const intensity = Math.abs(activation);
              const isPositive = activation > 0;
              
              return (
                <motion.div
                  key={index}
                  className={`w-4 h-4 rounded-sm ${
                    isPositive ? 'bg-blue-500' : 'bg-red-500'
                  }`}
                  style={{ opacity: intensity * 2 }}
                  animate={{
                    scale: intensity > 0.5 ? [1, 1.2, 1] : 1
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: intensity > 0.5 ? Infinity : 0
                  }}
                  title={`Neuron ${index}: ${activation.toFixed(4)}`}
                />
              );
            })}
          </div>
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>Negative</span>
            <span>Inactive</span>
            <span>Positive</span>
          </div>
          
          <div className="h-2 bg-gradient-to-r from-red-500 via-gray-600 to-blue-500 rounded-full mt-2" />
        </div>
      )}
    </motion.div>
  ), [selectedLayer, layerOutputs]);

  const ControlPanel = useMemo(() => (
    <motion.div 
      className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <GitBranch className="w-6 h-6 mr-2 text-green-400" />
          Data Flow Controls
        </h3>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </motion.button>
          
          <motion.button
            onClick={() => {
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Visualization Mode
          </label>
          <select
            value={visualizationMode}
            onChange={(e) => setVisualizationMode(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
          >
            <option value="forward">Forward Pass</option>
            <option value="backward">Backward Pass</option>
            <option value="both">Both Passes</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Animation Speed: {animationSpeed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={showTensorShapes}
              onChange={(e) => setShowTensorShapes(e.target.checked)}
              className="rounded border-gray-600"
            />
            <span>Show Tensor Shapes</span>
          </label>
          
          <label className="flex items-center space-x-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={showActivations}
              onChange={(e) => setShowActivations(e.target.checked)}
              className="rounded border-gray-600"
            />
            <span>Show Activations</span>
          </label>
          
          <label className="flex items-center space-x-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={showGradients}
              onChange={(e) => setShowGradients(e.target.checked)}
              className="rounded border-gray-600"
            />
            <span>Show Gradients</span>
          </label>
        </div>
        
        <div className="pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Current Step</div>
          <div className="text-2xl font-bold text-blue-400">
            {currentStep} / {getMaxSteps()}
          </div>
          <div className="text-sm text-gray-400">
            {getCurrentLayerIndex() < architecture?.layers?.length 
              ? `Layer ${getCurrentLayerIndex() + 1} - ${isBackwardPass() ? 'Backward' : 'Forward'}`
              : 'Complete'
            }
          </div>
        </div>
      </div>
    </motion.div>
  ), [isPlaying, visualizationMode, animationSpeed, showTensorShapes, showActivations, showGradients, currentStep, architecture]);

  if (!architecture || !architecture.layers || architecture.layers.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div 
          className="text-center text-gray-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-2xl font-semibold mb-2">No Network Architecture</h3>
          <p className="text-lg">Please build a network in the Architecture Designer first</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {DataFlowCanvas}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {ControlPanel}
          {LayerInspector}
          {ActivationHeatmap}
        </div>
      </div>
    </div>
  );
};

export default DataFlowVisualizer;