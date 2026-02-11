
export default function Lights() {
  return (
    <>
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