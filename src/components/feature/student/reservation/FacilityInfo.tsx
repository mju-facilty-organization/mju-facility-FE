import { MapPin, Users, Lightbulb, School } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FacilityDetailItem } from '@/components/feature/student/reservation/FacilityDetailItem';
import { FACILITY_TYPE_MAP } from '@/constants/building';
import { Facility } from '@/types/facility';
import { DEPARTMENT_ENGLISH_TO_KOREAN } from '@/constants/department';

export const FacilityInfo = ({
  facilityData,
}: {
  facilityData: Facility | undefined;
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (facilityData?.imageMetas && facilityData.imageMetas.length > 0) {
      setSelectedImage(facilityData.imageMetas[0].url);
    }

    setFailedImages({});
  }, [facilityData]);

  const handleImageError = (imageUrl: string): void => {
    setFailedImages((prev) => ({
      ...prev,
      [imageUrl]: true,
    }));

    if (
      selectedImage === imageUrl &&
      facilityData?.imageMetas &&
      facilityData.imageMetas.length > 0
    ) {
      const validImages = facilityData.imageMetas
        .map((meta) => meta.url)
        .filter((url: string) => !failedImages[url] && url !== imageUrl);

      if (validImages.length > 0) {
        setSelectedImage(validImages[0]);
      }
    }
  };

  const getKoreanDepartmentName = (englishName: string): string => {
    return DEPARTMENT_ENGLISH_TO_KOREAN[englishName] || englishName;
  };

  if (!facilityData) {
    return null;
  }

  const availableImages = (facilityData.imageMetas || [])
    .map((meta) => meta.url)
    .filter((url: string) => !failedImages[url]);

  const visibleThumbnails = availableImages.slice(0, 3);
  const remainingCount = Math.max(0, availableImages.length - 3);

  const koreanAllowedBoundary =
    facilityData.allowedBoundary?.map(getKoreanDepartmentName) || [];

  return (
    <div className="bg-white shadow-lg rounded-xl">
      <h3 className="text-2xl font-bold p-6 border-b">
        {FACILITY_TYPE_MAP[facilityData.facilityType] ||
          facilityData.facilityType}{' '}
        {facilityData.facilityNumber}
      </h3>

      <div className="flex flex-col md:flex-row p-6 gap-6">
        <div className="md:w-1/2">
          {selectedImage && !failedImages[selectedImage] ? (
            <img
              src={selectedImage}
              alt="강의실"
              className="w-full h-72 object-cover rounded-lg"
              onError={() => handleImageError(selectedImage)}
            />
          ) : (
            <div className="w-full h-72 flex items-center justify-center bg-gray-100 rounded-lg">
              <School size={64} className="text-gray-400" />
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mt-3">
            {visibleThumbnails.length > 0 ? (
              visibleThumbnails.map((imageUrl, index) => (
                <div key={imageUrl} className="relative">
                  <img
                    src={imageUrl}
                    alt={`강의실 이미지 ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md cursor-pointer"
                    onClick={() => setSelectedImage(imageUrl)}
                    onError={() => handleImageError(imageUrl)}
                  />
                  {index === 2 && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                      <span className="text-white font-medium">
                        +{remainingCount}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="w-full h-24 bg-gray-100 rounded-md"></div>
                <div className="w-full h-24 bg-gray-100 rounded-md"></div>
                <div className="w-full h-24 bg-gray-100 rounded-md"></div>
              </>
            )}
          </div>
        </div>

        <div className="md:w-1/2 bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold mb-4">공간 정보</h4>
          <dl className="space-y-6">
            <FacilityDetailItem
              icon={<MapPin className="w-5 h-5 mr-2 text-gray-400" />}
              label="위치"
              value={`${
                FACILITY_TYPE_MAP[facilityData.facilityType] ||
                facilityData.facilityType
              } ${facilityData.facilityNumber}`}
            />
            <FacilityDetailItem
              icon={<Users className="w-5 h-5 mr-2 text-gray-400" />}
              label="수용인원"
              value={`${facilityData.capacity}명`}
            />
            <FacilityDetailItem
              icon={<Lightbulb className="w-5 h-5 mr-2 text-gray-400" />}
              label="구비 시설"
              value={facilityData.supportFacilities?.join(', ') || '없음'}
            />
            <FacilityDetailItem
              icon={<Users className="w-5 h-5 mr-2 text-gray-400" />}
              label="사용 가능 대상"
              value={
                koreanAllowedBoundary.length > 0
                  ? koreanAllowedBoundary.join(', ')
                  : '전체'
              }
            />
          </dl>
        </div>
      </div>
    </div>
  );
};
