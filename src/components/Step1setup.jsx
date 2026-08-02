import { motion } from "framer-motion";
import { useState } from "react";
import { FaUserTie, FaMicrophoneAlt, FaChartLine, FaFileUpload } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Step1setUp({ onStart }) {
  const userData = useSelector((state) => state.user?.data);
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  // 🚀 FIXED: Points to your live Render backend
  const ServerUrl = "https://interview-system-backend-2ark.onrender.com";

  const handleUploadResume = async () => {
    if (!resumeFile) {
      setError("Please select a file first");
      return;
    }
    
    setAnalyzing(true);
    setError("");

    const formdata = new FormData();
    formdata.append("resume", resumeFile);

    try {
      const result = await axios.post(`${ServerUrl}/api/interview/resume`, formdata, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("API Response:", result.data);
      
      // Extract data from backend
      let projectsData = result.data.projects || result.data.data?.projects || [];
      let skillsData = result.data.skills || result.data.data?.skills || [];
      
      projectsData = Array.isArray(projectsData) ? projectsData : [];
      skillsData = Array.isArray(skillsData) ? skillsData : [];
      
      // ✅ Auto-fill role and experience in input fields
      if (result.data.role) {
        setRole(result.data.role);
      }
      
      if (result.data.experience) {
        // Convert to string if it's a number
        const expValue = typeof result.data.experience === 'number' 
          ? result.data.experience.toString() 
          : result.data.experience;
        setExperience(expValue);
      }
      
      setProjects(projectsData);
      setSkills(skillsData);
      setResumeText(result.data.resumeText || result.data.data?.resumeText || "");
      setAnalysisDone(true);
      
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.message || "Failed to analyze resume. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    if (!role || !experience) {
      setError("Please fill in Role and Experience");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/generate-questions`,
        { role, experience, mode, resumeText, projects, skills },
        { withCredentials: true }
      );

      console.log("Generated Questions:", result.data);

      if (userData) {
        dispatch(
          setUserData({
            ...userData,
            credits: result.data.creditsLeft,
          })
        );
      }

      setLoading(false);
      onStart(result.data);

    } catch (error) {
      console.log("Start Error:", error);
      setError(error.response?.data?.message || "Failed to start interview.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4"
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">

        {/* Left Panel */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Start Your AI Interview
          </h2>
          <p className="text-gray-600 mb-10">
            Practice real interview scenarios powered by AI.
            Improve communication, technical skills, and confidence.
          </p>
          <div className="space-y-5">
            {[
              { icon: <FaUserTie className="text-green-600 text-xl" />, text: "Choose Role & Experience" },
              { icon: <FaMicrophoneAlt className="text-green-600 text-xl" />, text: "Smart Voice Interview" },
              { icon: <FaChartLine className="text-green-600 text-xl" />, text: "Performance Analytics" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center space-x-4 bg-white rounded-xl shadow-sm cursor-pointer p-4"
              >
                {item.icon}
                <span className="text-gray-700 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-12 bg-white"
        >
          <h2 className='text-3xl font-bold text-gray-800 mb-8'>
            Interview SetUp
          </h2>

          <div className='space-y-6'>
            {/* Role Input */}
            <div className='relative'>
              <FaUserTie className='absolute top-4 left-4 text-gray-400' />
              <input 
                type='text' 
                placeholder='Enter role'
                value={role}
                className='w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition'
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            {/* Experience Input */}
            <div className='relative'>
              <FaUserTie className='absolute top-4 left-4 text-gray-400' />
              <input 
                type='text' 
                placeholder='Enter experience (in years)'
                value={experience}
                className='w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition'
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            {/* Mode Select */}
            <select 
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
            >
              <option value="Technical">Technical Interview</option>
              <option value="HR">HR Interview</option>
            </select>

            {/* Resume Upload Section */}
            {!analysisDone ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => document.getElementById('resumeUpload').click()}
                className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition'
              >
                <FaFileUpload className='text-xl mx-auto text-green-600 mb-3' />
                <input 
                  type="file" 
                  accept="application/pdf" 
                  id="resumeUpload" 
                  className='hidden' 
                  onChange={e => {
                    setResumeFile(e.target.files[0]);
                    setError("");
                  }}
                />
                <p className='text-gray-600 font-medium'>
                  {resumeFile ? resumeFile.name : "Click to upload resume (PDF)"}
                </p>
                {resumeFile && (
                  <motion.div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    className='mt-4 bg-green-600 rounded-lg hover:bg-green-700 transition h-10 w-full flex items-center justify-center text-white font-medium cursor-pointer'
                  >
                    {analyzing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Analyzing...
                      </div>
                    ) : (
                      "Analyze Resume"
                    )}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-green-300 rounded-xl p-6 bg-green-50"
              >
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  ✓ Resume Analyzed Successfully
                </h3>
                
                {skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills Found:</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-green-200 text-green-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {projects.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Projects Found:</p>
                    <div className="space-y-2">
                      {projects.map((project, idx) => (
                        <div key={idx} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm">
                          {project}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {skills.length === 0 && projects.length === 0 && (
                  <p className="text-gray-600 text-sm">No skills or projects detected from the resume.</p>
                )}
                
                <button
                  onClick={() => {
                    setAnalysisDone(false);
                    setResumeFile(null);
                    setProjects([]);
                    setSkills([]);
                    setError("");
                  }}
                  className="mt-3 text-sm text-green-600 hover:text-green-700 underline"
                >
                  Upload different resume
                </button>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}
          </div>
          
          {/* Start Interview Button */}
          <motion.div className="mt-6">
            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={{ scale: (!role || !experience || loading) ? 1 : 1.03 }}
              whileTap={{ scale: (!role || !experience || loading) ? 1 : 0.95 }}
              className={`w-full py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md
                ${(!role || !experience || loading) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}
              `}
            >
              {loading ? "Generating Questions..." : "Start Interview"}
            </motion.button>
          </motion.div>

        </motion.div>

      </div>
    </motion.div>
  );
}

export default Step1setUp;