import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPageV2 } from './pages/LoginPageV2';
import { OnboardingPageV2 } from './pages/OnboardingPageV2';
import { HomePageV2 } from './pages/HomePageV2';
import { RecommendationDetailPageV2 } from './pages/RecommendationDetailPageV2';
import { ArchivePageV2 } from './pages/ArchivePageV2';
import { SettingsPageV2 } from './pages/SettingsPageV2';
import { StatePageV2 } from './pages/StatePageV2';
import { DebugPanelV2 } from './components/DebugPanelV2';
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
    return <LoginPageV2 onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/onboarding') {
    return <OnboardingPageV2 onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/') {
    return <HomePageV2 onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/recommendations' && recId) {
    return <RecommendationDetailPageV2 recId={recId} onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/archive') {
    return <ArchivePageV2 onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/settings') {
    return <SettingsPageV2 onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/state/no-call') {
    return <StatePageV2 type="no-call" onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/state/loading') {
    return <StatePageV2 type="loading" onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/state/empty') {
    return <StatePageV2 type="empty" onNavigate={handleNavigate} />;
  }

  if (currentRoute === '/state/error') {
    return <StatePageV2 type="error" onNavigate={handleNavigate} />;
  }

  return <HomePageV2 onNavigate={handleNavigate} />;
}

export default function App() {
  return (
    <AppProvider>
      <div className="size-full">
        <AppContent />
        <DebugPanelV2 />
        <Toaster />
      </div>
    </AppProvider>
  );
}