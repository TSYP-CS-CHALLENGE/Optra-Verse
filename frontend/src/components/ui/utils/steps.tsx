import { useState } from "react"
import { Search, FileText, Users, Brain, Award, CheckCircle } from "lucide-react"
import { useTranslation } from "@/i18n";


const onboardingSteps = [
  {
    id: 1,
    title: "Find Your Dream Job",
    description: "Discover thousands of job opportunities tailored to your skills, experience, and career aspirations.",
    icon: Search,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    emoji: "🎯",
    audience: "both"
  },
  {
    id: 2,
    title: "AI-Powered CV Enhancement",
    description: "Transform your resume with our intelligent CV analyzer. Get personalized suggestions to stand out to employers.",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    emoji: "📄",
    audience: "both"
  },
  {
    id: 3,
    title: "AI Interview Training",
    description: "Practice with our AI interview simulator. Get real-time feedback on your answers, body language, and communication skills.",
    icon: Brain,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    emoji: "🤖",
    audience: "both"
  },
  {
    id: 4,
    title: "Career Coaching & Community",
    description: "Connect with career experts and fellow job seekers. Get personalized guidance and support throughout your journey.",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    emoji: "👥",
    audience: "both"
  },
  {
    id: 5,
    title: "Skill Development & Certifications",
    description: "Access curated courses and certification programs to enhance your skills and boost your employability.",
    icon: Award,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    emoji: "🏆",
    audience: "both"
  },
]

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const totalSteps = onboardingSteps.length
  const { t } = useTranslation();
  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setIsTransitioning(true)
      await new Promise(resolve => setTimeout(resolve, 300))
      setCurrentStep(currentStep + 1)
      setIsTransitioning(false)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  const handleDotClick = async (index: number) => {
    if (index !== currentStep) {
      setIsTransitioning(true)
      await new Promise(resolve => setTimeout(resolve, 200))
      setCurrentStep(index)
      setIsTransitioning(false)
    }
  }
  const currentStepData = onboardingSteps[currentStep]
  const IconComponent = currentStepData.icon
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <Search className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-bold text-blue-600">CareerBoost</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">
            {currentStep + 1}/{totalSteps}
          </span>
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 transition-colors px-3 py-1 rounded-md text-sm"
          >
            {t('apiErrors.401')}
          </button>
        </div>
      </div>

      {/* Main Content with Animation */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className={`w-full max-w-md p-8 text-center bg-white rounded-3xl shadow-xl transition-all duration-500 transform ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}>
          {/* Animated Icon with Emoji */}
          <div className="mb-6 flex justify-center">
            <div className={`w-20 h-20 sm:w-25 sm:h-25 rounded-full ${currentStepData.bgColor} flex items-center justify-center transition-all duration-500 transform hover:scale-110 relative`}>
              <IconComponent className={`w-12 h-12 sm:w-15 sm:h-15 ${currentStepData.color} transition-all duration-500`} />
              <div className="absolute -top-2 -right-2 text-2xl">
                {currentStepData.emoji}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
            <div
              className="h-2 rounded-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-out"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <h2 className=" font-bold text-[18px] md:text-lg text-gray-800 mb-4 transition-all duration-500 leading-tight">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-2 transition-all duration-500">
            {currentStepData.description}
          </p>
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {currentStep === 0 && (
              <>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Tech Jobs</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Remote Work</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Startups</span>
              </>
            )}
            {currentStep === 1 && (
              <>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">ATS Optimized</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">AI Analysis</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Professional</span>
              </>
            )}
            {currentStep === 2 && (
              <>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Real-time Feedback</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Mock Interviews</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">AI Coach</span>
              </>
            )}
            {currentStep === 3 && (
              <>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Expert Mentors</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Community</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Networking</span>
              </>
            )}
            {currentStep === 4 && (
              <>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Certifications</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Skill Paths</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Career Growth</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 mt-2 bg-white/80 backdrop-blur-sm border-t">
        <div className="flex justify-center gap-3 mb-3">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${index === currentStep
                  ? "bg-linear-to-r from-blue-500 to-blue-600 scale-125"
                  : index < currentStep
                    ? "bg-blue-500"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => handleDotClick(currentStep - 1)}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-4 px-4 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 hover:border-gray-400"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${currentStep === 0 ? 'flex-1' : 'flex-1'
              }`}
          >
            {currentStep === totalSteps - 1 ? (
              <span className="flex items-center justify-center text-sm">
                Start My Journey <Award className="ml-2 w-5 h-5" />
              </span>
            ) : (
              <span className="flex items-center justify-center text-sm">
                Continue <CheckCircle className="ml-2 w-5 h-5" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}