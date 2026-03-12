"use client";

import { useEffect, useRef, useState } from "react";

const MUSIC_PATH = "/images/bg.mp3";

function createBackgroundAudio(syncPlayingState) {
  const audio = new Audio(MUSIC_PATH);
  audio.loop = true;
  audio.preload = "none";
  audio.volume = 0.42;
  audio.addEventListener("play", syncPlayingState);
  audio.addEventListener("pause", syncPlayingState);
  return audio;
}

function VolumeIcon({ isPlaying }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      {isPlaying ? (
        <>
          <path d="M17 8.5a5.5 5.5 0 0 1 0 7" />
          <path d="M19.5 6a9 9 0 0 1 0 12" />
        </>
      ) : (
        <path d="m17 9 4 6M21 9l-4 6" />
      )}
    </svg>
  );
}

export default function HeroBackgroundMusic() {
  const audioRef = useRef(null);
  const unlockedRef = useRef(false);
  const ensureAudioRef = useRef(() => null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const syncPlayingState = () => {
      const audio = audioRef.current;
      setIsPlaying(Boolean(audio && !audio.paused));
    };

    const ensureAudio = () => {
      if (audioRef.current) {
        return audioRef.current;
      }

      const audio = createBackgroundAudio(syncPlayingState);
      audioRef.current = audio;
      return audio;
    };

    ensureAudioRef.current = ensureAudio;

    const startPlayback = () => {
      if (unlockedRef.current) {
        return;
      }

      const audio = ensureAudio();
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

    window.addEventListener("pointerdown", startPlayback, { once: true });
    window.addEventListener("keydown", startPlayback, { once: true });

    return () => {
      removeUnlockListeners();
      const audio = audioRef.current;
      if (audio) {
        audio.removeEventListener("play", syncPlayingState);
        audio.removeEventListener("pause", syncPlayingState);
        audio.pause();
        audio.src = "";
      }
      audioRef.current = null;
      ensureAudioRef.current = () => null;
    };
  }, []);

  const handleToggle = async () => {
    const audio = ensureAudioRef.current();
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
        <VolumeIcon isPlaying={isPlaying} />
      </span>
      <span className="bg-music-toggle__label">
        {isPlaying ? "Music On" : "Music Off"}
      </span>
    </button>
  );
}
