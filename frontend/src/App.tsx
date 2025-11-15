import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/ui/utils/splashScreen';
import OnboardingFlow from './components/ui/utils/steps';
import HomeScreen from './pages/home';
import NotFoundPage from './components/ui/utils/not_found';
import InterviewsDashboard from './pages/interviewsDashboard';
import Session from './pages/session';
import { LanguageProvider } from "./i18n";
import { ThemeProvider } from "./contexts/ThemeProvider";
import SessionSetup from './pages/sessionSetup';
import InterviewResume from './pages/interviewResume';


function AppContent() {
  const [currentView, setCurrentView] = useState<'splash' | 'onboarding' | 'main'>('splash');
  const [isLoading, setIsLoading] = useState(true);
  const isAuth = false;

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Authentication status:', isAuth);
        const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
        if (isAuth) {
          console.log('User is authenticated, skipping to main');
          setCurrentView('main');
          return;
        }

        if (onboardingCompleted) {
          console.log('Onboarding already completed, going to main');
          setCurrentView('main');
        } else {
          console.log('Showing splash screen for new user');
          setCurrentView('splash');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setCurrentView('main');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [isAuth]);

  const handleSplashFinish = () => {
    console.log('Splash finished, showing onboarding');
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = () => {
    console.log('Onboarding completed');
    localStorage.setItem('onboardingCompleted', 'true');
    setCurrentView('main');
  };

  const handleOnboardingSkip = () => {
    console.log('Onboarding skipped');
    localStorage.setItem('onboardingCompleted', 'true');
    setCurrentView('main');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentView === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}
      {currentView === 'onboarding' && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      {currentView === 'main' && (
        <Router>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LanguageProvider>
              <Routes>
                <Route >
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/login" element={<HomeScreen />} />
                  <Route path="/register" element={<HomeScreen />} />
                  <Route path="/interviewsDashboard" element={<InterviewsDashboard/>} />
                  <Route path="/Session" element ={<Session/>} />
                  <Route path="/session-setup" element ={<SessionSetup/>} />
                  <Route path="/interview-resume" element={<InterviewResume />} />

                </Route>
                {/* <Route path="unauthorized" element={<UnauthorizedPage />} /> */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </LanguageProvider>
          </ThemeProvider>
        </Router>
      )}
    </>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;
