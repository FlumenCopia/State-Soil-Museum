"use client";

import { useAppStore } from "@/store/useAppStore";

export default function TestViewButtons() {
  const setView = useAppStore((s) => s.setView);

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        zIndex: 9999,
        display: "flex",
        gap: "10px",
      }}
    >
      <button onClick={() => setView("globe")}>Globe</button>
      <button onClick={() => setView("india")}>India</button>
      <button onClick={() => setView("kerala")}>Kerala</button>
    </div>
  );
}
