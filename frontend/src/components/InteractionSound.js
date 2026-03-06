"use client";

import { useEffect, useRef } from "react";

const SOUND_PATH = "/images/clikesound.mp3";
const AUDIO_POOL_SIZE = 4;
const INTERACTIVE_SELECTOR = [
  "button",
  "a[href]",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "summary",
  "[role='button']",
  "[role='link']",
  "[role='tab']",
  "[role='switch']",
  "[role='option']",
  "[data-click-sound]",
  "[class*='IndiaSVG-']",
  "[class*='cls-']",
].join(", ");

function createAudioPool() {
  return Array.from({ length: AUDIO_POOL_SIZE }, () => {
    const audio = new Audio(SOUND_PATH);
    audio.preload = "auto";
    audio.volume = 0.45;
    return audio;
  });
}

export default function InteractionSound() {
  const audioPoolRef = useRef([]);
  const nextAudioIndexRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    audioPoolRef.current = createAudioPool();

    const playInteractionSound = () => {
      if (audioPoolRef.current.length === 0) {
        return;
      }

      const audio = audioPoolRef.current[nextAudioIndexRef.current];
      nextAudioIndexRef.current = (nextAudioIndexRef.current + 1) % audioPoolRef.current.length;

      audio.pause();
      audio.currentTime = 0;

      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    const handleClick = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (!target.closest(INTERACTIVE_SELECTOR)) {
        return;
      }

      playInteractionSound();
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      audioPoolRef.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      audioPoolRef.current = [];
    };
  }, []);

  return null;
}
