"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./StartupLoader.module.css";

const START_PROGRESS = 9;
const PROGRESS_CAP_BEFORE_LOAD = 92;
const MIN_VISIBLE_MS = 1100;
const MAX_WAIT_MS = 7000;
const EXIT_DURATION_MS = 420;
const COMPLETE_HOLD_MS = 180;

const STATUS_STEPS = [
  {
    until: 26,
    headline: "Connecting to Kerala soil database...",
    detail: "Authenticating museum archive nodes.",
  },
  {
    until: 54,
    headline: "Calibrating interactive globe coordinates...",
    detail: "Aligning terrain and horizon references.",
  },
  {
    until: 82,
    headline: "Preparing soil profiles and geochemical layers...",
    detail: "Streaming map textures and section metadata.",
  },
  {
    until: 100,
    headline: "Finalizing museum interface...",
    detail: "Stabilizing overlays and interaction controls.",
  },
];

function getStatusCopy(progress) {
  return STATUS_STEPS.find((step) => progress <= step.until) ?? STATUS_STEPS[STATUS_STEPS.length - 1];
}

export default function StartupLoader() {
  const [progress, setProgress] = useState(START_PROGRESS);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const startTimeRef = useRef(0);
  const progressRef = useRef(START_PROGRESS);
  const isLoadedRef = useRef(false);
  const exitStartedRef = useRef(false);

  const statusCopy = useMemo(() => getStatusCopy(progress), [progress]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    startTimeRef.current = window.performance.now();

    const finishLoading = () => {
      isLoadedRef.current = true;
    };

    const removeLoadListener = () => {
      window.removeEventListener("load", finishLoading);
    };

    if (document.readyState === "complete") {
      finishLoading();
    } else {
      window.addEventListener("load", finishLoading, { once: true });
    }

    const timeoutId = window.setTimeout(finishLoading, MAX_WAIT_MS);
    const progressIntervalId = window.setInterval(() => {
      const cap = isLoadedRef.current ? 100 : PROGRESS_CAP_BEFORE_LOAD;
      const current = progressRef.current;
      const delta = isLoadedRef.current
        ? Math.max(1.6, (100 - current) * 0.22)
        : Math.max(0.35, (cap - current) * 0.06);
      const next = Math.min(cap, current + delta);

      progressRef.current = next;
      setProgress(next);

      const elapsed = window.performance.now() - startTimeRef.current;
      if (
        !exitStartedRef.current &&
        isLoadedRef.current &&
        next >= 99.4 &&
        elapsed >= MIN_VISIBLE_MS
      ) {
        exitStartedRef.current = true;
        window.clearInterval(progressIntervalId);
        setProgress(100);
        window.setTimeout(() => {
          setIsExiting(true);
        }, COMPLETE_HOLD_MS);
      }
    }, 90);

    return () => {
      removeLoadListener();
      window.clearTimeout(timeoutId);
      window.clearInterval(progressIntervalId);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || typeof document === "undefined") {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isExiting) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, EXIT_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isExiting]);

  if (!isVisible) {
    return null;
  }

  const roundedProgress = Math.round(progress);

  return (
    <div
      className={`${styles.loader} ${isExiting ? styles.exiting : ""}`}
      aria-live="polite"
      aria-busy={!isExiting}
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.scanline} aria-hidden="true" />

      <section className={styles.panel}>
        <div className={styles.planetShell} aria-hidden="true">
          <div className={styles.planetGlow} />
          <div className={styles.planet}>
            <div className={styles.planetLabel}>
            </div>
          </div>
        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>Digital Soil Atlas</p>
          <h1 className={styles.title}>State Soil Museum</h1>
          <p className={styles.description}>
            Initializing interactive geochemical layers and soil profiles...
          </p>
        </div>

        <div className={styles.progressBlock}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>System Status: Loading</span>
            <span className={styles.progressValue}>{roundedProgress}%</span>
          </div>
          <div className={styles.progressTrack} aria-hidden="true">
            <div
              className={styles.progressFill}
              style={{ width: `${roundedProgress}%` }}
            />
          </div>
          <div className={styles.statusCopy}>
            <p>{statusCopy.headline}</p>
            <p>{roundedProgress === 100 ? "Museum interface online." : statusCopy.detail}</p>
          </div>
        </div>

        <div className={styles.footer}>
          Kerala State Department of Agriculture
        </div>
      </section>
    </div>
  );
}
