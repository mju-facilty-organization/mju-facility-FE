import { TIME_SLOT_CONFIG } from '@/constants/regularSchedule';
import { WeeklySchedules } from '@/types/RegularSchedule';

export const slotToTime = (slot: number): string => {
  const hours =
    Math.floor(slot / TIME_SLOT_CONFIG.SLOTS_PER_HOUR) +
    TIME_SLOT_CONFIG.START_HOUR;
  const minutes = (slot % TIME_SLOT_CONFIG.SLOTS_PER_HOUR) * 30;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
};

export const getTimeRanges = (
  weeklySchedules: WeeklySchedules,
  day: string
): string[] => {
  const slots = weeklySchedules[day];
  const ranges: string[] = [];
  let start: number | null = null;

  for (let i = 0; i < slots.length; i++) {
    if (slots[i] && start === null) {
      start = i;
    } else if (!slots[i] && start !== null) {
      ranges.push(`${slotToTime(start)} - ${slotToTime(i)}`);
      start = null;
    }
  }

  if (start !== null) {
    ranges.push(`${slotToTime(start)} - 22:00`);
  }

  return ranges;
};

export const getDefaultDates = () => {
  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 4);

  return {
    validStartDate: startDate.toISOString().split('T')[0],
    validEndDate: endDate.toISOString().split('T')[0],
  };
};
