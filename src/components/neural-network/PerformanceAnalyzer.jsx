import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Target, Eye, 
  AlertTriangle, CheckCircle, XCircle, Activity,
  Download, RefreshCw, Settings, Info, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PerformanceAnalyzer = ({ metrics, architecture }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('loss');
  const [analysisResults, setAnalysisResults] = useState({});
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  
  const chartRefs = {
    loss: useRef(null),
    accuracy: useRef(null),
    confusion: useRef(null),
    roc: useRef(null)
  };

  useEffect(() => {
    if (metrics && Object.keys(metrics).length > 0) {
      performAnalysis();
    }
  }, [metrics]);

  const performAnalysis = () => {
    const analysis = {
      overfitting: detectOverfitting(),
      convergence: analyzeConvergence(),
      performance: evaluatePerformance(),
      recommendations: generateRecommendations(),
      modelHealth: assessModelHealth()
    };
    
    setAnalysisResults(analysis);
  };

  const detectOverfitting = () => {
    if (!metrics.loss || !metrics.validationLoss || metrics.loss.length < 10) {
      return { detected: false, confidence: 0, message: 'Insufficient data' };
    }

    const trainLoss = metrics.loss.slice(-10);
    const valLoss = metrics.validationLoss.slice(-10);
    
    const trainTrend = calculateTrend(trainLoss);
    const valTrend = calculateTrend(valLoss);
    
    const gap = valLoss[valLoss.length - 1] - trainLoss[trainLoss.length - 1];
    const gapIncrease = valTrend - trainTrend;
    
    let confidence = 0;
    let detected = false;
    let severity = 'none';
    
    if (gap > 0.1 && gapIncrease > 0.01) {
      confidence = Math.min(0.9, gap * 2 + gapIncrease * 10);
      detected = true;
      severity = confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low';
    }
    
    return {
      detected,
      confidence,
      severity,
      gap,
      message: detected 
        ? `Overfitting detected with ${(confidence * 100).toFixed(1)}% confidence`
        : 'No clear signs of overfitting'
    };
  };

  const analyzeConvergence = () => {
    if (!metrics.loss || metrics.loss.length < 5) {
      return { converged: false, message: 'Insufficient data' };
    }

    const recentLoss = metrics.loss.slice(-5);
    const variance = calculateVariance(recentLoss);
    const trend = calculateTrend(recentLoss);
    
    const converged = variance < 0.001 && Math.abs(trend) < 0.001;
    const plateauing = variance < 0.01 && Math.abs(trend) < 0.01;
    
    return {
      converged,
      plateauing,
      variance,
      trend,
      message: converged 
        ? 'Model has converged'
        : plateauing 
        ? 'Model is plateauing'
        : 'Model is still learning'
    };
  };

  const evaluatePerformance = () => {
    const currentAccuracy = metrics.currentAccuracy || 0;
    const currentLoss = metrics.currentLoss || Infinity;
    
    let performanceGrade = 'F';
    let performanceColor = 'red';
    
    if (currentAccuracy > 0.95) {
      performanceGrade = 'A+';
      performanceColor = 'green';
    } else if (currentAccuracy > 0.90) {
      performanceGrade = 'A';
      performanceColor = 'green';
    } else if (currentAccuracy > 0.80) {
      performanceGrade = 'B';
      performanceColor = 'blue';
    } else if (currentAccuracy > 0.70) {
      performanceGrade = 'C';
      performanceColor = 'yellow';
    } else if (currentAccuracy > 0.60) {
      performanceGrade = 'D';
      performanceColor = 'orange';
    }
    
    return {
      grade: performanceGrade,
      color: performanceColor,
      accuracy: currentAccuracy,
      loss: currentLoss,
      message: `Current performance: ${performanceGrade} grade`
    };
  };

  const generateRecommendations = () => {
    const recommendations = [];
    
    if (analysisResults.overfitting?.detected) {
      recommendations.push({
        type: 'warning',
        title: 'Reduce Overfitting',
        message: 'Consider adding dropout, reducing model complexity, or increasing training data',
        priority: 'high'
      });
    }
    
    if (analysisResults.convergence?.plateauing) {
      recommendations.push({
        type: 'info',
        title: 'Adjust Learning Rate',
        message: 'Try reducing learning rate or using learning rate scheduling',
        priority: 'medium'
      });
    }
    
    if (analysisResults.performance?.accuracy < 0.7) {
      recommendations.push({
        type: 'warning',
        title: 'Improve Model Architecture',
        message: 'Consider increasing model capacity or trying different architectures',
        priority: 'high'
      });
    }
    
    return recommendations;
  };

  const assessModelHealth = () => {
    const scores = {
      convergence: analysisResults.convergence?.converged ? 100 : 
                   analysisResults.convergence?.plateauing ? 70 : 40,
      overfitting: analysisResults.overfitting?.detected ? 
                   (100 - analysisResults.overfitting.confidence * 100) : 100,
      performance: (analysisResults.performance?.accuracy || 0) * 100
    };
    
    const overallHealth = (scores.convergence + scores.overfitting + scores.performance) / 3;
    
    let healthStatus = 'Poor';
    let healthColor = 'red';
    
    if (overallHealth > 80) {
      healthStatus = 'Excellent';
      healthColor = 'green';
    } else if (overallHealth > 65) {
      healthStatus = 'Good';
      healthColor = 'blue';
    } else if (overallHealth > 50) {
      healthStatus = 'Fair';
      healthColor = 'yellow';
    }
    
    return {
      scores,
      overall: overallHealth,
      status: healthStatus,
      color: healthColor
    };
  };

  const calculateTrend = (data) => {
    if (data.length < 2) return 0;
    
    const n = data.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = data.reduce((sum, val) => sum + val, 0);
    const sumXY = data.reduce((sum, val, idx) => sum + val * idx, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  };

  const calculateVariance = (data) => {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  };

  const PerformanceOverview = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Performance Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-400" />
            <div className={`text-2xl font-bold text-${analysisResults.performance?.color}-400`}>
              {analysisResults.performance?.grade || 'N/A'}
            </div>
          </div>
          <div className="text-sm text-gray-400">Performance Grade</div>
        </motion.div>

        <motion.div 
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-400" />
            <div className={`text-2xl font-bold text-${analysisResults.modelHealth?.color}-400`}>
              {Math.round(analysisResults.modelHealth?.overall || 0)}%
            </div>
          </div>
          <div className="text-sm text-gray-400">Model Health</div>
        </motion.div>

        <motion.div 
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <div className="text-2xl font-bold text-purple-400">
              {((metrics.currentAccuracy || 0) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-sm text-gray-400">Current Accuracy</div>
        </motion.div>

        <motion.div 
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 text-red-400" />
            <div className="text-2xl font-bold text-red-400">
              {(metrics.currentLoss || 0).toFixed(4)}
            </div>
          </div>
          <div className="text-sm text-gray-400">Current Loss</div>
        </motion.div>
      </div>

      {/* Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overfitting Analysis */}
        <motion.div 
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            Overfitting Analysis
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status</span>
              <div className="flex items-center space-x-2">
                {analysisResults.overfitting?.detected ? (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">Detected</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">Not Detected</span>
                  </>
                )}
              </div>
            </div>
            
            {analysisResults.overfitting?.detected && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Confidence</span>
                  <span className="text-yellow-400">
                    {(analysisResults.overfitting.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Severity</span>
                  <span className={`capitalize text-${
                    analysisResults.overfitting.severity === 'high' ? 'red' :
                    analysisResults.overfitting.severity === 'medium' ? 'yellow' : 'blue'
                  }-400`}>
                    {analysisResults.overfitting.severity}
                  </span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Convergence Analysis */}
        <motion.div 
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-400" />
            Convergence Analysis
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status</span>
              <div className="flex items-center space-x-2">
                {analysisResults.convergence?.converged ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">Converged</span>
                  </>
                ) : analysisResults.convergence?.plateauing ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400">Plateauing</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400">Training</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Variance</span>
              <span className="text-cyan-400">
                {(analysisResults.convergence?.variance || 0).toFixed(6)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Trend</span>
              <span className="text-purple-400">
                {(analysisResults.convergence?.trend || 0).toFixed(6)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommendations */}
      {analysisResults.recommendations && analysisResults.recommendations.length > 0 && (
        <motion.div 
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-green-400" />
            Recommendations
          </h4>
          
          <div className="space-y-3">
            {analysisResults.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.type === 'warning' ? 'bg-yellow-900/20 border-yellow-400' :
                  rec.type === 'error' ? 'bg-red-900/20 border-red-400' :
                  'bg-blue-900/20 border-blue-400'
                }`}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="font-semibold text-white mb-1">{rec.title}</div>
                <div className="text-gray-300 text-sm">{rec.message}</div>
                <div className={`text-xs mt-2 px-2 py-1 rounded inline-block ${
                  rec.priority === 'high' ? 'bg-red-600 text-white' :
                  rec.priority === 'medium' ? 'bg-yellow-600 text-white' :
                  'bg-blue-600 text-white'
                }`}>
                  {rec.priority.toUpperCase()} PRIORITY
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const TrainingCurves = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Loss Curve */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4">Loss Curves</h4>
        <div className="h-64 bg-gray-900 rounded-lg relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="lossGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="valLossGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[...Array(5)].map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 40}
                x2="400"
                y2={i * 40}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
            ))}
            
            {/* Training loss */}
            {metrics.loss && metrics.loss.length > 1 && (
              <motion.polyline
                points={metrics.loss.map((loss, index) => {
                  const x = (index / (metrics.loss.length - 1)) * 400;
                  const maxLoss = Math.max(...metrics.loss);
                  const minLoss = Math.min(...metrics.loss);
                  const y = 200 - ((loss - minLoss) / (maxLoss - minLoss + 0.001)) * 180;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
              />
            )}
            
            {/* Validation loss */}
            {metrics.validationLoss && metrics.validationLoss.length > 1 && (
              <motion.polyline
                points={metrics.validationLoss.map((loss, index) => {
                  const x = (index / (metrics.validationLoss.length - 1)) * 400;
                  const maxLoss = Math.max(...metrics.validationLoss);
                  const minLoss = Math.min(...metrics.validationLoss);
                  const y = 200 - ((loss - minLoss) / (maxLoss - minLoss + 0.001)) * 180;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.3 }}
              />
            )}
          </svg>
          
          <div className="absolute bottom-4 right-4 space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-4 h-1 bg-red-500 rounded"></div>
              <span className="text-gray-300">Training Loss</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-4 h-1 bg-yellow-500 rounded border-2 border-dashed border-yellow-500"></div>
              <span className="text-gray-300">Validation Loss</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Curve */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4">Accuracy Curves</h4>
        <div className="h-64 bg-gray-900 rounded-lg relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[...Array(5)].map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 40}
                x2="400"
                y2={i * 40}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
            ))}
            
            {/* Training accuracy */}
            {metrics.accuracy && metrics.accuracy.length > 1 && (
              <motion.polyline
                points={metrics.accuracy.map((acc, index) => {
                  const x = (index / (metrics.accuracy.length - 1)) * 400;
                  const y = 200 - (acc * 180);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
              />
            )}
            
            {/* Validation accuracy */}
            {metrics.validationAccuracy && metrics.validationAccuracy.length > 1 && (
              <motion.polyline
                points={metrics.validationAccuracy.map((acc, index) => {
                  const x = (index / (metrics.validationAccuracy.length - 1)) * 400;
                  const y = 200 - (acc * 180);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.3 }}
              />
            )}
          </svg>
          
          <div className="absolute bottom-4 right-4 space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-4 h-1 bg-green-500 rounded"></div>
              <span className="text-gray-300">Training Accuracy</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-4 h-1 bg-cyan-500 rounded border-2 border-dashed border-cyan-500"></div>
              <span className="text-gray-300">Validation Accuracy</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ModelComparison = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4">Model Comparison</h4>
        <div className="text-center text-gray-400 py-12">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Model comparison feature coming soon...</p>
          <p className="text-sm mt-2">Train multiple models to enable comparison</p>
        </div>
      </div>
    </motion.div>
  );

  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div 
          className="text-center text-gray-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h3 className="text-2xl font-semibold mb-2">No Training Data</h3>
          <p className="text-lg">Start training a model to see performance analysis</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <motion.div 
          className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-2 border border-gray-700 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'curves', label: 'Training Curves', icon: TrendingUp },
              { id: 'comparison', label: 'Model Comparison', icon: Eye }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <PerformanceOverview />}
            {activeTab === 'curves' && <TrainingCurves />}
            {activeTab === 'comparison' && <ModelComparison />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PerformanceAnalyzer;