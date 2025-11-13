// src/components/ui/VideoPreview.tsx
import React from "react";
import { VideoOff } from "lucide-react";

export function VideoPreview({ isVideoOn }: { isVideoOn: boolean }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  React.useEffect(() => {
    if (!isVideoOn) {
      stream?.getTracks().forEach((t) => t.stop());
      setStream(null);
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user", width: 1280, height: 720 }, audio: false })
      .then((s) => {
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch((e) => console.error("Camera error:", e));

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [isVideoOn]);

  if (!isVideoOn) {
    return (
      <div className="h-64 w-96 rounded-2xl bg-slate-700 flex items-center justify-center shadow-2xl">
        <VideoOff className="h-16 w-16 text-slate-400" />
      </div>
    );
  }

  return (
    <div className="relative h-64 w-96 overflow-hidden rounded-2xl border-4 border-white/30 shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover scale-x-[-1]"
      />
      <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
        You
      </div>
    </div>
  );
}
