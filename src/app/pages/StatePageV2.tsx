import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { AlertCircle, FileX, ServerCrash, Sparkles } from 'lucide-react';
import { ROUTES } from '../routes';

interface StatePageV2Props {
  type: 'no-call' | 'loading' | 'empty' | 'error';
  onNavigate: (route: string) => void;
}

export function StatePageV2({ type, onNavigate }: StatePageV2Props) {
  if (type === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6 pt-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 space-y-4">
            <Skeleton className="h-12 w-64 rounded-2xl" />
            <Skeleton className="h-6 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-96 w-full rounded-3xl" />
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'no-call') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-md w-full bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              오늘은 명확한 추천을 만들지 않았습니다
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              가격 데이터와 뉴스 신호가 충분히 정렬되지 않아 무리한 판단을 피했습니다.
            </p>
            <p className="text-sm text-slate-600">
              관심 종목을 조정하거나 내일 아침 브리핑을 확인하세요.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onNavigate(ROUTES.settings)}
              variant="outline"
              className="rounded-2xl border-2"
            >
              관심 종목 수정
            </Button>
            <Button
              onClick={() => onNavigate(ROUTES.home)}
              className="rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/30"
            >
              다시 확인
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'empty') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-md w-full bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center shadow-lg">
              <FileX className="w-10 h-10 text-slate-400" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              데이터 축적 중
            </h2>
            <p className="text-sm text-slate-700">
              아직 쌓인 추천 이력이 없습니다.
            </p>
            <p className="text-sm text-slate-600">
              추천 카드가 평가되면 성공과 실패 기록이 여기에 표시됩니다.
            </p>
          </div>
          <Button
            onClick={() => onNavigate(ROUTES.home)}
            className="w-full rounded-2xl h-12 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black shadow-lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            홈으로 이동
          </Button>
        </div>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-red-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-rose-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-md w-full bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
              <ServerCrash className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              잠시 후 다시 확인해주세요
            </h2>
            <p className="text-sm text-slate-700">
              외부 데이터 응답이 지연되고 있습니다.
            </p>
            <p className="text-xs text-slate-500">
              일시적인 문제일 수 있습니다. 잠시 후 다시 시도해주세요.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="rounded-2xl border-2"
            >
              다시 시도
            </Button>
            <Button
              onClick={() => onNavigate(ROUTES.home)}
              className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30"
            >
              홈으로 이동
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
