"use client"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
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
  Users,
  Star,
  Zap,
  ArrowRight,
  Bookmark,
  Share2,
  Filter,
  Search,
} from "lucide-react"

const mockInterviews = [
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
    description: "Master the art of sales presentations with this comprehensive training program designed for intermediate-level professionals.",
    position: "Sales Manager",
    required_skills: ["Sales", "Presentation", "Negotiation", "Communication"],
    responsibilities: ["Close deals", "Build client relationships"],
    experience_years: "3+",
    place: "Tunis, Tunisia",
    work_mode: "hybrid",
    matchScore: 95,
    urgency: true,
    featured: true,
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
    position: "Senior Software Engineer",
    required_skills: ["System Design", "Algorithms", "Distributed Systems"],
    responsibilities: ["Design scalable systems", "Code review"],
    experience_years: "5+",
    place: "Remote",
    work_mode: "remote",
    matchScore: 87,
    urgency: false,
    featured: true,
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
    position: "Team Lead",
    required_skills: ["Leadership", "Communication", "STAR Method"],
    responsibilities: ["Team management", "Project coordination"],
    experience_years: "2+",
    place: "Redmond, WA",
    work_mode: "on-site",
    matchScore: 78,
    urgency: false,
    featured: false,
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
    position: "Frontend Developer",
    required_skills: ["React", "TypeScript", "Tailwind CSS", "JavaScript"],
    responsibilities: ["UI Development", "Code implementation"],
    experience_years: "3+",
    place: "Remote",
    work_mode: "remote",
    matchScore: 92,
    urgency: true,
    featured: false,
  },
]

const interviewStats = [
  { label: 'Completed', value: '15', change: '+5', icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  { label: 'In Progress', value: '8', change: '+2', icon: PlayCircle, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  { label: 'Perfect Match', value: '12', change: '+3', icon: Target, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
  { label: 'Success Rate', value: '85%', change: '+7%', icon: TrendingUp, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/20' }
]

const quickFilters = [
  { id: 'all', label: 'All Interviews', count: 23 },
  { id: 'in-progress', label: 'In Progress', count: 8 },
  { id: 'technical', label: 'Technical', count: 12 },
  { id: 'behavioral', label: 'Behavioral', count: 6 },
  { id: 'featured', label: 'Featured', count: 4 }
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner": return "from-green-500 to-green-600"
    case "Intermediate": return "from-yellow-500 to-yellow-600"
    case "Advanced": return "from-red-500 to-red-600"
    default: return "from-blue-500 to-blue-600"
  }
}

const getDifficultyBadge = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800"
    case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
    case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800"
    default: return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case "in-progress": return <PlayCircle className="h-4 w-4 text-blue-600" />
    case "not-started": return <AlertCircle className="h-4 w-4 text-gray-500" />
    default: return null
  }
}

const CustomProgress = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)

export default function InterviewsDashboard() {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [savedInterviews, setSavedInterviews] = useState<string[]>([])

  const toggleDetails = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  const toggleSavedInterview = (interviewId: string) => {
    setSavedInterviews(prev => 
      prev.includes(interviewId) 
        ? prev.filter(id => id !== interviewId)
        : [...prev, interviewId]
    )
  }

  const filteredInterviews = mockInterviews.filter(interview => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'in-progress') return interview.status === 'in-progress'
    if (activeFilter === 'technical') return interview.scenario.includes('Technical') || interview.scenario.includes('Coding')
    if (activeFilter === 'behavioral') return interview.scenario.includes('Behavioral') || interview.scenario.includes('Leadership')
    if (activeFilter === 'featured') return interview.featured
    return true
  })

  const InterviewCard = ({ interview }: { interview: any }) => {
    const progress = (interview.completedSessions / interview.totalSessions) * 100
    const isExpanded = expandedId === interview.id
    const isSaved = savedInterviews.includes(interview.id)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden ${
          interview.featured ? 'border-2 border-blue-300 dark:border-blue-600' : ''
        }`}>
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getDifficultyColor(interview.difficulty)} flex items-center justify-center text-white text-lg flex-shrink-0`}>
                  <Target className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {interview.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                    <Briefcase className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400 text-sm truncate">{interview.recruiter}</span>
                    {interview.featured && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 text-xs flex-shrink-0">
                        Featured
                      </Badge>
                    )}
                    {interview.urgency && (
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 self-start flex-shrink-0">
                <button
                  onClick={() => toggleSavedInterview(interview.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{interview.place}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Home className="w-4 h-4 flex-shrink-0" />
                <span className="truncate capitalize">{interview.work_mode}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{interview.duration}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{interview.completedSessions}/{interview.totalSessions} sessions</span>
              </div>
            </div>

            {/* Match Score & Progress */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Match Score</span>
                <span className="text-sm font-bold text-green-600">{interview.matchScore}%</span>
              </div>
              <Progress value={interview.matchScore} className="h-2 bg-slate-200 dark:bg-slate-700" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</span>
                <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
              </div>
              <CustomProgress value={progress} />
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {interview.required_skills.map((skill: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-700 text-xs px-2 py-1"
                >
                  {skill}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3">
              <div className="flex items-center gap-2 order-2 xs:order-1">
                <Badge className={getDifficultyBadge(interview.difficulty)}>
                  {interview.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  {getStatusIcon(interview.status)}
                  <span className="capitalize">{interview.status.replace("-", " ")}</span>
                </div>
              </div>
              
              <div className="flex gap-2 order-1 xs:order-2">
                <Button 
                  variant="outline" 
                  className="rounded-xl border-2 text-sm h-11 xs:h-auto"
                  onClick={() => toggleDetails(interview.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isExpanded ? "Hide" : "Details"}
                </Button>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 shadow-lg transition-all duration-300 h-11 xs:h-auto"
                  onClick={() => navigate("/session-setup", { state: { interview } })}
                >
                  Start
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {interview.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Position Details</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Position:</span>
                        <span className="font-medium">{interview.position}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Experience:</span>
                        <span className="font-medium">{interview.experience_years} years</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Scenario</h4>
                    <p className="text-slate-600 dark:text-slate-400">{interview.scenario}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {interviewStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                        {stat.label}
                      </p>
                      <div className="flex items-baseline space-x-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                          {stat.value}
                        </h3>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs hidden sm:inline-flex">
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                    <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} flex-shrink-0 ml-3`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="sm:hidden mt-2">
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6 lg:space-y-8">
          {/* Search & Filter Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 rounded-2xl shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-purple-900 dark:text-purple-100 text-xl sm:text-2xl flex items-center">
                      <Target className="w-6 h-6 sm:w-7 sm:h-7 mr-3" />
                      Interview Practice
                    </CardTitle>
                    <CardDescription className="text-purple-700 dark:text-purple-300 text-base sm:text-lg mt-2">
                      Master your interview skills with AI-powered practice sessions
                    </CardDescription>
                  </div>
                  <Badge className="bg-purple-500 text-white border-0 text-sm py-1 self-start sm:self-auto">
                    AI Powered
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search interviews, companies, or skills..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {quickFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-3 py-2 rounded-xl border-2 transition-all duration-200 text-sm ${
                        activeFilter === filter.id
                          ? 'bg-purple-500 text-white border-purple-500 shadow-md'
                          : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                    >
                      <span className="font-medium whitespace-nowrap">{filter.label}</span>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${
                          activeFilter === filter.id
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {filter.count}
                      </Badge>
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:space-x-4">
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-6 sm:px-8 py-3 shadow-lg transition-all duration-300 hover:shadow-xl flex-1 group min-h-[48px]">
                    <Target className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    New Practice Session
                  </Button>
                  <Button variant="outline" className="rounded-xl px-4 sm:px-6 py-3 border-2 border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex-1 min-h-[48px]">
                    <Filter className="w-4 h-4 mr-2" />
                    Set Preferences
                  </Button>
                  <Button variant="outline" className="rounded-xl px-4 sm:px-6 py-3 border-2 border-green-300 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 min-h-[48px]">
                    <Zap className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Quick Start</span>
                    <span className="sm:hidden">Quick</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Featured Interviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-slate-900 dark:text-white flex items-center text-lg sm:text-xl">
                    <Star className="w-5 h-5 mr-2 text-yellow-500 fill-current" />
                    Featured Interviews
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Curated practice sessions matching your career goals
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 self-start sm:self-auto">
                  {mockInterviews.filter(i => i.featured).length} featured
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {filteredInterviews
                    .filter(interview => interview.featured)
                    .map((interview) => (
                      <InterviewCard key={interview.id} interview={interview} />
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* All Interviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-slate-900 dark:text-white flex items-center text-lg sm:text-xl">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                    All Practice Sessions
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Your complete interview practice library
                  </CardDescription>
                </div>
                <Button variant="outline" className="rounded-xl self-start sm:self-auto">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {filteredInterviews.map((interview) => (
                    <InterviewCard key={interview.id} interview={interview} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:space-y-8">
          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { step: 'Not Started', count: 5, color: 'bg-gray-500' },
                  { step: 'In Progress', count: 8, color: 'bg-blue-500' },
                  { step: 'Completed', count: 15, color: 'bg-green-500' },
                  { step: 'Mastered', count: 3, color: 'bg-purple-500' }
                ].map((status, index) => (
                  <div key={status.step} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${status.color}`} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {status.step}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {status.count}
                    </span>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 rounded-xl border-2 h-11">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Progress
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Saved Interviews */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900 dark:text-white text-lg">
                  <Bookmark className="w-5 h-5 mr-2 text-blue-500 fill-current" />
                  Saved Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4">
                  <Target className="w-12 h-12 text-blue-300 dark:text-blue-600 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                    {savedInterviews.length > 0 
                      ? `You have ${savedInterviews.length} saved sessions` 
                      : 'No sessions saved yet'
                    }
                  </p>
                  <Button variant="outline" className="rounded-xl w-full h-11 border-blue-300 text-blue-700 dark:text-blue-300">
                    View Saved
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white text-lg flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Practice regularly for best results",
                  "Use STAR method for behavioral questions",
                  "Review your performance after each session",
                  "Focus on your weak areas"
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">{tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}