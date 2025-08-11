import { UseMutationResult } from '@tanstack/react-query';

export type RegularSchedule = {
  organization: string;
  scheduleType: string;
  facilityId: number;
  schedules: Array<{
    dayOfWeek: string;
    rentalStartTime: string;
    rentalEndTime: string;
  }>;
  validStartDate: string;
  validEndDate: string;
};

export type RegularScheduleFormData = {
  facilityId: string;
  scheduleType: string;
  validStartDate: string;
  validEndDate: string;
  excludeHolidays: boolean;
  excludeWeekends: boolean;
  excludeDates: string[];
};

export type WeeklySchedules = {
  [key: string]: boolean[];
};

export type Facility = {
  id: number;
  name: string;
  facilityNumber: string;
};

export type ScheduleType = {
  value: string;
  label: string;
};

export type BasicInfoSectionProps = {
  organization: string;
  setOrganization: (value: string) => void;
  formData: RegularScheduleFormData;
  setFormData: (data: RegularScheduleFormData) => void;
  facilities: Facility[];
  isLoadingFacilities: boolean;
  scheduleTypes: readonly ScheduleType[];
  createScheduleMutation: UseMutationResult<
    RegularSchedule,
    Error,
    RegularSchedule
  >;
};

export type TimeSlotGridProps = {
  weeklySchedules: WeeklySchedules;
  setWeeklySchedules: React.Dispatch<React.SetStateAction<WeeklySchedules>>;
  isPending: boolean;
  dayOrder: readonly string[];
  dayNames: Record<string, string>;
  slotToTime: (slot: number) => string;
};

export type RecurringSettingsSectionProps = {
  formData: RegularScheduleFormData;
  handleFormDataChange: (data: RegularScheduleFormData) => void;
  isPending: boolean;
};

export type PreviewSectionProps = {
  organization: string;
  formData: RegularScheduleFormData;
  weeklySchedules: WeeklySchedules;
  getFacilityById: (id: number) => Facility | undefined;
  error: Error | null;
  scheduleTypes: readonly ScheduleType[];
  dayOrder: readonly string[];
  dayNames: Record<string, string>;
  getTimeRanges: (day: string) => string[];
};
