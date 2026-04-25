import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { performanceRecords } from '../mockData';
import { NavigationV2 } from '../components/NavigationV2';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Filter, TrendingUp, TrendingDown, Award, Calendar } from 'lucide-react';

interface ArchivePageV2Props {
  onNavigate: (route: string) => void;
}

export function ArchivePageV2({ onNavigate }: ArchivePageV2Props) {
  const { addDebugEvent, watchlist } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('전체');

  useEffect(() => {
    addDebugEvent('archive_view');
  }, []);

  const filters = ['전체', ...watchlist];

  const filteredRecords =
    selectedFilter === '전체'
      ? performanceRecords
      : performanceRecords.filter(r => r.ticker === selectedFilter);

  const successCount = filteredRecords.filter(r => r.hitFlag === 'success').length;
  const successRate = filteredRecords.length > 0
    ? ((successCount / filteredRecords.length) * 100).toFixed(0)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <NavigationV2 currentRoute="/archive" onNavigate={onNavigate} />

      <div className="max-w-5xl mx-auto p-4 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-6 pt-4">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-purple-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  추천 이력
                </h1>
                <p className="text-sm text-slate-600">과거 추천 성과 기록</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 border border-blue-100">
                <div className="text-xs text-slate-600 mb-1">총 기록</div>
                <div className="text-xl font-bold text-slate-900">{filteredRecords.length}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 border border-green-100">
                <div className="text-xs text-slate-600 mb-1">성공률</div>
                <div className="text-xl font-bold text-green-700">{successRate}%</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-3 border border-purple-100">
                <div className="text-xs text-slate-600 mb-1">필터</div>
                <div className="text-sm font-bold text-slate-900">{selectedFilter}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-purple-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-900">종목 필터</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => {
                    setSelectedFilter(filter);
                    addDebugEvent('archive_filter_change', { filter });
                  }}
                  className={`px-4 py-2 rounded-2xl text-sm whitespace-nowrap transition-all ${
                    selectedFilter === filter
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-purple-300 hover:scale-102'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Records */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-12 text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-10 h-10 text-purple-600" />
            </div>
            <div className="space-y-2">
              <p className="text-slate-700 font-medium">아직 쌓인 추천 이력이 없습니다</p>
              <p className="text-sm text-slate-500">
                추천 카드가 평가되면 성공과 실패 기록이 여기에 표시됩니다.
              </p>
            </div>
            <Button
              onClick={() => onNavigate('/settings')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-lg"
            >
              관심 종목 수정하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg hover:shadow-xl transition-all p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                      record.predictedDirection === 'BUY'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30'
                        : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30'
                    }`}>
                      {record.predictedDirection === 'BUY' ? (
                        <TrendingUp className="w-6 h-6 text-white" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-white" />
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{record.ticker}</span>
                        <Badge
                          className={`${
                            record.predictedDirection === 'BUY'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-red-100 text-red-700 border-red-200'
                          } border text-xs`}
                        >
                          {record.predictedDirection}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
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
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {record.evaluatedAt}
                    </div>
                    <div className="text-xs text-slate-400">{record.evaluationWindowDays}일</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
