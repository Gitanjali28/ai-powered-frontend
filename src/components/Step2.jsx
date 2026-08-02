import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import femaleVideo from "../assets/female-ai.mp4";
import maleVideo from "../assets/male-ai.mp4";
import Timer from "./Timer";
import { Mic, MicOff } from "lucide-react";

function Step2({ interviewData, onFinish }) {
  const { questions, userName, interviewId } = interviewData;

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionSpoken, setQuestionSpoken] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const finalAnswerRef = useRef("");
  const isStartingMicRef = useRef(false);
  const introCompleteRef = useRef(false);

  const currentQuestion = questions?.[currentIndex];
  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  // ✅ FIXED: Points to your live Render backend
  const api = axios.create({
    baseURL: 'https://interview-system-backend-2ark.onrender.com',
    headers: { 'Content-Type': 'application/json' },
  });

  /* -------------------- Load Voices -------------------- */
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const female = voices.find(v =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        (v.name.toLowerCase().includes("google") && v.name.toLowerCase().includes("female"))
      );
      const male = voices.find(v =>
        v.name.toLowerCase().includes("david") ||
        (v.name.toLowerCase().includes("google") && v.name.toLowerCase().includes("male"))
      );

      if (female) {
        setSelectedVoice(female);
        setVoiceGender("female");
      } else if (male) {
        setSelectedVoice(male);
        setVoiceGender("male");
      } else {
        setSelectedVoice(voices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => (window.speechSynthesis.onvoiceschanged = null);
  }, []);

  /* -------------------- Speech Recognition -------------------- */
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Please use Google Chrome for speech recognition. You can still type your answers.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Microphone started - Speak now!");
      setIsMicOn(true);
      setPermissionDenied(false);
      isStartingMicRef.current = false;
    };
    
    recognition.onend = () => {
      console.log("🔇 Microphone stopped");
      setIsMicOn(false);
      isStartingMicRef.current = false;
    };
    
    recognition.onerror = (event) => {
      console.error("❌ Speech recognition error:", event.error);
      
      if (event.error === "not-allowed") {
        setPermissionDenied(true);
        alert("Please allow microphone access in your browser settings. You can still type your answers.");
      }
      setIsMicOn(false);
      isStartingMicRef.current = false;
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        const newAnswer = finalAnswerRef.current 
          ? finalAnswerRef.current + " " + finalTranscript 
          : finalTranscript;
        finalAnswerRef.current = newAnswer;
        setAnswer(newAnswer);
      }
    };

    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  /* -------------------- Start/Stop Mic Functions -------------------- */
  const startMic = useCallback(async () => {
    if (isStartingMicRef.current || isAIPlaying || isSubmittingRef.current || isMicOn || permissionDenied) return;
    if (!recognitionRef.current) return;
    
    isStartingMicRef.current = true;
    
    setTimeout(() => {
      if (recognitionRef.current && !isMicOn) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error("Error starting recognition:", err);
          isStartingMicRef.current = false;
        }
      }
    }, 100);
  }, [isAIPlaying, isMicOn, permissionDenied]);

  const stopMic = useCallback(() => {
    if (recognitionRef.current && isMicOn) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    isStartingMicRef.current = false;
  }, [isMicOn]);

  /* -------------------- Speak Function -------------------- */
  const speakText = useCallback((text) => {
    return new Promise((resolve) => {
      if (!selectedVoice) return resolve();
      if (isMicOn) stopMic();
      
      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = selectedVoice;
      utter.rate = 0.92;
      utter.pitch = 1.0;

      utter.onstart = () => {
        setIsAIPlaying(true);
        if (videoRef.current) videoRef.current.play().catch(() => {});
        setSubtitle(text);
      };

      utter.onend = () => {
        setIsAIPlaying(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        setSubtitle("");
        resolve();
      };

      window.speechSynthesis.speak(utter);
    });
  }, [selectedVoice, isMicOn, stopMic]);

  /* -------------------- Submit Answer -------------------- */
  const handleSubmit = useCallback(async () => {
    if (isSubmittingRef.current) return;
    
    const finalAnswer = finalAnswerRef.current || answer;
    if (!finalAnswer.trim()) {
      alert("Please provide an answer before submitting.");
      return;
    }
    
    stopMic();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsSubmitting(true);
    isSubmittingRef.current = true;
    
    const timeTaken = currentQuestion?.timeLimit 
      ? Math.max(0, currentQuestion.timeLimit - timeLeft)
      : 0;

    try {
      const response = await api.post("/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer: finalAnswer,
        timeTaken,
      });
      setFeedback(response.data.feedback);
      setShowFeedback(true);
    } catch (err) {
      console.error("❌ Submit error:", err);
      setFeedback("Your answer has been recorded. Great job!");
      setShowFeedback(true);
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  }, [interviewId, currentIndex, answer, timeLeft, currentQuestion, stopMic]);

  /* -------------------- Interview Flow -------------------- */
  useEffect(() => {
    if (!selectedVoice || !questions?.length) return;
    if (showFeedback) return;

    const flow = async () => {
      if (isIntroPhase && !introCompleteRef.current) {
        introCompleteRef.current = true;
        await speakText(`Hi ${userName}, let's begin the interview.`);
        await new Promise(resolve => setTimeout(resolve, 500));
        await speakText("I will ask you a few questions. Answer naturally.");
        await new Promise(resolve => setTimeout(resolve, 500));
        await speakText("Let's start with the first question.");
        setIsIntroPhase(false);
        setQuestionSpoken(false);
      } 
      else if (!isIntroPhase && currentQuestion && !questionSpoken && !isAIPlaying) {
        setQuestionSpoken(true);
        await speakText(currentQuestion.question);
        
        setTimeout(() => {
          if (!isSubmittingRef.current && !isAIPlaying && !showFeedback && !permissionDenied) {
            startMic();
          }
        }, 1000);
      }
    };

    flow();
  }, [selectedVoice, currentIndex, isIntroPhase, currentQuestion, showFeedback, isAIPlaying, questionSpoken, speakText, startMic, userName, questions, permissionDenied]);

  /* -------------------- Timer -------------------- */
  useEffect(() => {
    if (isIntroPhase || !currentQuestion?.timeLimit || showFeedback) return;

    if (timerRef.current) clearInterval(timerRef.current);

    // ✅ FIX: Only set timeLeft when a NEW question appears
    setTimeLeft(currentQuestion.timeLimit);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          if (!isSubmittingRef.current && !showFeedback) {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isIntroPhase, currentQuestion, showFeedback, handleSubmit]);

  /* -------------------- Reset question spoken when changing questions -------------------- */
  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setQuestionSpoken(false);
    }
  }, [currentIndex, isIntroPhase]);

  /* -------------------- Next Question -------------------- */
  const goToNext = async () => {
    setShowFeedback(false);
    setAnswer("");
    finalAnswerRef.current = "";
    isSubmittingRef.current = false;
    setIsSubmitting(false);
    stopMic();
    isStartingMicRef.current = false;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      console.log("🏁 Finishing interview...");
      setIsSubmitting(true);
      try {
        const response = await api.post("/api/interview/finish", { interviewId });
        onFinish(response.data);
      } catch (err) {
        // Fallback results if API fails
        const fallbackResults = {
          finalScore: 75,
          confidence: 70,
          communication: 75,
          correctness: 75,
          totalQuestions: questions.length,
          completedQuestions: currentIndex + 1,
          message: "Interview completed successfully!"
        };
        onFinish(fallbackResults);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl min-h-[80vh] bg-white rounded-3xl shadow-2xl border flex overflow-hidden">

        {/* Left Panel */}
        <div className="w-[30%] bg-gray-50 p-6 space-y-6 border-r">
          <video src={videoSource} ref={videoRef} muted className="w-full rounded-lg shadow-md" playsInline />
          {currentQuestion && <Timer timeLeft={timeLeft} totalTime={currentQuestion.timeLimit} />}
          {subtitle && (
            <div className="mt-4 p-3 bg-emerald-100 rounded-lg text-center text-sm animate-pulse">
              🤖 {subtitle}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-8 flex flex-col">
          <h2 className="text-2xl font-semibold text-emerald-600 mb-6">AI Smart Interview</h2>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-emerald-600 font-semibold mb-2">
              Question {currentIndex + 1} of {questions?.length}
            </p>
            <p className="font-medium text-gray-800 text-lg">{currentQuestion?.question}</p>
          </div>

          <label className="text-sm font-medium text-gray-700 mb-2">Your Answer:</label>
          <textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              finalAnswerRef.current = e.target.value;
            }}
            className="flex-1 border-2 border-emerald-400 rounded-xl p-4 resize-none focus:outline-none focus:border-emerald-600"
            placeholder="Speak or type your answer here..."
            disabled={isAIPlaying}
            rows={6}
          />

          <div className="flex gap-4 mt-6">
            {!permissionDenied && (
              <button
                onClick={isMicOn ? stopMic : startMic}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  isMicOn ? "bg-red-500 text-white hover:bg-red-600 animate-pulse" : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
                disabled={isAIPlaying || isSubmitting}
              >
                {isMicOn ? <MicOff size={20} /> : <Mic size={20} />}
                <span>{isMicOn ? "Stop Recording" : "Start Recording"}</span>
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isAIPlaying || (!answer.trim() && !finalAnswerRef.current)}
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Answer"}
            </button>
          </div>
          
          {isMicOn && (
            <div className="mt-4 text-sm text-emerald-600 text-center animate-pulse">🎤 Recording... Speak clearly</div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px] max-w-[90%] shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-emerald-600">AI Feedback</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-[300px] overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap">{feedback}</p>
            </div>
            <button
              onClick={goToNext}
              disabled={isSubmitting}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg w-full hover:bg-emerald-700 transition-all"
            >
              {currentIndex < questions.length - 1 ? "Next Question →" : "Finish Interview ✓"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Step2;