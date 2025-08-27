import React, { useState, useRef, useCallback, useEffect, useMemo, memo } from 'react';
import { 
  Plus, Trash2, Settings, Copy, Download, Upload, 
  Layers, Network, Cpu, Eye, Play, Square,
  ChevronDown, ChevronRight, Info, AlertCircle,
  Zap, Target, Maximize2, Minimize2
} from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

// Layer types library - moved outside component to prevent recreation
const layerTypes = [
  {
    type: 'Dense',
    name: 'Dense Layer',
    icon: Layers,
    description: 'Fully connected layer',
    defaultConfig: { units: 64, activation: 'relu' },
    inputs: 1,
    outputs: 1,
    color: 'from-blue-500 to-blue-600',
    category: 'Basic'
  },
  {
    type: 'Conv2D',
    name: 'Convolution 2D',
    icon: Network,
    description: 'Convolutional layer for images',
    defaultConfig: { filters: 32, kernelSize: 3, activation: 'relu' },
    inputs: 1,
    outputs: 1,
    color: 'from-green-500 to-green-600',
    category: 'CNN'
  },
  {
    type: 'LSTM',
    name: 'LSTM Layer',
    icon: Zap,
    description: 'Long Short-Term Memory',
    defaultConfig: { units: 50, returnSequences: false },
    inputs: 1,
    outputs: 1,
    color: 'from-purple-500 to-purple-600',
    category: 'RNN'
  },
  {
    type: 'Attention',
    name: 'Multi-Head Attention',
    icon: Eye,
    description: 'Self-attention mechanism',
    defaultConfig: { heads: 8, keyDim: 64 },
    inputs: 1,
    outputs: 1,
    color: 'from-pink-500 to-pink-600',
    category: 'Transformer'
  },
  {
    type: 'BatchNorm',
    name: 'Batch Normalization',
    icon: Target,
    description: 'Normalizes layer inputs',
    defaultConfig: { momentum: 0.99 },
    inputs: 1,
    outputs: 1,
    color: 'from-orange-500 to-orange-600',
    category: 'Normalization'
  },
  {
    type: 'Dropout',
    name: 'Dropout',
    icon: Square,
    description: 'Regularization layer',
    defaultConfig: { rate: 0.5 },
    inputs: 1,
    outputs: 1,
    color: 'from-red-500 to-red-600',
    category: 'Regularization'
  }
];

const NetworkBuilder = ({ architecture, onArchitectureChange }) => {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedLayer, setDraggedLayer] = useState(null);
  const [showLayerLibrary, setShowLayerLibrary] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [connectionMode, setConnectionMode] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef(null);
  const dragControls = useDragControls();

  const [layers, setLayers] = useState(architecture?.layers || []);
  const [connections, setConnections] = useState(architecture?.connections || []);

  const calculateParameters = useCallback(() => {
    return layers.reduce((total, layer) => {
      switch (layer.type) {
        case 'Dense':
          const prevLayer = layers[layer.id - 1];
          const inputSize = prevLayer ? prevLayer.config.units : 784; // Default input
          return total + (inputSize * layer.config.units) + layer.config.units;
        case 'Conv2D':
          return total + (layer.config.kernelSize * layer.config.kernelSize * layer.config.filters * 3) + layer.config.filters;
        default:
          return total + 1000; // Placeholder
      }
    }, 0);
  }, [layers]);

  const getInputShape = useCallback(() => {
    return layers.length > 0 ? layers[0].inputShape || [28, 28, 1] : null;
  }, [layers]);

  const getOutputShape = useCallback(() => {
    return layers.length > 0 ? layers[layers.length - 1].outputShape || [10] : null;
  }, [layers]);

  useEffect(() => {
    if (layers.length > 0 || connections.length > 0) {
      const newArchitecture = {
        layers,
        connections,
        parameters: calculateParameters(),
        inputShape: getInputShape(),
        outputShape: getOutputShape()
      };
      onArchitectureChange(newArchitecture);
    }
  }, [layers, connections, calculateParameters, getInputShape, getOutputShape, onArchitectureChange]);

  const addLayer = useCallback((layerType, position = null) => {
    const newLayer = {
      id: Date.now(),
      type: layerType.type,
      name: layerType.name,
      config: { ...layerType.defaultConfig },
      position: position || { 
        x: Math.random() * (canvasRef.current?.offsetWidth - 200) || 100, 
        y: Math.random() * (canvasRef.current?.offsetHeight - 100) || 100 
      },
      color: layerType.color,
      inputs: [],
      outputs: []
    };
    
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayer(newLayer.id);
  }, []);

  const removeLayer = useCallback((layerId) => {
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    setConnections(prev => prev.filter(conn => 
      conn.from !== layerId && conn.to !== layerId
    ));
    if (selectedLayer === layerId) {
      setSelectedLayer(null);
    }
  }, [selectedLayer]);

  const updateLayerPosition = useCallback((layerId, newPosition) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, position: newPosition }
        : layer
    ));
  }, []);

  const updateLayerConfig = useCallback((layerId, newConfig) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, config: { ...layer.config, ...newConfig } }
        : layer
    ));
  }, []);

  const addConnection = (fromLayerId, toLayerId) => {
    const newConnection = {
      id: Date.now(),
      from: fromLayerId,
      to: toLayerId
    };
    setConnections(prev => [...prev, newConnection]);
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    if (draggedLayer) {
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left - 100,
        y: e.clientY - rect.top - 40
      };
      addLayer(draggedLayer, position);
      setDraggedLayer(null);
      setIsDragging(false);
    }
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
  };

  const LayerNode = ({ layer }) => {
    const Icon = layerTypes.find(lt => lt.type === layer.type)?.icon || Layers;
    
    return (
      <motion.div
        className={`layer-node ${selectedLayer === layer.id ? 'selected' : ''} ${isDragging && draggedLayer?.id === layer.id ? 'dragging' : ''}`}
        style={{
          position: 'absolute',
          left: layer.position.x,
          top: layer.position.y,
          width: 200,
          minHeight: 80
        }}
        drag
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          updateLayerPosition(layer.id, {
            x: layer.position.x + info.offset.x,
            y: layer.position.y + info.offset.y
          });
        }}
        onClick={() => setSelectedLayer(layer.id)}
        whileHover={{ scale: 1.02 }}
        whileDrag={{ scale: 1.1, rotate: 2 }}
      >
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${layer.color} text-white shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{layer.type}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeLayer(layer.id);
              }}
              className="text-white/70 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-xs space-y-1 text-white/90">
            {Object.entries(layer.config).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}:</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
          
          {/* Connection points */}
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-300" />
          </div>
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-300" />
          </div>
        </div>
      </motion.div>
    );
  };

  const ConnectionLine = ({ connection }) => {
    const fromLayer = layers.find(l => l.id === connection.from);
    const toLayer = layers.find(l => l.id === connection.to);
    
    if (!fromLayer || !toLayer) return null;
    
    const startX = fromLayer.position.x + 200;
    const startY = fromLayer.position.y + 40;
    const endX = toLayer.position.x;
    const endY = toLayer.position.y + 40;
    
    const controlX1 = startX + 50;
    const controlY1 = startY;
    const controlX2 = endX - 50;
    const controlY2 = endY;
    
    return (
      <motion.path
        className="connection-line"
        d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
    );
  };

  const LayerLibrary = () => (
    <motion.div
      className={`layer-library right-sidebar fixed right-4 top-4 w-80 z-50 ${showLayerLibrary ? 'block' : 'hidden'}`}
      initial={{ x: 300 }}
      animate={{ x: showLayerLibrary ? 0 : 300 }}
      transition={{ duration: 0.3 }}
      style={{ maxHeight: 'calc(100vh - 2rem)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Layer Library</h3>
        <button
          onClick={() => setShowLayerLibrary(false)}
          className="text-gray-400 hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
        {layerTypes.map((layerType, index) => {
          const Icon = layerType.icon;
          
          return (
            <motion.div
              key={layerType.type}
              className="layer-item"
              draggable
              onDragStart={() => setDraggedLayer(layerType)}
              onDragEnd={() => setDraggedLayer(null)}
              onClick={() => addLayer(layerType)}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: -5 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${layerType.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{layerType.name}</div>
                  <div className="text-xs text-gray-400">{layerType.description}</div>
                  <div className="text-xs text-blue-400 mt-1">{layerType.category}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const LayerSettings = () => {
    const layer = layers.find(l => l.id === selectedLayer);
    if (!layer) return null;
    
    return (
      <motion.div
        className="layer-library left-sidebar fixed left-4 top-4 w-80 z-50"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Layer Settings</h3>
          <button
            onClick={() => setSelectedLayer(null)}
            className="text-gray-400 hover:text-white"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Layer Type
            </label>
            <div className={`p-3 rounded-lg bg-gradient-to-r ${layer.color} text-white`}>
              {layer.type}
            </div>
          </div>
          
          {Object.entries(layer.config).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                {key}
              </label>
              <input
                type={typeof value === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => {
                  const newValue = typeof value === 'number' 
                    ? parseFloat(e.target.value) || 0
                    : e.target.value;
                  updateLayerConfig(selectedLayer, { [key]: newValue });
                }}
                className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const ArchitectureSummary = () => (
    <motion.div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-lg rounded-2xl p-4 border border-gray-700 z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
    >
      <div className="flex items-center space-x-6 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{layers.length}</div>
          <div className="text-gray-400">Layers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{connections.length}</div>
          <div className="text-gray-400">Connections</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{calculateParameters().toLocaleString()}</div>
          <div className="text-gray-400">Parameters</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">
            {getInputShape() ? getInputShape().join('×') : 'N/A'}
          </div>
          <div className="text-gray-400">Input Shape</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`network-canvas w-full ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} relative overflow-hidden`}>
      {/* Toolbar */}
      <motion.div
        className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-lg rounded-2xl p-2 border border-gray-700 z-50"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowLayerLibrary(!showLayerLibrary)}
            className={`p-2 rounded-lg transition-colors ${showLayerLibrary ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
          >
            <Plus className="w-5 h-5" />
          </button>
          
          <div className="w-px h-6 bg-gray-600" />
          
          <button
            onClick={() => setConnections([])}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => {/* Auto-layout logic */}}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <Network className="w-5 h-5" />
          </button>
          
          <div className="w-px h-6 bg-gray-600" />
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full relative"
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="w-full h-full">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Connections SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {connections.map(connection => (
            <ConnectionLine key={connection.id} connection={connection} />
          ))}
        </svg>

        {/* Layer Nodes */}
        {layers.map(layer => (
          <LayerNode key={layer.id} layer={layer} />
        ))}

        {/* Empty State */}
        {layers.length === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center text-gray-400">
              <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-semibold mb-2">Build Your Neural Network</h3>
              <p className="text-lg mb-4">Drag layers from the library or click to add</p>
              <button
                onClick={() => setShowLayerLibrary(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Layer Library
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Layer Library */}
      <LayerLibrary />

      {/* Layer Settings */}
      <AnimatePresence>
        {selectedLayer && <LayerSettings />}
      </AnimatePresence>

      {/* Architecture Summary */}
      {layers.length > 0 && <ArchitectureSummary />}

      {/* Gradient overlay */}
      <div className="gradient-overlay" />
    </div>
  );
};

export default memo(NetworkBuilder);