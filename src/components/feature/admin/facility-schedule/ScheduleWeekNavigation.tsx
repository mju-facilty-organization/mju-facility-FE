import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatWeekInfo } from '@/utils/schedule';

type ScheduleWeekNavigationProps = {
  currentWeekStart: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
};

const ScheduleWeekNavigation = ({
  currentWeekStart,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
}: ScheduleWeekNavigationProps) => {
  const weekInfo = formatWeekInfo(currentWeekStart);

  return (
    <div className="mb-4 flex items-center relative">
      <div className="text-left">
        <div className="text-2xl font-bold text-slate-800">
          {weekInfo.year}년 {weekInfo.dateRange}
        </div>
      </div>

      <div className="flex gap-2 absolute left-1/2 transform -translate-x-1/2">
        <button
          onClick={onPreviousWeek}
          className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-lg hover:bg-slate-50/80 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md font-medium text-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">이전</span>
        </button>

        <button
          onClick={onCurrentWeek}
          className="px-4 py-2 bg-gradient-to-r bg-myongji text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
        >
          이번 주
        </button>

        <button
          onClick={onNextWeek}
          className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-lg hover:bg-slate-50/80 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md font-medium text-slate-700"
        >
          <span className="text-sm">다음</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ScheduleWeekNavigation;
