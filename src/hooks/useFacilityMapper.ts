import { useMemo, useCallback } from 'react';
import { useFacilities } from '@/hooks/useFacility';
import type { Facility } from '@/types/facility';

export const useFacilityMapper = () => {
  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useFacilities(0, 1000);

  const facilityNumberToIdMap = useMemo(() => {
    if (!facilitiesData?.data?.content) return {};

    const map: Record<string, number> = {};
    facilitiesData.data.content.forEach((facility: Facility) => {
      map[facility.facilityNumber] = facility.id;
    });

    return map;
  }, [facilitiesData?.data?.content]);

  const facilityIdToNumberMap = useMemo(() => {
    if (!facilitiesData?.data?.content) return {};

    const map: Record<number, string> = {};
    facilitiesData.data.content.forEach((facility: Facility) => {
      map[facility.id] = facility.facilityNumber;
    });

    return map;
  }, [facilitiesData?.data?.content]);

  const getFacilityId = useCallback(
    (facilityNumber: string): number => {
      return facilityNumberToIdMap[facilityNumber] || 1;
    },
    [facilityNumberToIdMap]
  );

  const getFacilityNumber = useCallback(
    (facilityId: number): string => {
      return facilityIdToNumberMap[facilityId] || '';
    },
    [facilityIdToNumberMap]
  );

  const getFacilityById = useCallback(
    (facilityId: number): Facility | undefined => {
      return facilitiesData?.data?.content?.find(
        (facility: Facility) => facility.id === facilityId
      );
    },
    [facilitiesData?.data?.content]
  );

  const getFacilityByNumber = useCallback(
    (facilityNumber: string): Facility | undefined => {
      return facilitiesData?.data?.content?.find(
        (facility: Facility) => facility.facilityNumber === facilityNumber
      );
    },
    [facilitiesData?.data?.content]
  );

  return {
    facilities: facilitiesData?.data?.content || [],
    facilityNumberToIdMap,
    facilityIdToNumberMap,
    isLoadingFacilities,
    getFacilityId,
    getFacilityNumber,
    getFacilityById,
    getFacilityByNumber,
  };
};
