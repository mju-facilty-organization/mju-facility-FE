import { useCallback } from 'react';
import { Calendar, Check } from 'lucide-react';
import { useFacilityMapper } from '@/hooks/useFacilityMapper';
import { useCreateRegularScheduleMutation } from '@/hooks/useCreateRegularSchedule';
import { useRegularScheduleForm } from '@/hooks/useRegularScheduleForm';
import BasicInfoSection from '@/components/feature/admin/regularSchedule/BasicInfoSection';
import TimeSlotGrid from '@/components/feature/admin/regularSchedule/TimeSlotGrid';
import RecurringSettingsSection from '@/components/feature/admin/regularSchedule/RecurringSettingsSection';
import PreviewSection from '@/components/feature/admin/regularSchedule/PreviewSection';
import {
  SCHEDULE_TYPES,
  DAY_ORDER,
  DAY_NAMES,
} from '@/constants/regularSchedule';
import { slotToTime, getTimeRanges } from '@/utils/regularSchedule';
import { RegularSchedule } from '@/types/RegularSchedule';

const AdminRegularSchedule = () => {
  const { facilities, isLoadingFacilities, getFacilityById } =
    useFacilityMapper();
  const createScheduleMutation = useCreateRegularScheduleMutation();

  const {
    organization,
    setOrganization,
    formData,
    setFormData,
    weeklySchedules,
    setWeeklySchedules,
    resetForm,
  } = useRegularScheduleForm();

  const getTimeRangesForDay = useCallback(
    (day: string) => getTimeRanges(weeklySchedules, day),
    [weeklySchedules]
  );

  const handleSubmit = useCallback(() => {
    if (!organization.trim()) {
      alert('조직명을 입력해주세요.');
      return;
    }

    if (!formData.facilityId) {
      alert('시설을 선택해주세요.');
      return;
    }

    const schedules: RegularSchedule['schedules'] = [];
    DAY_ORDER.forEach((day) => {
      const daySlots = weeklySchedules[day];
      let startSlot: number | null = null;

      daySlots.forEach((selected, slot) => {
        if (selected && startSlot === null) {
          startSlot = slot;
        } else if (!selected && startSlot !== null) {
          schedules.push({
            dayOfWeek: day,
            rentalStartTime: slotToTime(startSlot),
            rentalEndTime: slotToTime(slot),
          });
          startSlot = null;
        }
      });

      if (startSlot !== null) {
        schedules.push({
          dayOfWeek: day,
          rentalStartTime: slotToTime(startSlot),
          rentalEndTime: '22:00',
        });
      }
    });

    if (schedules.length === 0) {
      alert('시간대를 선택해주세요.');
      return;
    }

    const apiData: RegularSchedule = {
      organization: organization.trim(),
      scheduleType: formData.scheduleType,
      facilityId: parseInt(formData.facilityId),
      schedules,
      validStartDate: formData.validStartDate,
      validEndDate: formData.validEndDate,
    };

    createScheduleMutation.mutate(apiData, {
      onSuccess: (data) => {
        alert('정기 스케줄이 성공적으로 생성되었습니다!');
        console.log('생성된 스케줄:', data);

        resetForm();
      },
      onError: (error: Error) => {
        console.error('API 호출 오류:', error);
        alert(
          `스케줄 생성 실패: ${
            error.message || '알 수 없는 오류가 발생했습니다.'
          }`
        );
      },
    });
  }, [
    organization,
    formData,
    weeklySchedules,
    createScheduleMutation,
    resetForm,
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6  min-h-screen">
      <div className="bg-myongji text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="w-8 h-8" />
          정기 스케줄 생성
        </h1>
        <p className="mt-2 opacity-90">
          시설의 정기적인 사용 스케줄을 설정하세요 (08:00 ~ 22:00)
        </p>
      </div>

      <BasicInfoSection
        organization={organization}
        setOrganization={setOrganization}
        formData={formData}
        setFormData={setFormData}
        facilities={facilities}
        isLoadingFacilities={isLoadingFacilities}
        scheduleTypes={SCHEDULE_TYPES}
        createScheduleMutation={createScheduleMutation}
      />

      <TimeSlotGrid
        weeklySchedules={weeklySchedules}
        setWeeklySchedules={setWeeklySchedules}
        isPending={createScheduleMutation.isPending}
        dayOrder={DAY_ORDER}
        dayNames={DAY_NAMES}
        slotToTime={slotToTime}
      />

      <RecurringSettingsSection
        formData={formData}
        handleFormDataChange={setFormData}
        isPending={createScheduleMutation.isPending}
      />

      <PreviewSection
        organization={organization}
        formData={formData}
        weeklySchedules={weeklySchedules}
        getFacilityById={getFacilityById}
        error={createScheduleMutation.error}
        scheduleTypes={SCHEDULE_TYPES}
        dayOrder={DAY_ORDER}
        dayNames={DAY_NAMES}
        getTimeRanges={getTimeRangesForDay}
      />

      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between">
          <button
            onClick={resetForm}
            disabled={createScheduleMutation.isPending}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            초기화
          </button>

          <button
            onClick={handleSubmit}
            disabled={
              !organization.trim() ||
              !formData.facilityId ||
              createScheduleMutation.isPending
            }
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            {createScheduleMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                생성 중...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                정기 스케줄 생성
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRegularSchedule;
