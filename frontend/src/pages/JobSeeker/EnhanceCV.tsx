import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Search, Star, Zap, Shield, Clock, FileText, TrendingUp, Award, AlertCircle, CheckCircle, Loader2, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from '@/i18n';
import { useContext, useState } from "react";
import { LanguageContext } from '@/i18n';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function EnhanceCV() {
  const { t } = useTranslation();
  const { language: currentLanguage } = useContext(LanguageContext);
  const isRTL = currentLanguage === 'ar';

  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your CV for improvements",
      color: "text-orange-500"
    },
    {
      icon: Shield,
      title: "ATS Optimized",
      description: "Ensure your CV passes through applicant tracking systems",
      color: "text-blue-500"
    },
    {
      icon: Star,
      title: "Professional Templates",
      description: "Choose from industry-specific professional templates",
      color: "text-purple-500"
    },
    {
      icon: Clock,
      title: "Quick Results",
      description: "Get detailed analysis and suggestions in minutes",
      color: "text-green-500"
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError('');
    }
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCvText(e.target.value);
    setError('');
  };

  const analyzeCV = async () => {
    if (!file && !cvText.trim()) {
      setError('Please upload a CV or paste the text');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const API_URL = 'http://localhost:3000';
      const TOKEN = 'MonMotDePasseSecret123!';

      // 1. If file, extract text
      let finalCvText = cvText;

      if (file) {
        const formData = new FormData();
        formData.append('cv', file);

        const extractRes = await fetch(`${API_URL}/extract`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${TOKEN}` },
          body: formData
        });

        if (!extractRes.ok) throw new Error('Extraction failed');
        const extractData = await extractRes.json();
        finalCvText = extractData.cv_text;
      }

      // 2. Optimize CV
      const optimizeRes = await fetch(`${API_URL}/optimize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ candidate_cv_text: finalCvText })
      });

      if (!optimizeRes.ok) throw new Error('Optimization failed');
      const optimizeData = await optimizeRes.json();

      // 3. Analyze skill gaps
      const skillRes = await fetch(`${API_URL}/skill-gaps`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cv_text: finalCvText,
          jd_text: ''
        })
      });

      if (!skillRes.ok) throw new Error('Skill analysis failed');
      const skillData = await skillRes.json();

      // Display results
      setResults({
        original_score: optimizeData.original_cv_score,
        optimized_score: optimizeData.optimized_cv_score,
        optimized_cv: optimizeData.optimized_cv_text,
        skill_gaps: skillData.skill_gaps,
        improvements: optimizeData.improvements || []
      });

      setActiveTab('results');
    } catch (err: any) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  const [downloadLoading, setDownloadLoading] = useState(false);

  // const downloadEnhancedCV = async (format: 'txt' | 'pdf' | 'latex' = 'txt', language: 'french' | 'english' = 'french') => {
  //   if (!results?.optimized_cv) return;

  //   setDownloadLoading(true);
  //   try {
  //     const API_URL = 'http://localhost:3000';
  //     const TOKEN = 'MonMotDePasseSecret123!';

  //     const response = await fetch(`${API_URL}/download-cv`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${TOKEN}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         optimized_cv: results.optimized_cv,
  //         format: format,
  //         language: language
  //       })
  //     });

  //     if (!response.ok) throw new Error('Download failed');

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.style.display = 'none';
  //     a.href = url;

  //     // Set filename based on format and language
  //     const extensions = {
  //       'txt': 'txt',
  //       'pdf': 'pdf',
  //       'latex': 'tex'
  //     };
  //     const filename = `cv_${language}.${extensions[format]}`;
  //     a.download = filename;

  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);

  //   } catch (err: any) {
  //     console.error('Download error:', err);
  //     // Fallback to simple TXT download
  //     downloadTxtFallback(language);
  //   } finally {
  //     setDownloadLoading(false);
  //   }
  // };

  const downloadEnhancedCV = async (language: 'french' | 'english' = 'french') => {
    if (!results?.optimized_cv) return;

    setDownloadLoading(true);
    try {
      const API_URL = 'http://localhost:3000';
      const TOKEN = 'MonMotDePasseSecret123!';

      const response = await fetch(`${API_URL}/download-cv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          optimized_cv: results.optimized_cv,
          language: language
        })
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;

      // Get filename from response headers or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `professional_cv_${language}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      a.download = filename;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err: any) {
      console.error('Download error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };
  const downloadTxtFallback = (language: 'french' | 'english' = 'french') => {
    if (!results?.optimized_cv) return;

    const blob = new Blob([results.optimized_cv], {
      type: 'text/plain; charset=utf-8'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `cv_${language}.txt`;

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  // Alternative simple download function for TXT only (if you don't want dropdown)
  const downloadTxtCV = () => {
    if (!results?.optimized_cv) return;

    const blob = new Blob([results.optimized_cv], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'enhanced_cv.txt';

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const ScoreCircle = ({ score, label }: { score: number; label: string }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          </div>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 rounded-xl h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${feature.color} bg-${feature.color.split('-')[0]}-100 dark:bg-${feature.color.split('-')[0]}-900/20 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium transition-all border-b-2 ${activeTab === 'upload'
            ? 'border-orange-500 text-orange-600 dark:text-orange-400'
            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
        >
          <Upload className="w-4 h-4 inline-block mr-2" />
          Upload CV
        </button>
        <button
          onClick={() => setActiveTab('results')}
          disabled={!results}
          className={`px-4 py-2 font-medium transition-all border-b-2 ${activeTab === 'results' && results
            ? 'border-orange-500 text-orange-600 dark:text-orange-400'
            : 'border-transparent text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
        >
          <TrendingUp className="w-4 h-4 inline-block mr-2" />
          Results
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 rounded-2xl shadow-lg h-full hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-orange-900 dark:text-orange-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <Upload className="w-6 h-6 mr-3" />
                      {t('dashboard.uploadCV')}
                    </div>
                    <Badge variant="secondary" className="bg-orange-500 text-white">Recommended</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                        Upload your CV (PDF, DOCX, TXT)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="flex items-center justify-center w-full px-6 py-8 border-2 border-dashed border-orange-300 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                        >
                          <div className="text-center">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-orange-400" />
                            {file ? (
                              <p className="text-sm text-orange-700 dark:text-orange-300">
                                <CheckCircle className="w-4 h-4 inline text-green-500 mr-1" />
                                {file.name} uploaded successfully
                              </p>
                            ) : (
                              <>
                                <p className="text-sm text-orange-700 dark:text-orange-300 mb-1">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-orange-500 dark:text-orange-400">
                                  PDF, DOCX, TXT (Max 10MB)
                                </p>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Text Area */}
                    <div>
                      <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                        Or paste your CV text
                      </label>
                      <textarea
                        value={cvText}
                        onChange={handleTextInput}
                        placeholder="Paste your CV content here..."
                        className="w-full h-32 px-4 py-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl mt-4">
                      <AlertCircle className="w-5 h-5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button
                    onClick={analyzeCV}
                    disabled={loading}
                    className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        {t('dashboard.analyzeNow')}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Analysis Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg h-full hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center">
                    <Search className="w-6 h-6 mr-3" />
                    {t('dashboard.aiAnalysis')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 dark:text-blue-300 mb-6 leading-relaxed">
                    {t('dashboard.aiAnalysisDesc')}
                  </p>

                  {/* Analysis Progress Placeholder */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600 dark:text-blue-400">Keyword Optimization</span>
                      <span className="font-semibold">-</span>
                    </div>
                    <Progress value={0} className="h-2 bg-blue-200 dark:bg-blue-800" />

                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600 dark:text-blue-400">Formatting Score</span>
                      <span className="font-semibold">-</span>
                    </div>
                    <Progress value={0} className="h-2 bg-blue-200 dark:bg-blue-800" />

                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600 dark:text-blue-400">ATS Compatibility</span>
                      <span className="font-semibold">-</span>
                    </div>
                    <Progress value={0} className="h-2 bg-blue-200 dark:bg-blue-800" />
                  </div>

                  <div className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
                    <p>✓ AI-powered content analysis</p>
                    <p>✓ Skill gap identification</p>
                    <p>✓ ATS optimization</p>
                    <p>✓ Professional formatting</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {activeTab === 'results' && results && (
          <div className="space-y-6">
            {/* Scores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border-0">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                  Performance Scores
                </h2>
                <div className="flex justify-around items-center">
                  <ScoreCircle score={results.original_score} label="Original CV" />
                  <div className="text-4xl text-slate-300 dark:text-slate-600">→</div>
                  <ScoreCircle score={results.optimized_score} label="Optimized CV" />
                </div>
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">
                      +{results.optimized_score - results.original_score} points improvement
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Optimized CV */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="w-6 h-6 text-blue-600" />
                      Optimized CV
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-6 border border-slate-200 dark:border-slate-600 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {results.optimized_cv}
                      </pre>
                    </div>
                    <div className="mt-4 flex gap-3">
                      {/* Simple TXT Download */}
                      {/* <Button
                        onClick={downloadTxtCV}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download TXT
                      </Button> */}

                      {/* OR Dropdown for multiple formats */}
                      {/* <DropdownMenu>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() =>downloadEnhancedCV('txt', 'french')}>
                            <FileText className="w-4 h-4 mr-2" />
                            Download as TXT
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadEnhancedCV('pdf')}>
                            <FileText className="w-4 h-4 mr-2" />
                            Download as PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            disabled={downloadLoading}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 flex-1"
                          >
                            {downloadLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                            Télécharger CV
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <div className="px-2 py-1 text-xs font-semibold text-slate-500">Format Français</div>
                          <DropdownMenuItem onClick={() => downloadEnhancedCV('french')}>
                            <FileText className="w-4 h-4 mr-2" />
                            TXT Français
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadEnhancedCV('french')}>
                            <FileText className="w-4 h-4 mr-2" />
                            LaTeX Français
                          </DropdownMenuItem>

                          <div className="px-2 py-1 text-xs font-semibold text-slate-500 mt-2">English Format</div>
                          <DropdownMenuItem onClick={() => downloadEnhancedCV('english')}>
                            <FileText className="w-4 h-4 mr-2" />
                            TXT English
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadEnhancedCV('english')}>
                            <FileText className="w-4 h-4 mr-2" />
                            LaTeX English
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      <p>✓ Professionally formatted</p>
                      <p>✓ ATS optimized</p>
                      <p>✓ Ready to use</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skill Gaps */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                      Skills to Develop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {results.skill_gaps.map((gap: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-xl p-4 hover:shadow-lg transition-shadow"
                        >
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm">
                              {index + 1}
                            </div>
                            {gap.skill}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed ml-10">
                            {gap.suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* New Analysis Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <Button
                onClick={() => {
                  setActiveTab('upload');
                  setResults(null);
                  setFile(null);
                  setCvText('');
                }}
                variant="outline"
                className="bg-white/60 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-xl py-3 px-8"
              >
                Analyze New CV
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Recent Analysis (Only show when no active analysis) */}
      {!results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Recent Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Senior Developer CV", date: "2 hours ago", score: 92, improvements: 5 },
                  { name: "Updated Resume", date: "1 day ago", score: 85, improvements: 3 },
                  { name: "Initial CV Draft", date: "3 days ago", score: 67, improvements: 12 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{item.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg text-green-600">{item.score}%</span>
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700">
                          {item.improvements} improvements
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}