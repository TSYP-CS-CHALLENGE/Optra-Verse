import { useState, useContext, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from '@/i18n';
import { LanguageContext } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";

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
  BarChart3,
  Target,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  Crown,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Badge,
  Upload,
  Edit3,
  UserCog
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser, logout } from "@/services/auth/auth_service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function JobSeekerDashboard() {
  const { t } = useTranslation();
  const { user, LogoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { language: currentLanguage, setLanguage } = useContext(LanguageContext);
  const [mounted, setMounted] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showMobileLanguageDropdown, setShowMobileLanguageDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const isRTL = currentLanguage === 'ar';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    LogoutUser();
    await logout();
    navigate('/login');
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
    setShowMobileLanguageDropdown(false);
  };

  const menuItems = [
    {
      id: 'enhance-cv',
      title: t('dashboard.enhanceCV'),
      description: t('dashboard.enhanceCVDesc'),
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      gradient: 'bg-gradient-to-r from-orange-500 to-orange-600',
      path: '/dashboard/enhance-cv',
      badge: 'AI Powered'
    },
    {
      id: 'job-matcher',
      title: t('dashboard.jobMatcher'),
      description: t('dashboard.jobMatcherDesc'),
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
      path: '/dashboard/job-matcher',
      badge: 'Smart Match'
    },
    {
      id: 'interview',
      title: t('dashboard.interviewAI'),
      description: t('dashboard.interviewAIDesc'),
      icon: Video,
      color: 'from-green-500 to-green-600',
      gradient: 'bg-gradient-to-r from-green-500 to-green-600',
      path: '/dashboard/interview',
      badge: 'Real-time'
    }
  ];

  const stats = [
    { label: t('dashboard.profileCompletion'), value: '75%', color: 'text-orange-500', progress: 75 },
    { label: t('dashboard.jobsApplied'), value: '12', color: 'text-blue-500', trend: '+2' },
    { label: t('dashboard.interviews'), value: '3', color: 'text-green-500', trend: '+1' },
    { label: t('dashboard.successRate'), value: '85%', color: 'text-purple-500', trend: '+5%' }
  ];

  const quickActions = [
    { label: 'Upload Resume', icon: Upload, color: 'orange', path: '/dashboard/enhance-cv' },
    { label: 'Find Jobs', icon: Search, color: 'blue', path: '/dashboard/job-matcher' },
    { label: 'Practice Interview', icon: Video, color: 'green', path: '/dashboard/interview' },
  ];

  const recentActivities = [
    { action: 'CV Enhanced', time: '2 hours ago', status: 'completed', icon: CheckCircle2 },
    { action: 'Job Application Sent', time: '1 day ago', status: 'completed', icon: CheckCircle2 },
    { action: 'Interview Scheduled', time: '2 days ago', status: 'upcoming', icon: Clock }
  ];

  const currentMenu = menuItems.find(item =>
    location.pathname === item.path || location.pathname.startsWith(item.path)
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/30 dark:from-slate-900 dark:via-blue-950/20 dark:to-orange-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your career dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/30 dark:from-slate-900 dark:via-blue-950/20 dark:to-orange-950/20 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/80 shadow-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center h-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Logo and Mobile Menu */}
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4 cursor-pointer`}
                onClick={() => navigate('/dashboard')}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">OV</span>
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                    OptraVerse
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {t('dashboard.welcome')}, <span className="text-orange-500 dark:text-orange-400 font-semibold">{user?.prenom}</span>!
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Notifications */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* Theme */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
              </motion.div>

              {/* Language */}
              <motion.div whileHover={{ scale: 1.05 }} className="relative ">
                <Button
                  variant="ghost"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl`}
                >
                  <Languages className="w-5 h-5" />
                  <span className="font-medium">{currentLanguage === 'fr' ? 'FR' : currentLanguage === 'ar' ? 'AR' : 'EN'}</span>
                </Button>

                <AnimatePresence>
                  {showLanguageDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`  absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-2 z-50 min-w-[100px] backdrop-blur-lg`}
                    >
                      {[
                        { value: 'fr', label: 'Français' },
                        { value: 'en', label: 'English' },
                        { value: 'ar', label: 'العربية' }
                      ].map((language) => (
                        <motion.button
                          key={language.value}
                          whileHover={{ backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9' }}
                          onClick={() => changeLanguage(language.value)}
                          className={` w-full px-4 py-2 text-left transition-colors duration-150 text-sm font-medium ${currentLanguage === language.value
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
              </motion.div>

              {/* Profile */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/profile')}
                  className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={getImageUrl(user?.profile_picture)} />
                    <AvatarFallback className="bg-gradient-to-r from-orange-500 to-blue-600 text-white">
                      {user?.prenom?.[0]}{user?.name}
                    </AvatarFallback>
                  </Avatar>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-medium">{user?.prenom} {user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Premium Member</p>
                  </div>
                </Button>
              </motion.div>

              {/* Settings */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/dashboard/profile')}
                  className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Logout */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl`}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium hidden sm:inline">{t('dashboard.logout')}</span>
                </Button>
              </motion.div>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-2">
              {/* Mobile Language Switcher */}
              <motion.div whileHover={{ scale: 1.05 }} className="hidden relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileLanguageDropdown(!showMobileLanguageDropdown)}
                  className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <Languages className="w-5 h-5" />
                </Button>

                <AnimatePresence>
                  {showMobileLanguageDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-2 z-50 min-w-[100px] backdrop-blur-lg`}
                    >
                      {[
                        { value: 'fr', label: 'Français' },
                        { value: 'en', label: 'English' },
                        { value: 'ar', label: 'العربية' }
                      ].map((language) => (
                        <motion.button
                          key={language.value}
                          whileHover={{ backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9' }}
                          onClick={() => changeLanguage(language.value)}
                          className={`w-full px-4 py-2 text-left transition-colors duration-150 text-sm font-medium ${currentLanguage === language.value
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
              </motion.div>

              {/* Mobile Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-slate-600 dark:text-slate-400"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Mobile Notifications */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ type: "spring", damping: 30 }}
                  className="fixed left-0 top-0 h-full w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-700/80 z-50 lg:hidden overflow-y-auto"
                >
                  <MobileSidebar
                    menuItems={menuItems}
                    stats={stats}
                    currentMenu={currentMenu}
                    isRTL={isRTL}
                    navigate={navigate}
                    onClose={() => setMobileMenuOpen(false)}
                    changeLanguage={changeLanguage}
                    currentLanguage={currentLanguage}
                    theme={theme}
                    user={user}
                    handleLogout={handleLogout}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <Sidebar
              menuItems={menuItems}
              stats={stats}
              quickActions={quickActions}
              recentActivities={recentActivities}
              currentMenu={currentMenu}
              isRTL={isRTL}
              navigate={navigate}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-2xl shadow-xl border-0 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Welcome back, {user?.prenom}! 👋
                      </h2>
                      <p className="text-orange-100 text-lg">
                        Ready to take your career to the next level?
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="hidden md:block"
                    >
                      <Zap className="w-16 h-16 text-yellow-300" />
                    </motion.div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Badge className="bg-white/20 text-white border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Profile Strength: 75%
                    </Badge>
                    <Badge className="bg-white/20 text-white border-0">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium Features
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content Card */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl min-h-[600px]">
                <CardHeader className="pb-6">
                  <CardTitle className={`text-slate-900 dark:text-white flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4 text-2xl font-bold`}>
                    {currentMenu && (
                      <>
                        <div className={`p-3 rounded-2xl bg-gradient-to-r ${currentMenu.color}`}>
                          <currentMenu.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <span>{currentMenu.title}</span>
                          <Badge className="ml-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                            {currentMenu.badge}
                          </Badge>
                        </div>
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 text-lg mt-2">
                    {currentMenu?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Outlet />
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Sidebar Component
const Sidebar = ({ menuItems, stats, quickActions, recentActivities, currentMenu, isRTL, navigate }: any) => (
  <>
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-slate-900 dark:text-white text-lg font-bold flex items-center">
            <Target className="w-5 h-5 text-orange-500 mr-2" />
            Career Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {menuItems.map((item: any, index: any) => {
            const Icon = item.icon;
            const isActive = currentMenu?.id === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4 p-4 rounded-xl transition-all duration-300 border ${isActive
                  ? `${item.gradient} text-white shadow-lg border-transparent`
                  : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color.replace('from-', 'text-').split(' ')[0]
                    }`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className={`text-xs ${isActive ? 'text-white/90' : 'text-slate-500 dark:text-slate-500'
                    }`}>
                    {item.description}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'rotate-90 text-white' : 'text-slate-400'
                  }`} />
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
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-slate-900 dark:text-white text-lg font-bold flex items-center">
            <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat: any, index: any) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="space-y-2"
            >
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{stat.label}</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${stat.color} text-lg`}>{stat.value}</span>
                  {stat.trend && (
                    <Badge className="text-xs bg-green-50 text-green-600 border-green-200">
                      {stat.trend}
                    </Badge>
                  )}
                </div>
              </div>
              {stat.progress && (
                <Progress value={stat.progress} className="h-2 bg-slate-200 dark:bg-slate-700" />
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>

    {/* Quick Actions */}
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-slate-900 dark:text-white text-lg font-bold flex items-center">
            <Zap className="w-5 h-5 text-yellow-500 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {quickActions.map((action: any, index: any) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.path)}
                className={`p-3 rounded-xl bg-${action.color}-50 dark:bg-${action.color}-900/20 border border-${action.color}-200 dark:border-${action.color}-700 text-${action.color}-700 dark:text-${action.color}-300 text-sm font-medium transition-all duration-200 hover:shadow-md`}
              >
                <Icon className="w-4 h-4 mb-1 mx-auto" />
                {action.label}
              </motion.button>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  </>
);

// Mobile Sidebar Component
const MobileSidebar = ({ 
  menuItems, 
  stats, 
  currentMenu, 
  isRTL, 
  navigate, 
  onClose, 
  changeLanguage, 
  currentLanguage, 
  theme, 
  user, 
  handleLogout 
}: any) => (
  <div className="h-full flex flex-col">
    <div className="p-6 border-b border-slate-200/80 dark:border-slate-700/80">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">OV</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">OptraVerse</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Career Dashboard</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 mb-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.photo} />
          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-blue-600 text-white text-sm">
            {user?.prenom?.[0]}{user?.name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {user?.prenom} {user?.name}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
            Premium Member • {user?.email}
          </p>
        </div>
      </div>

      {/* Mobile Language Switcher */}
      <div className="mb-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Language</span>
          <div className="flex space-x-1">
            {[
              { value: 'fr', label: 'FR' },
              { value: 'en', label: 'EN' },
              { value: 'ar', label: 'AR' }
            ].map((language) => (
              <button
                key={language.value}
                onClick={() => changeLanguage(language.value)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  currentLanguage === language.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {language.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Profile Actions */}
   

      {/* Menu Items */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Career Tools</h3>
        {menuItems.map((item: any, index: any) => {
          const Icon = item.icon;
          const isActive = currentMenu?.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              className={`w-full flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 p-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
              {isActive && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
   <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Profile & Settings</h3>
        
        {/* Edit Profile Button */}
        <button
          onClick={() => {
            navigate('/profile');
            onClose();
          }}
          className="w-full flex items-center space-x-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
        >
          <Edit3 className="w-5 h-5" />
          <span className="font-medium">Edit Profile</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            navigate('/settings');
            onClose();
          }}
          className="w-full flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
        >
          <UserCog className="w-5 h-5" />
          <span className="font-medium">Account Settings</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>
      </div>
      {/* Stats */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Your Progress</h3>
        {stats.map((stat: any, index: any) => (
          <div key={stat.label} className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
            <span className="text-slate-600 dark:text-slate-400 text-sm">{stat.label}</span>
            <div className="flex items-center space-x-2">
              <span className={`font-bold ${stat.color}`}>{stat.value}</span>
              {stat.trend && (
                <span className="text-xs bg-green-100 text-green-600 px-1 rounded">{stat.trend}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => {
            handleLogout();
            onClose();
          }}
          className="w-full flex items-center space-x-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  </div>
);