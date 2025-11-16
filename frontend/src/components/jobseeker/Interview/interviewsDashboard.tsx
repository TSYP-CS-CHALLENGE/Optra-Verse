"use client"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Card,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Eye,
  TrendingUp,
  Target,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Briefcase,
  MapPin,
  Home,
} from "lucide-react"
import type Interview from "src/models/Interview"

const mockInterviews: Interview[] = [
  {
    id: "1",
    title: "Sales Pitch Mastery",
    recruiter: "TALAN Tunisie",
    scenario: "Product Demo",
    difficulty: "Intermediate",
    duration: "45 min",
    completedSessions: 12,
    totalSessions: 20,
    lastSession: "2 days ago",
    status: "in-progress",
    description:
      "Master the art of sales presentations with this comprehensive training program designed for intermediate-level professionals.",
    /* averageScore: 85,
    improvement: "+12%",
    objectives: [
      "Deliver compelling product demonstrations",
      "Handle objections effectively",
      "Close deals with confidence",
      "Build rapport with potential clients",
    ],
    recentSessions: [
      {
        date: "2024-01-15",
        score: 88,
        duration: "42 min",
        feedback: "Excellent presentation flow, minor improvements needed in objection handling",
        strengths: ["Clear communication", "Good product knowledge", "Confident delivery"],
        improvements: ["Handle price objections better", "Use more visual aids"],
      },
      {
        date: "2024-01-12",
        score: 82,
        duration: "45 min",
        feedback: "Good overall performance, work on closing techniques",
        strengths: ["Engaging opening", "Technical expertise", "Professional demeanor"],
        improvements: ["Stronger call-to-action", "Better time management"],
      },
    ],
    skillMetrics: {
      presentation: 85,
      communication: 78,
      confidence: 92,
      technical: 71,
      closing: 68,
    }, */
  },
  {
    id: "2",
    title: "Technical Interview Prep",
    recruiter: "Google",
    scenario: "System Design",
    difficulty: "Advanced",
    duration: "60 min",
    completedSessions: 3,
    totalSessions: 10,
    status: "in-progress",
    description: "Deep dive into distributed systems and algorithmic problem solving.",
    position: "Full-time",
  required_skills: ["Sales", "Presentation", "Negotiation"],
  responsibilities: ["Close deals", "Build client relationships"],
  experience_years: "3+",
  place: "Tunis, Tunisia",
  work_mode: "hybrid",
  },
  {
    id: "3",
    title: "Behavioral Interview",
    recruiter: "Microsoft",
    scenario: "Leadership Stories",
    difficulty: "Beginner",
    duration: "30 min",
    completedSessions: 0,
    totalSessions: 5,
    status: "not-started",
    description: "Practice telling impactful stories using STAR method.",
    position: "Full-time",
  required_skills: ["Sales", "Presentation", "Negotiation"],
  responsibilities: ["Close deals", "Build client relationships"],
  experience_years: "3+",
  place: "Tunis, Tunisia",
  work_mode: "hybrid",
  },
  {
    id: "4",
    title: "Frontend Coding Challenge",
    recruiter: "Meta",
    scenario: "Live Coding",
    difficulty: "Intermediate",
    duration: "90 min",
    completedSessions: 7,
    totalSessions: 15,
    lastSession: "1 week ago",
    status: "in-progress",
    description: "Build a responsive dashboard with React and Tailwind.",
    averageScore: 78,
    improvement: "+5%",
    position: "Full-time",
  required_skills: ["Sales", "Presentation", "Negotiation"],
  responsibilities: ["Close deals", "Build client relationships"],
  experience_years: "3+",
  place: "Tunis, Tunisia",
  work_mode: "hybrid",
  },
]

const getDifficultyColor = (d: string) =>
  d === "Beginner" ? "bg-green-100 text-green-800" :
  d === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
  "bg-red-100 text-red-800"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case "in-progress": return <PlayCircle className="h-4 w-4 text-blue-600" />
    case "not-started": return <AlertCircle className="h-4 w-4 text-gray-500" />
    default: return null
  }
}

// Custom Progress
const CustomProgress = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
    <div
      className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)

export default function InterviewsDashboard() {
  const onNavigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleDetails = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  // Replace the entire return() block in InterviewsDashboard with this:

return (
  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="h-9 w-9 text-blue-600" />
          My Interviews
        </h1>
        <Badge variant="outline" className="text-lg px-4 py-1">
          {mockInterviews.length} Active
        </Badge>
      </div>

      <div className="space-y-6">
        {mockInterviews.map((interview) => {
          const progress = (interview.completedSessions / interview.totalSessions) * 100
          const isExpanded = expandedId === interview.id

          return (
            <Card
              key={interview.id}
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg border-0 ${
                isExpanded ? "ring-2 ring-blue-500 ring-opacity-20" : ""
              }`}
            >
              {/* MAIN CARD CONTENT */}
              <div className="p-6 bg-white">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left: Title, Recruiter, Scenario + Job Info */}
                  <div className="flex-1 space-y-5">
                    {/* Title & Recruiter */}
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 text-white">
                        <Target className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{interview.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                          <span className="font-medium">{interview.recruiter}</span>
                          <span className="text-gray-400">•</span>
                          <span>{interview.scenario}</span>
                        </p>
                      </div>
                    </div>

                    {/* JOB DETAILS GRID – ALWAYS VISIBLE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      {/* Position */}
                      {interview.position && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-indigo-600" />
                          <span className="font-medium">{interview.position}</span>
                        </div>
                      )}

                      {/* Experience */}
                      {interview.experience_years && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span>{interview.experience_years} years</span>
                        </div>
                      )}

                      {/* Location */}
                      {interview.place && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-600" />
                          <span>{interview.place}</span>
                        </div>
                      )}

                      {/* Work Mode */}
                      {interview.work_mode && (
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-purple-600" />
                          <span className="capitalize">{interview.work_mode}</span>
                        </div>
                      )}

                      {/* Duration */}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{interview.duration}</span>
                      </div>

                      {/* Progress */}
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span>
                          {interview.completedSessions}/{interview.totalSessions}
                        </span>
                      </div>
                    </div>

                    {/* Required Skills */}
                    {interview.required_skills && interview.required_skills.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Required Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {interview.required_skills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Completion</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <CustomProgress value={progress} />
                    </div>
                  </div>

                  {/* Right: Badges + Buttons */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getDifficultyColor(interview.difficulty)} font-medium`}>
                        {interview.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(interview.status)}
                        <span className="text-sm font-medium capitalize">
                          {interview.status.replace("-", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDetails(interview.id)}
                        className="flex items-center gap-1.5 font-medium transition-all hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4" />
                        {isExpanded ? "Hide" : "Details"}
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1.5 font-medium bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => onNavigate("/session-setup", { state: { interview } })}
                      >
                        <Calendar className="h-4 w-4" />
                        Book
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPANDED CONTENT (Optional – keep if you want) */}
              {isExpanded && (
                <div className="border-t bg-gradient-to-b from-gray-50 to-white px-6 pt-6 pb-8">
                  <div className="flex gap-3">
                    <div className="bg-blue-100 rounded-lg p-2 text-blue-700">
                      <Target className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{interview.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  </div>
)
}
