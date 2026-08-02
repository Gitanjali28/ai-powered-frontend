import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';

function InterviewReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Get the data passed from the previous page
    if (location.state) {
      setReportData(location.state);
      console.log("Report Data:", location.state);
    }
  }, [location]);

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your interview report...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Interview Report</h1>
              <p className="text-green-100">Role: {reportData.role || "Not specified"}</p>
              <p className="text-green-100 text-sm">Experience: {reportData.experience || "N/A"} years</p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
            >
              <FaArrowLeft /> Back Home
            </button>
          </div>
        </div>

        {/* Score Section */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Overall Performance</h2>
              <p className="text-gray-600 text-sm mt-1">Based on your answers and AI analysis</p>
            </div>
            <div className="bg-green-100 rounded-full h-24 w-24 flex items-center justify-center">
              <span className="text-3xl font-bold text-green-600">
                {reportData.finalScore || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Q&A Section - THIS IS THE PART YOU WERE MISSING */}
        <div className="p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-green-600">📝</span> Detailed Question & Answer Analysis
          </h3>

          <div className="space-y-6">
            {reportData.questions && reportData.questions.length > 0 ? (
              reportData.questions.map((q, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="bg-green-100 text-green-700 rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-2">{q.question}</p>
                      
                      <div className="bg-white p-3 rounded-lg border border-gray-100 mb-2">
                        <p className="text-sm text-gray-500 font-medium">Your Answer:</p>
                        <p className="text-gray-700">{q.answer || "No answer provided"}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-600 font-medium">AI Feedback:</p>
                        <p className="text-gray-700 text-sm">{q.feedback || "Good response!"}</p>
                      </div>

                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                          Score: {q.score || 0}%
                        </span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                          Confidence: {q.confidence || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No detailed Q&A data available for this interview.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="p-8 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            💡 Tip: Practice regularly to improve your interview skills!
          </p>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <FaDownload /> Download Report
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default InterviewReport;