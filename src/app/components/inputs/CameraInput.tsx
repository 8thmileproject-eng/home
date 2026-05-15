"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X } from "lucide-react";

interface CameraInputProps {
  onCapture: (dataUrl: string) => void;
}

export default function CameraInput({ onCapture }: CameraInputProps) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!open) return;
    const start = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch { alert("Camera access denied"); }
    };
    start();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setOpen(false);
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    onCapture(canvas.toDataURL("image/jpeg", 0.8));
    stopCamera();
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="p-2 rounded-lg text-gray-400 hover:text-[#2d5a3d] hover:bg-gray-100 transition-colors"
        title="Take photo">
        <Camera className="w-4 h-4" />
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Take Photo</h3>
              <button type="button" onClick={stopCamera} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="bg-black">
              <video ref={videoRef} className="w-full aspect-[4/3] object-cover" autoPlay muted playsInline />
            </div>
            <div className="flex justify-center gap-4 px-4 py-4">
              <button type="button" onClick={capture}
                className="px-6 py-2.5 bg-[#1a3d2e] text-white rounded-xl font-medium text-sm hover:bg-[#143324] transition-colors">
                Capture Photo
              </button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </>
  );
}
