import React from 'react';
import { RESERVATION_STATES, ReservationState } from '@/types/reservationState';
import { FacilityData } from '@/types/facility';

interface TimeTableProps {
  data?: FacilityData;
}

const MOCK_FACILITY_DATA: FacilityData = {
  id: 1,
  facilityType: '본관',
  facilityNumber: '1350',
  images: ['test-file1'],
  capacity: 5,
  allowedBoundary: '융합소프트웨어학부',
  supportFacilities: ['구비시설1', '구비시설2'],
  pic: '교수',
  date: '2025-02-04',
  timeSlot: {
    '11:30': '예약가능',
    '12:00': '예약가능',
    '12:30': '예약가능',
    '13:00': '예약가능',
    '13:30': '예약가능',
    '14:00': '예약가능',
    '14:30': '예약가능',
    '15:00': '예약완료',
  },
};

export const TimeTable: React.FC<TimeTableProps> = ({
  data = MOCK_FACILITY_DATA,
}) => {
  const timeSlotLegend = Object.entries(RESERVATION_STATES).map(
    ([state, { label }]) => ({
      state: state as ReservationState,
      label,
    })
  );

  const getReservationState = (status: string): ReservationState => {
    switch (status) {
      case '예약가능':
        return 'AVAILABLE';
      case '예약완료':
        return 'COMPLETED';
      case '예약대기':
        return 'PENDING';
      case '현재예약':
        return 'CURRENT';
      default:
        return 'UNAVAILABLE';
    }
  };

  const generateTimeSlots = () => {
    const slots: { time: string; state: ReservationState }[] = [];
    for (let hour = 6; hour < 24; hour++) {
      for (const minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        const status = data?.timeSlot?.[time];
        slots.push({
          time,
          state: status ? getReservationState(status) : 'UNAVAILABLE',
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="mt-6 px-10">
      <div className="flex justify-end mb-4 gap-4">
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
                className="w-4 h-full border-r last:border-r-0"
                style={{
                  backgroundColor: RESERVATION_STATES[slot.state].color,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
