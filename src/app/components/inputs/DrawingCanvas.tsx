"use client";

import { useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { Undo2, Eraser } from "lucide-react";
import { createWorker } from "tesseract.js";

interface DrawingCanvasProps {
  value: string;
  onChange: (value: string) => void;
}

export interface DrawingCanvasHandle {
  recognize: () => Promise<string | null>;
  hasStrokes: () => boolean;
}

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(({ value, onChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const isDrawingRef = useRef(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(400);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autoConvert = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || strokesRef.current.length === 0) return;
    try {
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(canvas);
      await worker.terminate();
      const text = data.text.trim();
      if (text) onChange(text);
    } catch { /* auto-convert failed silently */ }
  }, [onChange]);

  const scheduleAutoConvert = useCallback(() => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(autoConvert, 1500);
  }, [autoConvert]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const allStrokes = [...strokesRef.current, currentStrokeRef.current].filter(Boolean) as Stroke[];
    for (const stroke of allStrokes) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        const p1 = stroke.points[i - 1];
        const p2 = stroke.points[i];
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, mx, my);
      }
      ctx.stroke();
    }
  }, []);

  useImperativeHandle(ref, () => ({
    hasStrokes: () => strokesRef.current.length > 0,
    recognize: async () => {
      const canvas = canvasRef.current;
      if (!canvas || strokesRef.current.length === 0) return null;
      try {
        const worker = await createWorker("eng");
        const { data } = await worker.recognize(canvas);
        await worker.terminate();
        return data.text.trim() || null;
      } catch { return null; }
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (container) setCanvasWidth(container.clientWidth);
  }, []);

  useEffect(() => { strokesRef.current = strokes; }, [strokes]);
  useEffect(() => { redraw(); }, [redraw]);
  useEffect(() => { return () => { if (autoTimer.current) clearTimeout(autoTimer.current); }; }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (autoTimer.current) clearTimeout(autoTimer.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    const pos = getPos(e);
    isDrawingRef.current = true;
    currentStrokeRef.current = { points: [pos], color: "#1a3d2e", width: 3 };
    setHasDrawn(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    e.preventDefault();
    currentStrokeRef.current.points.push(getPos(e));
    redraw();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (currentStrokeRef.current) {
      strokesRef.current = [...strokesRef.current, currentStrokeRef.current];
      setStrokes(strokesRef.current);
    }
    currentStrokeRef.current = null;
    isDrawingRef.current = false;
    redraw();
    scheduleAutoConvert();
    const canvas = canvasRef.current;
    if (canvas && strokesRef.current.length > 0) {
      const dataUrl = canvas.toDataURL("image/png");
      if (dataUrl) onChange(dataUrl);
    }
  };

  const handlePointerCancel = () => { currentStrokeRef.current = null; isDrawingRef.current = false; redraw(); };

  const handleUndo = () => {
    const next = strokesRef.current.slice(0, -1);
    strokesRef.current = next;
    setStrokes(next);
    if (next.length === 0) { setHasDrawn(false); onChange(""); } else { const canvas = canvasRef.current; if (canvas) onChange(canvas.toDataURL("image/png")); }
    redraw();
  };

  const handleClear = () => {
    strokesRef.current = [];
    currentStrokeRef.current = null;
    isDrawingRef.current = false;
    setStrokes([]);
    setHasDrawn(false);
    onChange("");
    redraw();
  };

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={300}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="w-full h-[300px] rounded-lg border border-gray-200 cursor-crosshair"
        style={{ touchAction: "none" }}
      />
      <div className="flex items-center gap-2 mt-2">
        <button type="button" onClick={handleUndo} disabled={strokes.length === 0}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Undo2 className="w-3.5 h-3.5" /> Undo
        </button>
        <button type="button" onClick={handleClear} disabled={strokes.length === 0 && !hasDrawn}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Eraser className="w-3.5 h-3.5" /> Clear
        </button>
      </div>
    </div>
  );
});

DrawingCanvas.displayName = "DrawingCanvas";
export default DrawingCanvas;
