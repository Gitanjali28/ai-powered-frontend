import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { HiSparkles } from "react-icons/hi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthModel from "../components/AuthModel";

// Icons
import {
  BsRobot,
  BsMic,
  BsClock,
  BsGraphUp,
  BsFileEarmarkText,
  BsDownload,
  BsCheck2Circle,
} from "react-icons/bs";

// Assets
import analyticImg from "../assets/ai-ans.png";
import resumeImg from "../assets/TECH.png";
import pdfImg from "../assets/pdf.png";
import evalImg from "../assets/HR.png";
import credit from "../assets/credit.png"
import MM from "../assets/MM.png"
import image1 from "../assets/img1.png"
import confi from "../assets/confi.png"
import Footer from "../components/Footer";



function Home() {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const userData = null;

  // ✅ FEATURES ARRAY
  const features = [
    {
      image: analyticImg,
      icon: <BsGraphUp size={20} />,
      title: "Performance Analytics",
      desc: "Get detailed analysis of your answers, strengths and weaknesses after each interview.",
    },
    {
      image: resumeImg,
      icon: <BsFileEarmarkText size={20} />,
      title: "Resume Based Questions",
      desc: "AI generates questions directly from your resume content for realistic practice.",
    },
    {
      image: pdfImg,
      icon: <BsDownload size={20} />,
      title: "Download Interview Report",
      desc: "Export your performance report as a professional PDF document.",
    },
    {
      image: evalImg,
      icon: <BsCheck2Circle size={20} />,
      title: "Real-time Evaluation",
      desc: "Instant scoring and feedback while you answer the questions.",
    },
  ];

  // ✅ AI MODES ARRAY
  const aiModes = [
    {
      image: confi,
      icon: <BsRobot size={20} />,
      title: "HR Interview Mode",
      desc: "Behavioral and communication based evaluation.",
    },
    {
      image: image1,
      icon: <BsMic size={20} />,
      title: "Technical Interview Mode",
      desc: "Role-specific deep technical questioning.",
    },
    {
      image: MM,
      icon: <BsGraphUp size={20} />,
      title: "Confidence Detection",
      desc: "Basic tone and voice confidence analysis.",
    },
    {
      image: credit,
      icon: <BsCheck2Circle size={20} />,
      title: "Credits System",
      desc: "Manage your usage with an inbuilt credit system.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 px-6 py-20">
        {/* HERO */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2">
            <HiSparkles size={16} className="text-green-600" />
            AI Powered Smart Interview Platform
          </div>
        </div>

        <div className="text-center mb-28">
          <motion.h1
            className="text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Practice Interviews with{" "}
            <span className="bg-green-100 text-green-600 px-5 py-1 rounded-full">
              AI Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg"
          >
            Role-based mock interviews with smart follow-ups, adaptive
            difficulty and real-time performance evaluation.
          </motion.p>
        </div>

        {/* STEP CARDS */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-32">
          {[
            {
              icon: <BsRobot size={24} />,
              step: "STEP 1",
              title: "Selection",
              desc: "AI adjusts difficulty based on selected job role.",
            },
            {
              icon: <BsMic size={24} />,
              step: "STEP 2",
              title: "Smart Voice Interview",
              desc: "Dynamic follow-up questions based on your answers.",
            },
            {
              icon: <BsClock size={24} />,
              step: "STEP 3",
              title: "Timer Based Simulation",
              desc: "Real interview pressure with time tracking.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="relative bg-white rounded-3xl border-2 border-green-100
              hover:border-green-500 p-10 w-80 max-w-[90%] shadow-md
              hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-green-500 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                {item.icon}
              </div>
              <div className="pt-10 text-center">
                <div className="text-xs text-green-600 font-bold mb-2 tracking-widest">
                  {item.step}
                </div>
                <h3 className="font-bold mb-3 text-xl text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ADVANCED AI CAPABILITIES */}
        <Section title="Advanced AI Capabilities" data={features} />

        {/* AI MODES */}
        <Section title="AI Modes" data={aiModes} />
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
        <Footer />
    </div>
  );
}

// ✅ Reusable Section (same design & motion)
const Section = ({ title, data }) => (
  <div className="max-w-6xl mx-auto pb-20">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-4xl font-semibold text-center mb-16"
    >
      {title.split(" ")[0]}{" "}
      <span className="text-green-600">{title.split(" ").slice(1).join(" ")}</span>
    </motion.h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {data.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
        >
          <div className="w-full sm:w-1/2 flex justify-center">
            <img
              src={feature.image}
              alt={feature.title}
              className="max-h-[160px] w-auto object-contain"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <div className="text-green-600 mb-3 bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Home;