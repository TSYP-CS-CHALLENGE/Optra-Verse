import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Search, Star, Zap, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from '@/i18n';
import { useContext } from "react";
import { LanguageContext } from '@/i18n';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function EnhanceCV() {
  const { t } = useTranslation();
  const { language: currentLanguage } = useContext(LanguageContext);
  const isRTL = currentLanguage === 'ar';

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <p className="text-orange-700 dark:text-orange-300 mb-6 leading-relaxed">
                {t('dashboard.uploadCVDesc')}
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-600 dark:text-orange-400">File size limit</span>
                  <span className="font-semibold">10 MB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-600 dark:text-orange-400">Supported formats</span>
                  <span className="font-semibold">PDF, DOC, DOCX</span>
                </div>
              </div>
              <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 shadow-lg transition-all duration-300 hover:shadow-xl">
                <Upload className="w-4 h-4 mr-2" />
                {t('dashboard.uploadFile')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

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
              
              {/* Analysis Progress */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 dark:text-blue-400">Keyword Optimization</span>
                  <span className="font-semibold">92%</span>
                </div>
                <Progress value={92} className="h-2 bg-blue-200 dark:bg-blue-800" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 dark:text-blue-400">Formatting Score</span>
                  <span className="font-semibold">85%</span>
                </div>
                <Progress value={85} className="h-2 bg-blue-200 dark:bg-blue-800" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 dark:text-blue-400">ATS Compatibility</span>
                  <span className="font-semibold">78%</span>
                </div>
                <Progress value={78} className="h-2 bg-blue-200 dark:bg-blue-800" />
              </div>

              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 shadow-lg transition-all duration-300 hover:shadow-xl">
                <Search className="w-4 h-4 mr-2" />
                {t('dashboard.analyzeNow')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Analysis */}
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
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
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
    </div>
  );
}