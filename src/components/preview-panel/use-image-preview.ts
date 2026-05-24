import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;

export function useImagePreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const fitToWindow = useCallback(() => {
    const container = containerRef.current;
    if (!container || !naturalSize.w || !naturalSize.h) return;

    const containerW = container.clientWidth - 32;
    const containerH = container.clientHeight - 32;
    const scaleW = containerW / naturalSize.w;
    const scaleH = containerH / naturalSize.h;
    const fitZoom = Math.min(scaleW, scaleH, 1);
    setZoom(fitZoom);
    setPosition({ x: 0, y: 0 });
  }, [naturalSize]);

  const handleImageLoad = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  }, []);

  useEffect(() => {
    if (naturalSize.w > 0 && naturalSize.h > 0) {
      fitToWindow();
    }
  }, [naturalSize, fitToWindow]);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    setZoom((prev) => {
      const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta));
    });
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      posX: position.x,
      posY: position.y,
    };
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      const dx = event.clientX - dragStart.current.x;
      const dy = event.clientY - dragStart.current.y;
      setPosition({
        x: dragStart.current.posX + dx,
        y: dragStart.current.posY + dy,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  }, []);

  const rotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const resetToWindow = useCallback(() => {
    fitToWindow();
    setRotation(0);
  }, [fitToWindow]);

  const imageStyle = useMemo<React.CSSProperties>(() => ({
    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
    transformOrigin: "center center",
  }), [position.x, position.y, rotation, zoom]);

  return {
    containerRef,
    imageRef,
    imageStyle,
    cursor: isDragging ? "grabbing" : "grab",
    zoomPercent: Math.round(zoom * 100),
    handleImageLoad,
    handleWheel,
    handleMouseDown,
    zoomOut,
    zoomIn,
    rotate,
    resetToWindow,
  };
}
