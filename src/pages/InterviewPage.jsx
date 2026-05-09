// import React, { useState } from 'react';
// import Step1setUp from '../components/Step1setup';
// import Step2 from '../components/Step2';
// import Step3 from '../components/Step3';

// function InterviewPage() {
//   const [step, setStep] = useState(1);
//   const [interviewData, setInterviewData] = useState(null);
//   const [interviewResults, setInterviewResults] = useState(null);

//   const handleSetupComplete = (data) => {
//     console.log("Setup complete:", data);
//     setInterviewData(data);
//     setStep(2);
//   };

//   const handleInterviewFinish = (results) => {
//     console.log("Interview finished:", results);
//     setInterviewResults(results);
//     setStep(3);
//   };

//   const handleRestart = () => {
//     setStep(1);
//     setInterviewData(null);
//     setInterviewResults(null);
//   };

//   return (
//     <div>
//       {step === 1 && <Step1setUp onStart={handleSetupComplete} />}  {/* ← CHANGE: onStart instead of onSetupComplete */}
//       {step === 2 && interviewData && (
//         <Step2 interviewData={interviewData} onFinish={handleInterviewFinish} />
//       )}
//       {step === 3 && interviewResults && (
//         <Step3 interviewResults={interviewResults} onRestart={handleRestart} />
//       )}
//     </div>
//   );
// }

// export default InterviewPage;

import React, { useState } from 'react';
import Step1setUp from '../components/Step1setup';
import Step2 from '../components/Step2';
import Step3 from '../components/Step3';

function InterviewPage() {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);
  const [interviewResults, setInterviewResults] = useState(null);

  const handleSetupComplete = (data) => {
    console.log("Setup complete:", data);
    setInterviewData(data);
    setStep(2);
  };

  const handleInterviewFinish = (results) => {
    console.log("Interview finished:", results);
    setInterviewResults(results);
    setStep(3);
  };

  const handleRestart = () => {
    setStep(1);
    setInterviewData(null);
    setInterviewResults(null);
  };

  return (
    <div>
      {step === 1 && <Step1setUp onStart={handleSetupComplete} />}  {/* ← CHANGE: Use onStart prop */}
      {step === 2 && interviewData && (
        <Step2 interviewData={interviewData} onFinish={handleInterviewFinish} />
      )}
      {step === 3 && interviewResults && (
        <Step3 results={interviewResults} onRetry={handleRestart} />
      )}
    </div>
  );
}

export default InterviewPage;