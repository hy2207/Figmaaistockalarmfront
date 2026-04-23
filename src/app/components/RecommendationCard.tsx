import { Copy, ArrowRight, ExternalLink } from 'lucide-react';
import type { RecommendationCard as RecommendationCardType } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';

interface RecommendationCardProps {
  recommendation: RecommendationCardType;
  onViewDetail: () => void;
}

export function RecommendationCard({ recommendation, onViewDetail }: RecommendationCardProps) {
  const { addDebugEvent } = useApp();

  const handleCopyPrice = () => {
    const priceText = recommendation.entryPrice
      ? `$${recommendation.entryPrice}`
      : `$${recommendation.entryRangeMin} - $${recommendation.entryRangeMax}`;
    navigator.clipboard.writeText(priceText);
    toast.success('가격이 복사되었습니다.');
    addDebugEvent('price_copy', { ticker: recommendation.ticker });
  };

  const handleBrokerRedirect = () => {
    addDebugEvent('broker_redirect', { ticker: recommendation.ticker });
    if (confirm('외부 브로커 화면으로 이동합니다.')) {
      toast.success('브로커로 이동합니다.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-slate-900">{recommendation.ticker}</h3>
            <Badge
              variant={recommendation.direction === 'BUY' ? 'default' : 'destructive'}
              className={
                recommendation.direction === 'BUY'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {recommendation.direction}
            </Badge>
          </div>
          <div className="text-sm text-slate-600">{recommendation.companyName}</div>
        </div>
        <div className="text-sm text-slate-600">{recommendation.actionLabel}</div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">진입가</span>
          <span className="text-slate-900">
            {recommendation.entryPrice
              ? `$${recommendation.entryPrice.toFixed(2)}`
              : `$${recommendation.entryRangeMin} - $${recommendation.entryRangeMax}`}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">목표가</span>
          <span className="text-green-600">
            {recommendation.targetPrice
              ? `$${recommendation.targetPrice.toFixed(2)}`
              : `$${recommendation.targetRangeMin} - $${recommendation.targetRangeMax}`}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">손절가</span>
          <span className="text-red-600">${recommendation.stopPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">권장 보유</span>
          <span className="text-slate-900">{recommendation.holdDays}일</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <p className="text-sm text-slate-700 leading-relaxed">{recommendation.reasonLine}</p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleCopyPrice}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Copy className="w-4 h-4 mr-1" />
          가격 복사
        </Button>
        <Button
          onClick={onViewDetail}
          variant="default"
          size="sm"
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          상세 보기
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <Button
        onClick={handleBrokerRedirect}
        variant="outline"
        size="sm"
        className="w-full"
      >
        <ExternalLink className="w-4 h-4 mr-1" />
        브로커로 이동
      </Button>
    </div>
  );
}
