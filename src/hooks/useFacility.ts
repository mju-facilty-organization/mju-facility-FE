import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFacility,
  getFacilities,
  uploadFileToPresignedUrl,
} from '@/api/facility';
import { Facility } from '@/types/facility';

export function useFacilities(page = 0, size = 10, facilityType?: string) {
  return useQuery({
    queryKey: ['facilities', page, size, facilityType],
    queryFn: () => getFacilities(page, size, facilityType),
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
    },
  });
}
