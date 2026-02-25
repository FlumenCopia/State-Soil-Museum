
export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.1} /> 

      <directionalLight
        position={[-150, 50, 200]} 
        intensity={3.5}
      />
    </>
  );
}