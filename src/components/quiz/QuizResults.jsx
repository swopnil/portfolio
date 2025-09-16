import React from 'react';
import { Trophy, Clock, Target, RotateCcw, Upload, CheckCircle, XCircle, Award, TrendingUp } from 'lucide-react';

const QuizResults = ({ quizData, userAnswers, timeElapsed, onRestart, onNewQuiz }) => {
  // Calculate overall score
  const calculateScore = () => {
    const correctAnswers = quizData.questions.filter(question => 
      userAnswers[question.id] === question.correct
    ).length;
    
    const total = quizData.questions.length;
    const percentage = Math.round((correctAnswers / total) * 100);
    
    return { score: correctAnswers, total, percentage };
  };

  // Calculate score by category
  const calculateCategoryScores = () => {
    const categoryStats = {};
    
    quizData.questions.forEach(question => {
      const category = question.category || 'General';
      if (!categoryStats[category]) {
        categoryStats[category] = { correct: 0, total: 0 };
      }
      
      categoryStats[category].total++;
      if (userAnswers[question.id] === question.correct) {
        categoryStats[category].correct++;
      }
    });

    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      correct: stats.correct,
      total: stats.total,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));
  };

  // Get performance level
  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50', icon: Award };
    if (percentage >= 80) return { level: 'Very Good', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Trophy };
    if (percentage >= 70) return { level: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: TrendingUp };
    if (percentage >= 60) return { level: 'Fair', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: Target };
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle };
  };

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const scoreData = calculateScore();
  const categoryScores = calculateCategoryScores();
  const performance = getPerformanceLevel(scoreData.percentage);
  const PerformanceIcon = performance.icon;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Results Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${performance.bgColor} mb-4`}>
            <PerformanceIcon className={`w-10 h-10 ${performance.color}`} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
          <p className="text-gray-600">{quizData.title}</p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-700">{scoreData.percentage}%</div>
            <div className="text-sm text-blue-600">Overall Score</div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-700">{scoreData.score}</div>
            <div className="text-sm text-green-600">Correct Answers</div>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-red-700">{scoreData.total - scoreData.score}</div>
            <div className="text-sm text-red-600">Incorrect Answers</div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-purple-700">{formatTime(timeElapsed)}</div>
            <div className="text-sm text-purple-600">Time Taken</div>
          </div>
        </div>

        {/* Performance Level */}
        <div className={`p-6 rounded-lg ${performance.bgColor} mb-8`}>
          <div className="flex items-center gap-3">
            <PerformanceIcon className={`w-6 h-6 ${performance.color}`} />
            <span className={`text-lg font-semibold ${performance.color}`}>
              Performance Level: {performance.level}
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryScores.length > 1 && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Performance by Category</h3>
          <div className="space-y-4">
            {categoryScores.map((category, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">{category.category}</span>
                  <span className="text-sm text-gray-600">
                    {category.correct}/{category.total} ({category.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      category.percentage >= 80 ? 'bg-green-500' :
                      category.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Question Review</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {quizData.questions.map((question, index) => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = userAnswer === question.correct;
            const wasAnswered = userAnswer !== undefined;

            return (
              <div 
                key={question.id} 
                className={`border rounded-lg p-4 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 
                  wasAnswered ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    ) : wasAnswered ? (
                      <XCircle className="w-5 h-5 text-red-500 mt-1" />
                    ) : (
                      <div className="w-5 h-5 bg-gray-400 rounded-full mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-600">Q{index + 1}</span>
                      {question.category && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                          {question.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 mb-2">{question.question}</p>
                    <div className="text-sm">
                      <div className={`mb-1 ${isCorrect ? 'text-green-700' : 'text-gray-600'}`}>
                        <strong>Correct:</strong> {question.options[question.correct]}
                      </div>
                      {wasAnswered && !isCorrect && (
                        <div className="text-red-700">
                          <strong>Your answer:</strong> {question.options[userAnswer]}
                        </div>
                      )}
                      {!wasAnswered && (
                        <div className="text-gray-500">
                          <strong>Not answered</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Quiz
          </button>
          <button
            onClick={onNewQuiz}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload New Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
