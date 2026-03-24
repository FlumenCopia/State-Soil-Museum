"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import CanvasWrapper from "@/components/canvas/CanvasWrapper";
import GlobeScene from "@/components/scenes/GlobeScene";
import StateScene from "@/components/scenes/StateScene";
import { useAppStore } from "@/store/useAppStore";
import gsap from "gsap";

import IndiaSVG from "../Svg/IndiaSVG";
import KeralaSVG from "../Svg/KeralaSVG";
import IndiaPortraitPanel from "./IndiaPortraitPanel";
import KeralaPortraitPanel from "./KeralaPortraitPanel";

/* CONSTANTS */
const SCALE_OUT = 0;

// Overlay controls (position + animation timings)
const OVERLAY_INITIAL_SCALE = 1;
const OVERLAY_FINAL_SCALE = 1;
const OVERLAY_POSITION_X_BEFORE = 0;
const OVERLAY_POSITION_Y_BEFORE = 0;
const OVERLAY_POSITION_X_AFTER = 0;
const OVERLAY_POSITION_Y_AFTER = 0;
const KERALA_OVERLAY_POSITION_X_BEFORE_PORTRAIT = -40;
const KERALA_OVERLAY_POSITION_Y_BEFORE_PORTRAIT = -40;
const KERALA_OVERLAY_POSITION_X_AFTER_PORTRAIT = -40;
const KERALA_OVERLAY_POSITION_Y_AFTER_PORTRAIT =-40;
const OVERLAY_ROTATION_BEFORE = 0;
const OVERLAY_ROTATION_AFTER = 0;
// India-specific before/after positioning controls.
const INDIA_OVERLAY_POSITION_X_BEFORE = -80;
const INDIA_OVERLAY_POSITION_Y_BEFORE = -80;
const INDIA_OVERLAY_POSITION_X_AFTER = -80;
const INDIA_OVERLAY_POSITION_Y_AFTER =-80;
const INDIA_OVERLAY_ROTATION_BEFORE = 0;
const INDIA_OVERLAY_ROTATION_AFTER = 0;
const OUTLINE_DELAY_SECONDS = 0.12;
const OUTLINE_DRAW_DURATION = 0.95;
const FILL_REVEAL_DURATION = 0.45;
const ZOOM_DURATION = 0.4;
const BLUR_FADE_IN_DURATION = 0.28;
const BLUR_DELAY_AFTER_FILL = 0.02;
const ZOOM_DELAY_AFTER_BLUR = 0.02;
const PANEL_ENTRY_OFFSET_X = 88;
const PANEL_SCROLL_DRIFT_X = 18;

const INDIA_WIDTH_BEFORE = "var(--india-svg-width)";
const INDIA_HEIGHT_BEFORE = "var(--india-svg-height)";
const INDIA_WIDTH_BEFORE_PORTRAIT = "var(--india-svg-width)";
const INDIA_HEIGHT_BEFORE_PORTRAIT = "var(--india-svg-height)";

const INDIA_WIDTH_AFTER = "min(68vw, 680px)";
const INDIA_HEIGHT_AFTER = "68vh";
const INDIA_WIDTH_AFTER_PORTRAIT = "var(--india-svg-after-width, min(68vw, 680px))";
const INDIA_HEIGHT_AFTER_PORTRAIT = "var(--india-svg-after-height, 68vh)";
const KERALA_WIDTH_BEFORE = "min(86vw, 900px)";
const KERALA_HEIGHT_BEFORE = "80vh";
const KERALA_WIDTH_AFTER = "min(100vw, 1120px)";
const KERALA_HEIGHT_AFTER = "96vh";

const KERALA_WIDTH_BEFORE_PORTRAIT = "var(--kerala-svg-width, min(88vw, 900px))";
const KERALA_HEIGHT_BEFORE_PORTRAIT = "var(--kerala-svg-height, 88vh)";
const KERALA_WIDTH_AFTER_PORTRAIT = "var(--kerala-svg-after-width, min(94vw, 980px))";
const KERALA_HEIGHT_AFTER_PORTRAIT = "var(--kerala-svg-after-height, 88vh)";
const INDIA_PORTRAIT_PRESETS = Object.freeze({
  base: {
    widthBefore: INDIA_WIDTH_BEFORE_PORTRAIT,
    heightBefore: INDIA_HEIGHT_BEFORE_PORTRAIT,
    widthAfter: INDIA_WIDTH_AFTER_PORTRAIT,
    heightAfter: INDIA_HEIGHT_AFTER_PORTRAIT,
    overlayXBefore: INDIA_OVERLAY_POSITION_X_BEFORE,
    overlayYBefore: INDIA_OVERLAY_POSITION_Y_BEFORE,
    overlayXAfter: INDIA_OVERLAY_POSITION_X_AFTER,
    overlayYAfter: INDIA_OVERLAY_POSITION_Y_AFTER,
  },
  medium: {
    widthBefore: INDIA_WIDTH_BEFORE_PORTRAIT,
    heightBefore: INDIA_HEIGHT_BEFORE_PORTRAIT,
    widthAfter: INDIA_WIDTH_AFTER_PORTRAIT,
    heightAfter: INDIA_HEIGHT_AFTER_PORTRAIT,
    overlayXBefore: INDIA_OVERLAY_POSITION_X_BEFORE,
    overlayYBefore: INDIA_OVERLAY_POSITION_Y_BEFORE,
    overlayXAfter: INDIA_OVERLAY_POSITION_X_AFTER,
    overlayYAfter: INDIA_OVERLAY_POSITION_Y_AFTER,
  },
  compact: {
    widthBefore: INDIA_WIDTH_BEFORE_PORTRAIT,
    heightBefore: INDIA_HEIGHT_BEFORE_PORTRAIT,
    widthAfter: INDIA_WIDTH_AFTER_PORTRAIT,
    heightAfter: INDIA_HEIGHT_AFTER_PORTRAIT,
    overlayXBefore: INDIA_OVERLAY_POSITION_X_BEFORE,
    overlayYBefore: INDIA_OVERLAY_POSITION_Y_BEFORE,
    overlayXAfter: INDIA_OVERLAY_POSITION_X_AFTER,
    overlayYAfter: INDIA_OVERLAY_POSITION_Y_AFTER,
  },

});

const KERALA_PORTRAIT_PRESETS = Object.freeze({
  base: {
    widthBefore: KERALA_WIDTH_BEFORE_PORTRAIT,
    heightBefore: KERALA_HEIGHT_BEFORE_PORTRAIT,
    widthAfter: KERALA_WIDTH_AFTER_PORTRAIT,
    heightAfter: KERALA_HEIGHT_AFTER_PORTRAIT,
  },

  medium: {
    widthBefore: KERALA_WIDTH_BEFORE_PORTRAIT,
    heightBefore: KERALA_HEIGHT_BEFORE_PORTRAIT,
    widthAfter: KERALA_WIDTH_AFTER_PORTRAIT,
    heightAfter: KERALA_HEIGHT_AFTER_PORTRAIT,
  },

  compact: {
    widthBefore: KERALA_WIDTH_BEFORE_PORTRAIT,
    heightBefore: KERALA_HEIGHT_BEFORE_PORTRAIT,
    widthAfter: KERALA_WIDTH_AFTER_PORTRAIT,
    heightAfter: KERALA_HEIGHT_AFTER_PORTRAIT,
  },
});

function getPortraitPreset(width, height) {
  const safeWidth = Math.max(width, 1);
  const aspectRatio = height / safeWidth;
  const isTallPortrait = aspectRatio >= 1.20;

  if (safeWidth <= 820 || (safeWidth <= 960 && isTallPortrait)) {
    return {
      india: INDIA_PORTRAIT_PRESETS.compact,
      kerala: KERALA_PORTRAIT_PRESETS.compact,
    };
  }

  if (safeWidth <= 960 || aspectRatio >= 1.7) {
    return {
      india: INDIA_PORTRAIT_PRESETS.medium,
      kerala: KERALA_PORTRAIT_PRESETS.medium,
    };
  }

  return {
    india: INDIA_PORTRAIT_PRESETS.base,
    kerala: KERALA_PORTRAIT_PRESETS.base,
  };
}

const MAP_BACKDROP_BACKGROUND_KERALA = `
  radial-gradient(120% 95% at 50% 46%, rgba(34, 98, 198, 0.34) 0%, rgba(12, 32, 68, 0.78) 46%, rgba(4, 12, 28, 0.96) 100%),
  radial-gradient(52% 42% at 16% 19%, rgba(92, 170, 255, 0.26) 0%, rgba(92, 170, 255, 0) 72%),
  radial-gradient(44% 36% at 85% 24%, rgba(148, 198, 255, 0.16) 0%, rgba(148, 198, 255, 0) 74%),
  repeating-linear-gradient(118deg, rgba(92, 162, 255, 0.11) 0 1px, transparent 1px 130px),
  repeating-linear-gradient(28deg, rgba(74, 126, 220, 0.1) 0 1px, transparent 1px 130px),
  url('/images/bg3.png')
`;
const MAP_BACKDROP_BACKGROUND_INDIA = `
  radial-gradient(120% 95% at 50% 46%, rgba(34, 98, 198, 0.34) 0%, rgba(12, 32, 68, 0.78) 46%, rgba(4, 12, 28, 0.96) 100%),
  radial-gradient(52% 42% at 16% 19%, rgba(92, 170, 255, 0.26) 0%, rgba(92, 170, 255, 0) 72%),
  radial-gradient(44% 36% at 85% 24%, rgba(148, 198, 255, 0.16) 0%, rgba(148, 198, 255, 0) 74%),
  repeating-linear-gradient(118deg, rgba(92, 162, 255, 0.11) 0 1px, transparent 1px 130px),
  repeating-linear-gradient(28deg, rgba(74, 126, 220, 0.1) 0 1px, transparent 1px 130px),
  url('/images/bg3.png')
`;
const MAP_BACKDROP_BOX_SHADOW =
  "inset 0 0 140px rgba(0, 0, 0, 0.72), inset 0 0 240px rgba(2, 8, 24, 0.92)";
const MAP_BACKDROP_SIZE_KERALA =
  "cover, cover, cover, auto, auto, cover";
const MAP_BACKDROP_SIZE_INDIA = "cover, cover, cover, auto, auto, cover";
const MAP_BACKDROP_POSITION_KERALA =
  "center center, left top, right top, center center, center center, 78% 54%";
const MAP_BACKDROP_POSITION_INDIA =
  "center center, left top, right top, center center, center center, center center";
const MAP_BACKDROP_REPEAT_KERALA =
  "no-repeat, no-repeat, no-repeat, repeat, repeat, no-repeat";
const MAP_BACKDROP_REPEAT_INDIA =
  "no-repeat, no-repeat, no-repeat, repeat, repeat, no-repeat";
const INDIA_COLOR_CLASS_PATTERN = /^IndiaSVG-\d+$/;
const KERALA_COLOR_CLASS_PATTERN = /^cls-(11|[1-9])$/;
const KERALA_COLOR_DETAILS = Object.freeze({
  "cls-1": {
    label: "Black Cotton Soils",
    color: "#888888",
    details: "Well-drained coarse-textured soil seen in selected Kerala regions.",
    image: "/images/hill.jpg",
  },
  "cls-2": {
    label: "Red Soils",
    color: "#ff00fe",
    details: "Balanced loamy red soil with moderate moisture-holding capacity.",
    image: "/images/hill.jpg",
  },
  "cls-3": {
    label: "Coastal Alluvium Soils",
    color: "#96fffe",
    details: "Mixed red-yellow profile typically requiring organic enrichment.",
    image: "/images/hill.jpg",
  },

  "cls-5": {
    label: " Kari Soils",
    color: "#04b293",
    details: "Hill-foot and slope soils with variable depth and gravel content.",
    image: "/images/hill.jpg",
  },
  "cls-6": {
    label: "Forest Soils",
    color: "#009900",
    details: "Light-textured low-organic soils represented by this mapped class.",
    image: "/images/hill.jpg",
  },
  "cls-7": {
    label: "Hill Soils",
    color: "#ceffc8",
    details: "Fine to medium-textured soils with moderate nutrient status.",
    image: "/images/hill.jpg",
  },

  "cls-8": {
    label: "Alluvium Soils",
    color: "#ffff01",
    details: "Freely draining sandy-loam profile suitable for multiple crops.",
    image: "/images/hill.jpg",
  },


  "cls-9": {
    label: "Acid Soils",
    color: "#f7c4a2",
    details: "Clay-rich darker soils with higher moisture retention.",
    image: "/images/hill.jpg",
  },

  "cls-11": {
    label: "Lateritic Soils",
    color: "#cc0033",
    details: "Highland soils influenced by slope, rainfall, and forest cover.",
    image: "/images/hill.jpg",
  },
  "cls-10": {
    label: "District Boundary",
    color: "#030304",
    details: "Transition zones containing mixed red and black soil traits.",
    image: "/images/hill.jpg",
  },
  "cls-4": {
    label: "Water Body",
    color: "#3c36bc",
    details: "Leached lateritic soil common in high-rainfall and upland belts.",
    image: "/images/hill.jpg",
  },
});
const KERALA_CLASS_ORDER = Object.keys(KERALA_COLOR_DETAILS);

const INDIA_COLOR_DETAILS = Object.freeze({
  "IndiaSVG-20": { label: "Boundary / Outline", color: "#000", details: "Map outline class used as geographic border." },
  "IndiaSVG-21": { label: "Skeletal Soils", color: "#add7d6", details: "Skeletal soils in India are shallow, coarse-textured soils, often rocky, with low water-holding capacity and limited fertility. Primarily found in Ladakh, the Vindhyan range, they consist largely of rock fragments, gravel and boulders." },
  "IndiaSVG-31": { label: "Red Sandy Soils", color: "#ff6a13", details: "Red sandy soil is a well-drained, sandy, coarse-textured, low moisture soil with a distinct red colour caused by iron oxide (hematite). Generally less fertile, acidic and low in humus, nitrogen and phosphorus, found in arid/semi-arid regions, ideal for crops like pulses, millets and tubers." },
  "IndiaSVG-30": { label: "Red Loamy Soils", color: "#f4cd37", details: "Red loamy soils are type of red soil, characteristically coloured by high iron oxide content and formed by the weathering of granite, gneiss, and diorite rocks. They are generally well drained, loamy textured with better structure ,moderately fertility and nutrient holding capacity. often requiring irrigation and fertilizer management, seen especially in the southern states." },
  "IndiaSVG-26": { label: "Red and Yellow Soils", color: "#fdd5a4", details: "Red and yellow soils (covering approx. 10.6% of India) form on crystalline metamorphic rocks in low-rainfall, eastern/southern Deccan Plateau regions. They are Sandy to loamy textured, Low to moderate water holding capacity & fertility, low in humus and nitrogen and phosphorus. They appear red due to iron diffusion and yellow when hydrated" },
  "IndiaSVG-25": { label: "Grey and Brown Soils", color: "#d3bccb", details: "Grey and brown soils in India, largely prevalent in semi-arid to sub-humid regions developed under low to moderate rainfall, formed from alluvial and wind-blown deposits. They are sandy to loam textured soils formed from weathering of granite, gneiss and schist. Characterized by high salinity, low organic matter and low moisture retention. They support hardy crops like millets, pulses and fodder requiring irrigation. " },

  "IndiaSVG-32": { label: "Mountain Soils", color: "#bcc3dc", details: "Mountain soil, or forest soil, covers about 18.2 million hectares (5.5%) of India, (primarly Himalayan region).They are acidic, humus rich,acidic, dark brown, loamy/silty in valleys and coarse-grained on upper slopes, Prone to erosion. Formed by weathering of rocks in mountains, often shallow and immature soils." },
  "IndiaSVG-34": { label: "Desert Soils", color: "#f4eeb4", details: "Desert soils, known as Aridisols, are dry, nutrient-poor, often alkaline soils found in arid and semi-arid regions, develop in regions with very low rainfall and high temperature. Low rainfall leads to minimal leaching and High evaporation causes salt accumulation. They are characterized by sandy or gravelly textures, low organic matter/ humus, high salinity, and rapid water draining." },
  "IndiaSVG-29": { label: "Black Soils", color: "#6d6b67", details: "Black soils (Regur soil or black cotton soil) covers about 16.6% of the total geographical area, primarily in the Deccan lava plateau. Rich in clay, iron, lime and magnesium, it is highly fertile, moisture-retentive, and ideal for cotton, wheat and soybean." },
  "IndiaSVG-35": { label: "Sandy Loam", color: "#ffffff", details: "Sandy loam soil is characterized by high sand content, good draining and gritty texture, predominantly found in eastern and western coastal regions. It requires organic amendments to improve water-holding capacity and nutrient retention for agriculture." },
  "IndiaSVG-33": { label: "Alluvial Soils", color: "#34945f", details: "Alluvial soil is India's most extensive soil and agriculturally important soils covering around 45% of its land area. Primarily found in the Indo-Gangetic –Brahmaputra plains, formed by the river deposits, making it highly fertile and ideal for crops like rice, wheat, sugarcane and cotton. most widespread in India." },




  "IndiaSVG-22": { label: "Terai Soils", color: "#d6e3a7", details: "Terai soils are fertile, moisture-retentive, and marshy alluvial soils found in a 15-30 km wide, humid, and forested belt along the Himalayan foothills. These fine-textured, clayey soils are rich in organic matter and nitrogen but deficient in phosphate, making them ideal for high-yield crops like sugarcane, rice and wheat." },
  "IndiaSVG-23": { label: "Laterite Soils", color: "#dccd67", details: "Laterite soil is a rusty-red, acidic, and nutrient-poor soil type formed by intense leaching and weathering of iron/aluminium-rich rocks in tropical regions with high temperature and heavy rainfall. The name “laterite” comes from word later(Latin) ie., soil becomes hard like brick when exposed to air." },


  "IndiaSVG-24": { label: "Sub Mountain Soils", color: "#fbf6b0", details: "Sub-mountain soils (or sub-montane soils) are variant of forest/mountain soils found in India's lower Himalayan, North-eastern hill, and valley regions.They are typically rich in humus, deep and acidic making them ideal for orchards, fruits crops and tea." },
  "IndiaSVG-27": { label: "Glaciers", color: "#f5f5ed", details: "Glacial soils are primarily found in the high-altitude regions of the Greater Himalayas, Karakoram, Ladakh, and Zaskar ranges, are immature, often frozen and possess low organic matter. These nutrient-rich mineral sediments are crucial for forming fertile soils in lower valleys, unsuitable for agriculture in the native form." },
  "IndiaSVG-28": { label: "Mixed Red and Black Soils", color: "#f0c438", details: " Mixed red and black soils are fertile, hybrid soils formed by the mixture of red soil (from iron-rich crystalline rocks) and black soil (from volcanic lava). These soils are ideal for growing cotton and maize." },


});
const INDIA_CLASS_ORDER = Object.keys(INDIA_COLOR_DETAILS)
  .filter((className) => className !== "IndiaSVG-20")
  .sort((a, b) => Number(a.replace("IndiaSVG-", "")) - Number(b.replace("IndiaSVG-", "")));

const SVG_FILL_ORDER_ATTR = "data-fill-order";
const INDIA_OVERLAP_SELECTED_CLASS = "IndiaSVG-29";
const INDIA_OVERLAP_HIGHLIGHT_SELECTOR = ".lighting.IndiaSVG-21, .lighting.IndiaSVG-28";

function groupElementsByParent(elements) {
  return elements.reduce((groups, el) => {
    const parent = el.parentElement;
    if (!parent) return groups;

    if (!groups.has(parent)) {
      groups.set(parent, []);
    }

    groups.get(parent).push(el);
    return groups;
  }, new Map());
}

function cacheSvgFillOrder(elements, fillClassName) {
  let fillOrder = 0;

  elements.forEach((el) => {
    if (!el.classList.contains(fillClassName)) return;

    if (!el.hasAttribute(SVG_FILL_ORDER_ATTR)) {
      el.setAttribute(SVG_FILL_ORDER_ATTR, String(fillOrder));
    }

    fillOrder += 1;
  });
}

function restoreSvgFillOrder(elements, fillClassName, drawAnchorSelector) {
  const fillElements = elements.filter((el) => el.classList.contains(fillClassName));

  groupElementsByParent(fillElements).forEach((nodes, parent) => {
    const anchor = drawAnchorSelector ? parent.querySelector(drawAnchorSelector) : null;

    nodes
      .slice()
      .sort(
        (a, b) =>
          Number(a.getAttribute(SVG_FILL_ORDER_ATTR) ?? 0) -
          Number(b.getAttribute(SVG_FILL_ORDER_ATTR) ?? 0)
      )
      .forEach((el) => {
        if (anchor && anchor.parentElement === parent) {
          parent.insertBefore(el, anchor);
          return;
        }

        parent.appendChild(el);
      });
  });
}

function raiseSvgFillPaths(elements, className, fillClassName, drawAnchorSelector) {
  if (!className) return;

  const matchingFillElements = elements.filter(
    (el) => el.classList.contains(fillClassName) && el.classList.contains(className)
  );

  groupElementsByParent(matchingFillElements).forEach((nodes, parent) => {
    const anchor = drawAnchorSelector ? parent.querySelector(drawAnchorSelector) : null;

    nodes.forEach((el) => {
      if (anchor && anchor.parentElement === parent) {
        parent.insertBefore(el, anchor);
        return;
      }

      parent.appendChild(el);
    });
  });
}

function syncSvgHighlights({
  container,
  elements,
  focusClass,
  selectedClass,
  hoveredClass,
  fillClassName,
  drawAnchorSelector,
}) {
  container?.classList.toggle(focusClass, Boolean(selectedClass || hoveredClass));

  restoreSvgFillOrder(elements, fillClassName, drawAnchorSelector);

  elements.forEach((el) => {
    el.classList.remove("highlight");
    el.classList.remove("selected-highlight");

    if (selectedClass && el.classList.contains(selectedClass)) {
      el.classList.add("selected-highlight");
    }

    if (hoveredClass && el.classList.contains(hoveredClass)) {
      el.classList.add("highlight");
    }
  });

  raiseSvgFillPaths(elements, selectedClass, fillClassName, drawAnchorSelector);

  if (hoveredClass !== selectedClass) {
    raiseSvgFillPaths(elements, hoveredClass, fillClassName, drawAnchorSelector);
  }
}

function syncIndiaHighlightOverlay({ container, selectedClass, hoveredClass }) {
  const overlay = container?.querySelector(".IndiaSVG-highlight-overlay");
  if (!overlay) return;

  overlay.replaceChildren();

  const isSelected = selectedClass === INDIA_OVERLAP_SELECTED_CLASS;
  const isHovered = hoveredClass === INDIA_OVERLAP_SELECTED_CLASS;

  if (!isSelected && !isHovered) return;

  const overlapElements = Array.from(
    container.querySelectorAll(INDIA_OVERLAP_HIGHLIGHT_SELECTOR)
  );

  overlapElements.forEach((el) => {
    const clone = el.cloneNode(true);
    if (!(clone instanceof SVGElement)) return;
    if (isHovered) {
    }
    if (isSelected) {
    }
    overlay.appendChild(clone);
  });
}



export default function GobalMap() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const setOverlayMapView = useAppStore((s) => s.setOverlayMapView);
  const indiaRevealReady = useAppStore((s) => s.indiaRevealReady);
  const overlayMapView = useAppStore((s) => s.overlayMapView);

  const scrollRef = useRef(null);
  const blurRef = useRef(null);
  const overlayRef = useRef(null);
  const keralaSvgRef = useRef(null);
  const indiaSvgRef = useRef(null);

  const indiaContainerRef = useRef(null);
  const keralaContainerRef = useRef(null);
  const keralaAnimRef = useRef(null);
  const indiaAnimRef = useRef(null);
  const scrollViewRef = useRef("globe");
  const colorElementsRef = useRef([]);
  const indiaColorElementsRef = useRef([]);
  const activeColorClassRef = useRef(null);
  const hoverColorClassRef = useRef(null);
  const activeIndiaClassRef = useRef(null);
  const hoverIndiaClassRef = useRef(null);
  const [activeColorClass, setActiveColorClass] = useState(null);
  const [hoverColorClass, setHoverColorClass] = useState(null);
  const [activeIndiaClass, setActiveIndiaClass] = useState(null);
  const [hoverIndiaClass, setHoverIndiaClass] = useState(null);
  const [indiaZoomComplete, setIndiaZoomComplete] = useState(false);
  const [keralaZoomComplete, setKeralaZoomComplete] = useState(false);
  const [isSoilImageZoomed, setIsSoilImageZoomed] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  const showOverlay = (view === "india" || view === "kerala") && indiaRevealReady;
  const isKerala = overlayMapView === "kerala";
  const isPortrait = viewportSize.height > viewportSize.width;
  const isPortraitLayout = isPortrait;
  const portraitPreset = getPortraitPreset(viewportSize.width, viewportSize.height);
  const indiaPortraitPreset = portraitPreset.india;
  const keralaPortraitPreset = portraitPreset.kerala;
  const shouldRenderIndiaSvg = showOverlay && !isKerala;
  const shouldRenderKeralaSvg = showOverlay && isKerala;
  const indiaSvgWidth = isPortraitLayout
    ? indiaZoomComplete
      ? indiaPortraitPreset.widthAfter
      : indiaPortraitPreset.widthBefore
    : indiaZoomComplete
      ? INDIA_WIDTH_AFTER
      : INDIA_WIDTH_BEFORE;
  const indiaSvgHeight = isPortraitLayout
    ? indiaZoomComplete
      ? indiaPortraitPreset.heightAfter
      : indiaPortraitPreset.heightBefore
    : indiaZoomComplete
      ? INDIA_HEIGHT_AFTER
      : INDIA_HEIGHT_BEFORE;
  const keralaSvgWidth = isPortraitLayout
    ? keralaZoomComplete
      ? keralaPortraitPreset.widthAfter
      : keralaPortraitPreset.widthBefore
    : keralaZoomComplete
      ? KERALA_WIDTH_AFTER
      : KERALA_WIDTH_BEFORE;
  const keralaSvgHeight = isPortraitLayout
    ? keralaZoomComplete
      ? keralaPortraitPreset.heightAfter
      : keralaPortraitPreset.heightBefore
    : keralaZoomComplete
      ? KERALA_HEIGHT_AFTER
      : KERALA_HEIGHT_BEFORE;
  const indiaOverlayXBefore = isPortraitLayout
    ? indiaPortraitPreset.overlayXBefore
    : INDIA_OVERLAY_POSITION_X_BEFORE;
  const indiaOverlayYBefore = isPortraitLayout
    ? indiaPortraitPreset.overlayYBefore
    : INDIA_OVERLAY_POSITION_Y_BEFORE;
  const indiaOverlayXAfter = isPortraitLayout
    ? indiaPortraitPreset.overlayXAfter
    : INDIA_OVERLAY_POSITION_X_AFTER;
  const indiaOverlayYAfter = isPortraitLayout
    ? indiaPortraitPreset.overlayYAfter
    : INDIA_OVERLAY_POSITION_Y_AFTER;
  const keralaOverlayXBefore = isPortraitLayout
    ? KERALA_OVERLAY_POSITION_X_BEFORE_PORTRAIT
    : OVERLAY_POSITION_X_BEFORE;
  const keralaOverlayYBefore = isPortraitLayout
    ? KERALA_OVERLAY_POSITION_Y_BEFORE_PORTRAIT
    : OVERLAY_POSITION_Y_BEFORE;
  const keralaOverlayXAfter = isPortraitLayout
    ? KERALA_OVERLAY_POSITION_X_AFTER_PORTRAIT
    : OVERLAY_POSITION_X_AFTER;
  const keralaOverlayYAfter = isPortraitLayout
    ? KERALA_OVERLAY_POSITION_Y_AFTER_PORTRAIT
    : OVERLAY_POSITION_Y_AFTER;
  const selectedColorClass = hoverColorClass || activeColorClass;
  const selectedIndiaClass = hoverIndiaClass || activeIndiaClass;
  const selectedColorDetails = selectedColorClass
    ? KERALA_COLOR_DETAILS[selectedColorClass]
    : null;
  const selectedIndiaDetails = selectedIndiaClass
    ? INDIA_COLOR_DETAILS[selectedIndiaClass] ?? {
      label: `India Soil Region ${selectedIndiaClass.replace("IndiaSVG-", "")}`,
      color: "#6ab7ff",
      details: "Region selected on India map. Soil details can be customized in INDIA_COLOR_DETAILS.",
    }
    : null;
  const activeBackdropBackground = isKerala
    ? MAP_BACKDROP_BACKGROUND_KERALA
    : MAP_BACKDROP_BACKGROUND_INDIA;
  const activeBackdropSize = isKerala ? MAP_BACKDROP_SIZE_KERALA : MAP_BACKDROP_SIZE_INDIA;
  const activeBackdropPosition = isKerala
    ? MAP_BACKDROP_POSITION_KERALA
    : MAP_BACKDROP_POSITION_INDIA;
  const activeBackdropRepeat = isKerala ? MAP_BACKDROP_REPEAT_KERALA : MAP_BACKDROP_REPEAT_INDIA;

  useEffect(() => {
    scrollViewRef.current = view;
  }, [view]);

  useEffect(() => {
    if (view !== "kerala") return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [view]);

  const scrollToMapSection = () => {
    const indiaSection = document.getElementById("india-section");
    if (!indiaSection) return;
    indiaSection.scrollIntoView({ behavior: "auto", block: "start" });
  };

  const handleMapPreviewSwitch = () => {
    scrollToMapSection();
    setView(view === "india" ? "kerala" : "india");
  };

  const clearIndiaSelection = () => {
    activeIndiaClassRef.current = null;
    hoverIndiaClassRef.current = null;
    setHoverIndiaClass(null);
    setActiveIndiaClass(null);
  };
  const clearKeralaSelection = () => {
    activeColorClassRef.current = null;
    hoverColorClassRef.current = null;
    setHoverColorClass(null);
    setActiveColorClass(null);
  };
  const toggleIndiaSelection = (className) => {
    if (!indiaZoomComplete) return;
    if (activeIndiaClassRef.current === className) {
      clearIndiaSelection();
      return;
    }
    activeIndiaClassRef.current = className;
    hoverIndiaClassRef.current = null;
    setHoverIndiaClass(null);
    setActiveIndiaClass(className);
  };
  const toggleKeralaSelection = (className) => {
    if (activeColorClassRef.current === className) {
      clearKeralaSelection();
      return;
    }
    activeColorClassRef.current = className;
    hoverColorClassRef.current = null;
    setHoverColorClass(null);
    setActiveColorClass(className);
  };

  useEffect(() => {
    const updateViewport = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  /* SECTION VIEW TRANSITIONS */
  useEffect(() => {
    const HYSTERESIS_PX = 64;
    let rafId = null;

    const resolveViewFromScroll = () => {
      // Keep Kerala as an explicit button-driven view.
      if (view === "kerala") return;
      const indiaSection = document.getElementById("india-section");
      if (!indiaSection) return;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const indiaTop = indiaSection.offsetTop;
      const indiaSwitchY = indiaTop - window.innerHeight * 0.5;
      const currentView = scrollViewRef.current;
      let nextView = currentView;

      if (currentView === "globe" && scrollY >= indiaSwitchY + HYSTERESIS_PX) {
        nextView = "india";
      } else if (currentView === "india") {
        if (scrollY < indiaSwitchY - HYSTERESIS_PX) {
          nextView = "globe";
        }
      }

      if (nextView !== currentView) {
        scrollViewRef.current = nextView;
        setView(nextView);
      }
    };

    const onScroll = () => {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        resolveViewFromScroll();
      });
    };

    const onResize = () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      resolveViewFromScroll();
    };

    resolveViewFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [setView, view]);

  useEffect(() => {
    const handleExploreMap = () => {
      setOverlayMapView("india");
      setView("india");
    };

    window.addEventListener("hero:explore-map", handleExploreMap);
    return () => window.removeEventListener("hero:explore-map", handleExploreMap);
  }, [setOverlayMapView, setView]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const leftPanels = Array.from(root.querySelectorAll('[data-map-side="left"]'));
    const leftTopPanels = Array.from(root.querySelectorAll('[data-map-side="left-top"]'));
    const rightPanels = Array.from(root.querySelectorAll('[data-map-side="right"]'));
    const allLeftPanels = [...leftPanels, ...leftTopPanels];
    const allPanels = [...allLeftPanels, ...rightPanels];

    if (!allPanels.length) return;

    gsap.killTweensOf(allPanels);

    if (!showOverlay) {
      gsap.set(allLeftPanels, { x: -PANEL_ENTRY_OFFSET_X, opacity: 0 });
      gsap.set(rightPanels, { x: PANEL_ENTRY_OFFSET_X, opacity: 0 });
      return;
    }

    if (isPortraitLayout) {
      gsap.set(allPanels, { x: 0, opacity: 1 });
      return;
    }

    gsap.fromTo(
      allLeftPanels,
      { x: -PANEL_ENTRY_OFFSET_X, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.58, ease: "power2.out", stagger: 0.06, overwrite: "auto" }
    );
    gsap.fromTo(
      rightPanels,
      { x: PANEL_ENTRY_OFFSET_X, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.58, ease: "power2.out", stagger: 0.06, overwrite: "auto" }
    );

    const updatePanelDrift = () => {
      const indiaSection = document.getElementById("india-section");
      if (!indiaSection) return;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const viewportCenterY = scrollY + window.innerHeight * 0.5;
      const start = indiaSection.offsetTop;
      const end = indiaSection.offsetTop + indiaSection.offsetHeight;
      const range = Math.max(1, end - start);
      const progress = Math.min(1, Math.max(0, (viewportCenterY - start) / range));
      const drift = (progress - 0.5) * 2;

      gsap.to(allLeftPanels, {
        x: -drift * PANEL_SCROLL_DRIFT_X,
        duration: 0.2,
        ease: "none",
        overwrite: "auto",
      });
      gsap.to(rightPanels, {
        x: drift * PANEL_SCROLL_DRIFT_X,
        duration: 0.2,
        ease: "none",
        overwrite: "auto",
      });
    };

    updatePanelDrift();
    window.addEventListener("scroll", updatePanelDrift, { passive: true });
    window.addEventListener("resize", updatePanelDrift);

    return () => {
      window.removeEventListener("scroll", updatePanelDrift);
      window.removeEventListener("resize", updatePanelDrift);
      gsap.killTweensOf(allPanels);
    };
  }, [showOverlay, isPortraitLayout, view, isKerala]);

  /* BLUR + OVERLAY ANIMATION */
  useEffect(() => {
    const blur = blurRef.current;
    const overlay = overlayRef.current;
    if (!blur || !overlay) return;

    gsap.killTweensOf([blur, overlay]);
    if (indiaAnimRef.current) {
      indiaAnimRef.current.kill();
      indiaAnimRef.current = null;
    }
    if (keralaAnimRef.current) {
      keralaAnimRef.current.kill();
      keralaAnimRef.current = null;
    }

    gsap.set(overlay, {
      x: isKerala ? keralaOverlayXBefore : indiaOverlayXBefore,
      y: isKerala ? keralaOverlayYBefore : indiaOverlayYBefore,
      rotation: isKerala ? OVERLAY_ROTATION_BEFORE : INDIA_OVERLAY_ROTATION_BEFORE,
      transformOrigin: "50% 50%",
    });

    if (!showOverlay) {
      gsap
        .timeline()
        .to(overlay, {
          opacity: 0,
          scale: SCALE_OUT,
          x: isKerala ? keralaOverlayXBefore : indiaOverlayXBefore,
          y: isKerala ? keralaOverlayYBefore : indiaOverlayYBefore,
          rotation: isKerala ? OVERLAY_ROTATION_BEFORE : INDIA_OVERLAY_ROTATION_BEFORE,
          duration: 0.5,
        })
        .to(blur, { opacity: 0, duration: 0.4 }, "-=0.3");
      return;
    }

    gsap.set(overlay, { opacity: 1 });
    if (isKerala) {
      gsap.set(blur, { opacity: 0 });
      gsap.set(overlay, { scale: OVERLAY_INITIAL_SCALE });
    } else {
      gsap.set(blur, { opacity: 0 });
    }
  }, [showOverlay, isKerala, indiaOverlayXBefore, indiaOverlayYBefore, keralaOverlayXBefore, keralaOverlayYBefore]);

  // India sequence:
  // small image -> blur background -> outline draw -> fill reveal -> zoom to full.
  useEffect(() => {
    if (!showOverlay || !indiaSvgRef.current || isKerala) return;
    setIndiaZoomComplete(false);
    activeIndiaClassRef.current = null;
    hoverIndiaClassRef.current = null;
    setActiveIndiaClass(null);
    setHoverIndiaClass(null);

    const svg = indiaSvgRef.current;
    const drawPaths = svg.querySelectorAll(".IndiaSVG-draw-path");
    const fillPaths = svg.querySelectorAll(".IndiaSVG-fill-path");
    const overlay = overlayRef.current;
    const blur = blurRef.current;
    if (!overlay || !blur) return;

    gsap.killTweensOf([overlay, blur]);

    gsap.set(overlay, {
      opacity: 1,
      scale: OVERLAY_INITIAL_SCALE,
      x: indiaOverlayXBefore,
      y: indiaOverlayYBefore,
      rotation: INDIA_OVERLAY_ROTATION_BEFORE,
      transformOrigin: "50% 50%",
    });
    gsap.set(blur, { opacity: 0 });
    gsap.set(fillPaths, { opacity: 0 });

    drawPaths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    const tl = gsap.timeline();
    tl.to(blur, {
      opacity: 1,
      duration: BLUR_FADE_IN_DURATION,
      ease: "power2.out",
    });
    tl.to({}, { duration: OUTLINE_DELAY_SECONDS });
    tl.to(drawPaths, {
      strokeDashoffset: 0,
      duration: OUTLINE_DRAW_DURATION,
      ease: "power2.out",
    });
    tl.to(fillPaths, {
      opacity: 1,
      duration: FILL_REVEAL_DURATION,
      ease: "power2.out",
    });
    tl.to(
      overlay,
      {
        scale: OVERLAY_FINAL_SCALE,
        x: indiaOverlayXAfter,
        y: indiaOverlayYAfter,
        rotation: INDIA_OVERLAY_ROTATION_AFTER,
        duration: ZOOM_DURATION,
        ease: "power3.out",
        force3D: true,
      },
      `>+${BLUR_DELAY_AFTER_FILL + ZOOM_DELAY_AFTER_BLUR}`
    );
    tl.eventCallback("onComplete", () => setIndiaZoomComplete(true));

    indiaAnimRef.current = tl;
    return () => {
      tl.kill();
      indiaAnimRef.current = null;
    };
  }, [isKerala, showOverlay, indiaOverlayXAfter, indiaOverlayXBefore, indiaOverlayYAfter, indiaOverlayYBefore]);

  /* INDIA/KERALA SWITCH */
  useEffect(() => {
    if (!indiaContainerRef.current || !keralaContainerRef.current) return;

    if (isKerala) {
      gsap.to(indiaContainerRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
        overwrite: "auto",
      });
      gsap.to(keralaContainerRef.current, {
        opacity: 1,
        duration: 0.55,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    } else {
      gsap.to(keralaContainerRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
        overwrite: "auto",
      });
      gsap.to(indiaContainerRef.current, {
        opacity: 1,
        duration: 0.55,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    }
  }, [isKerala]);

  // Kerala sequence:
  // small image -> blur background -> outline -> color -> zoom to full.
  useEffect(() => {
    if (!showOverlay || !keralaSvgRef.current || !isKerala) return;
    setKeralaZoomComplete(false);

    const svg = keralaSvgRef.current;
    const drawPaths = svg.querySelectorAll(".cls-10");
    const fillPaths = svg.querySelectorAll(".fill-path");
    const overlay = overlayRef.current;
    const blur = blurRef.current;
    if (!overlay || !blur) return;

    gsap.killTweensOf([overlay, blur]);

    gsap.set(overlay, {
      opacity: 1,
      scale: OVERLAY_INITIAL_SCALE,
      x: keralaOverlayXBefore,
      y: keralaOverlayYBefore,
      rotation: OVERLAY_ROTATION_BEFORE,
      transformOrigin: "50% 50%",
    });
    gsap.set(blur, { opacity: 0 });
    gsap.set(fillPaths, { opacity: 0 });

    drawPaths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    const tl = gsap.timeline();
    tl.to(blur, {
      opacity: 1,
      duration: BLUR_FADE_IN_DURATION,
      ease: "power2.out",
    });
    tl.to({}, { duration: OUTLINE_DELAY_SECONDS });
    tl.to(drawPaths, {
      strokeDashoffset: 0,
      duration: OUTLINE_DRAW_DURATION,
      ease: "power2.out",
    });
    tl.to(fillPaths, {
      opacity: 1,
      duration: FILL_REVEAL_DURATION,
      ease: "power2.out",
    });
    tl.to(
      overlay,
      {
        scale: OVERLAY_FINAL_SCALE,
        x: keralaOverlayXAfter,
        y: keralaOverlayYAfter,
        rotation: OVERLAY_ROTATION_AFTER,
        duration: ZOOM_DURATION,
        ease: "power3.out",
        force3D: true,
      },
      `>+${BLUR_DELAY_AFTER_FILL + ZOOM_DELAY_AFTER_BLUR}`
    );
    tl.eventCallback("onComplete", () => setKeralaZoomComplete(true));

    keralaAnimRef.current = tl;
    return () => {
      tl.kill();
      keralaAnimRef.current = null;
    };
  }, [isKerala, showOverlay, keralaOverlayXAfter, keralaOverlayXBefore, keralaOverlayYAfter, keralaOverlayYBefore]);

  useEffect(() => {
    const container = keralaContainerRef.current;
    if (!container || !showOverlay || !isKerala) return;

    const elements = Array.from(container.querySelectorAll("path, polygon, rect"));
    const getColorClass = (el) =>
      Array.from(el.classList).find((name) => KERALA_COLOR_CLASS_PATTERN.test(name)) ?? null;
    const colorElements = elements.filter((el) => getColorClass(el));
    colorElementsRef.current = colorElements;
    cacheSvgFillOrder(colorElements, "fill-path");

    const paintHighlights = () => {
      syncSvgHighlights({
        container,
        elements: colorElementsRef.current,
        focusClass: "kerala-has-focus",
        selectedClass: activeColorClassRef.current,
        hoveredClass: hoverColorClassRef.current,
        fillClassName: "fill-path",
        drawAnchorSelector: ".draw-path",
      });
    };

    const handleClick = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const clickableElement = target.closest("path, polygon, rect");
      if (!clickableElement || !container.contains(clickableElement)) return;

      const colorClass = getColorClass(clickableElement);
      if (!colorClass) return;
      if (activeColorClassRef.current === colorClass) {
        activeColorClassRef.current = null;
        setActiveColorClass(null);
        paintHighlights();
        return;
      }
      activeColorClassRef.current = colorClass;
      setActiveColorClass(colorClass);
      paintHighlights();
    };

    const handleContainerClick = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const clickedColorClass = getColorClass(target);
      if (clickedColorClass) return;
    };

    const handlePointerMove = (e) => {
      if (e.pointerType === "touch") return;

      const target = e.target;
      if (!(target instanceof Element)) return;
      const hoveredElement = target.closest("path, polygon, rect");

      if (!hoveredElement || !container.contains(hoveredElement)) {
        if (hoverColorClassRef.current !== null) {
          hoverColorClassRef.current = null;
          setHoverColorClass(null);
          paintHighlights();
        }
        return;
      }

      const colorClass = getColorClass(hoveredElement);
      if (hoverColorClassRef.current === colorClass) return;

      hoverColorClassRef.current = colorClass;
      setHoverColorClass(colorClass);
      paintHighlights();
    };

    const handlePointerLeave = () => {
      if (hoverColorClassRef.current === null) return;
      hoverColorClassRef.current = null;
      setHoverColorClass(null);
      paintHighlights();
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    container.addEventListener("click", handleContainerClick);
    container.addEventListener("click", handleClick);
    paintHighlights();

    return () => {
      syncSvgHighlights({
        container,
        elements: colorElementsRef.current,
        focusClass: "kerala-has-focus",
        selectedClass: null,
        hoveredClass: null,
        fillClassName: "fill-path",
        drawAnchorSelector: ".draw-path",
      });
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      container.removeEventListener("click", handleContainerClick);
      container.removeEventListener("click", handleClick);
      colorElementsRef.current = [];
    };
  }, [isKerala, showOverlay]);

  useEffect(() => {
    const selectedClass = activeColorClassRef.current;
    const hoveredClass = hoverColorClassRef.current;
    syncSvgHighlights({
      container: keralaContainerRef.current,
      elements: colorElementsRef.current,
      focusClass: "kerala-has-focus",
      selectedClass,
      hoveredClass,
      fillClassName: "fill-path",
      drawAnchorSelector: ".draw-path",
    });
  }, [activeColorClass, hoverColorClass]);

  useEffect(() => {
    const container = indiaContainerRef.current;
    if (!container || !showOverlay || isKerala || !indiaZoomComplete) {
      if (container) {
        container.classList.remove("india-has-focus");
      }
      return;
    }

    const elements = Array.from(container.querySelectorAll("path, polygon, rect"));
    const getColorClass = (el) =>
      Array.from(el.classList).find((name) => INDIA_COLOR_CLASS_PATTERN.test(name)) ?? null;
    const colorElements = elements.filter((el) => getColorClass(el));
    indiaColorElementsRef.current = colorElements;
    cacheSvgFillOrder(colorElements, "IndiaSVG-fill-path");

    const paintHighlights = () => {
      syncSvgHighlights({
        container,
        elements: indiaColorElementsRef.current,
        focusClass: "india-has-focus",
        selectedClass: activeIndiaClassRef.current,
        hoveredClass: hoverIndiaClassRef.current,
        fillClassName: "IndiaSVG-fill-path",
        drawAnchorSelector: ".IndiaSVG-draw-path",
      });
      syncIndiaHighlightOverlay({
        container,
        selectedClass: activeIndiaClassRef.current,
        hoveredClass: hoverIndiaClassRef.current,
      });
    };

    const handleClick = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const clickableElement = target.closest("path, polygon, rect");
      if (!clickableElement || !container.contains(clickableElement)) return;

      const colorClass = getColorClass(clickableElement);
      if (!colorClass) return;
      if (activeIndiaClassRef.current === colorClass) {
        activeIndiaClassRef.current = null;
        setActiveIndiaClass(null);
        paintHighlights();
        return;
      }
      activeIndiaClassRef.current = colorClass;
      setActiveIndiaClass(colorClass);
      paintHighlights();
    };

    const handleContainerClick = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const clickedColorClass = getColorClass(target);
      if (clickedColorClass) return;
    };

    const handlePointerMove = (e) => {
      if (e.pointerType === "touch") return;

      const target = e.target;
      if (!(target instanceof Element)) return;
      const hoveredElement = target.closest("path, polygon, rect");

      if (!hoveredElement || !container.contains(hoveredElement)) {
        if (hoverIndiaClassRef.current !== null) {
          hoverIndiaClassRef.current = null;
          setHoverIndiaClass(null);
          paintHighlights();
        }
        return;
      }

      const colorClass = getColorClass(hoveredElement);
      if (hoverIndiaClassRef.current === colorClass) return;

      hoverIndiaClassRef.current = colorClass;
      setHoverIndiaClass(colorClass);
      paintHighlights();
    };

    const handlePointerLeave = () => {
      if (hoverIndiaClassRef.current === null) return;
      hoverIndiaClassRef.current = null;
      setHoverIndiaClass(null);
      paintHighlights();
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    container.addEventListener("click", handleContainerClick);
    container.addEventListener("click", handleClick);
    paintHighlights();

    return () => {
      syncSvgHighlights({
        container,
        elements: indiaColorElementsRef.current,
        focusClass: "india-has-focus",
        selectedClass: null,
        hoveredClass: null,
        fillClassName: "IndiaSVG-fill-path",
        drawAnchorSelector: ".IndiaSVG-draw-path",
      });
      syncIndiaHighlightOverlay({
        container,
        selectedClass: null,
        hoveredClass: null,
      });
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      container.removeEventListener("click", handleContainerClick);
      container.removeEventListener("click", handleClick);
      indiaColorElementsRef.current = [];
    };
  }, [isKerala, showOverlay, indiaZoomComplete]);

  useEffect(() => {
    if (!indiaZoomComplete) {
      syncSvgHighlights({
        container: indiaContainerRef.current,
        elements: indiaColorElementsRef.current,
        focusClass: "india-has-focus",
        selectedClass: null,
        hoveredClass: null,
        fillClassName: "IndiaSVG-fill-path",
        drawAnchorSelector: ".IndiaSVG-draw-path",
      });
      syncIndiaHighlightOverlay({
        container: indiaContainerRef.current,
        selectedClass: null,
        hoveredClass: null,
      });
      return;
    }

    const selectedClass = activeIndiaClassRef.current;
    const hoveredClass = hoverIndiaClassRef.current;
    syncSvgHighlights({
      container: indiaContainerRef.current,
      elements: indiaColorElementsRef.current,
      focusClass: "india-has-focus",
      selectedClass,
      hoveredClass,
      fillClassName: "IndiaSVG-fill-path",
      drawAnchorSelector: ".IndiaSVG-draw-path",
    });
    syncIndiaHighlightOverlay({
      container: indiaContainerRef.current,
      selectedClass,
      hoveredClass,
    });
  }, [activeIndiaClass, hoverIndiaClass, indiaZoomComplete]);

  useEffect(() => {
    setIsSoilImageZoomed(false);
  }, [selectedColorClass]);

  useEffect(() => {
    if (isKerala) return;
    setActiveColorClass(null);
    setHoverColorClass(null);
    activeColorClassRef.current = null;
    hoverColorClassRef.current = null;
    setKeralaZoomComplete(false);
    setIsSoilImageZoomed(false);
  }, [isKerala]);

  useEffect(() => {
    if (!isKerala) return;
    setActiveIndiaClass(null);
    setHoverIndiaClass(null);
    activeIndiaClassRef.current = null;
    hoverIndiaClassRef.current = null;
  }, [isKerala]);

  return (
    <main ref={scrollRef} style={{ position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <CanvasWrapper>
          <Suspense fallback={null}>
            <GlobeScene />
          </Suspense>
          <Suspense fallback={null}>{view === "kerala" && <StateScene />}</Suspense>
        </CanvasWrapper>
      </div>

      <div
        ref={blurRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          opacity: 0,
          pointerEvents: "none",
          background: activeBackdropBackground,
          backgroundSize: activeBackdropSize,
          backgroundPosition: activeBackdropPosition,
          backgroundRepeat: activeBackdropRepeat,
          boxShadow: MAP_BACKDROP_BOX_SHADOW,
          mixBlendMode: "normal",
        }}
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 30,
          pointerEvents: view === "globe" ? "none" : "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={overlayRef}
          style={{
            position: "relative",
            display: "grid",
            placeItems: "center",
            willChange: "transform, opacity",
          }}
        >
          <div ref={indiaContainerRef} style={{ gridArea: "1 / 1" }}>
            {shouldRenderIndiaSvg && (
              <IndiaSVG
                ref={indiaSvgRef}
                className={isPortraitLayout ? "INDIA_WIDTH_AFTER_PORTRAIT" : undefined}
                width={indiaSvgWidth}
                height={indiaSvgHeight}
                isZoomed={indiaZoomComplete}
                showLabels={indiaZoomComplete}
                showFilter={indiaZoomComplete}
              />
            )}
          </div>

          <div ref={keralaContainerRef} style={{ gridArea: "1 / 1", opacity: 0 }}>
              {shouldRenderKeralaSvg && (
                <KeralaSVG
                  ref={keralaSvgRef}
                  className={isPortraitLayout ? "KERALA_WIDTH_AFTER_PORTRAIT" : undefined}
                  width={keralaSvgWidth}
                  height={keralaSvgHeight}
                  isZoomed={keralaZoomComplete}
                />
              )}
          </div>
        </div>
      </div>

      {isKerala && showOverlay && (
        <>
          {isPortraitLayout ? (
            <KeralaPortraitPanel
              classOrder={KERALA_CLASS_ORDER}
              colorDetails={KERALA_COLOR_DETAILS}
              selectedClass={selectedColorClass}
              onToggleSelection={toggleKeralaSelection}
              onClearSelection={clearKeralaSelection}
            />
          ) : (
            <aside
              data-map-side="left"
              style={{
                position: "fixed",
                top: "50%",
                left: 24,
                transform: "translateY(-50%)",
                zIndex: 60,
                width: "min(280px, 26vw)",
                minWidth: 220,
                background:
                  "radial-gradient(140% 110% at 100% 0%, rgba(49, 136, 255, 0.22), rgba(49, 136, 255, 0) 55%), linear-gradient(155deg, rgba(8, 24, 56, 0.9), rgba(4, 14, 38, 0.84) 55%, rgba(7, 30, 72, 0.86) 100%)",
                border: "1px solid rgba(88, 168, 255, 0.45)",
                borderRadius: 18,
                padding: "16px 14px",
                color: "#eaf3ff",
                backdropFilter: "blur(14px) saturate(122%)",
                WebkitBackdropFilter: "blur(14px) saturate(122%)",
                boxShadow:
                  "0 0 0 1px rgba(124, 194, 255, 0.24), 0 0 35px rgba(49, 142, 255, 0.32), 0 20px 50px rgba(2, 8, 26, 0.68), inset 0 0 40px rgba(38, 118, 255, 0.18), inset 0 1px 0 rgba(196, 228, 255, 0.32)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    letterSpacing: "0.35px",
                    color: "rgba(226, 241, 255, 0.95)",
                  }}
                >
                  Kerala Soil Types
                </div>
                <button className="see-all-section-btn" type="button" onClick={clearKeralaSelection}>
                  See all section
                </button>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                {KERALA_CLASS_ORDER.map((className) => {
                  const item = KERALA_COLOR_DETAILS[className];
                  const isSelected = selectedColorClass === className;
                  return (
                    <button
                      className={`holo-border soil-type-btn${isSelected ? " soil-type-btn-active" : ""}`}
                      key={className}
                      type="button"
                      onClick={() => toggleKeralaSelection(className)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        textAlign: "left",
                        padding: "9px 10px",
                        borderRadius: 11,
                        border: "none",
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(37, 152, 255, 0.24), rgba(41, 255, 212, 0.2))"
                          : "linear-gradient(135deg, rgba(25, 62, 118, 0.54), rgba(12, 34, 72, 0.42))",
                        color: "#eaf3ff",
                        cursor: "pointer",
                        fontSize: 12.5,
                        boxShadow: isSelected
                          ? "0 0 20px rgba(56, 202, 255, 0.34), inset 0 0 22px rgba(90, 255, 219, 0.22)"
                          : "inset 0 0 18px rgba(50, 119, 224, 0.16)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          background: item.color,
                          border: "1px solid rgba(210, 236, 255, 0.72)",
                          flex: "0 0 auto",
                          boxShadow: "0 0 8px rgba(255,255,255,0.26)",
                        }}
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </aside>
          )}

          <aside
            data-map-side={isPortraitLayout ? "left-top" : "right"}
            style={{
              position: "fixed",
              top: isPortraitLayout ? 14 : "50%",
              right: isPortraitLayout ? "auto" : 24,
              left: isPortraitLayout ? 12 : "auto",
              transform: isPortraitLayout ? "none" : "translateY(-50%)",
              zIndex: 60,
              width: isPortraitLayout ? "min(500px, calc(100vw - 24px))" : "min(340px, 32vw)",
              minWidth: isPortraitLayout ? 0 : 240,
              maxHeight: isPortraitLayout ? "22vh" : "none",
              overflowY: isPortraitLayout ? "auto" : "visible",
              background:
                "radial-gradient(140% 110% at 100% 0%, rgba(49, 136, 255, 0.22), rgba(49, 136, 255, 0) 55%), linear-gradient(155deg, rgba(8, 24, 56, 0.9), rgba(4, 14, 38, 0.84) 55%, rgba(7, 30, 72, 0.86) 100%)",
              border: "1px solid rgba(88, 168, 255, 0.45)",
              borderRadius: 18,
              padding: "16px",
              color: "#eaf3ff",
              backdropFilter: "blur(14px) saturate(122%)",
              WebkitBackdropFilter: "blur(14px) saturate(122%)",
              boxShadow:
                "0 0 0 1px rgba(124, 194, 255, 0.24), 0 0 35px rgba(49, 142, 255, 0.32), 0 20px 50px rgba(2, 8, 26, 0.68), inset 0 0 40px rgba(38, 118, 255, 0.18), inset 0 1px 0 rgba(196, 228, 255, 0.32)",
            }}
          >



            <div
              style={{
                alignSelf: "flex-start",
                fontSize: 18,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: 999,
                border: "1px solid rgba(163, 224, 255, 0.56)",
                background: "rgba(25, 104, 214, 0.34)",
                color: "rgba(222, 242, 255, 0.95)",
                fontWeight: 700,
                marginBottom: 6,
                width: "fit-content",
              }}
            >
              Kerala Soil 

            </div>


            {selectedColorDetails ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 999,
                      background: selectedColorDetails.color,
                      border: "1px solid rgba(255,255,255,0.55)",
                      display: "inline-block",
                    }}
                  />
                  <strong style={{ fontSize: 14 }}>{selectedColorDetails.label}</strong>
                </div>
                {/* <div
                  style={{
                    width: "90%",
                    height: 135,
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: 10,
                    border: "1px solid rgba(95, 176, 255, 0.4)",
                    boxShadow: "inset 0 0 22px rgba(73, 153, 255, 0.2)",
                  }}
                >
                  <img
                    src={selectedColorDetails.image}
                    alt={selectedColorDetails.label}
                    data-click-sound
                    onClick={() => setIsSoilImageZoomed((prev) => !prev)}
                    title={isSoilImageZoomed ? "Click to reset image zoom" : "Click to zoom image"}
                    style={{
                      width: "90",
                      height: "90%",
                      objectFit: "cover",
                      transform: isSoilImageZoomed ? "scale(6)" : "scale(1)",
                      transformOrigin: "center center",
                      transition: "transform 0.25s ease",
                      cursor: isSoilImageZoomed ? "zoom-out" : "zoom-in",
                    }}
                  />
                </div> */}
                <div style={{ fontSize: 18, lineHeight: 1.45, opacity: 0.95 }}>
                  {selectedColorDetails.details}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 18, lineHeight: 1.45, opacity: 0.85 }}>
                {isPortraitLayout
                  ? "Select a soil type from the bottom swiper or tap a Kerala section."
                  : "Select a soil type from the left list or hover/click a Kerala section."}
              </div>
            )}
          </aside>
        </>
      )}
      {!isKerala && showOverlay && indiaZoomComplete && (
        <>
          {isPortraitLayout ? (
            <IndiaPortraitPanel
              classOrder={INDIA_CLASS_ORDER}
              colorDetails={INDIA_COLOR_DETAILS}
              selectedClass={selectedIndiaClass}
              onToggleSelection={toggleIndiaSelection}
              onClearSelection={clearIndiaSelection}
            />
          ) : (
            <aside
              data-map-side="left"
              style={{
                position: "fixed",
                top: "50%",
                left: 24,
                transform: "translateY(-50%)",
                zIndex: 60,
                width: "min(300px, 28vw)",
                minWidth: 230,
                maxHeight: "calc(100vh - 48px)",
                overflowY: "auto",
                background:
                  "radial-gradient(140% 110% at 100% 0%, rgba(49, 136, 255, 0.22), rgba(49, 136, 255, 0) 55%), linear-gradient(155deg, rgba(8, 24, 56, 0.9), rgba(4, 14, 38, 0.84) 55%, rgba(7, 30, 72, 0.86) 100%)",
                border: "1px solid rgba(88, 168, 255, 0.45)",
                borderRadius: 18,
                padding: "14px 12px",
                color: "#eaf3ff",
                backdropFilter: "blur(14px) saturate(122%)",
                WebkitBackdropFilter: "blur(14px) saturate(122%)",
                boxShadow:
                  "0 0 0 1px rgba(124, 194, 255, 0.24), 0 0 35px rgba(49, 142, 255, 0.32), 0 20px 50px rgba(2, 8, 26, 0.68), inset 0 0 40px rgba(38, 118, 255, 0.18), inset 0 1px 0 rgba(196, 228, 255, 0.32)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    letterSpacing: "0.35px",
                    color: "rgba(226, 241, 255, 0.95)",
                  }}
                >
                  India Soil Types
                </div>
                <button className="see-all-section-btn" type="button" onClick={clearIndiaSelection}>
                  See all section
                </button>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                {INDIA_CLASS_ORDER.map((className) => {
                  const item = INDIA_COLOR_DETAILS[className];
                  const isSelected = selectedIndiaClass === className;
                  return (
                    <button
                      className={`holo-border soil-type-btn${isSelected ? " soil-type-btn-active" : ""}`}
                      key={className}
                      type="button"
                      onClick={() => toggleIndiaSelection(className)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        textAlign: "left",
                        padding: "7px 8px",
                        borderRadius: 11,
                        border: "none",
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(37, 152, 255, 0.24), rgba(41, 255, 212, 0.2))"
                          : "linear-gradient(135deg, rgba(25, 62, 118, 0.54), rgba(12, 34, 72, 0.42))",
                        color: "#eaf3ff",
                        cursor: "pointer",
                        fontSize: 13,
                        boxShadow: isSelected
                          ? "0 0 20px rgba(56, 202, 255, 0.34), inset 0 0 22px rgba(90, 255, 219, 0.22)"
                          : "inset 0 0 18px rgba(50, 119, 224, 0.16)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          background: item.color,
                          border: "1px solid rgba(210, 236, 255, 0.72)",
                          flex: "0 0 auto",
                          boxShadow: "0 0 8px rgba(255,255,255,0.26)",
                        }}
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </aside>
          )}

          <aside
            data-map-side="right"
            style={{
              position: "fixed",
              top: isPortraitLayout ? 14 : "50%",
              right: isPortraitLayout ? "auto" : 24,
              left: isPortraitLayout ? 12 : "auto",
              transform: isPortraitLayout ? "none" : "translateY(-50%)",
              zIndex: 60,
              width: isPortraitLayout ? "min(450px, calc(100vw - 24px))" : "min(340px, 32vw)",
              minWidth: isPortraitLayout ? 0 : 240,
              maxHeight: isPortraitLayout ? "22vh" : "none",
              overflowY: isPortraitLayout ? "auto" : "visible",
              background:
                "radial-gradient(140% 110% at 100% 0%, rgba(49, 136, 255, 0.22), rgba(49, 136, 255, 0) 55%), linear-gradient(155deg, rgba(8, 24, 56, 0.9), rgba(4, 14, 38, 0.84) 55%, rgba(7, 30, 72, 0.86) 100%)",
              border: "1px solid rgba(88, 168, 255, 0.45)",
              borderRadius: 18,
              padding: "16px",
              color: "#eaf3ff",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              backdropFilter: "blur(14px) saturate(122%)",
              WebkitBackdropFilter: "blur(14px) saturate(122%)",
              boxShadow:
                "0 0 0 1px rgba(124, 194, 255, 0.24), 0 0 35px rgba(49, 142, 255, 0.32), 0 20px 50px rgba(2, 8, 26, 0.68), inset 0 0 40px rgba(38, 118, 255, 0.18), inset 0 1px 0 rgba(196, 228, 255, 0.32)",
            }}
          >
            {isPortraitLayout && (
              <div
                style={{
                  alignSelf: "flex-start",
                  fontSize: 18,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "3px 8px",
                  borderRadius: 999,
                  border: "1px solid rgba(163, 224, 255, 0.56)",
                  background: "rgba(25, 104, 214, 0.34)",
                  color: "rgba(222, 242, 255, 0.95)",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                India Soil
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
 
              {selectedIndiaDetails && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      background: selectedIndiaDetails.color,
                      border: "1px solid rgba(255,255,255,0.55)",
                      display: "inline-block",
                      flex: "0 0 auto",
                    }}
                  />
                  <strong style={{ fontSize: isPortraitLayout ? 18 : 18, lineHeight: 1.2 }}>
                    {selectedIndiaDetails.label}
                  </strong>
                </span>
              )}
            </div>
            {selectedIndiaDetails ? (
              <>
                <div style={{ fontSize: isPortraitLayout ? 18 : 18, lineHeight: 1.45, opacity: 0.95 }}>
                  {selectedIndiaDetails.details}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 18, lineHeight: 1.45, opacity: 0.85 }}>
                Click or hover an India map region to view soil data.
              </div>
            )}
          </aside>
        </>
      )}

      <div
        style={{
          position: "fixed",
          top: isPortraitLayout ? 12 : 24,
          right: isPortraitLayout ? 12 : 24,
          zIndex: 50,
        }}
      >
        {(view === "india" || view === "kerala") && (
          <button
            className="holo-border map-preview-switch"
            onClick={handleMapPreviewSwitch}
            type="button"
          >
            <div className="map-preview-switch__media">
              <img
                src={view === "india" ? "/images/buttoneimg2.png" : "/images/buttoneimg1.png"}
                alt={view === "india" ? "Kerala preview" : "India preview"}
              />
            </div>
            <div className="map-preview-switch__meta">
              <span className="map-preview-switch__label">
                {view === "india" ? "Explore Kerala" : "Back to India"}
              </span>
            </div>
          </button>
        )}
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <section id="globe-section" style={{ height: "100vh" }} />
        <section id="india-section" style={{ height: "100vh" }} />
      </div>
    </main>
  );
}

