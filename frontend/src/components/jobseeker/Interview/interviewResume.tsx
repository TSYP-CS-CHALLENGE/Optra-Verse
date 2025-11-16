"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Bot, Briefcase, MapPin, Clock, Target, Badge } from "lucide-react";
import type Interview from "@/models/Interview";

export default function InterviewResume() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const interview: Interview = state?.interview;

  if (!interview) {
    return <div className="p-8 text-center">No interview data</div>;
  }

  const { discussion = [] } = interview;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" size="lg" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-8 shadow-2xl mb-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{interview.title}</h1>
              <p className="text-lg text-gray-600 mt-1">{interview.recruiter}</p>
            </div>

            <div className="space-y-3">
              {interview.position && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium">{interview.position}</span>
                </div>
              )}
              {interview.place && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <span>{interview.place}</span>
                </div>
              )}
              {interview.work_mode && (
                <div className="flex items-center gap-2">
                  <Badge className="capitalize">{interview.work_mode}</Badge>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center items-end space-y-2">
              <Badge
                className={
                  interview.difficulty === "Beginner"
                    ? "bg-green-100 text-green-800"
                    : interview.difficulty === "Intermediate"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {interview.difficulty}
              </Badge>
              <span className="text-sm text-gray-600">
                {interview.completedSessions}/{interview.totalSessions} sessions
              </span>
            </div>
          </div>

          {interview.required_skills && interview.required_skills.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {interview.required_skills.map((skill, i) => (
                  <Badge key={i} >{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-700 leading-relaxed">{interview.description}</p>
        </Card>

        <Card className="p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Full Conversation</h2>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {discussion.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No conversation recorded</p>
            ) : (
              discussion.map((line, i) => {
                const isUser = line.startsWith("User:");
                const text = line.replace(/^(User|Assistant): /, "").trim();

                return (
                  <div
                    key={i}
                    className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start gap-3 max-w-3xl ${
                        isUser ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isUser ? "bg-blue-600" : "bg-green-600"
                        }`}
                      >
                        {isUser ? <User className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-white" />}
                      </div>
                      <div
                        className={`px-5 py-3 rounded-2xl max-w-xl ${
                          isUser
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{text}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
