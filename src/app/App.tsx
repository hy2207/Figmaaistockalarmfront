import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { RecommendationDetailPage } from './pages/RecommendationDetailPage';
import { ArchivePage } from './pages/ArchivePage';
import { SettingsPage } from './pages/SettingsPage';
import { StatePage } from './pages/StatePage';
import { DebugPanel } from './components/DebugPanel';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { isLoggedIn } = useApp();
  const [currentRoute, setCurrentRoute] = useState('/login');
  const [recId, setRecId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn && currentRoute !== '/login') {
      setCurrentRoute('/login');
    }
  }, [isLoggedIn]);

  const handleNavigate = (route: string) => {
    if (route.startsWith('/recommendations/')) {
      const id = route.split('/recommendations/')[1];
      setRecId(id);
      setCurrentRoute('/recommendations');
    } else {
      setCurrentRoute(route);
    }
  };

  if (!isLoggedIn && currentRoute === '/login') {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/onboarding') {
    return <OnboardingPage onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/') {
    return <HomePage onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/recommendations' && recId) {
    return <RecommendationDetailPage recId={recId} onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/archive') {
    return <ArchivePage onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/settings') {
    return <SettingsPage onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/state/no-call') {
    return <StatePage type="no-call" onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/state/loading') {
    return <StatePage type="loading" onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/state/empty') {
    return <StatePage type="empty" onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/state/error') {
    return <StatePage type="error" onNavigate={handleNavigate} />;
  }

  return <HomePage onNavigate={handleNavigate} />;
}

export default function App() {
  return (
    <AppProvider>
      <div className="size-full">
        <AppContent />
        <DebugPanel />
        <Toaster />
      </div>
    </AppProvider>
  );
}