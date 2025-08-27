import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, Square, RotateCcw, Settings, 
  TrendingUp, TrendingDown, Zap, Target, 
  BarChart3, Activity, Cpu, Database,
  ChevronDown, ChevronRight, Info, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuralNetwork, DenseLayer, DataUtils } from './NeuralEngine.js';

const TrainingLab = ({ architecture, onTrainingStateChange, onMetricsUpdate, trainingData }) => {
  const [isTraining, setIsTraining] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [network, setNetwork] = useState(null);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs, setTotalEpochs] = useState(100);
  const [batchSize, setBatchSize] = useState(32);
  const [learningRate, setLearningRate] = useState(0.001);
  const [optimizer, setOptimizer] = useState('adam');
  const [lossFunction, setLossFunction] = useState('meanSquaredError');
  const [selectedDataset, setSelectedDataset] = useState('synthetic_classification');
  const [metrics, setMetrics] = useState({
    loss: [],
    accuracy: [],
    validationLoss: [],
    validationAccuracy: [],
    learningRate: []
  });
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    currentLoss: 0,
    currentAccuracy: 0,
    currentValLoss: 0,
    currentValAccuracy: 0,
    epochTime: 0,
    remainingTime: 0
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [layerActivations, setLayerActivations] = useState([]);
  const [weightDistributions, setWeightDistributions] = useState([]);
  
  const trainingIntervalRef = useRef(null);
  const epochStartTime = useRef(null);
  const chartRefs = {
    loss: useRef(null),
    accuracy: useRef(null),
    weights: useRef(null)
  };

  // Initialize or rebuild network when architecture changes
  useEffect(() => {
    if (architecture && architecture.layers && architecture.layers.length > 0) {
      buildNetworkFromArchitecture();
    }
  }, [architecture]);

  // Update parent component about training state
  useEffect(() => {
    onTrainingStateChange(isTraining);
  }, [isTraining]);

  // Update parent component about metrics
  useEffect(() => {
    onMetricsUpdate({
      ...realTimeMetrics,
      totalEpochs,
      currentEpoch,
      steps: currentEpoch * Math.ceil(datasetInfo?.samples / batchSize || 0),
      accuracy: realTimeMetrics.currentAccuracy
    });
  }, [realTimeMetrics, currentEpoch, totalEpochs, datasetInfo]);

  const buildNetworkFromArchitecture = () => {
    try {
      const net = new NeuralNetwork();
      
      architecture.layers.forEach((layerConfig, index) => {
        switch (layerConfig.type) {
          case 'Dense':
            const prevLayerSize = index === 0 ? 
              (getDatasetInputSize() || 2) : 
              architecture.layers[index - 1].config.units;
            
            const layer = new DenseLayer(
              prevLayerSize,
              layerConfig.config.units || 64,
              layerConfig.config.activation || 'relu'
            );
            net.addLayer(layer);
            break;
          default:
            console.warn(`Layer type ${layerConfig.type} not implemented yet`);
        }
      });

      net.lossFunction = lossFunction;
      setNetwork(net);
      
      // Initialize weight distributions
      updateWeightDistributions(net);
      
    } catch (error) {
      console.error('Error building network:', error);
    }
  };

  const getDatasetInputSize = () => {
    switch (selectedDataset) {
      case 'synthetic_classification':
      case 'synthetic_regression':
      case 'xor':
        return 2;
      case 'mnist':
        return 784;
      case 'cifar10':
        return 3072;
      default:
        return 2;
    }
  };

  const loadDataset = async () => {
    try {
      let data;
      
      switch (selectedDataset) {
        case 'synthetic_classification':
          data = DataUtils.generateSyntheticData('classification', 1000);
          break;
        case 'synthetic_regression':
          data = DataUtils.generateSyntheticData('regression', 1000);
          break;
        case 'xor':
          data = DataUtils.generateSyntheticData('xor', 400);
          break;
        default:
          data = DataUtils.generateSyntheticData('classification', 1000);
      }

      // Split data
      const split = DataUtils.trainTestSplit(data.X, data.y, 0.2);
      
      setDatasetInfo({
        name: selectedDataset,
        samples: split.xTrain.length,
        features: split.xTrain[0].length,
        classes: split.yTrain[0].length,
        trainSamples: split.xTrain.length,
        testSamples: split.xTest.length
      });

      return split;
      
    } catch (error) {
      console.error('Error loading dataset:', error);
      return null;
    }
  };

  const startTraining = async () => {
    if (!network) {
      alert('Please build a network first!');
      return;
    }

    const data = await loadDataset();
    if (!data) {
      alert('Error loading dataset!');
      return;
    }

    setIsTraining(true);
    setIsPaused(false);
    epochStartTime.current = Date.now();

    // Reset metrics
    setMetrics({
      loss: [],
      accuracy: [],
      validationLoss: [],
      validationAccuracy: [],
      learningRate: []
    });

    // Training callbacks
    const callbacks = {
      onEpochEnd: (epochData) => {
        const epochEndTime = Date.now();
        const epochTime = epochEndTime - epochStartTime.current;
        const remainingEpochs = totalEpochs - epochData.epoch - 1;
        const remainingTime = remainingEpochs * epochTime;

        setCurrentEpoch(epochData.epoch + 1);
        setMetrics(prev => ({
          loss: [...prev.loss, epochData.loss],
          accuracy: [...prev.accuracy, epochData.accuracy || 0],
          validationLoss: [...prev.validationLoss, epochData.validationLoss || 0],
          validationAccuracy: [...prev.validationAccuracy, epochData.validationAccuracy || 0],
          learningRate: [...prev.learningRate, learningRate]
        }));

        setRealTimeMetrics({
          currentLoss: epochData.loss,
          currentAccuracy: epochData.accuracy || 0,
          currentValLoss: epochData.validationLoss || 0,
          currentValAccuracy: epochData.validationAccuracy || 0,
          epochTime,
          remainingTime
        });

        // Update visualizations
        updateLayerActivations(network, data.xTrain[0]);
        updateWeightDistributions(network);

        epochStartTime.current = Date.now();
      },
      onBatchEnd: (batchData) => {
        // Real-time updates during training
        setRealTimeMetrics(prev => ({
          ...prev,
          currentLoss: batchData.batchLoss
        }));
      }
    };

    // Start training
    try {
      await network.train(
        data.xTrain,
        data.yTrain,
        totalEpochs,
        batchSize,
        { x: data.xTest, y: data.yTest },
        callbacks
      );
    } catch (error) {
      console.error('Training error:', error);
    } finally {
      setIsTraining(false);
    }
  };

  const pauseTraining = () => {
    setIsPaused(!isPaused);
  };

  const stopTraining = () => {
    setIsTraining(false);
    setIsPaused(false);
    setCurrentEpoch(0);
  };

  const resetNetwork = () => {
    if (network) {
      buildNetworkFromArchitecture();
      setMetrics({
        loss: [],
        accuracy: [],
        validationLoss: [],
        validationAccuracy: [],
        learningRate: []
      });
      setCurrentEpoch(0);
    }
  };

  const updateLayerActivations = (net, sampleInput) => {
    try {
      const activations = [];
      let input = sampleInput;

      // Get activations from each layer
      net.layers.forEach((layer, index) => {
        if (layer.forward) {
          const output = layer.forward(input);
          activations.push({
            layerIndex: index,
            values: output.toArray().slice(0, 20), // Limit for visualization
            min: Math.min(...output.toArray()),
            max: Math.max(...output.toArray()),
            mean: output.toArray().reduce((a, b) => a + b, 0) / output.toArray().length
          });
          input = output;
        }
      });

      setLayerActivations(activations);
    } catch (error) {
      console.error('Error updating layer activations:', error);
    }
  };

  const updateWeightDistributions = (net) => {
    try {
      const distributions = [];
      
      net.layers.forEach((layer, index) => {
        if (layer.weights) {
          const weights = layer.weights.toArray();
          const biases = layer.biases ? layer.biases.toArray() : [];
          
          distributions.push({
            layerIndex: index,
            weights: {
              values: weights.slice(0, 100), // Limit for visualization
              min: Math.min(...weights),
              max: Math.max(...weights),
              mean: weights.reduce((a, b) => a + b, 0) / weights.length,
              std: Math.sqrt(weights.reduce((acc, val) => acc + Math.pow(val - weights.reduce((a, b) => a + b, 0) / weights.length, 2), 0) / weights.length)
            },
            biases: {
              values: biases,
              min: biases.length > 0 ? Math.min(...biases) : 0,
              max: biases.length > 0 ? Math.max(...biases) : 0,
              mean: biases.length > 0 ? biases.reduce((a, b) => a + b, 0) / biases.length : 0
            }
          });
        }
      });

      setWeightDistributions(distributions);
    } catch (error) {
      console.error('Error updating weight distributions:', error);
    }
  };

  const TrainingControls = () => (
    <motion.div 
      className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Activity className="w-6 h-6 mr-2 text-blue-400" />
          Training Controls
        </h3>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={startTraining}
            disabled={isTraining || !network}
            className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-xl transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5" />
            <span>Start</span>
          </motion.button>
          
          <motion.button
            onClick={pauseTraining}
            disabled={!isTraining}
            className="p-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Pause className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={stopTraining}
            disabled={!isTraining}
            className="p-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Square className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={resetNetwork}
            disabled={isTraining}
            className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Epochs</label>
          <input
            type="number"
            value={totalEpochs}
            onChange={(e) => setTotalEpochs(parseInt(e.target.value) || 100)}
            disabled={isTraining}
            className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Batch Size</label>
          <input
            type="number"
            value={batchSize}
            onChange={(e) => setBatchSize(parseInt(e.target.value) || 32)}
            disabled={isTraining}
            className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Learning Rate</label>
          <input
            type="number"
            step="0.001"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0.001)}
            disabled={isTraining}
            className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Dataset</label>
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            disabled={isTraining}
            className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
          >
            <option value="synthetic_classification">Synthetic Classification</option>
            <option value="synthetic_regression">Synthetic Regression</option>
            <option value="xor">XOR Problem</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  const TrainingMetrics = () => (
    <motion.div 
      className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <BarChart3 className="w-6 h-6 mr-2 text-green-400" />
        Training Metrics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-red-400">
            {realTimeMetrics.currentLoss.toFixed(6)}
          </div>
          <div className="text-sm text-gray-400">Current Loss</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">
            {(realTimeMetrics.currentAccuracy * 100).toFixed(2)}%
          </div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">
            {currentEpoch}/{totalEpochs}
          </div>
          <div className="text-sm text-gray-400">Epoch</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">
            {Math.round(realTimeMetrics.remainingTime / 1000)}s
          </div>
          <div className="text-sm text-gray-400">Remaining</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Training Progress</span>
          <span>{((currentEpoch / totalEpochs) * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div 
            className="h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentEpoch / totalEpochs) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Loss/Accuracy Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Loss Curve</h4>
          <div className="h-32 relative">
            <svg className="w-full h-full">
              {metrics.loss.length > 1 && (
                <polyline
                  className="loss-curve"
                  points={metrics.loss.map((loss, index) => 
                    `${(index / (metrics.loss.length - 1)) * 100},${100 - ((loss - Math.min(...metrics.loss)) / (Math.max(...metrics.loss) - Math.min(...metrics.loss) + 0.0001)) * 100}`
                  ).join(' ')}
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Accuracy Curve</h4>
          <div className="h-32 relative">
            <svg className="w-full h-full">
              {metrics.accuracy.length > 1 && (
                <polyline
                  className="accuracy-curve"
                  points={metrics.accuracy.map((acc, index) => 
                    `${(index / (metrics.accuracy.length - 1)) * 100},${100 - (acc * 100)}`
                  ).join(' ')}
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const NetworkVisualization = () => (
    <motion.div 
      className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <Zap className="w-6 h-6 mr-2 text-yellow-400" />
        Live Network Activity
      </h3>
      
      {layerActivations.length > 0 ? (
        <div className="space-y-4">
          {layerActivations.map((layer, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-semibold">Layer {index + 1}</h4>
                <div className="text-sm text-gray-400">
                  Avg: {layer.mean.toFixed(3)}
                </div>
              </div>
              
              <div className="flex space-x-1 h-8">
                {layer.values.map((value, neuronIndex) => {
                  const intensity = Math.abs(value) / Math.max(Math.abs(layer.min), Math.abs(layer.max));
                  return (
                    <motion.div
                      key={neuronIndex}
                      className={`flex-1 rounded ${value > 0 ? 'bg-blue-500' : 'bg-red-500'}`}
                      style={{ opacity: intensity }}
                      animate={{ opacity: intensity }}
                      transition={{ duration: 0.3 }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Start training to see network activity</p>
        </div>
      )}
    </motion.div>
  );

  const DatasetInfo = () => (
    <motion.div 
      className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Database className="w-6 h-6 mr-2 text-cyan-400" />
        Dataset Information
      </h3>
      
      {datasetInfo ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-cyan-400">{datasetInfo.samples}</div>
            <div className="text-sm text-gray-400">Total Samples</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">{datasetInfo.features}</div>
            <div className="text-sm text-gray-400">Features</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{datasetInfo.classes}</div>
            <div className="text-sm text-gray-400">Output Classes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              {((datasetInfo.trainSamples / datasetInfo.samples) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">Training Split</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-4">
          <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Load a dataset to see information</p>
        </div>
      )}
    </motion.div>
  );

  if (!architecture || !architecture.layers || architecture.layers.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div 
          className="text-center text-gray-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-2xl font-semibold mb-2">No Network Architecture</h3>
          <p className="text-lg">Please build a network in the Architecture Designer first</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <TrainingControls />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrainingMetrics />
          <DatasetInfo />
        </div>
        
        <NetworkVisualization />
      </div>
    </div>
  );
};

export default TrainingLab;