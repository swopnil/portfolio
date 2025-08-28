import React, { useState, useRef } from 'react';
import {
  Layers, Brain, Grid3X3, RotateCcw, Shuffle, Droplets,
  Zap, Target, Settings, Info, Plus, Search, Filter,
  Copy, Trash2, Edit3, ChevronDown, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LayerLibrary = ({ onLayerAdd, selectedArchitecture }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['core']));
  const [layerDetails, setLayerDetails] = useState(null);
  const dragRef = useRef(null);

  const layerCategories = {
    core: {
      name: 'Core Layers',
      icon: Brain,
      layers: [
        {
          id: 'dense',
          name: 'Dense (Fully Connected)',
          type: 'Dense',
          description: 'Standard fully connected layer',
          params: { units: 128, activation: 'relu', useBias: true },
          configurable: ['units', 'activation', 'useBias', 'kernelInitializer'],
          complexity: 'Basic',
          color: '#3B82F6'
        },
        {
          id: 'input',
          name: 'Input Layer',
          type: 'Input',
          description: 'Network input specification',
          params: { shape: [784] },
          configurable: ['shape'],
          complexity: 'Basic',
          color: '#10B981'
        },
        {
          id: 'output',
          name: 'Output Layer',
          type: 'Output',
          description: 'Network output layer',
          params: { units: 10, activation: 'softmax' },
          configurable: ['units', 'activation'],
          complexity: 'Basic',
          color: '#F59E0B'
        }
      ]
    },
    convolutional: {
      name: 'Convolutional',
      icon: Grid3X3,
      layers: [
        {
          id: 'conv2d',
          name: 'Conv2D',
          type: 'Conv2D',
          description: '2D Convolutional layer',
          params: { filters: 32, kernelSize: [3, 3], strides: [1, 1], padding: 'valid', activation: 'relu' },
          configurable: ['filters', 'kernelSize', 'strides', 'padding', 'activation'],
          complexity: 'Intermediate',
          color: '#8B5CF6'
        },
        {
          id: 'maxpool2d',
          name: 'MaxPool2D',
          type: 'MaxPooling2D',
          description: '2D Max pooling layer',
          params: { poolSize: [2, 2], strides: [2, 2], padding: 'valid' },
          configurable: ['poolSize', 'strides', 'padding'],
          complexity: 'Basic',
          color: '#06B6D4'
        },
        {
          id: 'avgpool2d',
          name: 'AvgPool2D',
          type: 'AveragePooling2D',
          description: '2D Average pooling layer',
          params: { poolSize: [2, 2], strides: [2, 2], padding: 'valid' },
          configurable: ['poolSize', 'strides', 'padding'],
          complexity: 'Basic',
          color: '#0EA5E9'
        },
        {
          id: 'flatten',
          name: 'Flatten',
          type: 'Flatten',
          description: 'Flattens input to 1D',
          params: {},
          configurable: [],
          complexity: 'Basic',
          color: '#84CC16'
        }
      ]
    },
    recurrent: {
      name: 'Recurrent',
      icon: RotateCcw,
      layers: [
        {
          id: 'lstm',
          name: 'LSTM',
          type: 'LSTM',
          description: 'Long Short-Term Memory layer',
          params: { units: 50, returnSequences: false, returnState: false, dropout: 0.0 },
          configurable: ['units', 'returnSequences', 'returnState', 'dropout', 'recurrentDropout'],
          complexity: 'Advanced',
          color: '#EF4444'
        },
        {
          id: 'gru',
          name: 'GRU',
          type: 'GRU',
          description: 'Gated Recurrent Unit layer',
          params: { units: 50, returnSequences: false, dropout: 0.0 },
          configurable: ['units', 'returnSequences', 'dropout', 'recurrentDropout'],
          complexity: 'Advanced',
          color: '#F97316'
        },
        {
          id: 'simpleRnn',
          name: 'Simple RNN',
          type: 'SimpleRNN',
          description: 'Basic recurrent layer',
          params: { units: 32, returnSequences: false, dropout: 0.0 },
          configurable: ['units', 'returnSequences', 'dropout'],
          complexity: 'Intermediate',
          color: '#EC4899'
        }
      ]
    },
    attention: {
      name: 'Attention & Transformers',
      icon: Target,
      layers: [
        {
          id: 'multiHeadAttention',
          name: 'Multi-Head Attention',
          type: 'MultiHeadAttention',
          description: 'Multi-head self-attention mechanism',
          params: { numHeads: 8, keyDim: 64, dropout: 0.1 },
          configurable: ['numHeads', 'keyDim', 'dropout', 'useBias'],
          complexity: 'Advanced',
          color: '#7C3AED'
        },
        {
          id: 'layerNorm',
          name: 'Layer Normalization',
          type: 'LayerNormalization',
          description: 'Layer normalization',
          params: { epsilon: 1e-6, center: true, scale: true },
          configurable: ['epsilon', 'center', 'scale'],
          complexity: 'Intermediate',
          color: '#059669'
        },
        {
          id: 'positionEncoding',
          name: 'Position Encoding',
          type: 'PositionalEncoding',
          description: 'Positional encoding for transformers',
          params: { maxLength: 512, embeddingDim: 512 },
          configurable: ['maxLength', 'embeddingDim'],
          complexity: 'Advanced',
          color: '#DC2626'
        }
      ]
    },
    regularization: {
      name: 'Regularization',
      icon: Droplets,
      layers: [
        {
          id: 'dropout',
          name: 'Dropout',
          type: 'Dropout',
          description: 'Randomly sets input units to 0',
          params: { rate: 0.5 },
          configurable: ['rate', 'noiseShape', 'seed'],
          complexity: 'Basic',
          color: '#374151'
        },
        {
          id: 'batchNorm',
          name: 'Batch Normalization',
          type: 'BatchNormalization',
          description: 'Normalizes batch inputs',
          params: { momentum: 0.99, epsilon: 1e-3, center: true, scale: true },
          configurable: ['momentum', 'epsilon', 'center', 'scale'],
          complexity: 'Intermediate',
          color: '#6B7280'
        },
        {
          id: 'l1l2',
          name: 'L1L2 Regularization',
          type: 'ActivityRegularization',
          description: 'L1 and L2 activity regularization',
          params: { l1: 0.01, l2: 0.01 },
          configurable: ['l1', 'l2'],
          complexity: 'Intermediate',
          color: '#9CA3AF'
        }
      ]
    },
    activation: {
      name: 'Activation',
      icon: Zap,
      layers: [
        {
          id: 'relu',
          name: 'ReLU',
          type: 'ReLU',
          description: 'Rectified Linear Unit',
          params: { maxValue: null, negative_slope: 0.0, threshold: 0.0 },
          configurable: ['maxValue', 'negative_slope', 'threshold'],
          complexity: 'Basic',
          color: '#F59E0B'
        },
        {
          id: 'leakyRelu',
          name: 'Leaky ReLU',
          type: 'LeakyReLU',
          description: 'Leaky Rectified Linear Unit',
          params: { alpha: 0.3 },
          configurable: ['alpha'],
          complexity: 'Basic',
          color: '#F97316'
        },
        {
          id: 'softmax',
          name: 'Softmax',
          type: 'Softmax',
          description: 'Softmax activation',
          params: { axis: -1 },
          configurable: ['axis'],
          complexity: 'Basic',
          color: '#EF4444'
        },
        {
          id: 'tanh',
          name: 'Tanh',
          type: 'Tanh',
          description: 'Hyperbolic tangent',
          params: {},
          configurable: [],
          complexity: 'Basic',
          color: '#EC4899'
        }
      ]
    }
  };

  const handleDragStart = (e, layer) => {
    e.dataTransfer.setData('application/json', JSON.stringify(layer));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredLayers = Object.entries(layerCategories).reduce((acc, [categoryKey, category]) => {
    const filteredCategoryLayers = category.layers.filter(layer => {
      const matchesSearch = layer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           layer.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || categoryKey === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (filteredCategoryLayers.length > 0) {
      acc[categoryKey] = { ...category, layers: filteredCategoryLayers };
    }
    return acc;
  }, {});

  const LayerCard = ({ layer, category }) => {
    const IconComponent = layerCategories[category].icon;
    
    return (
      <motion.div
        className="bg-white rounded-lg border border-gray-200 p-3 cursor-move hover:shadow-md transition-all duration-200"
        draggable
        onDragStart={(e) => handleDragStart(e, layer)}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setLayerDetails(layer)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: layer.color }}
            />
            <h4 className="font-medium text-sm text-gray-900">{layer.name}</h4>
          </div>
          <div className="flex items-center space-x-1">
            <IconComponent className="w-4 h-4 text-gray-400" />
            <Info 
              className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                setLayerDetails(layer);
              }}
            />
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mb-2">{layer.description}</p>
        
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${
            layer.complexity === 'Basic' ? 'bg-green-100 text-green-700' :
            layer.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {layer.complexity}
          </span>
          
          <div className="flex items-center space-x-1">
            <Copy 
              className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                onLayerAdd({ ...layer, id: `${layer.id}_${Date.now()}` });
              }}
            />
            <Plus 
              className="w-3 h-3 text-gray-400 cursor-pointer hover:text-green-500"
              onClick={(e) => {
                e.stopPropagation();
                onLayerAdd(layer);
              }}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  const LayerDetailsModal = ({ layer, onClose }) => (
    <AnimatePresence>
      {layer && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{layer.name}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">{layer.description}</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Parameters</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  {Object.entries(layer.params).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-mono">{JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {layer.configurable.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Configurable</h4>
                  <div className="flex flex-wrap gap-2">
                    {layer.configurable.map(param => (
                      <span key={param} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  onLayerAdd(layer);
                  onClose();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Layer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="bg-gray-50 border-r border-gray-200 w-80 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            Layer Library
          </h2>
          <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search layers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {Object.entries(layerCategories).map(([key, category]) => (
              <option key={key} value={key}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Layer Categories */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredLayers).map(([categoryKey, category]) => (
          <div key={categoryKey} className="border-b border-gray-200">
            <button
              onClick={() => toggleCategory(categoryKey)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <category.icon className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">{category.name}</span>
                <span className="text-xs text-gray-500">({category.layers.length})</span>
              </div>
              {expandedCategories.has(categoryKey) ? 
                <ChevronDown className="w-4 h-4 text-gray-600" /> :
                <ChevronRight className="w-4 h-4 text-gray-600" />
              }
            </button>
            
            <AnimatePresence>
              {expandedCategories.has(categoryKey) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 space-y-2 bg-white">
                    {category.layers.map(layer => (
                      <LayerCard key={layer.id} layer={layer} category={categoryKey} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      <LayerDetailsModal layer={layerDetails} onClose={() => setLayerDetails(null)} />
    </div>
  );
};

export default LayerLibrary;