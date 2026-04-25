import { useEffect, useState } from 'react';
import { ArrowLeft, Copy, Bell, ExternalLink, TrendingUp, TrendingDown, Target, Calendar, Shield, Award, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { recommendationsByRisk, performanceRecords } from '../mockData';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import type { RiskProfile } from '../types';
import { usePerformanceStats } from '../hooks/usePerformanceStats';
import { useRecommendationActions } from '../hooks/useRecommendationActions';
import { ROUTES } from '../routes';

interface RecommendationDetailPageV2Props {
  recId: string;
  onNavigate: (route: string) => void;
}

export function RecommendationDetailPageV2({ recId, onNavigate }: RecommendationDetailPageV2Props) {
  const { riskProfile, setRiskProfile, addDebugEvent } = useApp();
  const [selectedRisk, setSelectedRisk] = useState<RiskProfile>(riskProfile);
  const { handleCopyPrice, handleBrokerRedirect, handleSetAlert } = useRecommendationActions();

  useEffect(() => {
    addDebugEvent('rec_detail_view', { recId });
  }, [recId]);

  useEffect(() => {
    setSelectedRisk(riskProfile);
  }, [riskProfile]);

  const allRecommendations = [
    ...recommendationsByRisk.conservative,
    ...recommendationsByRisk.balanced,
    ...recommendationsByRisk.aggressive,
  ];
  const recommendation = allRecommendations.find(r => r.id === recId);

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-slate-700">추천을 찾을 수 없습니다.</p>
          <Button
            onClick={() => onNavigate(ROUTES.home)}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-2xl shadow-lg"
          >
            홈으로 이동
          </Button>
        </div>
      </div>
    );
  }

  const currentRec = recommendationsByRisk[selectedRisk].find(
    r => r.ticker === recommendation.ticker
  );

  const rec = currentRec || recommendation;

  const tickerRecords = performanceRecords.filter(r => r.ticker === rec.ticker);
  const { successRate, avgReturn, failCount, evaluatingCount } = usePerformanceStats(tickerRecords);

  const handleRiskChange = (risk: RiskProfile) => {
    setSelectedRisk(risk);
    setRiskProfile(risk);
    addDebugEvent('confidence_change', { from: riskProfile, to: risk, page: 'detail' });
  };

  const riskOptions: { value: RiskProfile; label: string; color: string }[] = [
    { value: 'conservative', label: '안정형', color: 'from-green-500 to-emerald-600' },
    { value: 'balanced', label: '중립형', color: 'from-blue-500 to-indigo-600' },
    { value: 'aggressive', label: '공격형', color: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto p-4 pb-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate(ROUTES.home)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 pt-4 transition-colors"
        >
          <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">뒤로가기</span>
        </button>

        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-blue-500/10 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
              rec.direction === 'BUY'
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30'
                : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30'
            }`}>
              {rec.direction === 'BUY' ? (
                <TrendingUp className="w-8 h-8 text-white" />
              ) : (
                <TrendingDown className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{rec.ticker}</h1>
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
              <div className="text-slate-600">{rec.companyName}</div>
              <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full mt-2">
                <span className="text-sm font-medium text-blue-700">{rec.actionLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Profile Selector */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 mb-6">
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
                <div
                  className={`relative text-sm font-medium ${
                    selectedRisk === value ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
            <Target className="w-5 h-5 text-blue-600" />
            가격 요약
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
              <div className="text-xs text-slate-600 mb-1">진입가</div>
              <div className="text-xl font-bold text-slate-900">
                {rec.entryPrice
                  ? `$${rec.entryPrice.toFixed(2)}`
                  : `$${rec.entryRangeMin}-${rec.entryRangeMax}`}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
              <div className="text-xs text-slate-600 mb-1">목표가</div>
              <div className="text-xl font-bold text-green-700">
                {rec.targetPrice
                  ? `$${rec.targetPrice.toFixed(2)}`
                  : `$${rec.targetRangeMin}-${rec.targetRangeMax}`}
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100">
              <div className="text-xs text-slate-600 mb-1">손절가</div>
              <div className="text-xl font-bold text-red-700">${rec.stopPrice.toFixed(2)}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
              <div className="text-xs text-slate-600 mb-1">권장 보유</div>
              <div className="text-xl font-bold text-slate-900">{rec.holdDays}일</div>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-3">한 줄 이유</h2>
          <p className="text-slate-700 leading-relaxed bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
            {rec.reasonLine}
          </p>
        </div>

        {/* Evidence Snapshot */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
            <Activity className="w-5 h-5 text-indigo-600" />
            근거 스냅샷
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
              <div className="text-xs text-slate-600 mb-1">뉴스 신호</div>
              <div className="font-bold text-green-700">긍정적</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
              <div className="text-xs text-slate-600 mb-1">거래량 신호</div>
              <div className="font-bold text-blue-700">평균 이상</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
              <div className="text-xs text-slate-600 mb-1">커뮤니티 신호</div>
              <div className="font-bold text-amber-700">중립</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
              <div className="text-xs text-slate-600 mb-1">패턴 태그</div>
              <div className="font-bold text-purple-700">단기 반등</div>
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
            <Award className="w-5 h-5 text-amber-600" />
            성과 카드 (실패 포함 기록)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 text-center">
              <div className="text-xs text-slate-600 mb-1">성공률</div>
              <div className="text-2xl font-bold text-blue-700">{successRate}%</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 text-center">
              <div className="text-xs text-slate-600 mb-1">평균 수익률</div>
              <div className="text-2xl font-bold text-green-700">
                {parseFloat(avgReturn) > 0 ? '+' : ''}{avgReturn}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100 text-center">
              <div className="text-xs text-slate-600 mb-1">실패 건수</div>
              <div className="text-2xl font-bold text-red-700">
                {failCount}건
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200 text-center">
              <div className="text-xs text-slate-600 mb-1">평가 중</div>
              <div className="text-2xl font-bold text-slate-700">
                {evaluatingCount}건
              </div>
            </div>
          </div>
        </div>

        {/* Performance History */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">최근 성과 이력</h2>
          <div className="space-y-3">
            {tickerRecords.slice(0, 5).map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${
                      record.predictedDirection === 'BUY'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    } border`}
                  >
                    {record.predictedDirection}
                  </Badge>
                  <span className={`font-bold ${
                    record.hitFlag === 'success'
                      ? 'text-green-600'
                      : record.hitFlag === 'fail'
                      ? 'text-red-600'
                      : 'text-slate-600'
                  }`}>
                    {record.realizedReturn}
                  </span>
                  <Badge
                    className={`${
                      record.hitFlag === 'success'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : record.hitFlag === 'fail'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    } border text-xs`}
                  >
                    {record.hitFlag === 'success' ? '성공' : record.hitFlag === 'fail' ? '실패' : '평가 중'}
                  </Badge>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-500">{record.evaluatedAt}</span>
                  <span className="text-xs text-slate-400">{record.evaluationWindowDays}일</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleCopyPrice(rec, 'detail')}
              variant="outline"
              className="rounded-2xl h-12 border-2"
            >
              <Copy className="w-4 h-4 mr-2" />
              가격 복사
            </Button>
            <Button
              onClick={() => handleSetAlert(rec.ticker, 'detail')}
              variant="outline"
              className="rounded-2xl h-12 border-2"
            >
              <Bell className="w-4 h-4 mr-2" />
              알림 설정
            </Button>
          </div>
          <Button
            onClick={() => handleBrokerRedirect(rec.ticker, 'detail')}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 text-lg"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            브로커로 이동
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-slate-500 mt-6 bg-white/50 backdrop-blur-sm rounded-2xl p-4 space-y-1">
          <p>투자 참고용 정보이며 투자 자문이 아닙니다.</p>
          <p>실제 투자 결정과 책임은 사용자에게 있습니다.</p>
        </div>
      </div>
    </div>
  );
}
