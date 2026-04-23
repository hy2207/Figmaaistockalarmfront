import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { RiskProfile, DebugEvent } from '../types';
import { mockUser, defaultWatchlist } from '../mockData';

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  watchlist: string[];
  setWatchlist: (value: string[]) => void;
  riskProfile: RiskProfile;
  setRiskProfile: (value: RiskProfile) => void;
  pushEnabled: boolean;
  setPushEnabled: (value: boolean) => void;
  debugEvents: DebugEvent[];
  addDebugEvent: (eventName: string, data?: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>(defaultWatchlist);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>(mockUser.defaultRiskProfile);
  const [pushEnabled, setPushEnabled] = useState(mockUser.pushEnabled);
  const [debugEvents, setDebugEvents] = useState<DebugEvent[]>([]);

  const addDebugEvent = (eventName: string, data?: any) => {
    const event: DebugEvent = {
      timestamp: new Date().toISOString(),
      eventName,
      data,
    };
    setDebugEvents(prev => [...prev.slice(-19), event]);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        watchlist,
        setWatchlist,
        riskProfile,
        setRiskProfile,
        pushEnabled,
        setPushEnabled,
        debugEvents,
        addDebugEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
