import { useState, useEffect } from 'react';
import { useFacilityMapper } from '@/hooks/useFacilityMapper';
import { useScheduleData } from '@/hooks/useScheduleData';
import { useWeekNavigation } from '@/hooks/useWeekNavigation';
import ScheduleHeader from '@/components/feature/admin/facility-schedule/ScheduleHeader';
import ScheduleWeekNavigation from '@/components/feature/admin/facility-schedule/ScheduleWeekNavigation';
import ScheduleTable from '@/components/feature/admin/facility-schedule/ScheduleTable';
import {
  LoadingState,
  NoFacilityState,
  NoSelectionState,
  NoDataState,
} from '@/components/feature/admin/facility-schedule/ScheduleEmptyStates';
import { generateTimeSlots } from '@/utils/schedule';

const AdminFacilitySchedule = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(
    null
  );

  const { facilities, isLoadingFacilities, getFacilityById } =
    useFacilityMapper();
  const { currentWeekStart, goToPreviousWeek, goToNextWeek, goToCurrentWeek } =
    useWeekNavigation();
  const { scheduleData, loading, error, refetch } = useScheduleData({
    facilityId: selectedFacilityId,
    weekStart: currentWeekStart,
  });

  const timeSlots = generateTimeSlots();
  const selectedFacility = selectedFacilityId
    ? getFacilityById(selectedFacilityId) ?? null
    : null;

  useEffect(() => {
    if (facilities.length > 0 && !selectedFacilityId) {
      setSelectedFacilityId(facilities[0].id);
    }
  }, [facilities, selectedFacilityId]);

  if (isLoadingFacilities) {
    return <LoadingState message="시설 정보를 불러오고 있습니다..." />;
  }

  if (!facilities.length) {
    return <NoFacilityState />;
  }

  return (
    <div className="min-h-screen">
      <ScheduleHeader
        facilities={facilities}
        selectedFacilityId={selectedFacilityId}
        onFacilityChange={setSelectedFacilityId}
        onRefresh={refetch}
        loading={loading}
        error={error}
        selectedFacility={selectedFacility}
      />

      <div className="max-w-8xl mx-auto px-6 py-4">
        {!selectedFacilityId ? (
          <NoSelectionState />
        ) : loading ? (
          <LoadingState message="스케줄 정보를 불러오고 있습니다..." />
        ) : scheduleData.length === 0 ? (
          <NoDataState />
        ) : (
          <>
            <ScheduleWeekNavigation
              currentWeekStart={currentWeekStart}
              onPreviousWeek={goToPreviousWeek}
              onNextWeek={goToNextWeek}
              onCurrentWeek={goToCurrentWeek}
            />
            <ScheduleTable scheduleData={scheduleData} timeSlots={timeSlots} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminFacilitySchedule;
