import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { recommendationsByRisk } from '../mockData';
import { NavigationV2 } from '../components/NavigationV2';
import type { RiskProfile } from '../types';
import { Copy, ArrowRight, ExternalLink, TrendingUp, TrendingDown, Calendar, Target, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

interface HomePageV2Props {
  onNavigate: (route: string) => void;
}

export function HomePageV2({ onNavigate }: HomePageV2Props) {
  const { riskProfile, setRiskProfile, addDebugEvent, watchlist } = useApp();
  const [selectedRisk, setSelectedRisk] = useState<RiskProfile>(riskProfile);

  useEffect(() => {
    addDebugEvent('home_view');
  }, []);

  const recommendations = recommendationsByRisk[selectedRisk].filter(rec =>
    watchlist.includes(rec.ticker)
  );

  const handleRiskChange = (risk: RiskProfile) => {
    setSelectedRisk(risk);
    setRiskProfile(risk);
    addDebugEvent('confidence_change', { from: riskProfile, to: risk });
  };

  const handleCopyPrice = (rec: any) => {
    const priceText = rec.entryPrice
      ? `$${rec.entryPrice}`
      : `$${rec.entryRangeMin} - $${rec.entryRangeMax}`;
    navigator.clipboard.writeText(priceText);
    toast.success('가격이 복사되었습니다.');
    addDebugEvent('price_copy', { ticker: rec.ticker });
  };

  const handleBrokerRedirect = (ticker: string) => {
    addDebugEvent('broker_redirect', { ticker });
    if (confirm('외부 브로커 화면으로 이동합니다.')) {
      toast.success('브로커로 이동합니다.');
    }
  };

  const handleCardClick = (recId: string) => {
    addDebugEvent('rec_card_click', { recId });
    onNavigate(`/recommendations/${recId}`);
  };

  const riskOptions: { value: RiskProfile; label: string; color: string }[] = [
    { value: 'conservative', label: '안정형', color: 'from-green-500 to-emerald-600' },
    { value: 'balanced', label: '중립형', color: 'from-blue-500 to-indigo-600' },
    { value: 'aggressive', label: '공격형', color: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NavigationV2 currentRoute="/" onNavigate={onNavigate} />

      <div className="max-w-5xl mx-auto p-4 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8 pt-4">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-blue-500/5 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  오늘의 의사결정 카드
                </h1>
                <p className="text-sm text-slate-500">
                  {new Date().toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short',
                  })}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600">관심 종목 기준 {recommendations.length}개 추천</p>
          </div>
        </div>

        {/* Risk Profile Selector */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-blue-500/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-slate-900">Confidence Score</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {riskOptions.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => handleRiskChange(value)}
                  className={`relative overflow-hidden rounded-2xl p-4 transition-all ${
                    selectedRisk === value
                      ? 'scale-105 shadow-lg'
                      : 'scale-100 hover:scale-102 shadow'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} ${
                    selectedRisk === value ? 'opacity-100' : 'opacity-20'
                  } transition-opacity`} />
                  <div className="relative">
                    <div className={`text-sm font-medium ${
                      selectedRisk === value ? 'text-white' : 'text-slate-900'
                    }`}>
                      {label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation Cards */}
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="group bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-blue-500/5 p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer"
              onClick={() => handleCardClick(rec.id)}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                    rec.direction === 'BUY'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30'
                      : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30'
                  }`}>
                    {rec.direction === 'BUY' ? (
                      <TrendingUp className="w-7 h-7 text-white" />
                    ) : (
                      <TrendingDown className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900">{rec.ticker}</h3>
                      <Badge
                        className={`${
                          rec.direction === 'BUY'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        } border`}
                      >
                        {rec.direction}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600">{rec.companyName}</div>
                  </div>
                </div>
                <div className="bg-blue-50 px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-blue-700">{rec.actionLabel}</span>
                </div>
              </div>

              {/* Price Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-slate-600">진입가</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {rec.entryPrice
                      ? `$${rec.entryPrice.toFixed(2)}`
                      : `$${rec.entryRangeMin}-${rec.entryRangeMax}`}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-slate-600">목표가</span>
                  </div>
                  <div className="text-lg font-bold text-green-700">
                    {rec.targetPrice
                      ? `$${rec.targetPrice.toFixed(2)}`
                      : `$${rec.targetRangeMin}-${rec.targetRangeMax}`}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-slate-600">손절가</span>
                  </div>
                  <div className="text-lg font-bold text-red-700">${rec.stopPrice.toFixed(2)}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-xs text-slate-600">권장 보유</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900">{rec.holdDays}일</div>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-4 mb-4 border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed">{rec.reasonLine}</p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyPrice(rec);
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-2 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  복사
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(rec.id);
                  }}
                  size="sm"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
                >
                  상세
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrokerRedirect(rec.ticker);
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-2 hover:bg-indigo-50 hover:border-indigo-300"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  매매
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-slate-500 mt-8 bg-white/50 backdrop-blur-sm rounded-2xl p-4 space-y-1">
          <p>투자 참고용 정보이며 투자 자문이 아닙니다.</p>
          <p>실제 투자 결정과 책임은 사용자에게 있습니다.</p>
        </div>
      </div>
    </div>
  );
}
