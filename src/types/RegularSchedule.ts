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
