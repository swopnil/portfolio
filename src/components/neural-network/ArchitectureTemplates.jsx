import React, { useState } from 'react';
import {
  Grid, Brain, Eye, MessageSquare, BarChart, Layers,
  Download, Upload, Star, Clock, Users, TrendingUp,
  Search, Filter, Tag, ExternalLink, Copy, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ArchitectureTemplates = ({ onTemplateLoad, onTemplateCreate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');

  const architectureTemplates = {
    basic: {
      name: 'Basic Models',
      icon: Brain,
      templates: [
        {
          id: 'basic_mlp',
          name: 'Basic MLP',
          description: 'Simple multi-layer perceptron for classification',
          complexity: 'Beginner',
          category: 'basic',
          useCases: ['Image Classification', 'Tabular Data'],
          architecture: {
            layers: [
              { type: 'Input', params: { shape: [784] } },
              { type: 'Dense', params: { units: 128, activation: 'relu' } },
              { type: 'Dropout', params: { rate: 0.2 } },
              { type: 'Dense', params: { units: 64, activation: 'relu' } },
              { type: 'Dense', params: { units: 10, activation: 'softmax' } }
            ]
          },
          performance: { accuracy: 0.85, trainTime: '2 min', parameters: '101K' },
          tags: ['classification', 'dense', 'beginner'],
          popularity: 95,
          author: 'Neural Net Templates',
          created: '2024-01-15'
        },
        {
          id: 'simple_cnn',
          name: 'Simple CNN',
          description: 'Basic convolutional neural network for image processing',
          complexity: 'Beginner',
          category: 'basic',
          useCases: ['Image Classification', 'Computer Vision'],
          architecture: {
            layers: [
              { type: 'Input', params: { shape: [28, 28, 1] } },
              { type: 'Conv2D', params: { filters: 32, kernelSize: [3, 3], activation: 'relu' } },
              { type: 'MaxPooling2D', params: { poolSize: [2, 2] } },
              { type: 'Conv2D', params: { filters: 64, kernelSize: [3, 3], activation: 'relu' } },
              { type: 'MaxPooling2D', params: { poolSize: [2, 2] } },
              { type: 'Flatten' },
              { type: 'Dense', params: { units: 64, activation: 'relu' } },
              { type: 'Dense', params: { units: 10, activation: 'softmax' } }
            ]
          },
          performance: { accuracy: 0.92, trainTime: '5 min', parameters: '93K' },
          tags: ['cnn', 'vision', 'beginner'],
          popularity: 88,
          author: 'Neural Net Templates',
          created: '2024-01-20'
        }
      ]
    },
    computer_vision: {
      name: 'Computer Vision',
      icon: Eye,
      templates: [
        {
          id: 'resnet_mini',
          name: 'Mini ResNet',
          description: 'Simplified ResNet architecture with residual connections',
          complexity: 'Intermediate',
          category: 'computer_vision',
          useCases: ['Image Classification', 'Feature Extraction'],
          architecture: {
            layers: [
              { type: 'Input', params: { shape: [32, 32, 3] } },
              { type: 'Conv2D', params: { filters: 16, kernelSize: [3, 3], padding: 'same', activation: 'relu' } },
              { type: 'BatchNormalization' },
              // Residual Block 1
              { type: 'Conv2D', params: { filters: 16, kernelSize: [3, 3], padding: 'same', activation: 'relu' } },
              { type: 'BatchNormalization' },
              { type: 'Conv2D', params: { filters: 16, kernelSize: [3, 3], padding: 'same' } },
              // Skip connection would be added here
              { type: 'MaxPooling2D', params: { poolSize: [2, 2] } },
              { type: 'Conv2D', params: { filters: 32, kernelSize: [3, 3], padding: 'same', activation: 'relu' } },
              { type: 'BatchNormalization' },
              { type: 'GlobalAveragePooling2D' },
              { type: 'Dense', params: { units: 10, activation: 'softmax' } }
            ]
          },
          performance: { accuracy: 0.94, trainTime: '15 min', parameters: '270K' },
          tags: ['resnet', 'residual', 'vision'],
          popularity: 82,
          author: 'Research Team',
          created: '2024-02-01'
        },
        {
          id: 'vgg_mini',
          name: 'Mini VGG',
          description: 'Simplified VGG-style architecture',
          complexity: 'Intermediate',
          category: 'computer_vision',
          useCases: ['Image Classification', 'Transfer Learning'],
          architecture: {
            layers: [
              { type: 'Input', params: { shape: [64, 64, 3] } },
              { type: 'Conv2D', params: { filters: 32, kernelSize: [3, 3], padding: 'same', activation: 'relu' } },
              { type: 'Conv2D', params: { filters: 32, kernelSize: [3, 3], padding: 'same', activation: 'relu' } },
              { type: 'MaxPooling2D', params: { poolSize: [2, 2] } },
              { type: 'Conv2D', params: { filters: 64, kernelSize: [3, 3], padding: 'same', activation: 'relu' } },
              { type: 'Conv2D', params: { filters: 64, kernelSize: [3, 3], padding: 'same', activation: 'relu' } },
              { type: 'MaxPooling2D', params: { poolSize: [2, 2] } },
              { type: 'Conv2D', params: { filters: 128, kernelSize: [3, 3], padding: 'same', activation: 'relu' } },
              { type: 'Conv2D', params: { filters: 128, kernelSize: [3, 3], padding: 'same', activation: 'relu' } },
              { type: 'MaxPooling2D', params: { poolSize: [2, 2] } },
              { type: 'Flatten' },
              { type: 'Dense', params: { units: 256, activation: 'relu' } },
              { type: 'Dropout', params: { rate: 0.5 } },
              { type: 'Dense', params: { units: 10, activation: 'softmax' } }
            ]
          },
          performance: { accuracy: 0.91, trainTime: '12 min', parameters: '890K' },
          tags: ['vgg', 'deep', 'vision'],
          popularity: 75,
          author: 'Research Team',
          created: '2024-02-05'
        }
      ]
    },
    nlp: {
      name: 'Natural Language Processing',
      icon: MessageSquare,
      templates: [
        {
          id: 'text_classifier',
          name: 'Text Classifier',
          description: 'LSTM-based text classification model',
          complexity: 'Intermediate',
          category: 'nlp',
          useCases: ['Sentiment Analysis', 'Text Classification'],
          architecture: {
            layers: [
              { type: 'Input', params: { shape: [100] } },
              { type: 'Embedding', params: { inputDim: 10000, outputDim: 128 } },
              { type: 'LSTM', params: { units: 64, returnSequences: true } },
              { type: 'Dropout', params: { rate: 0.3 } },
              { type: 'LSTM', params: { units: 32 } },
              { type: 'Dense', params: { units: 16, activation: 'relu' } },
              { type: 'Dense', params: { units: 1, activation: 'sigmoid' } }
            ]
          },
          performance: { accuracy: 0.87, trainTime: '8 min', parameters: '1.2M' },
          tags: ['lstm', 'text', 'classification'],
          popularity: 70,
          author: 'NLP Team',
          created: '2024-02-10'
        }
      ]
    },
    advanced: {
      name: 'Advanced Architectures',
      icon: TrendingUp,
      templates: [
        {
          id: 'simple_transformer',
          name: 'Simple Transformer',
          description: 'Basic transformer architecture for sequence modeling',
          complexity: 'Advanced',
          category: 'advanced',
          useCases: ['Sequence Modeling', 'Attention Mechanisms'],
          architecture: {
            layers: [
              { type: 'Input', params: { shape: [50, 128] } },
              { type: 'PositionalEncoding', params: { maxLength: 50, embeddingDim: 128 } },
              { type: 'MultiHeadAttention', params: { numHeads: 8, keyDim: 16 } },
              { type: 'LayerNormalization' },
              { type: 'Dense', params: { units: 256, activation: 'relu' } },
              { type: 'Dense', params: { units: 128 } },
              { type: 'LayerNormalization' },
              { type: 'GlobalAveragePooling1D' },
              { type: 'Dense', params: { units: 10, activation: 'softmax' } }
            ]
          },
          performance: { accuracy: 0.93, trainTime: '25 min', parameters: '2.8M' },
          tags: ['transformer', 'attention', 'advanced'],
          popularity: 85,
          author: 'Advanced AI Lab',
          created: '2024-02-15'
        }
      ]
    }
  };

  const categories = [
    { key: 'all', name: 'All Templates', icon: Grid },
    { key: 'basic', name: 'Basic', icon: Brain },
    { key: 'computer_vision', name: 'Computer Vision', icon: Eye },
    { key: 'nlp', name: 'NLP', icon: MessageSquare },
    { key: 'advanced', name: 'Advanced', icon: TrendingUp }
  ];

  const sortOptions = [
    { key: 'popularity', name: 'Popularity' },
    { key: 'name', name: 'Name' },
    { key: 'complexity', name: 'Complexity' },
    { key: 'created', name: 'Date Created' }
  ];

  const getAllTemplates = () => {
    return Object.values(architectureTemplates).flatMap(category => category.templates);
  };

  const getFilteredTemplates = () => {
    let templates = getAllTemplates();

    // Filter by category
    if (selectedCategory !== 'all') {
      templates = templates.filter(template => template.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort templates
    templates.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'complexity':
          const complexityOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return complexityOrder[a.complexity] - complexityOrder[b.complexity];
        case 'created':
          return new Date(b.created) - new Date(a.created);
        default:
          return 0;
      }
    });

    return templates;
  };

  const TemplateCard = ({ template }) => (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
      whileHover={{ y: -4 }}
      onClick={() => setSelectedTemplate(template)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
          <p className="text-gray-600 text-sm">{template.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-600">{template.popularity}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {template.tags.map(tag => (
          <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div className="text-center">
          <div className="text-gray-500">Accuracy</div>
          <div className="font-semibold">{(template.performance.accuracy * 100).toFixed(1)}%</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Train Time</div>
          <div className="font-semibold">{template.performance.trainTime}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Parameters</div>
          <div className="font-semibold">{template.performance.parameters}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs px-3 py-1 rounded-full ${
          template.complexity === 'Beginner' ? 'bg-green-100 text-green-700' :
          template.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {template.complexity}
        </span>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTemplateLoad(template.architecture);
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center space-x-1"
          >
            <Play className="w-3 h-3" />
            <span>Load</span>
          </button>
          <Copy 
            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(JSON.stringify(template.architecture, null, 2));
            }}
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Architecture Templates</h2>
        <p className="text-gray-600">Pre-built neural network architectures for common tasks</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category.key} value={category.key}>{category.name}</option>
          ))}
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sortOptions.map(option => (
            <option key={option.key} value={option.key}>Sort by {option.name}</option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredTemplates().map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {/* Template Details Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h3>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Architecture Layers</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {selectedTemplate.architecture.layers.map((layer, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="font-mono">{layer.type}</span>
                        <span className="text-gray-600">{Object.keys(layer.params).length} params</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Use Cases</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.useCases.map(useCase => (
                      <span key={useCase} className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    onTemplateLoad(selectedTemplate.architecture);
                    setSelectedTemplate(null);
                  }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Load Template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArchitectureTemplates;