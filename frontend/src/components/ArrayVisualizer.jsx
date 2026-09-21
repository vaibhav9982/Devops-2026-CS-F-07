// ********** only for testing purposes, not used in the final version ********** 
// import "./ArrayVisualizer.css";

// function ArrayVisualizer({ elements, highlights }) {
//   return (
//     <div className="array-visualizer">
//       <div className="array-container">
//         {elements.map((element, index) => {
//           let value = element;

//           // Supports:
//           // "arr[0] = 10"
//           // "arr[0]: 10"
//           if (element.includes("=")) {
//             value = element.split("=")[1].trim();
//           } else if (element.includes(":")) {
//             value = element.split(":")[1].trim();
//           }

//           const isHighlighted =
//             highlights.includes(String(index)) ||
//             highlights.includes(index) ||
//             highlights.includes(`index_${index}`) ||
//             highlights.includes("arr");

//           return (
//             <div className="array-item-wrapper" key={index}>
//               <div className="array-index">
//                 index {index}
//               </div>

//               <div
//                 className={`array-item ${
//                   isHighlighted ? "active" : ""
//                 }`}
//               >
//                 {value}
//               </div>

//               {isHighlighted && (
//                 <div className="array-pointer">
//                   ↑
//                   <span>index {index}</span>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default ArrayVisualizer;