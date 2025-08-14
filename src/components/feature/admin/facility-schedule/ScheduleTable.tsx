import { RESERVATION_STATES, ReservationState } from '@/types/reservationState';
import {
  formatDate,
  formatTimeLabel,
  getStatusFromTimeTable,
  getStatusHoverClass,
} from '@/utils/schedule';

type ScheduleDay = {
  date: string;
  timeTable: Record<string, ReservationState>;
};

type ScheduleTableProps = {
  scheduleData: ScheduleDay[];
  timeSlots: string[];
};

const ScheduleTable = ({ scheduleData, timeSlots }: ScheduleTableProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white z-10 shadow-lg">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold w-20 border-r border-slate-500/30">
                시간
              </th>
              {scheduleData.map((day) => {
                const { month, day: dayNum, dayOfWeek } = formatDate(day.date);
                const isToday =
                  new Date(day.date).toDateString() ===
                  new Date().toDateString();
                return (
                  <th
                    key={day.date}
                    className={`px-2 py-4 text-center text-sm font-semibold border-r border-slate-500/30 last:border-r-0 ${
                      isToday ? 'bg-blue-600' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-base font-bold">
                        {month}/{dayNum}
                      </div>
                      <div className="text-xs opacity-90">{dayOfWeek}</div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => {
              const isHourStart = time.endsWith(':00');
              return (
                <tr
                  key={time}
                  className={`${
                    isHourStart
                      ? 'border-t-2 border-slate-200'
                      : 'border-t border-slate-100'
                  } hover:bg-slate-50/50 transition-colors duration-150`}
                >
                  <td className="px-4 py-2 text-sm font-medium text-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 border-r border-slate-200">
                    <div className="text-right">
                      {formatTimeLabel(time) ? (
                        <div className="font-bold text-slate-800">
                          {formatTimeLabel(time)}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500">{time}</div>
                      )}
                    </div>
                  </td>
                  {scheduleData.map((day) => {
                    const status = getStatusFromTimeTable(day.timeTable, time);
                    const statusConfig = RESERVATION_STATES[status];
                    return (
                      <td
                        key={`${day.date}-${time}`}
                        className="p-1 border-r border-slate-100 last:border-r-0"
                      >
                        <div
                          className={`h-6 w-full rounded-md transition-all duration-200 shadow-sm border border-white/30 ${getStatusHoverClass(
                            status
                          )} ${
                            status === 'AVAILABLE'
                              ? 'hover:scale-105 hover:shadow-md'
                              : ''
                          }`}
                          style={{
                            backgroundColor: statusConfig.color,
                          }}
                          title={`${day.date} ${time} - ${statusConfig.label}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
