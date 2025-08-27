import React, { useState, useEffect, useRef } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Brain, Dice6, BarChart3, Zap, Play } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ProbabilityStats = ({ updateProgress }) => {
  const [activeSection, setActiveSection] = useState('basics');
  const [numSamples, setNumSamples] = useState(1000);
  const [simulationData, setSimulationData] = useState([]);
  const [bayesianData, setBayesianData] = useState({ prior: 0.5, likelihood: 0.8 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [p1, setP1] = useState(0.5);
  const [p2, setP2] = useState(0.5);

  // Monte Carlo simulation
  const runMonteCarloSimulation = () => {
    setIsSimulating(true);
    const samples = [];
    const results = [];
    
    // Simulate coin flips
    for (let i = 0; i < numSamples; i++) {
      const flip = Math.random() < 0.5 ? 1 : 0; // 1 = heads, 0 = tails
      samples.push(flip);
      
      // Calculate running average
      const runningSum = samples.reduce((sum, val) => sum + val, 0);
      const runningAvg = runningSum / (i + 1);
      results.push({ x: i + 1, y: runningAvg });
    }
    
    setSimulationData(results);
    setTimeout(() => setIsSimulating(false), 1000);
  };

  // Information theory calculations
  const calculateEntropy = (probabilities) => {
    return -probabilities.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0);
  };

  const calculateKLDivergence = (p, q) => {
    return p.reduce((sum, pi, i) => sum + (pi > 0 ? pi * Math.log2(pi / q[i]) : 0), 0);
  };

  // Bayesian update
  const updateBayesian = () => {
    const { prior, likelihood } = bayesianData;
    const evidence = likelihood * prior + (1 - likelihood) * (1 - prior);
    const posterior = (likelihood * prior) / evidence;
    
    setBayesianData(prev => ({ ...prev, posterior, evidence }));
  };

  useEffect(() => {
    updateBayesian();
  }, [bayesianData.prior, bayesianData.likelihood]);

  const sections = [
    { id: 'basics', title: 'Probability Fundamentals', icon: Dice6 },
    { id: 'bayesian', title: 'Bayesian Inference', icon: Brain },
    { id: 'distributions', title: 'Distributions & Sampling', icon: BarChart3 },
    { id: 'information', title: 'Information Theory', icon: Zap }
  ];

  const renderBasicsSection = () => {
    const chartData = {
      labels: simulationData.map(d => d.x).filter((_, i) => i % Math.floor(simulationData.length / 50) === 0),
      datasets: [{
        label: 'Running Average',
        data: simulationData.filter((_, i) => i % Math.floor(simulationData.length / 50) === 0).map(d => d.y),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1
      }, {
        label: 'True Probability (0.5)',
        data: simulationData.filter((_, i) => i % Math.floor(simulationData.length / 50) === 0).map(() => 0.5),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 0
      }]
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Law of Large Numbers Demonstration' }
      },
      scales: {
        x: { title: { display: true, text: 'Number of Samples' } },
        y: { title: { display: true, text: 'Probability of Heads' }, min: 0, max: 1 }
      }
    };

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Probability Fundamentals</h2>
          <p className="text-lg text-gray-600">Building intuition through simulation</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Monte Carlo Simulation</h3>
            
            <div className="mb-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Number of samples: {numSamples}
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={numSamples}
                  onChange={(e) => setNumSamples(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <button
                onClick={runMonteCarloSimulation}
                disabled={isSimulating}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Play className="w-4 h-4 inline mr-1" />
                {isSimulating ? 'Running...' : 'Run Simulation'}
              </button>
            </div>
            
            {simulationData.length > 0 && (
              <div className="h-80">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Key Probability Concepts</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Probability Axioms</h4>
                <ul className="text-sm space-y-1">
                  <li>• <InlineMath math="P(A) \geq 0" /> (Non-negativity)</li>
                  <li>• <InlineMath math="P(\Omega) = 1" /> (Normalization)</li>
                  <li>• <InlineMath math="P(A \cup B) = P(A) + P(B)" /> if A ∩ B = ∅</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Conditional Probability</h4>
                <BlockMath math="P(A|B) = \frac{P(A \cap B)}{P(B)}" />
                <p className="text-sm text-gray-600">
                  Probability of A given that B has occurred
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Independence</h4>
                <BlockMath math="P(A \cap B) = P(A) \cdot P(B)" />
                <p className="text-sm text-gray-600">
                  Events A and B are independent
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Law of Large Numbers</h4>
                <p className="text-sm text-gray-600">
                  As n → ∞, sample average converges to expected value
                </p>
                <BlockMath math="\lim_{n \to \infty} \frac{1}{n}\sum_{i=1}^{n} X_i = E[X]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3">🎯 AI Applications</h4>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Uncertainty Quantification:</strong> Neural networks output probability distributions</li>
            <li>• <strong>Sampling Methods:</strong> Monte Carlo techniques for training and inference</li>
            <li>• <strong>Generative Models:</strong> GANs and VAEs model data distributions</li>
            <li>• <strong>Reinforcement Learning:</strong> Action selection based on probability policies</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderBayesianSection = () => {
    const { prior, likelihood, posterior, evidence } = bayesianData;
    
    const bayesianChartData = {
      labels: ['Prior', 'Posterior'],
      datasets: [{
        label: 'Probability',
        data: [prior, posterior || 0],
        backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(239, 68, 68, 0.6)'],
        borderColor: ['rgb(59, 130, 246)', 'rgb(239, 68, 68)'],
        borderWidth: 2
      }]
    };

    const bayesianChartOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Bayesian Update' }
      },
      scales: {
        y: { min: 0, max: 1, title: { display: true, text: 'Probability' } }
      }
    };

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Bayesian Inference</h2>
          <p className="text-lg text-gray-600">Updating beliefs with evidence</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Interactive Bayesian Update</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Prior P(H): {prior.toFixed(3)}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.99"
                  step="0.01"
                  value={prior}
                  onChange={(e) => setBayesianData(prev => ({ ...prev, prior: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Likelihood P(E|H): {likelihood.toFixed(3)}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.99"
                  step="0.01"
                  value={likelihood}
                  onChange={(e) => setBayesianData(prev => ({ ...prev, likelihood: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm"><strong>Evidence P(E):</strong> {evidence?.toFixed(3)}</p>
                <p className="text-sm"><strong>Posterior P(H|E):</strong> {posterior?.toFixed(3)}</p>
              </div>
            </div>
            
            <div className="h-64">
              <Bar data={bayesianChartData} options={bayesianChartOptions} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Bayes' Theorem</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">The Formula</h4>
                <BlockMath math="P(H|E) = \frac{P(E|H) \cdot P(H)}{P(E)}" />
                <ul className="text-sm space-y-1 mt-2">
                  <li>• P(H|E): Posterior probability</li>
                  <li>• P(E|H): Likelihood</li>
                  <li>• P(H): Prior probability</li>
                  <li>• P(E): Evidence (marginal likelihood)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Expanded Form</h4>
                <BlockMath math="P(H|E) = \frac{P(E|H) \cdot P(H)}{P(E|H) \cdot P(H) + P(E|\neg H) \cdot P(\neg H)}" />
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Interpretation</h4>
                <p className="text-sm text-gray-600">
                  Start with prior belief P(H), observe evidence E, update to posterior P(H|E).
                  The likelihood P(E|H) determines how much the evidence changes your belief.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold mb-2">📊 Example: Medical Testing</h4>
                <p className="text-sm">
                  Disease prevalence (prior): 1%<br/>
                  Test accuracy (likelihood): 95%<br/>
                  Positive test → Posterior probability of disease ≈ 16%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3">🧠 Bayesian Machine Learning</h4>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Bayesian Neural Networks:</strong> Uncertainty quantification in predictions</li>
            <li>• <strong>Gaussian Processes:</strong> Bayesian approach to function approximation</li>
            <li>• <strong>Bayesian Optimization:</strong> Efficient hyperparameter tuning</li>
            <li>• <strong>Variational Inference:</strong> Approximate Bayesian inference for complex models</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderDistributionsSection = () => {
    // Generate normal distribution data
    const normalData = [];
    const uniformData = [];
    const exponentialData = [];
    
    for (let x = -4; x <= 4; x += 0.1) {
      normalData.push({
        x: parseFloat(x.toFixed(1)),
        y: (1/Math.sqrt(2*Math.PI)) * Math.exp(-0.5*x*x)
      });
    }
    
    for (let x = 0; x <= 1; x += 0.01) {
      uniformData.push({ x: parseFloat(x.toFixed(2)), y: 1 });
    }
    
    for (let x = 0; x <= 5; x += 0.1) {
      exponentialData.push({
        x: parseFloat(x.toFixed(1)),
        y: Math.exp(-x)
      });
    }

    const distributionChartData = {
      labels: normalData.map(d => d.x),
      datasets: [{
        label: 'Normal(0,1)',
        data: normalData.map(d => d.y),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1
      }]
    };

    const distributionChartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Probability Distributions' }
      },
      scales: {
        x: { title: { display: true, text: 'x' } },
        y: { title: { display: true, text: 'Probability Density' } }
      }
    };

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Distributions & Sampling</h2>
          <p className="text-lg text-gray-600">Understanding probability distributions</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Common Distributions</h3>
            
            <div className="h-64 mb-4">
              <Line data={distributionChartData} options={distributionChartOptions} />
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  const newData = { ...distributionChartData };
                  newData.datasets[0] = {
                    ...newData.datasets[0],
                    label: 'Normal(0,1)',
                    data: normalData.map(d => d.y)
                  };
                }}
                className="w-full text-left p-2 border rounded hover:bg-gray-50"
              >
                <strong>Normal Distribution</strong>
              </button>
              <button
                onClick={() => {
                  const newData = { ...distributionChartData };
                  newData.datasets[0] = {
                    ...newData.datasets[0],
                    label: 'Exponential(1)',
                    data: exponentialData.map(d => d.y)
                  };
                }}
                className="w-full text-left p-2 border rounded hover:bg-gray-50"
              >
                <strong>Exponential Distribution</strong>
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Key Properties</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Normal Distribution</h4>
                <BlockMath math="f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}" />
                <ul className="text-sm space-y-1">
                  <li>• Mean: μ, Variance: σ²</li>
                  <li>• Symmetric, bell-shaped</li>
                  <li>• Central Limit Theorem</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Exponential Distribution</h4>
                <BlockMath math="f(x) = \lambda e^{-\lambda x}" />
                <ul className="text-sm space-y-1">
                  <li>• Rate parameter: λ</li>
                  <li>• Memoryless property</li>
                  <li>• Models waiting times</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Sampling Methods</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Inverse Transform:</strong> F⁻¹(U) where U ~ Uniform(0,1)</li>
                  <li>• <strong>Rejection Sampling:</strong> Accept/reject based on ratio</li>
                  <li>• <strong>MCMC:</strong> Markov Chain Monte Carlo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3">🎲 Sampling in AI</h4>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Generative Models:</strong> VAEs and GANs sample from learned distributions</li>
            <li>• <strong>Dropout:</strong> Bernoulli sampling for regularization</li>
            <li>• <strong>Variational Inference:</strong> Approximate complex posteriors</li>
            <li>• <strong>Reinforcement Learning:</strong> Policy sampling and exploration</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderInformationSection = () => {
    const probsP = [p1, 1-p1];
    const probsQ = [p2, 1-p2];
    
    const entropyP = calculateEntropy(probsP);
    const entropyQ = calculateEntropy(probsQ);
    const klDivergence = calculateKLDivergence(probsP, probsQ);

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Information Theory</h2>
          <p className="text-lg text-gray-600">Quantifying information and uncertainty</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Interactive Information Measures</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Distribution P - p₁: {p1.toFixed(3)}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.99"
                  step="0.01"
                  value={p1}
                  onChange={(e) => setP1(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Distribution Q - q₁: {p2.toFixed(3)}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.99"
                  step="0.01"
                  value={p2}
                  onChange={(e) => setP2(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="bg-gray-100 p-4 rounded space-y-2">
                <p className="text-sm"><strong>H(P):</strong> {entropyP.toFixed(3)} bits</p>
                <p className="text-sm"><strong>H(Q):</strong> {entropyQ.toFixed(3)} bits</p>
                <p className="text-sm"><strong>KL(P||Q):</strong> {klDivergence.toFixed(3)} bits</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>P = [{probsP[0].toFixed(3)}, {probsP[1].toFixed(3)}]</p>
              <p>Q = [{probsQ[0].toFixed(3)}, {probsQ[1].toFixed(3)}]</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Information Theory Concepts</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Entropy</h4>
                <BlockMath math="H(X) = -\sum_{i} p_i \log_2 p_i" />
                <p className="text-sm text-gray-600">
                  Average information content (uncertainty)
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Cross-Entropy</h4>
                <BlockMath math="H(P, Q) = -\sum_{i} p_i \log_2 q_i" />
                <p className="text-sm text-gray-600">
                  Expected bits when using Q to encode P
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">KL Divergence</h4>
                <BlockMath math="D_{KL}(P||Q) = \sum_{i} p_i \log_2 \frac{p_i}{q_i}" />
                <p className="text-sm text-gray-600">
                  How different P is from Q (not symmetric)
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Mutual Information</h4>
                <BlockMath math="I(X;Y) = H(X) - H(X|Y)" />
                <p className="text-sm text-gray-600">
                  Information shared between X and Y
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3">⚡ Information Theory in AI</h4>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Loss Functions:</strong> Cross-entropy loss in classification</li>
            <li>• <strong>Model Selection:</strong> Information criteria (AIC, BIC)</li>
            <li>• <strong>Feature Selection:</strong> Mutual information for relevance</li>
            <li>• <strong>Generative Models:</strong> VAE loss includes KL divergence term</li>
            <li>• <strong>Compression:</strong> Minimum Description Length principle</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'basics':
        return renderBasicsSection();
      case 'bayesian':
        return renderBayesianSection();
      case 'distributions':
        return renderDistributionsSection();
      case 'information':
        return renderInformationSection();
      default:
        return renderBasicsSection();
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

export default ProbabilityStats;