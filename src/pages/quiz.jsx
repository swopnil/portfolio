import React, { useState, useRef } from 'react';
import { Upload, FileText, Play, RotateCcw, Trophy, Clock, Target, Type, Code } from 'lucide-react';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizResults from '../components/quiz/QuizResults';

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputMethod, setInputMethod] = useState('file'); // 'file' or 'text'
  const [jsonText, setJsonText] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  // Handle JSON text parsing
  const handleJsonTextSubmit = async () => {
    if (!jsonText.trim()) {
      setError('Please enter JSON text');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = JSON.parse(jsonText);
      await processQuizData(data);
    } catch (err) {
      setError(`Error parsing JSON: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Process quiz data (shared between file upload and text input)
  const processQuizData = async (data) => {
    // Validate quiz structure
    if (!data.quiz || !data.quiz.questions || !Array.isArray(data.quiz.questions)) {
      throw new Error('Invalid quiz format. Please ensure your JSON has a "quiz" object with a "questions" array.');
    }

    // Validate question structure
    const validQuestions = data.quiz.questions.filter(q => 
      q.question && 
      Array.isArray(q.options) && 
      q.options.length > 0 && 
      typeof q.correct === 'number' &&
      q.correct >= 0 && 
      q.correct < q.options.length
    );

    if (validQuestions.length === 0) {
      throw new Error('No valid questions found. Each question must have "question", "options" array, and "correct" index.');
    }

    setQuizData({
      ...data.quiz,
      questions: validQuestions
    });
    
    resetQuiz();
  };

  // Handle file upload and parsing
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      setError('Please upload a valid JSON file');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await processQuizData(data);
    } catch (err) {
      setError(`Error parsing JSON: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true);
    setTimeElapsed(0);
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, selectedOption) => {
    if (answerSubmitted) return; // Prevent changing answer after submission
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  // Submit answer and show feedback
  const submitAnswer = () => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    if (userAnswers[currentQuestion.id] === undefined) return;
    
    setAnswerSubmitted(true);
    setShowAnswer(true);
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
      setAnswerSubmitted(false);
    } else {
      completeQuiz();
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Check if previous question was already answered
      const prevQuestion = quizData.questions[currentQuestionIndex - 1];
      const wasAnswered = userAnswers[prevQuestion.id] !== undefined;
      setShowAnswer(wasAnswered);
      setAnswerSubmitted(wasAnswered);
    }
  };

  // Complete the quiz
  const completeQuiz = () => {
    setQuizCompleted(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Reset quiz state
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizStarted(false);
    setQuizCompleted(false);
    setTimeElapsed(0);
    setJsonText('');
    setShowAnswer(false);
    setAnswerSubmitted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Calculate score
  const calculateScore = () => {
    if (!quizData) return { score: 0, total: 0, percentage: 0 };
    
    const correctAnswers = quizData.questions.filter(question => 
      userAnswers[question.id] === question.correct
    ).length;
    
    const total = quizData.questions.length;
    const percentage = Math.round((correctAnswers / total) * 100);
    
    return { score: correctAnswers, total, percentage };
  };

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // File upload area
  const renderFileUpload = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Quiz JSON</h2>
          <p className="text-gray-600">Upload a JSON file or paste JSON text containing your quiz questions</p>
        </div>

        {/* Input Method Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setInputMethod('file')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                inputMethod === 'file'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload File
            </button>
            <button
              onClick={() => setInputMethod('text')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                inputMethod === 'text'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Type className="w-4 h-4 inline mr-2" />
              Paste JSON
            </button>
          </div>
        </div>

        {inputMethod === 'file' ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">JSON files only</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="Paste your quiz JSON here..."
                className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none font-mono text-sm resize-vertical"
              />
              <div className="absolute top-2 right-2">
                <Code className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleJsonTextSubmit}
                disabled={!jsonText.trim() || isLoading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Load Quiz from JSON'}
              </button>
              <button
                onClick={() => {
                  const sampleJson = `{
  "quiz": {
    "title": "Sample JavaScript Quiz",
    "description": "Test your JavaScript knowledge with these questions",
    "questions": [
      {
        "id": 1,
        "question": "What is the correct way to declare a variable in JavaScript?",
        "options": ["var myVar;", "variable myVar;", "v myVar;", "declare myVar;"],
        "correct": 0,
        "category": "Variables",
        "explanation": "In JavaScript, variables are declared using 'var', 'let', or 'const' keywords. 'var' is the traditional way to declare variables."
      },
      {
        "id": 2,
        "question": "Which method is used to add an element to the end of an array?",
        "options": ["push()", "add()", "append()", "insert()"],
        "correct": 0,
        "category": "Arrays",
        "explanation": "The push() method adds one or more elements to the end of an array and returns the new length of the array."
      },
      {
        "id": 3,
        "question": "What does '===' operator do in JavaScript?",
        "options": ["Assigns value", "Compares value only", "Compares value and type", "Creates a variable"],
        "correct": 2,
        "category": "Operators",
        "explanation": "The '===' operator performs strict equality comparison, checking both value and type. It's recommended over '==' which only compares values."
      }
    ]
  }
}`;
                  setJsonText(sampleJson);
                }}
                className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Load Sample
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Processing {inputMethod === 'file' ? 'file' : 'JSON'}...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Expected JSON Format:</h3>
          <pre className="text-sm text-gray-600 overflow-x-auto">
{`{
  "quiz": {
    "title": "Quiz Title",
    "description": "Quiz Description",
    "questions": [
      {
        "id": 1,
        "question": "Question text?",
        "options": ["Option 1", "Option 2", "Option 3"],
        "correct": 0,
        "category": "Category Name",
        "explanation": "Optional explanation shown after answer"
      }
    ]
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );

  // Quiz info and start screen
  const renderQuizStart = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{quizData.title}</h2>
          <p className="text-gray-600 text-lg">{quizData.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{quizData.questions.length}</div>
            <div className="text-sm text-blue-600">Questions</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">~{Math.ceil(quizData.questions.length * 0.5)}</div>
            <div className="text-sm text-green-600">Minutes</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">
              {[...new Set(quizData.questions.map(q => q.category).filter(Boolean))].length || 1}
            </div>
            <div className="text-sm text-purple-600">Categories</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={startQuiz}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Play className="w-5 h-5" />
            Start Quiz
          </button>
          <button
            onClick={() => setQuizData(null)}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Upload className="w-5 h-5" />
            Load Different Quiz
          </button>
        </div>
      </div>
    </div>
  );

  // Main quiz interface
  const renderQuiz = () => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{quizData.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{formatTime(timeElapsed)}</span>
              </div>
              <div className="text-gray-600">
                {currentQuestionIndex + 1} of {quizData.questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Component */}
        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={userAnswers[currentQuestion.id]}
          onAnswerSelect={handleAnswerSelect}
          questionNumber={currentQuestionIndex + 1}
          showAnswer={showAnswer}
          answerSubmitted={answerSubmitted}
        />

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => setQuizData(null)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </button>

              {!answerSubmitted && userAnswers[currentQuestion.id] !== undefined && (
                <button
                  onClick={submitAnswer}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Submit Answer
                </button>
              )}
            </div>
            
            <button
              onClick={nextQuestion}
              disabled={!answerSubmitted && userAnswers[currentQuestion.id] === undefined}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
            >
              {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Interactive Quiz App</h1>
          <p className="text-gray-600">Upload your JSON quiz file and test your knowledge</p>
        </div>

        {!quizData && renderFileUpload()}
        {quizData && !quizStarted && !quizCompleted && renderQuizStart()}
        {quizData && quizStarted && !quizCompleted && renderQuiz()}
        {quizData && quizCompleted && (
          <QuizResults
            quizData={quizData}
            userAnswers={userAnswers}
            timeElapsed={timeElapsed}
            onRestart={resetQuiz}
            onNewQuiz={() => setQuizData(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;
