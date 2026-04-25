import { Home, Archive, Settings, TrendingUp } from 'lucide-react';

interface NavigationV2Props {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export function NavigationV2({ currentRoute, onNavigate }: NavigationV2Props) {
  const navItems = [
    { route: '/', label: '홈', icon: Home, gradient: 'from-blue-600 to-indigo-600' },
    { route: '/archive', label: '이력', icon: Archive, gradient: 'from-purple-600 to-pink-600' },
    { route: '/settings', label: '설정', icon: Settings, gradient: 'from-orange-600 to-red-600' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:static md:z-auto">
      {/* Mobile Bottom Nav */}
      <div className="md:hidden bg-white/80 backdrop-blur-xl border-t border-white/50 shadow-2xl">
        <div className="flex justify-around items-center px-4 pb-safe">
          {navItems.map(({ route, label, icon: Icon, gradient }) => {
            const isActive = currentRoute === route;
            return (
              <button
                key={route}
                onClick={() => onNavigate(route)}
                className="relative flex flex-col items-center gap-1 py-3 px-6 transition-all"
              >
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all ${
                  isActive
                    ? `bg-gradient-to-br ${gradient} shadow-lg scale-110`
                    : 'bg-slate-100 scale-100'
                }`}>
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-600'
                  }`} />
                  {isActive && (
                    <div className="absolute -bottom-1 w-8 h-1 bg-white rounded-full" />
                  )}
                </div>
                <span className={`text-xs transition-colors ${
                  isActive ? 'text-slate-900 font-medium' : 'text-slate-600'
                }`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Top Nav */}
      <div className="hidden md:block bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI Stock Alarm
              </span>
            </div>
            <div className="flex gap-2">
              {navItems.map(({ route, label, icon: Icon, gradient }) => {
                const isActive = currentRoute === route;
                return (
                  <button
                    key={route}
                    onClick={() => onNavigate(route)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-2xl transition-all ${
                      isActive
                        ? 'scale-105 shadow-lg'
                        : 'scale-100 hover:scale-102 hover:bg-slate-50'
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 rounded-2xl`} />
                    )}
                    <Icon className={`w-5 h-5 transition-colors relative z-10 ${
                      isActive ? 'text-blue-600' : 'text-slate-600'
                    }`} />
                    <span className={`text-sm relative z-10 transition-colors ${
                      isActive ? 'text-slate-900 font-medium' : 'text-slate-600'
                    }`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
