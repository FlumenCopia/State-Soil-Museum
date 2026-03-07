"use client";

import { useEffect, useRef, useState } from "react";

const MUSIC_PATH = "/images/bg.mp3";

export default function HeroBackgroundMusic() {
  const audioRef = useRef(null);
  const unlockedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const audio = new Audio(MUSIC_PATH);
    audioRef.current = audio;
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.82;

    const syncPlayingState = () => setIsPlaying(!audio.paused);

    const startPlayback = () => {
      if (unlockedRef.current) {
        return;
      }

      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            unlockedRef.current = true;
            syncPlayingState();
            removeUnlockListeners();
          })
          .catch(() => {
            setIsPlaying(false);
          });
        return;
      }

      unlockedRef.current = true;
      syncPlayingState();
      removeUnlockListeners();
    };

    const removeUnlockListeners = () => {
      window.removeEventListener("pointerdown", startPlayback);
      window.removeEventListener("keydown", startPlayback);
    };

    audio.addEventListener("play", syncPlayingState);
    audio.addEventListener("pause", syncPlayingState);

    startPlayback();
    window.addEventListener("pointerdown", startPlayback, { once: true });
    window.addEventListener("keydown", startPlayback, { once: true });

    return () => {
      removeUnlockListeners();
      audio.removeEventListener("play", syncPlayingState);
      audio.removeEventListener("pause", syncPlayingState);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      unlockedRef.current = true;
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="bg-music-toggle"
      aria-label={isPlaying ? "Pause background music" : "Play background music"}
      aria-pressed={isPlaying}
      title={isPlaying ? "Pause music" : "Play music"}
    >
      <span className="bg-music-toggle__icon" aria-hidden="true">
        <i className={`fa-solid ${isPlaying ? "fa-volume-high" : "fa-volume-xmark"}`} />
      </span>
      <span className="bg-music-toggle__label">
        {isPlaying ? "Music On" : "Music Off"}
      </span>
    </button>
  );
}
