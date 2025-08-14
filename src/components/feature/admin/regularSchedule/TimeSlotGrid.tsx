import React from 'react';
import { Clock } from 'lucide-react';
import { TimeSlotGridProps, WeeklySchedules } from '@/types/RegularSchedule';
import { useTimeSlotDrag } from '@/hooks/useTimeSlotDrag';

const TimeSlotGrid = ({
  weeklySchedules,
  setWeeklySchedules,
  isPending,
  dayOrder,
  dayNames,
}: TimeSlotGridProps) => {
  const { isDragging, dragStartDay, handleMouseDown, handleMouseEnter } =
    useTimeSlotDrag(weeklySchedules, setWeeklySchedules);

  return (
    <div className="bg-white rounded-lg border overflow-hidden mb-6">
      <div className="bg-blue-50 p-4 border-b">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          시설 사용 가능 시간 설정 (08:00 ~ 22:00)
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-200 border"></div>
            <span>사용 불가</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-500 border"></div>
            <span>사용 가능</span>
          </div>
          <span className="text-blue-600">
            {isPending ? '처리 중...' : '드래그하여 시간대를 선택하세요'}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]" style={{ userSelect: 'none' }}>
          <div className="grid grid-cols-8 border-b bg-gray-50">
            <div className="p-2 text-center font-medium border-r">시간</div>
            {dayOrder.map((day) => (
              <div key={day} className="p-2 text-center font-medium border-r">
                {dayNames[day]}요일
              </div>
            ))}
          </div>
          <div className="relative">
            {Array.from({ length: 14 }, (_, hour) => (
              <React.Fragment key={hour}>
                <div className="grid grid-cols-8 border-b border-gray-200">
                  <div className="p-1 text-xs text-center bg-gray-50 border-r font-mono">
                    {(hour + 8).toString().padStart(2, '0')}:00
                  </div>
                  {dayOrder.map((day) => {
                    const slot = hour * 2;
                    const isSelected = weeklySchedules[day][slot];
                    return (
                      <div
                        key={`${day}-${slot}`}
                        className={`h-6 border-r border-dotted border-gray-200 cursor-pointer transition-colors select-none
                          ${
                            isSelected
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-red-100 hover:bg-red-200'
                          }
                          ${
                            isDragging && dragStartDay === day
                              ? 'ring-2 ring-blue-300'
                              : ''
                          }
                          ${isPending ? 'pointer-events-none opacity-50' : ''}
                        `}
                        onMouseDown={(e) =>
                          !isPending && handleMouseDown(day, slot, e)
                        }
                        onMouseEnter={() =>
                          !isPending && handleMouseEnter(day, slot)
                        }
                        draggable={false}
                      />
                    );
                  })}
                </div>

                <div className="grid grid-cols-8 border-b border-gray-100">
                  <div className="p-1 text-xs text-center bg-gray-50 border-r font-mono text-gray-400">
                    {(hour + 8).toString().padStart(2, '0')}:30
                  </div>
                  {dayOrder.map((day) => {
                    const slot = hour * 2 + 1;
                    const isSelected = weeklySchedules[day][slot];
                    return (
                      <div
                        key={`${day}-${slot}`}
                        className={`h-6 border-r border-dotted border-gray-200 cursor-pointer transition-colors select-none
                          ${
                            isSelected
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-red-100 hover:bg-red-200'
                          }
                          ${
                            isDragging && dragStartDay === day
                              ? 'ring-2 ring-blue-300'
                              : ''
                          }
                          ${isPending ? 'pointer-events-none opacity-50' : ''}
                        `}
                        onMouseDown={(e) =>
                          !isPending && handleMouseDown(day, slot, e)
                        }
                        onMouseEnter={() =>
                          !isPending && handleMouseEnter(day, slot)
                        }
                        draggable={false}
                      />
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <div className="flex justify-end">
          <button
            onClick={() => {
              const newSchedules: WeeklySchedules = {};
              dayOrder.forEach((day) => {
                newSchedules[day] = new Array(28).fill(false);
              });
              setWeeklySchedules(newSchedules);
            }}
            disabled={isPending}
            className="px-3 py-1 text-red-600 border border-red-200 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            전체 해제
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotGrid;
