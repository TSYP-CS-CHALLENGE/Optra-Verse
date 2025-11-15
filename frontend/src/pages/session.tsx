"use client";

import React, { Suspense, useState, useEffect  } from "react";
import { Loader2, Mic, MicOff, Video, VideoOff, Phone, Settings, MessageSquare } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "@/components/ui/model";
import { useLocation } from "react-router-dom";
import { VideoPreview } from "@/components/ui/VideoPreview";

export default function Session() {
  const location = useLocation();
  const config = location.state?.config;
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [seconds, setSeconds] = useState(0);
const [endCall, setEndCall] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (!config) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600 text-xl">
        No configuration
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-500" />
          <p className="text-lg font-medium text-white">Your interview is being set up...</p>
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 40 }}
        className="absolute inset-0"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[0, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Model
            position={[0, -3, 0]}
            scale={2}
            config={config}
            onFirstResponse={() => setIsLoading(false)}
            endCall={endCall}        
            onEndCallComplete={() => setEndCall(false)}
          />
        </Suspense>
        <OrbitControls target={[0, 0, 0]} />
      </Canvas>

      <div className="absolute bottom-24 left-8 z-40">
        <VideoPreview isVideoOn={isVideoOn} />
      </div>
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40">
        <div className="rounded-full bg-black/60 px-5 py-2 text-white font-mono text-lg backdrop-blur-sm">
          {formatTime(seconds)}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-40 bg-slate-800/70 p-4 backdrop-blur-md">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              isMuted ? "bg-red-600" : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            {isMuted ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-white" />}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              !isVideoOn ? "bg-red-600" : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            {isVideoOn ? <Video className="h-5 w-5 text-white" /> : <VideoOff className="h-5 w-5 text-white" />}
          </button>

          <button
            onClick={() => setEndCall(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition"
          >
            <Phone className="h-6 w-6 text-white" />
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 transition">
            <MessageSquare className="h-5 w-5 text-white" />
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 transition">
            <Settings className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
