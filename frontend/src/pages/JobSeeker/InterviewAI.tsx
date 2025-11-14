import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Star, 
  Filter, 
  Heart,
  Share2,
  Zap,
  Target,
  TrendingUp,
  Building,
  Users,
  CheckCircle2,
  ChevronRight,
  Bookmark,
  Eye,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from '@/i18n';
import { useContext, useState } from "react";
import { LanguageContext } from '@/i18n';

export default function JobMatcher() {
  const { t } = useTranslation();
  const { language: currentLanguage } = useContext(LanguageContext);
  const isRTL = currentLanguage === 'ar';
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const jobStats = [
    { label: 'Perfect Matches', value: '12', change: '+3', icon: Target, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Applications Sent', value: '24', change: '+8', icon: Briefcase, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Interviews', value: '5', change: '+2', icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
    { label: 'Response Rate', value: '68%', change: '+12%', icon: TrendingUp, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/20' }
  ];

  const filters = [
    { id: 'all', label: 'All Jobs', count: 47 },
    { id: 'perfect', label: 'Perfect Match', count: 12 },
    { id: 'remote', label: 'Remote', count: 18 },
    { id: 'tech', label: 'Technology', count: 32 },
    { id: 'high-salary', label: 'High Salary', count: 8 }
  ];

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      logo: '🚀',
      location: 'San Francisco, CA',
      type: 'Remote',
      salary: '$120,000 - $150,000',
      match: 95,
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
      posted: '2 hours ago',
      urgent: true,
      featured: true,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      logo: '💡',
      location: 'New York, NY',
      type: 'Hybrid',
      salary: '$100,000 - $130,000',
      match: 87,
      skills: ['Node.js', 'React', 'MongoDB', 'AWS'],
      posted: '1 day ago',
      urgent: false,
      featured: true,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
    }
  ];

  const recommendedJobs = [
    {
      id: 3,
      title: 'React Native Developer',
      company: 'MobileFirst',
      logo: '📱',
      location: 'Austin, TX',
      type: 'Remote',
      salary: '$90,000 - $120,000',
      match: 92,
      skills: ['React Native', 'JavaScript', 'iOS', 'Android'],
      posted: '3 days ago',
      urgent: true,
      featured: false,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
    },
    {
      id: 4,
      title: 'UI/UX Developer',
      company: 'DesignHub',
      logo: '🎨',
      location: 'Chicago, IL',
      type: 'On-site',
      salary: '$85,000 - $110,000',
      match: 78,
      skills: ['Figma', 'CSS', 'JavaScript', 'UI Design'],
      posted: '5 days ago',
      urgent: false,
      featured: false,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'CloudSystems',
      logo: '☁️',
      location: 'Seattle, WA',
      type: 'Remote',
      salary: '$110,000 - $140,000',
      match: 82,
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      posted: '1 week ago',
      urgent: false,
      featured: false,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20'
    },
    {
      id: 6,
      title: 'Backend Developer',
      company: 'DataFlow',
      logo: '⚡',
      location: 'Boston, MA',
      type: 'Hybrid',
      salary: '$95,000 - $125,000',
      match: 91,
      skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
      posted: '2 days ago',
      urgent: false,
      featured: false,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20'
    }
  ];

  const quickSearches = [
    { term: 'Remote React Jobs', count: '245', trending: true },
    { term: 'Senior Developer', count: '189', trending: false },
    { term: 'Frontend Engineer', count: '167', trending: true },
    { term: 'Full Stack JavaScript', count: '134', trending: false }
  ];

  const toggleSavedJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  // Fixed JobCard component with proper responsive design
  const JobCard = ({ job, featured = false }: { job: any; featured?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`group ${featured ? 'col-span-1 lg:col-span-2' : ''}`}
    >
      <Card className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden ${
        featured ? 'border-2 border-blue-300 dark:border-blue-600' : ''
      }`}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="flex items-start space-x-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg flex-shrink-0">
                {job.logo}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {job.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                  <Building className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 text-sm truncate">{job.company}</span>
                  {job.featured && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 text-xs flex-shrink-0">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 self-start flex-shrink-0">
              {job.urgent && (
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                  Urgent
                </Badge>
              )}
              <button
                onClick={() => toggleSavedJob(job.id)}
                className={`p-2 rounded-lg transition-colors ${
                  savedJobs.includes(job.id)
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <Heart className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Details Grid - Responsive */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{job.type}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{job.salary}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{job.posted}</span>
            </div>
          </div>

          {/* Match Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Match Score</span>
              <span className="text-sm font-bold text-green-600">{job.match}%</span>
            </div>
            <Progress value={job.match} className="h-2 bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.map((skill: string, index: number) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-700 text-xs px-2 py-1"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Actions - Responsive */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3">
            <Button variant="outline" className="rounded-xl border-2 text-sm h-11 xs:h-auto order-2 xs:order-1">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 shadow-lg transition-all duration-300 h-11 xs:h-auto order-1 xs:order-2">
              Apply Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {jobStats.map((stat, index) => {
          const Icon = stat.icon;
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
                  {/* Mobile badge */}
                  <div className="sm:hidden mt-2">
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
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
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 rounded-2xl shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-blue-900 dark:text-blue-100 text-xl sm:text-2xl flex items-center">
                      <Search className="w-6 h-6 sm:w-7 sm:h-7 mr-3" />
                      {t('dashboard.findJobs')}
                    </CardTitle>
                    <CardDescription className="text-blue-700 dark:text-blue-300 text-base sm:text-lg mt-2">
                      {t('dashboard.findJobsDesc')}
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-500 text-white border-0 text-sm py-1 self-start sm:self-auto">
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
                    placeholder="Search for jobs, companies, or skills..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-3 py-2 rounded-xl border-2 transition-all duration-200 text-sm ${
                        activeFilter === filter.id
                          ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                          : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600'
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
                <div className={`flex flex-col sm:flex-row ${isRTL ? 'sm:space-x-reverse' : ''} gap-4 sm:gap-0 sm:space-x-4`}>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 sm:px-8 py-3 shadow-lg transition-all duration-300 hover:shadow-xl flex-1 group min-h-[48px]">
                    <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    {t('dashboard.browseJobs')}
                  </Button>
                  <Button variant="outline" className="rounded-xl px-4 sm:px-6 py-3 border-2 border-blue-300 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex-1 min-h-[48px]">
                    <Filter className="w-4 h-4 mr-2" />
                    {t('dashboard.setPreferences')}
                  </Button>
                  <Button variant="outline" className="rounded-xl px-4 sm:px-6 py-3 border-2 border-green-300 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 min-h-[48px]">
                    <Zap className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Smart Apply</span>
                    <span className="sm:hidden">Apply</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Featured Jobs */}
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
                    Featured Jobs
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Curated opportunities matching your profile perfectly
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 self-start sm:self-auto">
                  {featuredJobs.length} positions
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {featuredJobs.map((job, index) => (
                    <JobCard key={job.id} job={job} featured={true} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-slate-900 dark:text-white flex items-center text-lg sm:text-xl">
                    <Target className="w-5 h-5 mr-2 text-green-500" />
                    Recommended For You
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Jobs that match your skills and preferences
                  </CardDescription>
                </div>
                <Button variant="outline" className="rounded-xl self-start sm:self-auto">
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {recommendedJobs.map((job, index) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:space-y-8">
          {/* Quick Searches */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                  Trending Searches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickSearches.map((search, index) => (
                  <motion.button
                    key={search.term}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-200 group"
                  >
                    <div className="text-left min-w-0 flex-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate block">
                        {search.term}
                      </span>
                      <div className="flex items-center space-x-1 mt-1">
                        <Eye className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="text-xs text-slate-500 dark:text-slate-500 truncate">{search.count} jobs</span>
                      </div>
                    </div>
                    {search.trending && (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs flex-shrink-0 ml-2">
                        Trending
                      </Badge>
                    )}
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Application Progress */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900 dark:text-white text-lg">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: 'Applied', count: 24, color: 'bg-blue-500' },
                    { step: 'Viewed', count: 18, color: 'bg-purple-500' },
                    { step: 'Interview', count: 5, color: 'bg-orange-500' },
                    { step: 'Offer', count: 2, color: 'bg-green-500' }
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
                </div>
                <Button variant="outline" className="w-full mt-4 rounded-xl border-2 h-11">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Progress
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Saved Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white text-lg flex items-center">
                  <Bookmark className="w-5 h-5 mr-2 text-red-500 fill-current" />
                  Saved Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4">
                  <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                    {savedJobs.length > 0 
                      ? `You have ${savedJobs.length} saved jobs` 
                      : 'No jobs saved yet'
                    }
                  </p>
                  <Button variant="outline" className="rounded-xl w-full h-11">
                    View Saved Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}