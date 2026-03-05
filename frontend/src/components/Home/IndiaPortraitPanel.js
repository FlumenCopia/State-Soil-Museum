"use client";

import { useEffect, useRef, useState } from "react";

const INDIA_PORTRAIT_PAGE_SIZE = 6;

export default function IndiaPortraitPanel({
  classOrder,
  colorDetails,
  selectedClass,
  onToggleSelection,
  onClearSelection,
}) {
  const touchStartXRef = useRef(null);
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(classOrder.length / INDIA_PORTRAIT_PAGE_SIZE);
  const pages = Array.from({ length: pageCount }, (_, pageIndex) =>
    classOrder.slice(pageIndex * INDIA_PORTRAIT_PAGE_SIZE, (pageIndex + 1) * INDIA_PORTRAIT_PAGE_SIZE)
  );

  useEffect(() => {
    if (!selectedClass) return;
    const classIndex = classOrder.indexOf(selectedClass);
    if (classIndex < 0) return;
    setPage(Math.floor(classIndex / INDIA_PORTRAIT_PAGE_SIZE));
  }, [classOrder, selectedClass]);

  useEffect(() => {
    if (page > pageCount - 1) {
      setPage(Math.max(0, pageCount - 1));
    }
  }, [page, pageCount]);

  const handleSwipeEnd = (event) => {
    if (touchStartXRef.current == null || pageCount <= 1) return;
    const touchX = event.changedTouches?.[0]?.clientX;
    if (typeof touchX !== "number") return;
    const deltaX = touchX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) < 36) return;
    setPage((prev) => Math.max(0, Math.min(pageCount - 1, prev + (deltaX < 0 ? 1 : -1))));
  };

  return (
    <aside className="india-portrait-swiper-panel">
      <div className="india-portrait-swiper-head">
         <h3>India Soil</h3>

        <p>Click or tap a region on the map to view soil data.</p>
      </div>

      <div
        className="india-portrait-swiper-window"
        onTouchStart={(event) => {
          touchStartXRef.current = event.touches?.[0]?.clientX ?? null;
        }}
        onTouchEnd={handleSwipeEnd}
      >
        <div
          className="india-portrait-swiper-track"
          style={{
            transform: `translateX(-${page * 100}%)`,
          }}
        >
          {pages.map((pageItems, pageIndex) => (
            <div className="india-portrait-swiper-page" key={`india-portrait-page-${pageIndex}`}>
              {pageItems.map((className) => {
                const item = colorDetails[className];
                const isSelected = selectedClass === className;
                return (
                  <button
                    key={className}
                    type="button"
                    className={`india-portrait-soil-card${isSelected ? " active" : ""}`}
                    onClick={() => onToggleSelection(className)}
                  >
                    <span
                      className="india-portrait-soil-dot"
                      style={{ background: item.color }}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="india-portrait-swiper-footer">
        <button className="see-all-section-btn" type="button" onClick={onClearSelection}>
          See all section
        </button>
        <div className="india-portrait-swiper-dots" aria-label="India soil pages">
          {pages.map((_, pageIndex) => (
            <button
              key={`india-portrait-dot-${pageIndex}`}
              type="button"
              className={`india-portrait-swiper-dot${page === pageIndex ? " active" : ""}`}
              onClick={() => setPage(pageIndex)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
