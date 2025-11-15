import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Star,
  Filter,
  Heart,
  Target,
  TrendingUp,
  CheckCircle2,
  Bookmark,
  Upload,
  FileText,
  AlertCircle,
  User,
  Mail,
  FileEdit,
  X,
  Download,
  Zap,
  Lightbulb,
  Brain,
  Sparkles,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building,
  ExternalLink,
  Globe,
  GraduationCap,
  Languages,
  Rocket,
  BarChart3,
  Users,
  Settings,
  SlidersHorizontal,
  Github,
  Linkedin,
  Code2
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from '@/i18n';
import { useContext, useState, useEffect } from "react";
import { LanguageContext } from '@/i18n';
import type { 
  CVAnalysis, 
  CVAnalysisForm, 
  HealthStatus, 
  JobMatchRequest, 
  LiveJobSearchRequest,
  LiveJob,
  FootprintScanRequest,
  FootprintScanResponse,
  CareerInsightsResponse
} from "@/models/JobMatcher";
import {
  analyzeCV,
  extractSkills,
  getHealthStatus,
  matchCVToJobs,
  searchLiveJobs,
  scanDigitalFootprint,
  generateCareerInsights
} from "@/services/job_matcher_api/jobmatcher_service";

export default function JobMatcher() {
  const { t } = useTranslation();
  const { language: currentLanguage } = useContext(LanguageContext);
  const isRTL = currentLanguage === 'ar';

  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [jobMatches, setJobMatches] = useState<any | null>(null);
  const [liveJobs, setLiveJobs] = useState<LiveJob[]>([]);
  const [footprintData, setFootprintData] = useState<FootprintScanResponse | null>(null);
  const [careerInsights, setCareerInsights] = useState<CareerInsightsResponse | null>(null);
  const [showCVForm, setShowCVForm] = useState(false);
  const [showJobPreferences, setShowJobPreferences] = useState(false);
  const [showFootprintForm, setShowFootprintForm] = useState(false);
  const [showCareerInsights, setShowCareerInsights] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'skills' | 'matches' | 'live' | 'footprint' | 'insights'>('analysis');

  const [cvForm, setCvForm] = useState<CVAnalysisForm>({
    file: null,
    job_title: '',
    job_description: '',
    candidate_name: '',
    candidate_email: ''
  });

  const [jobMatchPreferences, setJobMatchPreferences] = useState<JobMatchRequest>({
    preferred_locations: ['Dubai', 'Remote'],
    salary_min: 30000,
    salary_max: 80000,
    open_to_remote: true,
    max_results: 20
  });

  const [liveSearch, setLiveSearch] = useState<LiveJobSearchRequest>({
    keywords: '',
    location: 'Dubai',
    max_results: 20
  });

  const [footprintForm, setFootprintForm] = useState<FootprintScanRequest>({
    github_username: '',
    linkedin_url: '',
    stackoverflow_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const healthData = await getHealthStatus();
      setHealthStatus(healthData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return;
    }

    setCvForm(prev => ({
      ...prev,
      file
    }));
  };

  const handleCVAnalysis = async () => {
    if (!cvForm.file || !cvForm.job_title.trim() || !cvForm.job_description.trim()) {
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', cvForm.file);
      formData.append('job_title', cvForm.job_title);
      formData.append('job_description', cvForm.job_description);

      if (cvForm.candidate_name.trim()) {
        formData.append('candidate_name', cvForm.candidate_name);
      }
      if (cvForm.candidate_email.trim()) {
        formData.append('candidate_email', cvForm.candidate_email);
      }

      const analysis = await analyzeCV(formData);
      setCvAnalysis(analysis);
      setActiveTab('analysis');

      setCvForm({
        file: null,
        job_title: '',
        job_description: '',
        candidate_name: '',
        candidate_email: ''
      });
      setShowCVForm(false);

    } catch (error: any) {
      console.error('Error analyzing CV:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleExtractSkills = async () => {
    if (!cvForm.file) return;

    setUploading(true);
    try {
      const result = await extractSkills(cvForm.file);
      setExtractedSkills(result.skills);
      setActiveTab('skills');

      setCvForm({
        file: null,
        job_title: '',
        job_description: '',
        candidate_name: '',
        candidate_email: ''
      });
      setShowCVForm(false);

    } catch (error: any) {
      console.error('Error extracting skills:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleJobMatching = async () => {
    if (!cvForm.file) return;

    setUploading(true);
    try {
      const result = await matchCVToJobs(cvForm.file, jobMatchPreferences);
      setJobMatches(result);
      setActiveTab('matches');

      setCvForm({
        file: null,
        job_title: '',
        job_description: '',
        candidate_name: '',
        candidate_email: ''
      });
      setShowCVForm(false);
      setShowJobPreferences(false);

    } catch (error: any) {
      console.error('Error matching jobs:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleLiveSearch = async () => {
    if (!liveSearch.keywords.trim()) return;

    setUploading(true);
    try {
      const result = await searchLiveJobs(liveSearch);
      setLiveJobs(result.jobs);
      setActiveTab('live');
    } catch (error: any) {
      console.error('Error searching live jobs:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFootprintScan = async () => {
    if (!footprintForm.github_username && !footprintForm.linkedin_url && !footprintForm.stackoverflow_id) {
      return;
    }

    setUploading(true);
    try {
      const result = await scanDigitalFootprint(footprintForm);
      setFootprintData(result);
      setActiveTab('footprint');
      setShowFootprintForm(false);
    } catch (error: any) {
      console.error('Error scanning footprint:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCareerInsights = async () => {
    if (!cvForm.file) return;

    setUploading(true);
    try {
      const result = await generateCareerInsights(cvForm.file);
      setCareerInsights(result);
      setActiveTab('insights');
      setShowCareerInsights(false);
      
      setCvForm({
        file: null,
        job_title: '',
        job_description: '',
        candidate_name: '',
        candidate_email: ''
      });
    } catch (error: any) {
      console.error('Error generating insights:', error);
    } finally {
      setUploading(false);
    }
  };

  const updateCvForm = (field: keyof CVAnalysisForm, value: string) => {
    setCvForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateJobMatchPreference = (field: keyof JobMatchRequest, value: any) => {
    setJobMatchPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateLiveSearch = (field: keyof LiveJobSearchRequest, value: string) => {
    setLiveSearch(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateFootprintForm = (field: keyof FootprintScanRequest, value: string) => {
    setFootprintForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addLocation = (location: string) => {
    if (location.trim() && !jobMatchPreferences.preferred_locations?.includes(location)) {
      setJobMatchPreferences(prev => ({
        ...prev,
        preferred_locations: [...(prev.preferred_locations || []), location]
      }));
    }
  };

  const removeLocation = (location: string) => {
    setJobMatchPreferences(prev => ({
      ...prev,
      preferred_locations: prev.preferred_locations?.filter(loc => loc !== location) || []
    }));
  };

  const clearAnalysis = () => {
    setCvAnalysis(null);
    setExtractedSkills([]);
    setJobMatches(null);
    setLiveJobs([]);
    setFootprintData(null);
    setCareerInsights(null);
  };

  const SkillBadge = ({ skill }: { skill: string }) => (
    <Badge
      variant="outline"
      className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-700 text-sm py-1.5 px-3"
    >
      {skill}
    </Badge>
  );

  const AnalysisCard = ({ title, items, color = "blue", icon: Icon }: {
    title: string;
    items: string[];
    color?: "green" | "blue" | "orange" | "red";
    icon?: any;
  }) => {
    const colorClasses = {
      green: "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200",
      blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200",
      orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200",
      red: "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200"
    };

    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            {Icon && <Icon className={`w-4 h-4 mr-2 ${colorClasses[color].split(' ')[0]}`} />}
            <h4 className="font-semibold text-slate-900 dark:text-white">{title}</h4>
            <Badge variant="outline" className="ml-2 bg-slate-100 text-slate-600">
              {items.length}
            </Badge>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${colorClasses[color].split(' ')[0]}`} />
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const ProfileCard = ({ profile }: { profile: any }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-500" />
          Candidate Profile
        </CardTitle>
        <CardDescription>
          AI-extracted profile from your CV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Experience</label>
            <p className="text-lg font-semibold">{profile.experience_years} years</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Level</label>
            <Badge className="bg-blue-500 text-white">{profile.seniority_level}</Badge>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">Current Role</label>
          <p className="font-medium">{profile.current_role}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 flex items-center">
            <GraduationCap className="w-4 h-4 mr-1" />
            Education
          </label>
          <p>{profile.education_level}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 flex items-center">
            <Languages className="w-4 h-4 mr-1" />
            Languages
          </label>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.languages?.map((lang: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">Location Preferences</label>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.preferred_locations?.map((location: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                {location}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">Salary Expectations</label>
          <p className="font-medium">
            ${profile.salary_expectation_min?.toLocaleString()} - ${profile.salary_expectation_max?.toLocaleString()} {profile.currency}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const JobMatchCard = ({ job }: { job: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600 dark:text-slate-400">{job.location}</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                  {job.type}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${job.match_score > 70 ? 'bg-green-500' : job.match_score > 50 ? 'bg-yellow-500' : 'bg-orange-500'} text-white`}>
                {job.match_score}% Match
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <Briefcase className="w-4 h-4" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Full-time</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" className="rounded-xl border-2 text-sm">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 shadow-lg transition-all duration-300">
              Apply Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const RecommendationCard = ({ recommendation, index }: { recommendation: any; index: number }) => (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Rocket className="w-5 h-5 mr-2 text-blue-500" />
          {recommendation.job_title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center mb-2">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            Why You're a Good Fit
          </h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {recommendation.why_good_fit}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center mb-2">
            <Target className="w-4 h-4 mr-2 text-blue-500" />
            What to Emphasize
          </h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {recommendation.what_to_emphasize}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center mb-2">
            <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
            Application Tips
          </h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {recommendation.application_tips}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const LiveJobCard = ({ job }: { job: LiveJob }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Building className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600 dark:text-slate-400">{job.company}</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-xs">
                  {job.source}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary || 'Salary not specified'}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{new Date(job.posted_date).toLocaleDateString()}</span>
            </div>
            {job.type && (
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Briefcase className="w-4 h-4" />
                <span>{job.type}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" className="rounded-xl border-2 text-sm">
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-6 shadow-lg transition-all duration-300">
              View Job
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* System Status */}
      {healthStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`border-l-4 ${healthStatus.status === 'healthy'
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
            }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${healthStatus.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                  <div>
                    <p className="font-medium">AI Job Matcher - System Ready</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Groq API: {healthStatus.groq_api} • Database: {healthStatus.vector_db_count} records
                    </p>
                  </div>
                </div>
                <Badge variant={healthStatus.status === 'healthy' ? 'default' : 'secondary'}>
                  v{healthStatus.version}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Upload & Forms */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700 rounded-2xl shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-blue-900 dark:text-blue-100 text-xl flex items-center">
                  <Sparkles className="w-6 h-6 mr-2" />
                  AI Job Matcher
                </CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  Upload CV for analysis, matching, and live job search
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload */}
                <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-600">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {cvForm.file ? cvForm.file.name : "Upload your CV (PDF)"}
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      disabled={uploading}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${uploading
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          {cvForm.file ? 'Change File' : 'Select PDF'}
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Additional Action Buttons */}
                {!showCVForm && !showFootprintForm && !showCareerInsights && (
                  <div className="space-y-3">
                    <Button
                      onClick={() => setShowCVForm(true)}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      CV Analysis
                    </Button>

                    <Button
                      onClick={() => setShowFootprintForm(true)}
                      variant="outline"
                      className="w-full border-orange-300 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Scan Digital Footprint
                    </Button>

                    <Button
                      onClick={() => setShowCareerInsights(true)}
                      variant="outline"
                      className="w-full border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Generate Career Insights
                    </Button>
                  </div>
                )}

                {/* CV Analysis Form */}
                {showCVForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900 dark:text-white flex items-center">
                        <FileEdit className="w-5 h-5 mr-2 text-blue-500" />
                        CV Analysis
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCVForm(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={cvForm.job_title}
                        onChange={(e) => updateCvForm('job_title', e.target.value)}
                        placeholder="e.g., Senior Frontend Developer"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Job Description *
                      </label>
                      <textarea
                        value={cvForm.job_description}
                        onChange={(e) => updateCvForm('job_description', e.target.value)}
                        placeholder="Paste the job description here..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Your Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="text"
                            value={cvForm.candidate_name}
                            onChange={(e) => updateCvForm('candidate_name', e.target.value)}
                            placeholder="Optional"
                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Your Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="email"
                            value={cvForm.candidate_email}
                            onChange={(e) => updateCvForm('candidate_email', e.target.value)}
                            placeholder="optional@email.com"
                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <Button
                        onClick={handleCVAnalysis}
                        disabled={uploading || !cvForm.job_title || !cvForm.job_description}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Analyze CV
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={handleExtractSkills}
                        disabled={uploading || !cvForm.file}
                        variant="outline"
                        className="border-green-300 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Extract Skills
                      </Button>

                      <Button
                        onClick={handleJobMatching}
                        disabled={uploading || !cvForm.file}
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Matching...
                          </>
                        ) : (
                          <>
                            <Target className="w-4 h-4 mr-2" />
                            Match Jobs
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Footprint Scanner Form */}
                {showFootprintForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-700">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-orange-900 dark:text-orange-100 text-lg flex items-center">
                            <Globe className="w-5 h-5 mr-2" />
                            Digital Footprint Scanner
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFootprintForm(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <CardDescription className="text-orange-700 dark:text-orange-300">
                          Analyze GitHub, LinkedIn, and StackOverflow profiles
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center">
                            <Github className="w-4 h-4 mr-2" />
                            GitHub Username
                          </label>
                          <input
                            type="text"
                            value={footprintForm.github_username}
                            onChange={(e) => updateFootprintForm('github_username', e.target.value)}
                            placeholder="e.g., octocat"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center">
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn Profile URL
                          </label>
                          <input
                            type="url"
                            value={footprintForm.linkedin_url}
                            onChange={(e) => updateFootprintForm('linkedin_url', e.target.value)}
                            placeholder="e.g., https://linkedin.com/in/username"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center">
                            <Code2 className="w-4 h-4 mr-2" />
                            StackOverflow User ID
                          </label>
                          <input
                            type="text"
                            value={footprintForm.stackoverflow_id}
                            onChange={(e) => updateFootprintForm('stackoverflow_id', e.target.value)}
                            placeholder="e.g., 1234567"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <Button
                          onClick={handleFootprintScan}
                          disabled={uploading || (!footprintForm.github_username && !footprintForm.linkedin_url && !footprintForm.stackoverflow_id)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          {uploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Scanning...
                            </>
                          ) : (
                            <>
                              <Globe className="w-4 h-4 mr-2" />
                              Scan Digital Footprint
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Career Insights Form */}
                {showCareerInsights && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-purple-900 dark:text-purple-100 text-lg flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Career Insights Generator
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCareerInsights(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <CardDescription className="text-purple-700 dark:text-purple-300">
                          Get AI-powered career recommendations and market insights
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-600">
                          <div className="text-center">
                            <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                              {cvForm.file ? cvForm.file.name : "Upload your CV (PDF)"}
                            </p>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileSelect}
                              disabled={uploading}
                              className="hidden"
                              id="insights-upload"
                            />
                            <label
                              htmlFor="insights-upload"
                              className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${uploading
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                : 'bg-purple-500 hover:bg-purple-600 text-white'
                                }`}
                            >
                              {uploading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  {cvForm.file ? 'Change File' : 'Select PDF'}
                                </>
                              )}
                            </label>
                          </div>
                        </div>

                        <Button
                          onClick={handleCareerInsights}
                          disabled={uploading || !cvForm.file}
                          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                        >
                          {uploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating Insights...
                            </>
                          ) : (
                            <>
                              <Brain className="w-4 h-4 mr-2" />
                              Generate Career Insights
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Job Matching Preferences */}
                <div className="pt-4 border-t border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-purple-500" />
                      Job Matching Preferences
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowJobPreferences(!showJobPreferences)}
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {showJobPreferences && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      {/* Salary Range */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Salary Range ($/year)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <input
                              type="number"
                              value={jobMatchPreferences.salary_min}
                              onChange={(e) => updateJobMatchPreference('salary_min', parseInt(e.target.value) || 0)}
                              placeholder="Min"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              value={jobMatchPreferences.salary_max}
                              onChange={(e) => updateJobMatchPreference('salary_max', parseInt(e.target.value) || 0)}
                              placeholder="Max"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Preferred Locations */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Preferred Locations
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {jobMatchPreferences.preferred_locations?.map((location, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 text-xs"
                            >
                              {location}
                              <button
                                onClick={() => removeLocation(location)}
                                className="ml-1 text-green-600 hover:text-green-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add location..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addLocation(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const input = document.querySelector('input[placeholder="Add location..."]') as HTMLInputElement;
                              if (input) {
                                addLocation(input.value);
                                input.value = '';
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Remote Work Preference */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Open to Remote Work
                        </label>
                        <button
                          onClick={() => updateJobMatchPreference('open_to_remote', !jobMatchPreferences.open_to_remote)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${jobMatchPreferences.open_to_remote ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${jobMatchPreferences.open_to_remote ? 'translate-x-6' : 'translate-x-1'}`}
                          />
                        </button>
                      </div>

                      {/* Max Results */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Max Results: {jobMatchPreferences.max_results}
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          value={jobMatchPreferences.max_results}
                          onChange={(e) => updateJobMatchPreference('max_results', parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>5</span>
                          <span>50</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Live Search Form */}
                <div className="pt-4 border-t border-blue-200">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center mb-3">
                    <Globe className="w-5 h-5 mr-2 text-green-500" />
                    Live Job Search
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Keywords *
                      </label>
                      <input
                        type="text"
                        value={liveSearch.keywords}
                        onChange={(e) => updateLiveSearch('keywords', e.target.value)}
                        placeholder="e.g., React Developer, Data Scientist"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={liveSearch.location}
                        onChange={(e) => updateLiveSearch('location', e.target.value)}
                        placeholder="e.g., Dubai, Remote"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <Button
                      onClick={handleLiveSearch}
                      disabled={uploading || !liveSearch.keywords.trim()}
                      className="bg-green-500 hover:bg-green-600 text-white w-full"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Search Live Jobs
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          {(cvAnalysis || extractedSkills.length > 0 || jobMatches || liveJobs.length > 0 || footprintData || careerInsights) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Results Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cvAnalysis && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CV Match Score</span>
                      <Badge className="bg-green-500 text-white">
                        {cvAnalysis.overall_match_score}%
                      </Badge>
                    </div>
                  )}

                  {extractedSkills.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Skills Found</span>
                      <Badge variant="outline">{extractedSkills.length}</Badge>
                    </div>
                  )}

                  {jobMatches && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Job Matches</span>
                      <Badge variant="outline">{jobMatches.total_matches}</Badge>
                    </div>
                  )}

                  {liveJobs.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Live Jobs</span>
                      <Badge variant="outline">{liveJobs.length}</Badge>
                    </div>
                  )}

                  {footprintData && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Footprint Score</span>
                      <Badge className="bg-orange-500 text-white">
                        {footprintData.overall_footprint_score}%
                      </Badge>
                    </div>
                  )}

                  {careerInsights && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Career Insights</span>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        Generated
                      </Badge>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearAnalysis}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Header */}
          {(cvAnalysis || extractedSkills.length > 0 || jobMatches || liveJobs.length > 0 || footprintData || careerInsights) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex space-x-4 border-b overflow-x-auto">
                    {cvAnalysis && (
                      <button
                        onClick={() => setActiveTab('analysis')}
                        className={`pb-2 px-1 font-medium transition-colors whitespace-nowrap ${activeTab === 'analysis'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        <Target className="w-4 h-4 inline mr-2" />
                        CV Analysis
                      </button>
                    )}
                    {extractedSkills.length > 0 && (
                      <button
                        onClick={() => setActiveTab('skills')}
                        className={`pb-2 px-1 font-medium transition-colors whitespace-nowrap ${activeTab === 'skills'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        <Lightbulb className="w-4 h-4 inline mr-2" />
                        Skills ({extractedSkills.length})
                      </button>
                    )}
                    {jobMatches && (
                      <button
                        onClick={() => setActiveTab('matches')}
                        className={`pb-2 px-1 font-medium transition-colors whitespace-nowrap ${activeTab === 'matches'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        <Briefcase className="w-4 h-4 inline mr-2" />
                        Matches ({jobMatches.total_matches})
                      </button>
                    )}
                    {liveJobs.length > 0 && (
                      <button
                        onClick={() => setActiveTab('live')}
                        className={`pb-2 px-1 font-medium transition-colors whitespace-nowrap ${activeTab === 'live'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        <Globe className="w-4 h-4 inline mr-2" />
                        Live Jobs ({liveJobs.length})
                      </button>
                    )}
                    {footprintData && (
                      <button
                        onClick={() => setActiveTab('footprint')}
                        className={`pb-2 px-1 font-medium transition-colors whitespace-nowrap ${activeTab === 'footprint'
                          ? 'text-orange-600 border-b-2 border-orange-600'
                          : 'text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        <Globe className="w-4 h-4 inline mr-2" />
                        Footprint
                      </button>
                    )}
                    {careerInsights && (
                      <button
                        onClick={() => setActiveTab('insights')}
                        className={`pb-2 px-1 font-medium transition-colors whitespace-nowrap ${activeTab === 'insights'
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        <TrendingUp className="w-4 h-4 inline mr-2" />
                        Insights
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Analysis Results */}
          {activeTab === 'analysis' && cvAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Overall Score Card */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        CV Analysis Complete
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {cvAnalysis.overall_feedback}
                      </p>
                    </div>
                    <Badge className={`text-white ${cvAnalysis.recommendation === 'POTENTIAL FIT'
                      ? 'bg-green-500'
                      : cvAnalysis.recommendation === 'STRONG MATCH'
                        ? 'bg-blue-500'
                        : 'bg-orange-500'
                      }`}>
                      {cvAnalysis.recommendation}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{cvAnalysis.overall_match_score}%</div>
                      <div className="text-sm text-slate-600">Overall Match</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{cvAnalysis.ats_score}%</div>
                      <div className="text-sm text-slate-600">ATS Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Match Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnalysisCard
                  title="Matched Skills"
                  items={cvAnalysis.matched_skills}
                  color="green"
                  icon={CheckCircle2}
                />
                <AnalysisCard
                  title="Missing Skills"
                  items={cvAnalysis.missing_skills}
                  color="orange"
                  icon={AlertCircle}
                />
              </div>

              {/* Strengths & Suggestions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnalysisCard
                  title="Strengths"
                  items={cvAnalysis.strengths}
                  color="blue"
                  icon={Star}
                />
                <AnalysisCard
                  title="Improvement Suggestions"
                  items={cvAnalysis.suggestions}
                  color="orange"
                  icon={Lightbulb}
                />
              </div>
            </motion.div>
          )}

          {/* Skills Results */}
          {activeTab === 'skills' && extractedSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    Extracted Skills
                    <Badge variant="outline" className="ml-2">
                      {extractedSkills.length} skills found
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    AI-powered skill extraction from your CV
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {extractedSkills.map((skill, index) => (
                      <SkillBadge key={index} skill={skill} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Job Matches Results */}
          {activeTab === 'matches' && jobMatches && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    AI-Matched Jobs
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {jobMatches.total_matches} jobs matched to your preferences
                  </p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-600">
                  AI Powered Matching
                </Badge>
              </div>

              {/* Profile Section */}
              {jobMatches.profile && (
                <ProfileCard profile={jobMatches.profile} />
              )}

              {/* Overall Assessment */}
              {jobMatches.recommendations?.overall_assessment && (
                <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                      Overall Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {jobMatches.recommendations.overall_assessment}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Job Matches */}
              {jobMatches.matches && jobMatches.matches.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                    Recommended Jobs ({jobMatches.matches.length})
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {jobMatches.matches.map((job: any, index: any) => (
                      <JobMatchCard key={job.job_id} job={job} />
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Recommendations */}
              {jobMatches.recommendations?.job_recommendations && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <Rocket className="w-5 h-5 mr-2 text-purple-500" />
                    Detailed Recommendations
                  </h3>
                  <div className="space-y-6">
                    {jobMatches.recommendations.job_recommendations.map((recommendation: any, index: any) => (
                      <RecommendationCard key={index} recommendation={recommendation} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {/* Market Insights */}
              {jobMatches.recommendations?.market_insights && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                      Market Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {jobMatches.recommendations.market_insights}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Next Steps */}
              {jobMatches.recommendations?.next_steps && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                      Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {jobMatches.recommendations.next_steps.map((step: any, index: any) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">{index + 1}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Live Jobs Results */}
          {activeTab === 'live' && liveJobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Live Job Search Results
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {liveJobs.length} jobs found from {Array.from(new Set(liveJobs.map(job => job.source))).join(', ')}
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600">
                  Real-time Search
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {liveJobs.map((job, index) => (
                  <LiveJobCard key={job.id} job={job} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Footprint Scanner Results */}
          {activeTab === 'footprint' && footprintData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Overall Score */}
              <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Digital Footprint Analysis
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Overall digital presence score
                      </p>
                    </div>
                    <Badge className="bg-orange-500 text-white text-lg">
                      {footprintData.overall_footprint_score}/100
                    </Badge>
                  </div>
                  <Progress value={footprintData.overall_footprint_score} className="h-2" />
                </CardContent>
              </Card>

              {/* GitHub Results */}
              {footprintData.results.github && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Github className="w-5 h-5 mr-2" />
                      GitHub Profile
                      {!footprintData.results.github.error && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                          {footprintData.results.github.activity_score} Activity Score
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {footprintData.results.github.error ? (
                      <div className="text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {footprintData.results.github.error}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{footprintData.results.github.public_repos}</div>
                          <div className="text-sm text-slate-600">Repos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{footprintData.results.github.followers}</div>
                          <div className="text-sm text-slate-600">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{footprintData.results.github.total_stars}</div>
                          <div className="text-sm text-slate-600">Stars</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{footprintData.results.github.following}</div>
                          <div className="text-sm text-slate-600">Following</div>
                        </div>
                      </div>
                    )}
                    
                    {footprintData.results.github.top_languages && footprintData.results.github.top_languages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Top Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {footprintData.results.github.top_languages.map((lang, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* StackOverflow Results */}
              {footprintData.results.stackoverflow && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code2 className="w-5 h-5 mr-2" />
                      StackOverflow Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {footprintData.results.stackoverflow.error ? (
                      <div className="text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {footprintData.results.stackoverflow.error}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{footprintData.results.stackoverflow.reputation}</div>
                          <div className="text-sm text-slate-600">Reputation</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{footprintData.results.stackoverflow.gold_badges}</div>
                          <div className="text-sm text-slate-600">Gold</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{footprintData.results.stackoverflow.silver_badges}</div>
                          <div className="text-sm text-slate-600">Silver</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{footprintData.results.stackoverflow.bronze_badges}</div>
                          <div className="text-sm text-slate-600">Bronze</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* LinkedIn Results */}
              {footprintData.results.linkedin && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Linkedin className="w-5 h-5 mr-2" />
                      LinkedIn Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{footprintData.results.linkedin.note}</p>
                    <Button variant="outline" asChild>
                      <a href={footprintData.results.linkedin.profile_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Profile
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Career Insights Results */}
          {activeTab === 'insights' && careerInsights && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Career Summary */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Career Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {careerInsights.insights.career_summary}
                  </p>
                </CardContent>
              </Card>

              {/* Market Competitiveness */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Market Competitiveness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={
                      careerInsights.insights.market_competitiveness === 'High' ? 'bg-green-500' :
                      careerInsights.insights.market_competitiveness === 'Medium' ? 'bg-yellow-500' : 'bg-orange-500'
                    }>
                      {careerInsights.insights.market_competitiveness}
                    </Badge>
                    <span className="text-slate-600 text-sm">
                      Based on your skills and experience
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Salary Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Salary Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold text-slate-900">
                    {careerInsights.insights.salary_insights.range}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Factors:</h4>
                    <ul className="space-y-1">
                      {careerInsights.insights.salary_insights.factors.map((factor, index) => (
                        <li key={index} className="flex items-center text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Growth Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Rocket className="w-5 h-5 mr-2" />
                    Growth Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {careerInsights.insights.growth_opportunities.map((opportunity, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">{opportunity.role}</h4>
                        <p className="text-sm text-slate-600">Timeline: {opportunity.timeline}</p>
                        {opportunity.requirements && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-slate-700">Requirements:</p>
                            <ul className="text-sm text-slate-600 mt-1 space-y-1">
                              {opportunity.requirements.map((req, reqIndex) => (
                                <li key={reqIndex} className="flex items-center">
                                  <div className="w-1 h-1 bg-slate-400 rounded-full mr-2"></div>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Recommended Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {careerInsights.insights.recommended_actions.map((action, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <span className="font-medium">{action.action}</span>
                        <Badge className={
                          action.priority === 'High' ? 'bg-red-500' :
                          action.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }>
                          {action.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Industry Trends */}
              {careerInsights.insights.industry_trends && careerInsights.insights.industry_trends.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Industry Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {careerInsights.insights.industry_trends.map((trend, index) => (
                        <li key={index} className="flex items-start text-sm text-slate-600">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Skill Gaps */}
              {careerInsights.insights.skill_gaps && careerInsights.insights.skill_gaps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Skill Gaps to Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {careerInsights.insights.skill_gaps.map((gap, index) => (
                        <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          {gap}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Empty State */}
          {!cvAnalysis && extractedSkills.length === 0 && !jobMatches && liveJobs.length === 0 && !footprintData && !careerInsights && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Start Your Job Search Journey
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Upload your CV to get AI-powered analysis, skill extraction, job matching, and live job search from multiple sources.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}