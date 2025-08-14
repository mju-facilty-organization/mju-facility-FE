import { Info } from 'lucide-react';
import { RESERVATION_STATES } from '@/types/reservationState';

const ScheduleLegend = () => {
  return (
    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-600" />
        <span className="font-semibold text-slate-700 text-sm">예약상태:</span>
      </div>
      <div className="flex gap-4">
        {Object.entries(RESERVATION_STATES).map(([key, state]) => (
          <div key={key} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-lg shadow-sm border border-white/50 flex-shrink-0"
              style={{ backgroundColor: state.color }}
            />
            <span className="text-sm text-slate-700 font-medium">
              {state.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleLegend;
