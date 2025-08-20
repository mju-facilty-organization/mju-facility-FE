import { RESERVATION_STATES, ReservationState } from '@/types/reservationState';
import {
  formatDate,
  formatTimeLabel,
  getStatusFromTimeTable,
  getStatusHoverClass,
  getBookInfoFromTable,
  BookInfo,
} from '@/utils/schedule';

type ScheduleDay = {
  date: string;
  timeTable: Record<string, ReservationState>;
  bookInfoTable: Record<string, BookInfo>;
};

type ScheduleTableProps = {
  scheduleData: ScheduleDay[];
  timeSlots: string[];
};

const ScheduleTable = ({ scheduleData, timeSlots }: ScheduleTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="overflow-auto">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 bg-gradient-to-r from-myongji to-blue-900 text-white z-10">
            <tr>
              <th className="w-16 px-3 py-3 text-center text-xs font-medium border-r border-myongji/30">
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
                    className={`px-2 py-3 text-center text-xs font-medium border-r border-myongji/30 last:border-r-0 ${
                      isToday ? 'bg-myongji/80' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <div className="text-base font-bold">{dayOfWeek}</div>
                      <div className="text-sm">
                        ({month}/{dayNum})
                      </div>
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
                      ? 'border-t border-gray-300'
                      : 'border-t border-gray-100'
                  } hover:bg-gray-50/50 transition-colors duration-150`}
                >
                  <td className="px-2 py-1 text-xs text-gray-600 bg-slate-50/50 border-r border-gray-200 text-center">
                    {formatTimeLabel(time) ? (
                      <div className="font-semibold text-slate-700">
                        {formatTimeLabel(time)}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">{time}</div>
                    )}
                  </td>
                  {scheduleData.map((day) => {
                    const status = getStatusFromTimeTable(day.timeTable, time);
                    const bookInfo = getBookInfoFromTable(
                      day.bookInfoTable,
                      time
                    );
                    const statusConfig = RESERVATION_STATES[status];

                    const hasBookInfo =
                      bookInfo && bookInfo.bookName !== '없음';

                    return (
                      <td
                        key={`${day.date}-${time}`}
                        className="p-0.5 border-r border-gray-100 last:border-r-0"
                      >
                        <div
                          className={`relative h-12 w-full rounded transition-all duration-200 overflow-hidden ${getStatusHoverClass(
                            status
                          )} ${
                            status === 'AVAILABLE'
                              ? 'hover:shadow-sm border border-myongji/20 hover:bg-myongji/5'
                              : 'border border-transparent'
                          }`}
                          style={{
                            backgroundColor: statusConfig.color,
                          }}
                        >
                          {hasBookInfo && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center px-1">
                              <div className="text-center">
                                <div className="text-xs font-bold opacity-80 text-myongji leading-tight">
                                  {bookInfo.type}
                                </div>
                                <div className="text-xs font-bold text-black leading-tight truncate mt-0.5">
                                  {bookInfo.bookName}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
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
