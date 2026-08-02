import React from 'react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Step3({ interviewResults, onRetry }) {
  // Add null/undefined checks
  if (!interviewResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Results Available</h2>
          <p className="text-gray-600 mb-6">Unable to load interview results.</p>
          <button
            onClick={onRetry}
            className="bg-emerald-500 text-white px-6 py-3 rounded-xl hover:bg-emerald-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Safely extract data with fallbacks
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
    overallFeedback = "Interview completed successfully!",
    role = "Candidate",
    mode = "Interview"
  } = interviewResults;

  // Generate improvement suggestions based on scores
  const generateSuggestions = () => {
    const suggestions = [];
    
    if (confidence < 70) {
      suggestions.push({
        area: "Confidence",
        issue: "Your confidence level needs improvement",
        tip: "Practice speaking out loud, record yourself, and focus on your achievements. Remember your experience and skills are valuable!"
      });
    }
    
    if (communication < 70) {
      suggestions.push({
        area: "Communication",
        issue: "Your communication clarity can be enhanced",
        tip: "Structure your answers using STAR method (Situation, Task, Action, Result). Take a moment to organize your thoughts before speaking."
      });
    }
    
    if (correctness < 70) {
      suggestions.push({
        area: "Technical Accuracy",
        issue: "Your answers need more specific details",
        tip: "Research common interview questions for your role. Prepare specific examples from your experience with metrics and outcomes."
      });
    }
    
    // Check for brief answers
    const shortAnswers = questionWiseScore.filter(q => q.answer && q.answer.length < 50);
    if (shortAnswers.length > 0) {
      suggestions.push({
        area: "Answer Length",
        issue: `${shortAnswers.length} of your answers were too brief`,
        tip: "Aim for 1-2 minutes per answer. Provide context, your actions, and results. Use specific numbers and examples."
      });
    }
    
    // Check for missing examples
    const answersWithoutExamples = questionWiseScore.filter(q => 
      q.answer && !q.answer.toLowerCase().match(/example|project|experience|when|specifically|for instance/i)
    );
    if (answersWithoutExamples.length > 0) {
      suggestions.push({
        area: "Real Examples",
        issue: "Your answers lack specific real-world examples",
        tip: "Prepare 3-4 success stories from your experience. Use the CAR method: Challenge, Action, Result with metrics."
      });
    }
    
    // Add general suggestions based on overall score
    if (finalScore < 60) {
      suggestions.push({
        area: "Overall Performance",
        issue: "Need significant improvement",
        tip: "Consider mock interviews with friends. Study common questions for your role. Focus on your strongest skills first."
      });
    } else if (finalScore < 75) {
      suggestions.push({
        area: "Overall Performance",
        issue: "Good but room for improvement",
        tip: "Review the feedback for each question. Practice answering the questions where you scored lowest. Focus on adding more details."
      });
    } else if (finalScore >= 75) {
      suggestions.push({
        area: "Overall Performance",
        issue: "Strong performance!",
        tip: "You're doing great! To reach excellence, focus on storytelling and quantifying your achievements with specific numbers and outcomes."
      });
    }
    
    return suggestions;
  };

  const suggestions = generateSuggestions();

  // Prepare chart data with vibrant colors
  const performanceData = {
    labels: ['Confidence', 'Communication', 'Correctness', 'Overall Score'],
    datasets: [
      {
        label: 'Your Scores',
        data: [
          confidence || 0,
          communication || 0,
          correctness || 0,
          finalScore || 0
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',   // Blue
          'rgba(16, 185, 129, 0.7)',   // Green
          'rgba(245, 158, 11, 0.7)',   // Orange
          'rgba(139, 92, 246, 0.7)'    // Purple
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 2,
        borderRadius: 10,
      },
    ],
  };

  // Radar chart for skill assessment
  const radarData = {
    labels: ['Technical Knowledge', 'Problem Solving', 'Communication', 'Confidence', 'Clarity', 'Relevance'],
    datasets: [
      {
        label: 'Your Performance',
        data: [
          correctness || 70,
          ((correctness || 0) + (communication || 0)) / 2,
          communication || 70,
          confidence || 70,
          communication || 70,
          correctness || 70
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(16, 185, 129)',
      },
    ],
  };

  // Question-wise scores chart
  const questionLabels = questionWiseScore.map((_, idx) => `Q${idx + 1}`);
  const questionScores = questionWiseScore.map(q => q?.score || 0);

  const questionChartData = {
    labels: questionLabels,
    datasets: [
      {
        label: 'Question Scores',
        data: questionScores,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: questionScores.map(score => 
          score >= 80 ? 'rgb(16, 185, 129)' :
          score >= 60 ? 'rgb(245, 158, 11)' :
          'rgb(239, 68, 68)'
        ),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Doughnut chart for overall performance
  const doughnutData = {
    labels: ['Your Score', 'Remaining Potential'],
    datasets: [
      {
        data: [finalScore || 0, 100 - (finalScore || 0)],
        backgroundColor: ['rgb(16, 185, 129)', 'rgb(229, 231, 235)'],
        borderWidth: 0,
      },
    ],
  };

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12, weight: 'bold' },
        },
      },
      title: {
        display: true,
        text: '📊 Performance Metrics',
        font: { size: 16, weight: 'bold' },
        color: '#1f2937',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}/100`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Score (0-100)',
          font: { weight: 'bold' },
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 12, weight: 'bold' } },
      },
      title: {
        display: true,
        text: '📈 Question-wise Performance',
        font: { size: 16, weight: 'bold' },
        color: '#1f2937',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Score: ${context.raw}/100`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Score (0-100)',
          font: { weight: 'bold' },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Question Number',
          font: { weight: 'bold' },
        },
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 12, weight: 'bold' } },
      },
      title: {
        display: true,
        text: '🎯 Skill Assessment Radar',
        font: { size: 16, weight: 'bold' },
        color: '#1f2937',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20 },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 12 } },
      },
      title: {
        display: true,
        text: '🎯 Overall Score',
        font: { size: 16, weight: 'bold' },
        color: '#1f2937',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
  };

  // Determine performance level
  const getPerformanceLevel = (score) => {
    if (score >= 85) return { text: 'Outstanding!', color: 'text-purple-600', bg: 'bg-purple-100', emoji: '🏆' };
    if (score >= 75) return { text: 'Excellent!', color: 'text-green-600', bg: 'bg-green-100', emoji: '🎉' };
    if (score >= 65) return { text: 'Good Job!', color: 'text-emerald-600', bg: 'bg-emerald-100', emoji: '👍' };
    if (score >= 55) return { text: 'Satisfactory', color: 'text-yellow-600', bg: 'bg-yellow-100', emoji: '📈' };
    if (score >= 45) return { text: 'Needs Improvement', color: 'text-orange-600', bg: 'bg-orange-100', emoji: '⚠️' };
    return { text: 'Requires Practice', color: 'text-red-600', bg: 'bg-red-100', emoji: '💪' };
  };

  const performance = getPerformanceLevel(finalScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Interview Results
          </h1>
          <p className="text-gray-600 text-lg">Role: {role} | Mode: {mode}</p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 transform hover:scale-105 transition-transform duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center border-r border-gray-200">
              <div className={`inline-flex items-center justify-center w-36 h-36 rounded-full ${performance.bg} mb-4`}>
                <span className="text-5xl font-bold text-gray-800">{finalScore}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Overall Score</h3>
              <p className="text-gray-500">out of 100</p>
            </div>
            
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-800">Performance Summary</h3>
                <div className={`px-4 py-2 rounded-full ${performance.bg}`}>
                  <span className={`text-lg font-bold ${performance.color}`}>
                    {performance.emoji} {performance.text}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">{overallFeedback}</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-sm text-gray-600">Confidence</p>
                  <p className="text-2xl font-bold text-blue-600">{confidence}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${confidence}%` }}></div>
                  </div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <p className="text-sm text-gray-600">Communication</p>
                  <p className="text-2xl font-bold text-green-600">{communication}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${communication}%` }}></div>
                  </div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <p className="text-sm text-gray-600">Correctness</p>
                  <p className="text-2xl font-bold text-orange-600">{correctness}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${correctness}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="h-80">
              <Bar data={performanceData} options={barOptions} />
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="h-80">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 hover:shadow-2xl transition-shadow">
          <div className="h-96">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Question-wise Line Chart */}
        {questionWiseScore.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 hover:shadow-2xl transition-shadow">
            <div className="h-96">
              <Line data={questionChartData} options={lineOptions} />
            </div>
          </div>
        )}

        {/* Detailed Question Analysis with Answers */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">📝</span> 
            Detailed Question & Answer Analysis
          </h3>
          <div className="space-y-6">
            {questionWiseScore.map((q, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                {/* Question Header */}
                <div className={`p-4 ${
                  q.score >= 80 ? 'bg-gradient-to-r from-green-50 to-emerald-50' :
                  q.score >= 60 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' :
                  'bg-gradient-to-r from-red-50 to-pink-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          q.score >= 80 ? 'bg-green-500 text-white' :
                          q.score >= 60 ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          Score: {q.score}/100
                        </span>
                        <span className="text-sm text-gray-500">Question {idx + 1}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">{q.question}</h4>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-3xl font-bold ${
                        q.score >= 80 ? 'text-green-600' :
                        q.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {q.score}
                      </div>
                      <p className="text-xs text-gray-500">/100</p>
                    </div>
                  </div>
                </div>
                
                {/* Answer Section */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-lg">💬</span> Your Answer:
                  </p>
                  <p className="text-gray-700 leading-relaxed bg-white p-3 rounded-lg">
                    {q.answer && q.answer.trim() ? q.answer : "No answer provided"}
                  </p>
                </div>
                
                {/* Feedback Section */}
                <div className="p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-lg">🤖</span> AI Feedback:
                  </p>
                  <p className="text-gray-600 leading-relaxed bg-blue-50 p-3 rounded-lg">
                    {q.feedback || "Feedback will be available soon."}
                  </p>
                  
                  {/* Score Breakdown */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600">Confidence</p>
                      <p className="text-lg font-bold text-blue-600">{q.confidence || 0}%</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-600">Communication</p>
                      <p className="text-lg font-bold text-green-600">{q.communication || 0}%</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                      <p className="text-xs text-gray-600">Correctness</p>
                      <p className="text-lg font-bold text-orange-600">{q.correctness || 0}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Suggestions Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">🚀</span> 
            Personalized Improvement Plan
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 hover:shadow-lg transition-shadow transform hover:scale-105">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      suggestion.area === 'Confidence' ? 'bg-blue-100 text-blue-600' :
                      suggestion.area === 'Communication' ? 'bg-green-100 text-green-600' :
                      suggestion.area === 'Technical Accuracy' ? 'bg-orange-100 text-orange-600' :
                      suggestion.area === 'Answer Length' ? 'bg-yellow-100 text-yellow-600' :
                      suggestion.area === 'Real Examples' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{suggestion.area}</h4>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.issue}</p>
                    <div className="bg-amber-50 p-3 rounded-lg mt-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">💡 Tip:</span> {suggestion.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Motivational Message */}
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white text-center">
            <p className="text-lg font-semibold">
              🌟 Remember: Every interview is a learning opportunity! 
              Practice these suggestions and you'll see improvement. You've got this! 💪
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onRetry}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            🔄 Start New Interview
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            📥 Download Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step3;