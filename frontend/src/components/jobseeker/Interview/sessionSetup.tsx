// src/pages/InterviewSetup.tsx
"use client";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Camera, CameraOff,ArrowRight } from "lucide-react";

interface SessionConfig {
  difficulty: "easy" | "medium" | "hard";
  interview_type: "technical" | "behavioral" | "culture-fit" | "case-study";
  ai_personality: "friendly" | "professional" | "direct" | "empathetic";
  micGranted: boolean;
  camGranted: boolean;
}

export default function SessionSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const interview = location.state?.interview;

  const [config, setConfig] = useState<SessionConfig>({
    difficulty: "medium",
    interview_type: "technical",
    ai_personality: "professional",
    micGranted: false,
    camGranted: false,
  });

  const [micStatus, setMicStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [camStatus, setCamStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const requestMic = async () => {
    setMicStatus("requesting");
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus("granted");
      setConfig(prev => ({ ...prev, micGranted: true }));
    } catch (err) {
      setMicStatus("denied");
    }
  };
  const requestCamera = async () => {
  setCamStatus("requesting");
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    setCamStatus("granted");
    setConfig(prev => ({ ...prev, camGranted: true }));
  } catch (err) {
    setCamStatus("denied");
  }
};

  const startInterview = () => {
    if (!config.micGranted|| !config.camGranted) return;

    const fullConfig = {
      ...interview,
      difficulty: config.difficulty,
      interview_type: config.interview_type,
      ai_personality: config.ai_personality,
    };

    navigate("/session", { state: { config: fullConfig } });
  };

  if (!interview) {
    return <div className="p-8 text-center">No interview selected</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Configure Interview</h1>
          <p className="text-gray-600 mb-8">{interview.title}</p>

          <div className="space-y-6">
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <Select
                value={config.difficulty}
                onValueChange={(v) => setConfig(prev => ({ ...prev, difficulty: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Interview Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Interview Type</label>
              <Select
                value={config.interview_type}
                onValueChange={(v) => setConfig(prev => ({ ...prev, interview_type: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="culture-fit">Culture Fit</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* AI Personality */}
            <div>
              <label className="block text-sm font-medium mb-2">AI Personality</label>
              <Select
                value={config.ai_personality}
                onValueChange={(v) => setConfig(prev => ({ ...prev, ai_personality: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="empathetic">Empathetic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mic Permission */}
            <div>
              <label className="block text-sm font-medium mb-2">Microphone</label>
              <div className="flex items-center gap-3">
                <Button
                  className="bg-blue-600 over"
                  onClick={requestMic}
                  disabled={micStatus === "granted" || micStatus === "requesting"}
                  variant={micStatus === "granted" ? "default" : "outline"}
                >
                  {micStatus === "idle" && <Mic className="h-4 w-4 mr-2" />}
                  {micStatus === "requesting" && "Requesting..."}
                  {micStatus === "granted" && <Mic className="h-4 w-4 mr-2" />}
                  {micStatus === "denied" && <MicOff className="h-4 w-4 mr-2" />}
                  {micStatus === "granted" ? "Mic Ready" : "Allow Mic"}
                </Button>
                {micStatus === "denied" && (
                  <Badge variant="destructive">Mic Denied</Badge>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Camera</label>
              <div className="flex items-center gap-3">
                <Button
                  className="bg-blue-600 over"
                  onClick={requestCamera}
                  disabled={camStatus === "granted" || camStatus === "requesting"}
                  variant={camStatus === "granted" ? "default" : "outline"}
                >
                  {camStatus === "idle" && <Camera className="h-4 w-4 mr-2" />}
                  {camStatus === "requesting" && "Requesting..."}
                  {camStatus === "granted" && <Camera className="h-4 w-4 mr-2" />}
                  {camStatus === "denied" && <CameraOff className="h-4 w-4 mr-2" />}
                  {camStatus === "granted" ? "Camera Ready" : "Allow Camera"}
                </Button>
                {camStatus === "denied" && (
                  <Badge variant="destructive">Camera Denied</Badge>
                )}
              </div>
            </div>

            {/* Start Button */}
            <Button
                 
              className="w-full mt-8 bg-blue-600 over hover:bg-blue-700 text-white flex items-center justify-center"
              size="lg"
              onClick={startInterview}
              disabled={!config.micGranted || !config.camGranted }
            >
              Start Interview <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
