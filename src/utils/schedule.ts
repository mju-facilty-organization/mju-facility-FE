import { ReservationState } from '@/types/reservationState';
import { FACILITY_TYPE_MAP } from '@/constants/building';

export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 22; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

export const getWeekDates = (weekStart: Date) => {
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);

  const startStr = `${start.getFullYear()}-${String(
    start.getMonth() + 1
  ).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
  const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(end.getDate()).padStart(2, '0')}`;

  return { startDate: startStr, endDate: endStr };
};

export const formatWeekInfo = (currentWeekStart: Date) => {
  const { startDate, endDate } = getWeekDates(currentWeekStart);
  const start = new Date(startDate);
  const end = new Date(endDate);

  const year = start.getFullYear();
  const month = start.getMonth() + 1;
  const weekOfMonth = Math.ceil(start.getDate() / 7);

  return {
    year,
    month,
    weekOfMonth,
    dateRange: `${month}/${start.getDate()} - ${
      end.getMonth() + 1
    }/${end.getDate()}`,
  };
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = days[date.getDay()];
  return { month, day, dayOfWeek };
};

export const formatTimeLabel = (time: string) => {
  const [hour, minute] = time.split(':');
  return minute === '00' ? `${hour}시` : '';
};

export const getStatusFromTimeTable = (
  timeTable: Record<string, ReservationState> | null | undefined,
  time: string
): ReservationState => {
  if (!timeTable || !timeTable[time]) {
    return 'UNAVAILABLE';
  }

  return timeTable[time] as ReservationState;
};

export const getStatusHoverClass = (status: ReservationState) => {
  return status === 'AVAILABLE' ? 'hover:opacity-80 cursor-pointer' : '';
};

export const getFacilityTypeInKorean = (facilityType: string) => {
  return FACILITY_TYPE_MAP[facilityType] || facilityType;
};
