// ********** only for testing purposes, not used in the final version ********** 
// import { useEffect, useState } from "react";
// import { getProject } from "../services/ProjectService.js";
// import ArrayVisualizer from "./ArrayVisualizer.jsx";

// function Visualizer({ projectId }) {
//   const [project, setProject] = useState(null);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);

//   // Fetch project
//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const data = await getProject(projectId);
//         setProject(data);
//       } catch (error) {
//         console.error("Failed to fetch project:", error);
//       }
//     };

//     fetchProject();
//   }, [projectId]);

//   // Play functionality
//   useEffect(() => {
//     if (!isPlaying || !project) {
//       return;
//     }

//     const steps = project.aiAnalysis.steps;

//     if (currentStep >= steps.length - 1) {
//       setIsPlaying(false);
//       return;
//     }

//     const timer = setTimeout(() => {
//       setCurrentStep((prev) => prev + 1);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [isPlaying, currentStep, project]);

//   // Loading state
//   if (!project) {
//     return <p>Loading visualization...</p>;
//   }

//   const steps = project.aiAnalysis.steps;
//   const step = steps[currentStep];

//   const handlePrevious = () => {
//     setIsPlaying(false);

//     setCurrentStep((prev) => Math.max(prev - 1, 0));
//   };

//   const handleNext = () => {
//     setIsPlaying(false);

//     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
//   };

//   const handlePlay = () => {
//     if (currentStep === steps.length - 1) {
//       setCurrentStep(0);
//     }

//     setIsPlaying(true);
//   };

//   const handleStop = () => {
//     setIsPlaying(false);
//   };

//   const handleReset = () => {
//     setIsPlaying(false);
//     setCurrentStep(0);
//   };

//   return (
//     <div>
//       <h2>{project.title}</h2>

//       <p>
//         Step {currentStep + 1} / {steps.length}
//       </p>

//       <p>{step.description}</p>

//       <ArrayVisualizer
//         elements={project.aiAnalysis.visualization.elements}
//         highlights={step.state.highlights}
//       />

//       <div style={{ marginTop: "20px" }}>
//         <button onClick={handlePrevious}>Previous</button>

//         <button onClick={handlePlay}>Play</button>

//         <button onClick={handleStop}>Stop</button>

//         <button onClick={handleNext}>Next</button>

//         <button onClick={handleReset}>Reset</button>
//       </div>
//     </div>
//   );
// }

// export default Visualizer;
