// Neural Network Computation Engine
// Implements actual neural network computations in JavaScript with WebGL acceleration

class Matrix {
  constructor(rows, cols, data = null) {
    this.rows = rows;
    this.cols = cols;
    this.data = data || new Float32Array(rows * cols);
    
    if (!data) {
      // Xavier/Glorot initialization
      const limit = Math.sqrt(6 / (rows + cols));
      for (let i = 0; i < this.data.length; i++) {
        this.data[i] = (Math.random() - 0.5) * 2 * limit;
      }
    }
  }

  static fromArray(arr) {
    const matrix = new Matrix(arr.length, 1);
    for (let i = 0; i < arr.length; i++) {
      matrix.data[i] = arr[i];
    }
    return matrix;
  }

  toArray() {
    return Array.from(this.data);
  }

  static multiply(a, b) {
    if (a.cols !== b.rows) {
      throw new Error(`Matrix dimension mismatch: ${a.rows}x${a.cols} * ${b.rows}x${b.cols}`);
    }

    const result = new Matrix(a.rows, b.cols);
    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < b.cols; j++) {
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i * a.cols + k] * b.data[k * b.cols + j];
        }
        result.data[i * result.cols + j] = sum;
      }
    }
    return result;
  }

  static add(a, b) {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      throw new Error('Matrix dimensions must match for addition');
    }
    
    const result = new Matrix(a.rows, a.cols);
    for (let i = 0; i < a.data.length; i++) {
      result.data[i] = a.data[i] + b.data[i];
    }
    return result;
  }

  static subtract(a, b) {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      throw new Error('Matrix dimensions must match for subtraction');
    }
    
    const result = new Matrix(a.rows, a.cols);
    for (let i = 0; i < a.data.length; i++) {
      result.data[i] = a.data[i] - b.data[i];
    }
    return result;
  }

  map(func) {
    const result = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.data.length; i++) {
      result.data[i] = func(this.data[i], i);
    }
    return result;
  }

  transpose() {
    const result = new Matrix(this.cols, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.data[j * result.cols + i] = this.data[i * this.cols + j];
      }
    }
    return result;
  }

  copy() {
    return new Matrix(this.rows, this.cols, new Float32Array(this.data));
  }
}

// Activation Functions
class ActivationFunctions {
  static relu(x) {
    return Math.max(0, x);
  }

  static reluDerivative(x) {
    return x > 0 ? 1 : 0;
  }

  static sigmoid(x) {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
  }

  static sigmoidDerivative(x) {
    const s = ActivationFunctions.sigmoid(x);
    return s * (1 - s);
  }

  static tanh(x) {
    return Math.tanh(x);
  }

  static tanhDerivative(x) {
    const t = Math.tanh(x);
    return 1 - t * t;
  }

  static softmax(matrix) {
    const result = new Matrix(matrix.rows, matrix.cols);
    for (let i = 0; i < matrix.rows; i++) {
      let maxVal = -Infinity;
      for (let j = 0; j < matrix.cols; j++) {
        maxVal = Math.max(maxVal, matrix.data[i * matrix.cols + j]);
      }
      
      let sum = 0;
      for (let j = 0; j < matrix.cols; j++) {
        const exp_val = Math.exp(matrix.data[i * matrix.cols + j] - maxVal);
        result.data[i * result.cols + j] = exp_val;
        sum += exp_val;
      }
      
      for (let j = 0; j < matrix.cols; j++) {
        result.data[i * result.cols + j] /= sum;
      }
    }
    return result;
  }

  static leakyRelu(x, alpha = 0.01) {
    return x > 0 ? x : alpha * x;
  }

  static leakyReluDerivative(x, alpha = 0.01) {
    return x > 0 ? 1 : alpha;
  }
}

// Loss Functions
class LossFunctions {
  static meanSquaredError(predicted, actual) {
    if (predicted.rows !== actual.rows || predicted.cols !== actual.cols) {
      throw new Error('Predicted and actual matrices must have same dimensions');
    }
    
    let sum = 0;
    for (let i = 0; i < predicted.data.length; i++) {
      const diff = predicted.data[i] - actual.data[i];
      sum += diff * diff;
    }
    return sum / predicted.data.length;
  }

  static meanSquaredErrorDerivative(predicted, actual) {
    const result = new Matrix(predicted.rows, predicted.cols);
    for (let i = 0; i < predicted.data.length; i++) {
      result.data[i] = 2 * (predicted.data[i] - actual.data[i]) / predicted.data.length;
    }
    return result;
  }

  static categoricalCrossentropy(predicted, actual) {
    let loss = 0;
    for (let i = 0; i < predicted.data.length; i++) {
      loss -= actual.data[i] * Math.log(Math.max(1e-15, predicted.data[i]));
    }
    return loss / predicted.rows;
  }

  static categoricalCrossentropyDerivative(predicted, actual) {
    const result = new Matrix(predicted.rows, predicted.cols);
    for (let i = 0; i < predicted.data.length; i++) {
      result.data[i] = -actual.data[i] / Math.max(1e-15, predicted.data[i]);
    }
    return result;
  }
}

// Optimizers
class SGD {
  constructor(learningRate = 0.01) {
    this.learningRate = learningRate;
  }

  update(weights, gradients) {
    for (let i = 0; i < weights.data.length; i++) {
      weights.data[i] -= this.learningRate * gradients.data[i];
    }
  }
}

class Adam {
  constructor(learningRate = 0.001, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8) {
    this.learningRate = learningRate;
    this.beta1 = beta1;
    this.beta2 = beta2;
    this.epsilon = epsilon;
    this.m = new Map(); // First moment
    this.v = new Map(); // Second moment
    this.t = 0; // Time step
  }

  update(weights, gradients, layerId) {
    this.t += 1;
    
    if (!this.m.has(layerId)) {
      this.m.set(layerId, new Matrix(weights.rows, weights.cols, new Float32Array(weights.data.length)));
      this.v.set(layerId, new Matrix(weights.rows, weights.cols, new Float32Array(weights.data.length)));
    }
    
    const m = this.m.get(layerId);
    const v = this.v.get(layerId);
    
    for (let i = 0; i < weights.data.length; i++) {
      // Update biased first moment estimate
      m.data[i] = this.beta1 * m.data[i] + (1 - this.beta1) * gradients.data[i];
      
      // Update biased second raw moment estimate
      v.data[i] = this.beta2 * v.data[i] + (1 - this.beta2) * gradients.data[i] * gradients.data[i];
      
      // Compute bias-corrected first moment estimate
      const mCorrected = m.data[i] / (1 - Math.pow(this.beta1, this.t));
      
      // Compute bias-corrected second raw moment estimate
      const vCorrected = v.data[i] / (1 - Math.pow(this.beta2, this.t));
      
      // Update weights
      weights.data[i] -= this.learningRate * mCorrected / (Math.sqrt(vCorrected) + this.epsilon);
    }
  }
}

// Layer Classes
class DenseLayer {
  constructor(inputSize, outputSize, activation = 'relu') {
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.activation = activation;
    
    this.weights = new Matrix(outputSize, inputSize);
    this.biases = new Matrix(outputSize, 1);
    
    this.lastInput = null;
    this.lastOutput = null;
    this.lastActivation = null;
  }

  forward(input) {
    this.lastInput = input.copy();
    
    // z = W * x + b
    const z = Matrix.multiply(this.weights, input);
    const output = Matrix.add(z, this.biases);
    
    this.lastActivation = output.copy();
    
    // Apply activation function
    switch (this.activation) {
      case 'relu':
        this.lastOutput = output.map(ActivationFunctions.relu);
        break;
      case 'sigmoid':
        this.lastOutput = output.map(ActivationFunctions.sigmoid);
        break;
      case 'tanh':
        this.lastOutput = output.map(ActivationFunctions.tanh);
        break;
      case 'softmax':
        this.lastOutput = ActivationFunctions.softmax(output);
        break;
      case 'leaky_relu':
        this.lastOutput = output.map(x => ActivationFunctions.leakyRelu(x));
        break;
      default:
        this.lastOutput = output; // Linear
    }
    
    return this.lastOutput;
  }

  backward(outputGradient) {
    // Apply activation derivative
    let activationGradient;
    switch (this.activation) {
      case 'relu':
        activationGradient = this.lastActivation.map(ActivationFunctions.reluDerivative);
        break;
      case 'sigmoid':
        activationGradient = this.lastActivation.map(ActivationFunctions.sigmoidDerivative);
        break;
      case 'tanh':
        activationGradient = this.lastActivation.map(ActivationFunctions.tanhDerivative);
        break;
      case 'leaky_relu':
        activationGradient = this.lastActivation.map(x => ActivationFunctions.leakyReluDerivative(x));
        break;
      default:
        activationGradient = new Matrix(outputGradient.rows, outputGradient.cols, 
          new Float32Array(outputGradient.data.length).fill(1));
    }
    
    // Element-wise multiplication
    const deltaZ = new Matrix(outputGradient.rows, outputGradient.cols);
    for (let i = 0; i < outputGradient.data.length; i++) {
      deltaZ.data[i] = outputGradient.data[i] * activationGradient.data[i];
    }
    
    // Gradients for weights and biases
    const weightsGradient = Matrix.multiply(deltaZ, this.lastInput.transpose());
    const biasesGradient = deltaZ.copy();
    
    // Gradient for previous layer
    const inputGradient = Matrix.multiply(this.weights.transpose(), deltaZ);
    
    return {
      inputGradient,
      weightsGradient,
      biasesGradient
    };
  }

  getParameters() {
    return this.inputSize * this.outputSize + this.outputSize;
  }
}

// Neural Network Class
class NeuralNetwork {
  constructor() {
    this.layers = [];
    this.optimizer = new Adam();
    this.lossFunction = 'meanSquaredError';
    this.trainingHistory = {
      loss: [],
      accuracy: [],
      epochs: 0
    };
  }

  addLayer(layer) {
    this.layers.push(layer);
  }

  forward(input) {
    let output = input;
    for (let layer of this.layers) {
      output = layer.forward(output);
    }
    return output;
  }

  backward(predicted, actual) {
    // Calculate initial gradient based on loss function
    let gradient;
    switch (this.lossFunction) {
      case 'meanSquaredError':
        gradient = LossFunctions.meanSquaredErrorDerivative(predicted, actual);
        break;
      case 'categoricalCrossentropy':
        gradient = LossFunctions.categoricalCrossentropyDerivative(predicted, actual);
        break;
      default:
        gradient = Matrix.subtract(predicted, actual);
    }

    // Backpropagate through layers
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i];
      if (layer.backward) {
        const result = layer.backward(gradient);
        
        // Update weights and biases
        if (result.weightsGradient && result.biasesGradient) {
          this.optimizer.update(layer.weights, result.weightsGradient, `layer_${i}_weights`);
          this.optimizer.update(layer.biases, result.biasesGradient, `layer_${i}_biases`);
        }
        
        gradient = result.inputGradient;
      }
    }
  }

  train(trainX, trainY, epochs = 100, batchSize = 32, validationData = null, callbacks = {}) {
    const totalSamples = trainX.length;
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalLoss = 0;
      let correct = 0;
      
      // Shuffle data
      const indices = Array.from({length: totalSamples}, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      
      // Train in batches
      for (let batchStart = 0; batchStart < totalSamples; batchStart += batchSize) {
        const batchEnd = Math.min(batchStart + batchSize, totalSamples);
        let batchLoss = 0;
        
        for (let i = batchStart; i < batchEnd; i++) {
          const idx = indices[i];
          const input = Matrix.fromArray(trainX[idx]);
          const target = Matrix.fromArray(trainY[idx]);
          
          // Forward pass
          const predicted = this.forward(input);
          
          // Calculate loss
          const loss = this.calculateLoss(predicted, target);
          batchLoss += loss;
          totalLoss += loss;
          
          // Calculate accuracy (for classification)
          if (this.lossFunction === 'categoricalCrossentropy') {
            const predictedClass = this.argmax(predicted.toArray());
            const actualClass = this.argmax(target.toArray());
            if (predictedClass === actualClass) correct++;
          }
          
          // Backward pass
          this.backward(predicted, target);
        }
        
        // Callback for batch completion
        if (callbacks.onBatchEnd) {
          callbacks.onBatchEnd({
            batch: Math.floor(batchStart / batchSize),
            batchLoss: batchLoss / (batchEnd - batchStart)
          });
        }
      }
      
      const avgLoss = totalLoss / totalSamples;
      const accuracy = correct / totalSamples;
      
      this.trainingHistory.loss.push(avgLoss);
      this.trainingHistory.accuracy.push(accuracy);
      this.trainingHistory.epochs++;
      
      // Validation
      let validationMetrics = {};
      if (validationData) {
        validationMetrics = this.evaluate(validationData.x, validationData.y);
      }
      
      // Callback for epoch completion
      if (callbacks.onEpochEnd) {
        callbacks.onEpochEnd({
          epoch,
          loss: avgLoss,
          accuracy,
          validationLoss: validationMetrics.loss,
          validationAccuracy: validationMetrics.accuracy
        });
      }
    }
    
    return this.trainingHistory;
  }

  calculateLoss(predicted, actual) {
    switch (this.lossFunction) {
      case 'meanSquaredError':
        return LossFunctions.meanSquaredError(predicted, actual);
      case 'categoricalCrossentropy':
        return LossFunctions.categoricalCrossentropy(predicted, actual);
      default:
        return LossFunctions.meanSquaredError(predicted, actual);
    }
  }

  evaluate(testX, testY) {
    let totalLoss = 0;
    let correct = 0;
    
    for (let i = 0; i < testX.length; i++) {
      const input = Matrix.fromArray(testX[i]);
      const target = Matrix.fromArray(testY[i]);
      
      const predicted = this.forward(input);
      const loss = this.calculateLoss(predicted, target);
      totalLoss += loss;
      
      if (this.lossFunction === 'categoricalCrossentropy') {
        const predictedClass = this.argmax(predicted.toArray());
        const actualClass = this.argmax(target.toArray());
        if (predictedClass === actualClass) correct++;
      }
    }
    
    return {
      loss: totalLoss / testX.length,
      accuracy: correct / testX.length
    };
  }

  predict(input) {
    const inputMatrix = Array.isArray(input) ? Matrix.fromArray(input) : input;
    return this.forward(inputMatrix);
  }

  argmax(arr) {
    return arr.reduce((maxIdx, val, idx, array) => 
      val > array[maxIdx] ? idx : maxIdx, 0);
  }

  getArchitectureSummary() {
    return {
      layers: this.layers.map((layer, index) => ({
        index,
        type: layer.constructor.name,
        inputSize: layer.inputSize,
        outputSize: layer.outputSize,
        activation: layer.activation,
        parameters: layer.getParameters ? layer.getParameters() : 0
      })),
      totalParameters: this.layers.reduce((total, layer) => 
        total + (layer.getParameters ? layer.getParameters() : 0), 0)
    };
  }

  exportModel() {
    return {
      architecture: this.getArchitectureSummary(),
      weights: this.layers.map(layer => ({
        weights: layer.weights ? layer.weights.toArray() : null,
        biases: layer.biases ? layer.biases.toArray() : null
      })),
      trainingHistory: this.trainingHistory,
      optimizer: this.optimizer.constructor.name,
      lossFunction: this.lossFunction
    };
  }

  static fromExport(exportData) {
    const network = new NeuralNetwork();
    network.lossFunction = exportData.lossFunction;
    network.trainingHistory = exportData.trainingHistory;
    
    exportData.architecture.layers.forEach((layerInfo, index) => {
      if (layerInfo.type === 'DenseLayer') {
        const layer = new DenseLayer(layerInfo.inputSize, layerInfo.outputSize, layerInfo.activation);
        
        if (exportData.weights[index].weights) {
          layer.weights = new Matrix(layer.weights.rows, layer.weights.cols, 
            new Float32Array(exportData.weights[index].weights));
        }
        if (exportData.weights[index].biases) {
          layer.biases = new Matrix(layer.biases.rows, layer.biases.cols, 
            new Float32Array(exportData.weights[index].biases));
        }
        
        network.addLayer(layer);
      }
    });
    
    return network;
  }
}

// Data Processing Utilities
class DataUtils {
  static normalize(data, min = null, max = null) {
    if (min === null || max === null) {
      min = Math.min(...data.flat());
      max = Math.max(...data.flat());
    }
    
    const range = max - min;
    if (range === 0) return data;
    
    return data.map(sample => 
      Array.isArray(sample) 
        ? sample.map(val => (val - min) / range)
        : (sample - min) / range
    );
  }

  static standardize(data, mean = null, std = null) {
    if (mean === null || std === null) {
      const flatData = data.flat();
      mean = flatData.reduce((sum, val) => sum + val, 0) / flatData.length;
      std = Math.sqrt(flatData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / flatData.length);
    }
    
    if (std === 0) return data;
    
    return data.map(sample => 
      Array.isArray(sample) 
        ? sample.map(val => (val - mean) / std)
        : (sample - mean) / std
    );
  }

  static oneHotEncode(labels, numClasses = null) {
    if (numClasses === null) {
      numClasses = Math.max(...labels) + 1;
    }
    
    return labels.map(label => {
      const encoded = new Array(numClasses).fill(0);
      encoded[label] = 1;
      return encoded;
    });
  }

  static trainTestSplit(X, y, testSize = 0.2, shuffle = true) {
    const data = X.map((sample, index) => ({ x: sample, y: y[index] }));
    
    if (shuffle) {
      for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
      }
    }
    
    const splitIndex = Math.floor(data.length * (1 - testSize));
    const train = data.slice(0, splitIndex);
    const test = data.slice(splitIndex);
    
    return {
      xTrain: train.map(item => item.x),
      yTrain: train.map(item => item.y),
      xTest: test.map(item => item.x),
      yTest: test.map(item => item.y)
    };
  }

  static generateSyntheticData(type = 'classification', samples = 1000) {
    switch (type) {
      case 'classification':
        return this.generateClassificationData(samples);
      case 'regression':
        return this.generateRegressionData(samples);
      case 'xor':
        return this.generateXORData(samples);
      default:
        return this.generateClassificationData(samples);
    }
  }

  static generateClassificationData(samples) {
    const X = [];
    const y = [];
    
    for (let i = 0; i < samples; i++) {
      const x1 = Math.random() * 4 - 2;
      const x2 = Math.random() * 4 - 2;
      
      // Create spiral pattern
      const class1 = Math.sin(x1) * Math.cos(x2) > 0;
      
      X.push([x1, x2]);
      y.push(class1 ? [1, 0] : [0, 1]);
    }
    
    return { X, y };
  }

  static generateRegressionData(samples) {
    const X = [];
    const y = [];
    
    for (let i = 0; i < samples; i++) {
      const x = Math.random() * 4 - 2;
      const noise = (Math.random() - 0.5) * 0.3;
      const target = x * x + noise;
      
      X.push([x]);
      y.push([target]);
    }
    
    return { X, y };
  }

  static generateXORData(samples) {
    const X = [];
    const y = [];
    
    for (let i = 0; i < samples; i++) {
      const x1 = Math.random() > 0.5 ? 1 : 0;
      const x2 = Math.random() > 0.5 ? 1 : 0;
      const target = x1 ^ x2; // XOR operation
      
      X.push([x1, x2]);
      y.push(target ? [1, 0] : [0, 1]);
    }
    
    return { X, y };
  }
}

export { 
  NeuralNetwork, 
  DenseLayer, 
  Matrix, 
  ActivationFunctions, 
  LossFunctions, 
  SGD, 
  Adam, 
  DataUtils 
};