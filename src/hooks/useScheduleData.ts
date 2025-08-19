import { useState, useEffect } from 'react';
import { getScheduleView } from '@/api/facilityschedule';
import { getWeekDates } from '@/utils/schedule';
import { ReservationState } from '@/types/reservationState';

type BookInfo = {
  bookName: string;
  type: string;
};

type ScheduleDay = {
  date: string;
  timeTable: Record<string, ReservationState>;
  bookInfoTable: Record<string, BookInfo>;
};

type UseScheduleDataProps = {
  facilityId: number | null;
  weekStart: Date;
};

type UseScheduleDataReturn = {
  scheduleData: ScheduleDay[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useScheduleData = ({
  facilityId,
  weekStart,
}: UseScheduleDataProps): UseScheduleDataReturn => {
  const [scheduleData, setScheduleData] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScheduleData = async () => {
    if (!facilityId) return;

    const { startDate, endDate } = getWeekDates(weekStart);

    setLoading(true);
    setError(null);

    try {
      const result = await getScheduleView(facilityId, {
        startDate,
        endDate,
      });
      setScheduleData(result.data || []);
    } catch (err) {
      setError('스케줄 데이터를 불러오는데 실패했습니다.');
      console.error('스케줄 데이터 로딩 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScheduleData();
  }, [facilityId, weekStart]);

  return {
    scheduleData,
    loading,
    error,
    refetch: loadScheduleData,
  };
};
