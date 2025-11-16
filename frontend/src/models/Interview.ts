export default interface Interview {
  id: string
  title: string
  recruiter: string
  scenario: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  completedSessions: number
  totalSessions: number
  lastSession?: string
  status: "in-progress" | "completed" | "not-started"
  description: string

  averageScore?: number
  improvement?: string
  objectives?: string[]
  recentSessions?: {
    date: string
    score: number
    duration: string
    feedback: string
    strengths: string[]
    improvements: string[]
  }[]
  skillMetrics?: Record<string, number>

  position?: string
  required_skills?: string[]
  responsibilities?: string[]
  experience_years?: string
  place?: string
  work_mode?: "hybrid" | "remote" | "inplace"
  discussion?: string[]
}
