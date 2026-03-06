"use client";

import { useEffect, useRef, useState } from "react";

const CELL_SIZE = 40;
const EFFECT_RADIUS = 220;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const GridTrailEffect = () => {
  const containerRef = useRef(null);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const frameRef = useRef(null);
  const [grid, setGrid] = useState({ columns: 0, rows: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateGrid = () => {
      const rect = container.getBoundingClientRect();
      setGrid({
        columns: Math.max(1, Math.ceil(rect.width / CELL_SIZE)),
        rows: Math.max(1, Math.ceil(rect.height / CELL_SIZE)),
      });
    };

    updateGrid();

    const resizeObserver = new ResizeObserver(updateGrid);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: isInside,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncCellCenters = () => {
      const containerRect = container.getBoundingClientRect();
      const cells = container.querySelectorAll("[data-grid-cell]");

      cells.forEach((cell) => {
        const cellRect = cell.getBoundingClientRect();
        cell.setAttribute("data-x", `${cellRect.left - containerRect.left + cellRect.width / 2}`);
        cell.setAttribute("data-y", `${cellRect.top - containerRect.top + cellRect.height / 2}`);
      });
    };

    syncCellCenters();

    const resizeObserver = new ResizeObserver(syncCellCenters);
    resizeObserver.observe(container);

    const animate = () => {
      if (!container) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const cells = container.querySelectorAll("[data-grid-cell]");
      const { x, y, active } = pointerRef.current;

      cells.forEach((cell) => {
        const cellX = Number(cell.getAttribute("data-x"));
        const cellY = Number(cell.getAttribute("data-y"));
        const distance = Math.hypot(x - cellX, y - cellY);
        const normalized = clamp(1 - distance / EFFECT_RADIUS, 0, 1);
        const strength = active ? normalized ** 1.85 : 0;

        cell.style.opacity = `${0.14 + strength * 0.9}`;
        cell.style.transform = `scale(${1 + strength * 0.28})`;
        cell.style.borderColor = `rgba(${48 + strength * 95}, ${132 + strength * 80}, 255, ${0.14 + strength * 0.78})`;
        cell.style.boxShadow = `0 0 ${8 + strength * 22}px rgba(52, 148, 255, ${strength * 0.34}), inset 0 0 ${10 + strength * 12}px rgba(106, 189, 255, ${strength * 0.18})`;
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [grid.columns, grid.rows]);

  const totalCells = grid.columns * grid.rows;

  return (
    <div ref={containerRef} className="grid-trail-effect" aria-hidden="true">
      <div className="grid-trail-effect__glow" />
      <div
        className="grid-trail-effect__grid"
        style={{
          gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))`,
          // gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: totalCells }).map((_, index) => {
          const column = index % grid.columns;
          const row = Math.floor(index / grid.columns);

          return (
            <span
              key={`${row}-${column}`}
              data-grid-cell
              className="grid-trail-effect__cell"
            />
          );
        })}
      </div>
    </div>
  );
};

export default GridTrailEffect;
