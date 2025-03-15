import React from 'react';
import { RESERVATION_STATES, ReservationState } from '@/types/reservationState';
import { Facility } from '@/types/facility';

export const TimeTable = ({
  facilityData,
  selectedDate,
  onDateChange,
}: {
  facilityData: Facility | undefined;
  selectedDate: string;
  onDateChange: (date: string) => void;
}) => {
  const timeSlotLegend = Object.entries(RESERVATION_STATES).map(
    ([state, { label }]) => ({
      state: state as ReservationState,
      label,
    })
  );

  const getReservationState = (status: string): ReservationState => {
    return status in RESERVATION_STATES
      ? (status as ReservationState)
      : 'UNAVAILABLE';
  };

  const generateTimeSlots = () => {
    const slots: { time: string; state: ReservationState }[] = [];
    for (let hour = 6; hour < 24; hour++) {
      for (const minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        const status = facilityData?.timeSlot?.[time];
        slots.push({
          time,
          state: status ? getReservationState(status) : 'UNAVAILABLE',
        });
      }
    }
    return slots;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(e.target.value);
  };

  if (!facilityData) {
    return null;
  }

  const timeSlots = generateTimeSlots();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="mt-6 px-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-xl font-medium mr-4">날짜 선택:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded-md px-3 py-2"
            min={today}
          />
        </div>

        <div className="flex gap-4">
          {timeSlotLegend.map(({ state, label }) => (
            <div key={state} className="flex items-center">
              <div
                className="w-4 h-4 mr-2"
                style={{
                  backgroundColor: RESERVATION_STATES[state].color,
                }}
              />
              <span className="text-base text-gray-custom">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col shrink-0">
          <span className="text-xl text-gray-custom mb-2">예약 가능 시간</span>
          <span className="text-lg text-gray-custom">평일 06:00 ~ 24:00</span>
        </div>

        <div className="overflow-x-auto">
          <div className="flex">
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i} className="w-8 flex">
                <span className="text-sm text-gray-custom">{i + 6}</span>
              </div>
            ))}
          </div>
          <div className="h-12 flex mt-2">
            {timeSlots.map((slot, i) => (
              <div
                key={i}
                className="w-4 h-full border-r last:border-r-0 relative group"
                style={{
                  backgroundColor: RESERVATION_STATES[slot.state].color,
                }}
              >
                <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                  {slot.time} - {RESERVATION_STATES[slot.state].label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
