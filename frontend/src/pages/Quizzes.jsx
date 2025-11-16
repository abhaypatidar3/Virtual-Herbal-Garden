// src/pages/Quizzes.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { quizData } from "../data/quizData";

const Quizzes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Store all user answers
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false); // Show detailed results
  const [quizScores, setQuizScores] = useState({});

  // Load scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem(`quizScores_${user?.username || 'guest'}`);
    if (savedScores) {
      setQuizScores(JSON.parse(savedScores));
    }
  }, [user]);

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setCompleted(false);
    setShowResults(false);
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    // Store the user's answer
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    // Move to next question or finish quiz
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz completed - calculate score
      const score = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === selectedQuiz.questions[index].correct ? 1 : 0);
      }, 0);

      const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
      
      // Save score
      const newScores = {
        ...quizScores,
        [selectedQuiz.id]: {
          score: score,
          total: selectedQuiz.questions.length,
          percentage: percentage,
          date: new Date().toISOString()
        }
      };
      setQuizScores(newScores);
      localStorage.setItem(`quizScores_${user?.username || 'guest'}`, JSON.stringify(newScores));
      
      setCompleted(true);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setCompleted(false);
    setShowResults(false);
  };

  const viewResults = () => {
    setShowResults(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Quiz selection view
  if (!selectedQuiz) {
    return (
      <div className="min-h-screen bg-[#E1EEBC] p-6">
        <div className="max-w-6xl mx-auto pt-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              🌿 Herbal Plant Quizzes
            </h1>
            <p className="text-xl text-gray-600">
              Test your knowledge about medicinal and culinary herbs!
            </p>
            {user && (
              <p className="text-sm text-gray-500 mt-2">
                Welcome back, {user.username}! Your progress is saved.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizData.map((quiz) => {
              const savedScore = quizScores[quiz.id];
              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 cursor-pointer"
                  onClick={() => startQuiz(quiz)}
                >
                  <div className="text-6xl mb-4">{quiz.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 mb-4 h-12">
                    {quiz.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">
                      {quiz.questions.length} questions
                    </span>
                  </div>
                  
                  {savedScore && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="text-sm text-blue-800">
                        Best Score: {savedScore.score}/{savedScore.total} ({savedScore.percentage}%)
                      </div>
                    </div>
                  )}
                  
                  <button className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                    Start Quiz
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Quiz completion view
  if (completed && !showResults) {
    const score = quizScores[selectedQuiz.id].score;
    const percentage = quizScores[selectedQuiz.id].percentage;
    let message = "";
    let emoji = "";
    
    if (percentage >= 80) {
      message = "Excellent! You're a herbal expert!";
      emoji = "🏆";
    } else if (percentage >= 60) {
      message = "Good job! Keep learning!";
      emoji = "🌟";
    } else {
      message = "Keep practicing! You'll improve!";
      emoji = "💪";
    }

    return (
      <div className="min-h-screen bg-[#E1EEBC] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-8xl mb-6">{emoji}</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Quiz Completed!
          </h2>
          <p className="text-2xl text-gray-600 mb-6">{message}</p>
          
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-8 mb-8 text-white">
            <div className="text-6xl font-bold mb-2">
              {score}/{selectedQuiz.questions.length}
            </div>
            <div className="text-2xl">{percentage}% Correct</div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={viewResults}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              📊 View Detailed Results
            </button>
            <button
              onClick={() => startQuiz(selectedQuiz)}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              🔄 Retry Quiz
            </button>
            <button
              onClick={resetQuiz}
              className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              ← Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Detailed results view
  if (showResults) {
    const score = quizScores[selectedQuiz.id].score;
    
    return (
      <div className="min-h-screen bg-[#E1EEBC] p-6">
        <div className="max-w-4xl mx-auto pt-20">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800">
                📊 Quiz Results: {selectedQuiz.title}
              </h2>
              <button
                onClick={resetQuiz}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Back to Quizzes
              </button>
            </div>
            <div className="text-lg text-gray-600">
              Your Score: <span className="font-bold text-emerald-600">{score}/{selectedQuiz.questions.length}</span>
            </div>
          </div>

          {/* Review all questions */}
          <div className="space-y-6">
            {selectedQuiz.questions.map((question, qIndex) => {
              const userAnswer = userAnswers[qIndex];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <div key={qIndex} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`text-3xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Question {qIndex + 1}: {question.question}
                      </h3>

                      {/* Options */}
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, oIndex) => {
                          let bgColor = "bg-gray-50";
                          let borderColor = "border-gray-200";
                          let textColor = "text-gray-800";
                          
                          if (oIndex === question.correct) {
                            bgColor = "bg-green-50";
                            borderColor = "border-green-500";
                            textColor = "text-green-900";
                          } else if (oIndex === userAnswer && !isCorrect) {
                            bgColor = "bg-red-50";
                            borderColor = "border-red-500";
                            textColor = "text-red-900";
                          }

                          return (
                            <div
                              key={oIndex}
                              className={`p-3 rounded-lg border-2 ${bgColor} ${borderColor}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`${textColor} font-medium`}>
                                  {String.fromCharCode(65 + oIndex)}. {option}
                                </span>
                                {oIndex === question.correct && (
                                  <span className="text-green-600 font-bold">✓ Correct</span>
                                )}
                                {oIndex === userAnswer && !isCorrect && (
                                  <span className="text-red-600 font-bold">Your Answer</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <div className="font-semibold text-blue-900 mb-1">💡 Explanation:</div>
                        <p className="text-blue-800">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom actions */}
          <div className="mt-8 flex gap-4 justify-center pb-8">
            <button
              onClick={() => startQuiz(selectedQuiz)}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              🔄 Retry Quiz
            </button>
            <button
              onClick={resetQuiz}
              className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              ← Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz question view
  const question = selectedQuiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#E1EEBC] p-6">
      <div className="max-w-4xl mx-auto pt-20">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedQuiz.title}
            </h2>
            <button
              onClick={resetQuiz}
              className="text-gray-600 hover:text-gray-800"
            >
              ✕ Exit
            </button>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {selectedQuiz.questions.length}</span>
            <span>Progress: {userAnswers.length}/{selectedQuiz.questions.length} answered</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / selectedQuiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            {question.question}
          </h3>

          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const bgColor = isSelected ? "bg-emerald-100" : "bg-gray-50 hover:bg-gray-100";
              const borderColor = isSelected ? "border-emerald-500" : "border-gray-200";

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 ${bgColor} ${borderColor} transition-colors cursor-pointer`}
                >
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-gray-800">{option}</span>
                    {isSelected && (
                      <span className="ml-auto text-emerald-600">●</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {currentQuestion < selectedQuiz.questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;