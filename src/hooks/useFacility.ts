import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  createFacility,
  getFacilities,
  uploadFileToPresignedUrl,
  getFacilityDetail,
  deleteFacility,
} from '@/api/facility';
import { Facility } from '@/types/facility';

export function useFacilities(
  page = 0,
  size = 10,
  facilityType?: Facility['facilityType']
) {
  return useQuery({
    queryKey: ['facilities', page, size, facilityType],
    queryFn: () => getFacilities(page, size, facilityType),
  });
}

export function useFacilityDetail(
  facilityId: Facility['id'] | undefined,
  date?: string
) {
  return useQuery({
    queryKey: ['facility', facilityId, date],
    queryFn: () => getFacilityDetail(facilityId!, date),
    enabled: !!facilityId,
  });
}

export function useCreateFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      facilityData,
      files,
    }: {
      facilityData: Facility;
      files: File[];
    }) => {
      const response = await createFacility(facilityData);

      if (
        response.data?.presignedUrlList &&
        response.data.presignedUrlList.length > 0
      ) {
        const uploadPromises = response.data.presignedUrlList.map(
          (url: string, index: number) => {
            return uploadFileToPresignedUrl(url, files[index]);
          }
        );

        await Promise.all(uploadPromises);
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast.success('시설이 성공적으로 등록되었습니다.');
    },
  });
}

export function useDeleteFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast.success('시설이 성공적으로 삭제되었습니다.');
    },
  });
}
