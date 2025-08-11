import { useState, useCallback } from 'react';
import {
  RegularScheduleFormData,
  WeeklySchedules,
} from '@/types/RegularSchedule';
import { DAY_ORDER, TIME_SLOT_CONFIG } from '@/constants/regularSchedule';
import { getDefaultDates } from '@/utils/regularSchedule';

export const useRegularScheduleForm = () => {
  const [organization, setOrganization] = useState('');

  const [formData, setFormData] = useState<RegularScheduleFormData>({
    facilityId: '',
    scheduleType: 'CLASS',
    ...getDefaultDates(),
    excludeHolidays: true,
    excludeWeekends: false,
    excludeDates: [],
  });

  const [weeklySchedules, setWeeklySchedules] = useState<WeeklySchedules>(
    () => {
      const schedules: WeeklySchedules = {};
      DAY_ORDER.forEach((day) => {
        schedules[day] = new Array(TIME_SLOT_CONFIG.TOTAL_SLOTS).fill(false);
      });
      return schedules;
    }
  );

  const handleOrganizationChange = useCallback((value: string) => {
    setOrganization(value);
  }, []);

  const handleFormDataChange = useCallback(
    (newData: RegularScheduleFormData) => {
      setFormData(newData);
    },
    []
  );

  const resetForm = useCallback(() => {
    setOrganization('');
    setFormData({
      facilityId: '',
      scheduleType: 'CLASS',
      ...getDefaultDates(),
      excludeHolidays: true,
      excludeWeekends: false,
      excludeDates: [],
    });

    const newSchedules: WeeklySchedules = {};
    DAY_ORDER.forEach((day) => {
      newSchedules[day] = new Array(TIME_SLOT_CONFIG.TOTAL_SLOTS).fill(false);
    });
    setWeeklySchedules(newSchedules);
  }, []);

  return {
    organization,
    setOrganization: handleOrganizationChange,
    formData,
    setFormData: handleFormDataChange,
    weeklySchedules,
    setWeeklySchedules,
    resetForm,
  };
};
