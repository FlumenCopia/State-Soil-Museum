// export default function Lights() {
//   return (
//     <>
//       <ambientLight intensity={0.3} />
//       <directionalLight
//         position={[80, 120, 40]}
//         intensity={1}
//       />
//     </>
//   );
// }


// // src/components/canvas/Lights.jsx

// export default function Lights() {
//   return (
//     <>
//       <ambientLight intensity={0.15} /> {/* Darker shadows */}
//       <directionalLight
//         position={[150, 50, 100]} // Light hits from the side
//         intensity={3.5} // High intensity for high contrast
//       />
//     </>
//   );
// }








// export default function Lights() {
//   return (
//     <>
    
//       <ambientLight intensity={0.1} /> 
//       <directionalLight
//         position={[200, 50, 100]} // Strong side light
//         intensity={3}
//       />
//     </>
//   );
// }




// src/components/canvas/Lights.jsx
export default function Lights() {
  return (
    <>
      {/* Very dim ambient light so the dark side isn't pitch black */}
      <ambientLight intensity={0.1} /> 
      
      {/* Position [-150, 50, 200]: 
          -150 on X (Left)
          50 on Y (Up)
          200 on Z (In front of the globe, towards the user)
      */}
      <directionalLight
        position={[-150, 50, 200]} 
        intensity={3.5}
      />
    </>
  );
}