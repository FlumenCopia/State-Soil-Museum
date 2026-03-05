"use client";

import { useEffect, useRef, useState } from "react";

const KERALA_PORTRAIT_PAGE_SIZE = 6;
const SWIPE_THRESHOLD_PX = 42;

export default function KeralaPortraitPanel({
  classOrder,
  colorDetails,
  selectedClass,
  onToggleSelection,
  onClearSelection,
}) {
  const dragStartXRef = useRef(null);
  const dragDeltaXRef = useRef(0);
  const draggingRef = useRef(false);
  const [page, setPage] = useState(0);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const pageCount = Math.ceil(classOrder.length / KERALA_PORTRAIT_PAGE_SIZE);
  const pages = Array.from({ length: pageCount }, (_, pageIndex) =>
    classOrder.slice(pageIndex * KERALA_PORTRAIT_PAGE_SIZE, (pageIndex + 1) * KERALA_PORTRAIT_PAGE_SIZE)
  );

  useEffect(() => {
    if (!selectedClass) return;
    const classIndex = classOrder.indexOf(selectedClass);
    if (classIndex < 0) return;
    setPage(Math.floor(classIndex / KERALA_PORTRAIT_PAGE_SIZE));
  }, [classOrder, selectedClass]);

  useEffect(() => {
    if (page > pageCount - 1) {
      setPage(Math.max(0, pageCount - 1));
    }
  }, [page, pageCount]);

  const beginDrag = (event) => {
    if (pageCount <= 1) return;
    draggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragDeltaXRef.current = 0;
  };

  const moveDrag = (event) => {
    if (!draggingRef.current || dragStartXRef.current == null) return;
    const deltaX = event.clientX - dragStartXRef.current;
    dragDeltaXRef.current = deltaX;
    setDragOffsetPx(deltaX);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragOffsetPx(0);

    const deltaX = dragDeltaXRef.current;
    dragStartXRef.current = null;
    dragDeltaXRef.current = 0;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    setPage((prev) => Math.max(0, Math.min(pageCount - 1, prev + (deltaX < 0 ? 1 : -1))));
  };

  return (
    <aside className="india-portrait-swiper-panel kerala-portrait-swiper-panel">
      <div className="india-portrait-swiper-head">
        <h3>Kerala Soil</h3>
        
        <p>Click or tap a region on the map to view soil data.</p>
      </div>

      <div
        className="india-portrait-swiper-window"
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <div
          className="india-portrait-swiper-track"
          style={{
            transform: `translateX(calc(-${page * 100}% + ${dragOffsetPx}px))`,
            transition: draggingRef.current ? "none" : undefined,
          }}
        >
          {pages.map((pageItems, pageIndex) => (
            <div className="india-portrait-swiper-page" key={`kerala-portrait-page-${pageIndex}`}>
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
        <div className="india-portrait-swiper-dots" aria-label="Kerala soil pages">
          {pages.map((_, pageIndex) => (
            <button
              key={`kerala-portrait-dot-${pageIndex}`}
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
