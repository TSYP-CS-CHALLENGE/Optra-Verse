// import { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from '@/i18n';
// import { LanguageContext } from '@/i18n';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   LogOut,
//   User,
//   FileText,
//   Briefcase,
//   Video,
//   Moon,
//   Sun,
//   Languages,
//   ChevronRight,
//   Upload,
//   Search,
//   Play,
//   BarChart3,
//   Target
// } from "lucide-react";
// import { useTheme } from "next-themes";
// import { motion, AnimatePresence } from "framer-motion";
// import { getCurrentUser, logout } from "@/services/auth/auth_service";

// export default function JobSeekerDashboard() {
//   const { t } = useTranslation();
//   const { user, LogoutUser } = useAuth();
//   const navigate = useNavigate();
//   const { theme, setTheme } = useTheme();
//   const { language: currentLanguage, setLanguage } = useContext(LanguageContext);
//   const [activeMenu, setActiveMenu] = useState<'enhance-cv' | 'job-matcher' | 'interview'>('enhance-cv');
//   const [mounted, setMounted] = useState(false);
//   const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

//   const isRTL = currentLanguage === 'ar';

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleLogout = async () => {
//     LogoutUser();
//     await logout();
//     navigate('/auth/login');
//   };

//   const fetchUser = async () => {
//     try {
//       const userData = await getCurrentUser();
//       console.log(userData);

//     } catch (error) {
//       console.error('Failed to fetch user data:', error);
//     }
//   }

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const changeLanguage = (lng: string) => {
//     setLanguage(lng);
//     setShowLanguageDropdown(false);
//   };

//   const menuItems = [
//     {
//       id: 'enhance-cv',
//       title: t('dashboard.enhanceCV'),
//       description: t('dashboard.enhanceCVDesc'),
//       icon: FileText,
//       color: 'from-orange-500 to-orange-600',
//       gradient: 'from-orange-500 to-orange-600',
//       bgGradient: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'
//     },
//     {
//       id: 'job-matcher',
//       title: t('dashboard.jobMatcher'),
//       description: t('dashboard.jobMatcherDesc'),
//       icon: Briefcase,
//       color: 'from-blue-500 to-blue-600',
//       gradient: 'from-blue-500 to-blue-600',
//       bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
//     },
//     {
//       id: 'interview',
//       title: t('dashboard.interviewAI'),
//       description: t('dashboard.interviewAIDesc'),
//       icon: Video,
//       color: 'from-green-500 to-green-600',
//       gradient: 'from-green-500 to-green-600',
//       bgGradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
//     }
//   ];

//   const currentMenu = menuItems.find(item => item.id === activeMenu);

//   if (!mounted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ${isRTL ? 'rtl' : 'ltr'}`}
//       dir={isRTL ? 'rtl' : 'ltr'}
//     >
//       {/* Header */}
//       <motion.header
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/80 shadow-sm"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className={`flex justify-between items-center h-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
//             {/* Logo et titre */}
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4 cursor-pointer`}
//               onClick={() => navigate('/dashboard')}
//             >
//               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
//                 <span className="text-white font-bold text-xl">OV</span>
//               </div>
//               <div className={isRTL ? 'text-right' : 'text-left'}>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
//                   OptraVerse
//                 </h1>
//                 <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
//                   {t('dashboard.welcome')}, <span className="text-orange-500 dark:text-orange-400">{user?.prenom}</span>!
//                 </p>
//               </div>
//             </motion.div>

//             {/* Actions */}
//             <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
//               {/* Thème */}
//               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//                   className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
//                 >
//                   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//                 </Button>
//               </motion.div>

//               {/* Langue */}
//               <motion.div whileHover={{ scale: 1.05 }} className="relative">
//                 <Button
//                   variant="ghost"
//                   onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
//                   className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl`}
//                 >
//                   <Languages className="w-5 h-5" />
//                   <span className="font-medium">{currentLanguage === 'fr' ? 'FR' : currentLanguage === 'ar' ? 'AR' : 'EN'}</span>
//                 </Button>

//                 <AnimatePresence>
//                   {showLanguageDropdown && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
//                       transition={{ duration: 0.2 }}
//                       className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-2 z-50 min-w-[100px] backdrop-blur-lg`}
//                     >
//                       {[
//                         { value: 'fr', label: 'Français' },
//                         { value: 'en', label: 'English' },
//                         { value: 'ar', label: 'العربية' }
//                       ].map((language) => (
//                         <motion.button
//                           key={language.value}
//                           whileHover={{ backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9' }}
//                           onClick={() => changeLanguage(language.value)}
//                           className={`w-full px-4 py-2 text-left transition-colors duration-150 text-sm font-medium ${currentLanguage === language.value
//                               ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
//                               : 'text-slate-700 dark:text-slate-300'
//                             }`}
//                         >
//                           {language.label}
//                         </motion.button>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>

//               {/* Profil */}
//               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 <Button
//                   variant="ghost"
//                   onClick={() => navigate('/profile')}
//                   className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl`}
//                 >
//                   <User className="w-5 h-5" />
//                   <span className="font-medium">{t('dashboard.profile')}</span>
//                 </Button>
//               </motion.div>

//               {/* Déconnexion */}
//               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 <Button
//                   variant="ghost"
//                   onClick={handleLogout}
//                   className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl`}
//                 >
//                   <LogOut className="w-5 h-5" />
//                   <span className="font-medium">{t('dashboard.logout')}</span>
//                 </Button>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </motion.header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
//           {/* Sidebar Menu */}
//           <div className="lg:col-span-1 space-y-6">
//             <motion.div
//               initial={{ x: -50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.6, delay: 0.1 }}
//             >
//               <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl">
//                 <CardHeader className="pb-4">
//                   <CardTitle className="text-slate-900 dark:text-white text-lg font-bold flex items-center">
//                     <Target className="w-5 h-5 text-orange-500 mr-2" />
//                     {t('dashboard.menu')}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   {menuItems.map((item, index) => {
//                     const Icon = item.icon;
//                     return (
//                       <motion.button
//                         key={item.id}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.4, delay: index * 0.1 }}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => setActiveMenu(item.id as any)}
//                         className={`w-full flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4 p-4 rounded-xl transition-all duration-300 border ${activeMenu === item.id
//                             ? `bg-gradient-to-r ${item.color} text-white shadow-lg border-transparent`
//                             : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
//                           }`}
//                       >
//                         <div className={`p-2 rounded-lg ${activeMenu === item.id
//                             ? 'bg-white/20'
//                             : 'bg-slate-100 dark:bg-slate-700'
//                           }`}>
//                           <Icon className={`w-5 h-5 ${activeMenu === item.id ? 'text-white' : item.color.replace('from-', 'text-').split(' ')[0]
//                             }`} />
//                         </div>
//                         <div className="flex-1 text-left">
//                           <div className="font-semibold text-sm">{item.title}</div>
//                           <div className={`text-xs ${activeMenu === item.id ? 'text-white/90' : 'text-slate-500 dark:text-slate-500'
//                             }`}>
//                             {item.description}
//                           </div>
//                         </div>
//                         <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeMenu === item.id ? 'rotate-90 text-white' : 'text-slate-400'
//                           }`} />
//                       </motion.button>
//                     );
//                   })}
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* Quick Stats */}
//             <motion.div
//               initial={{ x: -50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl">
//                 <CardHeader className="pb-4">
//                   <CardTitle className="text-slate-900 dark:text-white text-lg font-bold flex items-center">
//                     <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
//                     {t('dashboard.quickStats')}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {[
//                     { label: t('dashboard.profileCompletion'), value: '75%', color: 'text-orange-500' },
//                     { label: t('dashboard.jobsApplied'), value: '12', color: 'text-blue-500' },
//                     { label: t('dashboard.interviews'), value: '3', color: 'text-green-500' }
//                   ].map((stat, index) => (
//                     <motion.div
//                       key={stat.label}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
//                       className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''} p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/30`}
//                     >
//                       <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{stat.label}</span>
//                       <span className={`font-bold ${stat.color} text-lg`}>{stat.value}</span>
//                     </motion.div>
//                   ))}
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             <motion.div
//               key={activeMenu}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl min-h-[600px]">
//                 <CardHeader className="pb-6">
//                   <CardTitle className={`text-slate-900 dark:text-white flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4 text-2xl font-bold`}>
//                     {currentMenu && (
//                       <>
//                         <div className={`p-3 rounded-2xl bg-gradient-to-r ${currentMenu.color}`}>
//                           <currentMenu.icon className="w-8 h-8 text-white" />
//                         </div>
//                         <span>{currentMenu.title}</span>
//                       </>
//                     )}
//                   </CardTitle>
//                   <CardDescription className="text-slate-600 dark:text-slate-400 text-lg mt-2">
//                     {currentMenu?.description}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <AnimatePresence mode="wait">
//                     {activeMenu === 'enhance-cv' && (
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="space-y-6"
//                       >
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
//                             <Card className={`bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 rounded-2xl shadow-lg h-full`}>
//                               <CardHeader>
//                                 <CardTitle className="text-orange-900 dark:text-orange-100 flex items-center">
//                                   <Upload className="w-6 h-6 mr-3" />
//                                   {t('dashboard.uploadCV')}
//                                 </CardTitle>
//                               </CardHeader>
//                               <CardContent>
//                                 <p className="text-orange-700 dark:text-orange-300 mb-6 leading-relaxed">
//                                   {t('dashboard.uploadCVDesc')}
//                                 </p>
//                                 <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-300 hover:shadow-xl">
//                                   <Upload className="w-4 h-4 mr-2" />
//                                   {t('dashboard.uploadFile')}
//                                 </Button>
//                               </CardContent>
//                             </Card>
//                           </motion.div>

//                           <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
//                             <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg h-full">
//                               <CardHeader>
//                                 <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center">
//                                   <Search className="w-6 h-6 mr-3" />
//                                   {t('dashboard.aiAnalysis')}
//                                 </CardTitle>
//                               </CardHeader>
//                               <CardContent>
//                                 <p className="text-blue-700 dark:text-blue-300 mb-6 leading-relaxed">
//                                   {t('dashboard.aiAnalysisDesc')}
//                                 </p>
//                                 <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-300 hover:shadow-xl">
//                                   <Search className="w-4 h-4 mr-2" />
//                                   {t('dashboard.analyzeNow')}
//                                 </Button>
//                               </CardContent>
//                             </Card>
//                           </motion.div>
//                         </div>
//                       </motion.div>
//                     )}

//                     {activeMenu === 'job-matcher' && (
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="space-y-6"
//                       >
//                         <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
//                           <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg">
//                             <CardHeader>
//                               <CardTitle className="text-blue-900 dark:text-blue-100 text-xl">
//                                 {t('dashboard.findJobs')}
//                               </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                               <p className="text-blue-700 dark:text-blue-300 mb-6 text-lg leading-relaxed">
//                                 {t('dashboard.findJobsDesc')}
//                               </p>
//                               <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
//                                 <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-300 hover:shadow-xl">
//                                   <Search className="w-4 h-4 mr-2" />
//                                   {t('dashboard.browseJobs')}
//                                 </Button>
//                                 <Button variant="outline" className="rounded-xl px-6 py-3 border-2">
//                                   {t('dashboard.setPreferences')}
//                                 </Button>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         </motion.div>
//                       </motion.div>
//                     )}

//                     {activeMenu === 'interview' && (
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="space-y-6"
//                       >
//                         <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
//                           <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 rounded-2xl shadow-lg">
//                             <CardHeader>
//                               <CardTitle className="text-green-900 dark:text-green-100 text-xl">
//                                 {t('dashboard.practiceInterview')}
//                               </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                               <p className="text-green-700 dark:text-green-300 mb-6 text-lg leading-relaxed">
//                                 {t('dashboard.practiceInterviewDesc')}
//                               </p>
//                               <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
//                                 <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-300 hover:shadow-xl">
//                                   <Play className="w-4 h-4 mr-2" />
//                                   {t('dashboard.startPractice')}
//                                 </Button>
//                                 <Button variant="outline" className="rounded-xl px-6 py-3 border-2">
//                                   {t('dashboard.viewHistory')}
//                                 </Button>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         </motion.div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from '@/i18n';
import { LanguageContext } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LogOut,
  User,
  FileText,
  Briefcase,
  Video,
  Moon,
  Sun,
  Languages,
  ChevronRight,
  Upload,
  Search,
  Play,
  BarChart3,
  Target,
  Home,
  Settings,
  Bell,
  MessageSquare
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser, logout } from "@/services/auth/auth_service";

export default function JobSeekerDashboard() {
  const { t } = useTranslation();
  const { user, LogoutUser } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language: currentLanguage, setLanguage } = useContext(LanguageContext);
  const [activeMenu, setActiveMenu] = useState<'enhance-cv' | 'job-matcher' | 'interview'>('enhance-cv');
  const [mounted, setMounted] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRTL = currentLanguage === 'ar';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    LogoutUser();
    await logout();
    navigate('/auth/login');
  };

  const fetchUser = async () => {
    try {
      const userData = await getCurrentUser();
      console.log(userData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const changeLanguage = (lng: string) => {
    setLanguage(lng);
    setShowLanguageDropdown(false);
  };

  const mainMenuItems = [
    {
      id: 'enhance-cv',
      title: t('dashboard.enhanceCV'),
      description: t('dashboard.enhanceCVDesc'),
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'
    },
    {
      id: 'job-matcher',
      title: t('dashboard.jobMatcher'),
      description: t('dashboard.jobMatcherDesc'),
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
    },
    {
      id: 'interview',
      title: t('dashboard.interviewAI'),
      description: t('dashboard.interviewAIDesc'),
      icon: Video,
      color: 'from-green-500 to-green-600',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
    }
  ];

  const secondaryMenuItems = [
    {
      id: 'notifications',
      title: t('dashboard.notifications'),
      icon: Bell,
      color: 'text-purple-500'
    },
    {
      id: 'messages',
      title: t('dashboard.messages'),
      icon: MessageSquare,
      color: 'text-indigo-500'
    },
    {
      id: 'settings',
      title: t('dashboard.settings'),
      icon: Settings,
      color: 'text-slate-500'
    }
  ];

  const currentMenu = mainMenuItems.find(item => item.id === activeMenu);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header pour mobile */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="lg:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/80 shadow-sm sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Logo et titre */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 cursor-pointer`}
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">OV</span>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                  OptraVerse
                </h1>
              </div>
            </motion.div>

            {/* Menu mobile button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`h-0.5 w-6 bg-current transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`h-0.5 w-6 bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`h-0.5 w-6 bg-current transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          
          {/* Sidebar pour desktop */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {user?.prenom?.charAt(0)}{user?.name?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {user?.prenom} {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.online')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button 
                      onClick={() => navigate('/profile')}
                      variant="outline" 
                      className="w-full justify-center rounded-xl border-2"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('dashboard.viewProfile')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Menu */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-slate-900 dark:text-white text-lg font-bold flex items-center">
                    <Target className="w-5 h-5 text-orange-500 mr-2" />
                    {t('dashboard.mainMenu')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mainMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveMenu(item.id as any)}
                        className={`w-full flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 p-3 rounded-xl transition-all duration-300 border ${
                          activeMenu === item.id
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg border-transparent`
                            : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          activeMenu === item.id 
                            ? 'bg-white/20' 
                            : 'bg-slate-100 dark:bg-slate-700'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            activeMenu === item.id ? 'text-white' : item.color.replace('from-', 'text-').split(' ')[0]
                          }`} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-sm">{item.title}</div>
                          <div className={`text-xs ${
                            activeMenu === item.id ? 'text-white/90' : 'text-slate-500 dark:text-slate-500'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                          activeMenu === item.id ? 'rotate-90 text-white' : 'text-slate-400'
                        }`} />
                      </motion.button>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Secondary Menu */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-slate-900 dark:text-white text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {t('dashboard.quickAccess')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {secondaryMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300"
                      >
                        <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-700 ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">{item.title}</span>
                      </motion.button>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-slate-900 dark:text-white text-lg font-bold flex items-center">
                    <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
                    {t('dashboard.quickStats')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: t('dashboard.profileCompletion'), value: '75%', color: 'text-orange-500', bg: 'bg-orange-500' },
                    { label: t('dashboard.jobsApplied'), value: '12', color: 'text-blue-500', bg: 'bg-blue-500' },
                    { label: t('dashboard.interviews'), value: '3', color: 'text-green-500', bg: 'bg-green-500' },
                    { label: t('dashboard.profileViews'), value: '45', color: 'text-purple-500', bg: 'bg-purple-500' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''} p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/30`}
                    >
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{stat.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${stat.color} text-lg`}>{stat.value}</span>
                        <div className={`w-2 h-2 rounded-full ${stat.bg}`}></div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Settings Panel */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-4 shadow-lg"
            >
              <div className="space-y-3">
                {/* Language Selector */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('dashboard.language')}</span>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      className="flex items-center space-x-2 text-slate-600 dark:text-slate-400"
                    >
                      <Languages className="w-4 h-4" />
                      <span className="text-xs font-medium">{currentLanguage === 'fr' ? 'FR' : currentLanguage === 'ar' ? 'AR' : 'EN'}</span>
                    </Button>

                    <AnimatePresence>
                      {showLanguageDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute bottom-full mb-2 ${isRTL ? 'left-0' : 'right-0'} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-50 min-w-[80px]`}
                        >
                          {[
                            { value: 'fr', label: 'FR' },
                            { value: 'en', label: 'EN' },
                            { value: 'ar', label: 'AR' }
                          ].map((language) => (
                            <motion.button
                              key={language.value}
                              whileHover={{ backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9' }}
                              onClick={() => changeLanguage(language.value)}
                              className={`w-full px-3 py-2 text-left transition-colors duration-150 text-xs font-medium ${
                                currentLanguage === language.value
                                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {language.label}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('dashboard.theme')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="text-slate-600 dark:text-slate-400"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Logout */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl mt-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{t('dashboard.logout')}</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Sidebar Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
                <motion.div
                  initial={{ x: isRTL ? '100%' : '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: isRTL ? '100%' : '-100%' }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="fixed top-0 left-0 right-0 bottom-0 bg-white dark:bg-slate-900 z-50 lg:hidden overflow-y-auto"
                >
                  <div className="p-6 space-y-6">
                    {/* Mobile Header */}
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">OV</span>
                        </div>
                        <div>
                          <h1 className="text-lg font-bold text-slate-900 dark:text-white">OptraVerse</h1>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{t('dashboard.welcome')}, {user?.prenom}!</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-slate-600 dark:text-slate-400"
                      >
                        <div className="w-6 h-6">×</div>
                      </Button>
                    </div>

                    {/* Mobile navigation - Vous pouvez répliquer le contenu de la sidebar desktop ici */}
                    <div className="space-y-4">
                      {/* Ajoutez ici le contenu mobile de la navigation */}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header Actions pour mobile */}
            <div className="lg:hidden mb-6">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {currentMenu?.title}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {currentMenu?.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/profile')}
                      >
                        <User className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Le contenu principal reste le même */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl min-h-[500px] lg:min-h-[600px]">
                <CardHeader className="pb-6">
                  <CardTitle className={`text-slate-900 dark:text-white flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4 text-xl lg:text-2xl font-bold`}>
                    {currentMenu && (
                      <>
                        <div className={`p-3 rounded-2xl bg-gradient-to-r ${currentMenu.color}`}>
                          <currentMenu.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                        </div>
                        <span>{currentMenu.title}</span>
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 text-base lg:text-lg mt-2">
                    {currentMenu?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Le contenu des menus reste le même */}
                  <AnimatePresence mode="wait">
                    {activeMenu === 'enhance-cv' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Card className={`bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 rounded-2xl shadow-lg h-full`}>
                              <CardHeader>
                                <CardTitle className="text-orange-900 dark:text-orange-100 flex items-center text-lg">
                                  <Upload className="w-5 h-5 mr-2" />
                                  {t('dashboard.uploadCV')}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-orange-700 dark:text-orange-300 mb-4 text-sm leading-relaxed">
                                  {t('dashboard.uploadCVDesc')}
                                </p>
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 py-2 text-sm shadow-lg transition-all duration-300 hover:shadow-xl">
                                  <Upload className="w-3 h-3 mr-1" />
                                  {t('dashboard.uploadFile')}
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>

                          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg h-full">
                              <CardHeader>
                                <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center text-lg">
                                  <Search className="w-5 h-5 mr-2" />
                                  {t('dashboard.aiAnalysis')}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-blue-700 dark:text-blue-300 mb-4 text-sm leading-relaxed">
                                  {t('dashboard.aiAnalysisDesc')}
                                </p>
                                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 text-sm shadow-lg transition-all duration-300 hover:shadow-xl">
                                  <Search className="w-3 h-3 mr-1" />
                                  {t('dashboard.analyzeNow')}
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {/* Les autres menus restent similaires avec des ajustements responsive */}
                    {activeMenu === 'job-matcher' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
                          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg">
                            <CardHeader>
                              <CardTitle className="text-blue-900 dark:text-blue-100 text-lg lg:text-xl">
                                {t('dashboard.findJobs')}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-blue-700 dark:text-blue-300 mb-4 text-sm lg:text-base leading-relaxed">
                                {t('dashboard.findJobsDesc')}
                              </p>
                              <div className={`flex flex-col sm:flex-row ${isRTL ? 'space-y-reverse space-x-reverse' : ''} space-y-2 sm:space-y-0 sm:space-x-4`}>
                                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 text-sm shadow-lg transition-all duration-300 hover:shadow-xl">
                                  <Search className="w-3 h-3 mr-1" />
                                  {t('dashboard.browseJobs')}
                                </Button>
                                <Button variant="outline" className="rounded-xl px-4 py-2 text-sm border-2">
                                  {t('dashboard.setPreferences')}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>
                    )}

                    {activeMenu === 'interview' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
                          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 rounded-2xl shadow-lg">
                            <CardHeader>
                              <CardTitle className="text-green-900 dark:text-green-100 text-lg lg:text-xl">
                                {t('dashboard.practiceInterview')}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-green-700 dark:text-green-300 mb-4 text-sm lg:text-base leading-relaxed">
                                {t('dashboard.practiceInterviewDesc')}
                              </p>
                              <div className={`flex flex-col sm:flex-row ${isRTL ? 'space-y-reverse space-x-reverse' : ''} space-y-2 sm:space-y-0 sm:space-x-4`}>
                                <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 text-sm shadow-lg transition-all duration-300 hover:shadow-xl">
                                  <Play className="w-3 h-3 mr-1" />
                                  {t('dashboard.startPractice')}
                                </Button>
                                <Button variant="outline" className="rounded-xl px-4 py-2 text-sm border-2">
                                  {t('dashboard.viewHistory')}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation pour mobile */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-700/80 shadow-lg z-30"
      >
        <div className="flex justify-around items-center h-16">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveMenu(item.id as any)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                  activeMenu === item.id
                    ? `bg-gradient-to-r ${item.color} text-white`
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium">{item.title.split(' ')[0]}</span>
              </motion.button>
            );
          })}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-400"
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-1 font-medium">{t('dashboard.more')}</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}