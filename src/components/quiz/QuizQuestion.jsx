import React from 'react';
import { CheckCircle, Circle, HelpCircle, Check, X, AlertCircle } from 'lucide-react';

const QuizQuestion = ({ question, selectedAnswer, onAnswerSelect, questionNumber, showAnswer, answerSubmitted }) => {
  if (!question) return null;

  const handleOptionClick = (optionIndex) => {
    if (!answerSubmitted) {
      onAnswerSelect(question.id, optionIndex);
    }
  };

  const isCorrect = selectedAnswer === question.correct;
  const hasSelectedAnswer = selectedAnswer !== undefined;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              {questionNumber}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              {question.category && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {question.category}
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
              {question.question}
            </h3>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === question.correct;
          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...

          // Determine option styling based on state
          let optionClass = 'w-full p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center gap-3';
          let borderColor = 'border-gray-200 bg-white hover:border-gray-300';
          let letterBgColor = 'bg-gray-100 text-gray-600';
          let textColor = 'text-gray-700';

          if (showAnswer) {
            // Show answer mode - highlight correct and wrong answers
            if (isCorrectOption) {
              borderColor = 'border-green-500 bg-green-50';
              letterBgColor = 'bg-green-500 text-white';
              textColor = 'text-green-700';
            } else if (isSelected && !isCorrectOption) {
              borderColor = 'border-red-500 bg-red-50';
              letterBgColor = 'bg-red-500 text-white';
              textColor = 'text-red-700';
            } else {
              borderColor = 'border-gray-200 bg-gray-50';
              letterBgColor = 'bg-gray-200 text-gray-500';
              textColor = 'text-gray-500';
            }
          } else if (isSelected) {
            // Selected but not submitted
            borderColor = 'border-blue-500 bg-blue-50 shadow-md';
            letterBgColor = 'bg-blue-500 text-white';
            textColor = 'text-blue-700 font-medium';
          } else if (!answerSubmitted) {
            // Not selected and not submitted - hover effects
            optionClass += ' hover:shadow-md cursor-pointer';
          }

          if (answerSubmitted && !showAnswer) {
            // Answer submitted but waiting for next
            optionClass += ' cursor-not-allowed';
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={answerSubmitted}
              className={`${optionClass} ${borderColor}`}
            >
              {/* Option Letter */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${letterBgColor}`}>
                {optionLetter}
              </div>

              {/* Selection/Result Indicator */}
              <div className="flex-shrink-0">
                {showAnswer ? (
                  isCorrectOption ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : isSelected ? (
                    <X className="w-5 h-5 text-red-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )
                ) : isSelected ? (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Option Text */}
              <span className={`flex-1 ${textColor}`}>
                {option}
              </span>

              {/* Correct/Wrong indicator when showing answer */}
              {showAnswer && isCorrectOption && (
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Correct
                </div>
              )}
              {showAnswer && isSelected && !isCorrectOption && (
                <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                  <X className="w-4 h-4" />
                  Wrong
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Status */}
      <div className="mt-6 text-center">
        {showAnswer ? (
          <div className="space-y-3">
            {/* Result indicator */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isCorrect 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {isCorrect ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Correct! Well done!</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">Incorrect. The correct answer is highlighted above.</span>
                </>
              )}
            </div>
            
            {/* Explanation if available */}
            {question.explanation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-blue-700 mb-1">Explanation:</div>
                    <div className="text-sm text-blue-600">{question.explanation}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : answerSubmitted ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Answer submitted! Click "Submit Answer" to see the result</span>
          </div>
        ) : hasSelectedAnswer ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Answer selected - Click "Submit Answer" to check</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full">
            <Circle className="w-4 h-4" />
            <span className="text-sm font-medium">Please select an answer</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
