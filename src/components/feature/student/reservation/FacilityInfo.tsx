import { MapPin, Users, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { FacilityData, FacilityInfoProps } from '@/types/facility';
import { FacilityDetailItem } from '@/components/feature/student/reservation/FacilityDetailItem';

const TEMP_DATA: FacilityData = {
  id: 1,
  facilityType: '본관',
  facilityNumber: '1350',
  images: ['test-file1', 'test-file2', 'test-file3', 'test-file4'],
  capacity: 5,
  allowedBoundary: '융합소프트웨어학부',
  supportFacilities: ['구비시설1', '구비시설2'],
};

export const FacilityInfo = ({
  facilityData = TEMP_DATA,
}: FacilityInfoProps) => {
  const [selectedImage, setSelectedImage] = useState(facilityData.images[0]);
  const visibleThumbnails = facilityData.images.slice(0, 3);
  const remainingCount = Math.max(0, facilityData.images.length - 3);

  const getImageUrl = (imageId: string) => {
    return `/api/images/${imageId}`;
  };

  return (
    <div className="bg-white shadow-lg rounded-xl">
      <h3 className="text-2xl font-bold p-6 border-b">
        {facilityData.facilityType} {facilityData.facilityNumber}
      </h3>

      <div className="flex flex-col md:flex-row p-6 gap-6">
        <div className="md:w-1/2 ">
          <img
            src={getImageUrl(selectedImage)}
            alt="강의실"
            className="w-full h-72 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          />

          <div className="grid grid-cols-3 gap-3">
            {visibleThumbnails.map((image, index) => (
              <div key={image} className="relative">
                <img
                  src={getImageUrl(image)}
                  alt={`강의실 이미지 ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                />
                {index === 2 && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md cursor-pointer hover:bg-opacity-60 transition-all">
                    <span className="text-white font-medium">
                      +{remainingCount}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2 bg-gray-50 rounded-xl p-6 h-full">
          <h4 className="text-lg font-semibold mb-4">공간 정보</h4>
          <dl className="space-y-6">
            <FacilityDetailItem
              icon={<MapPin className="w-5 h-5 mr-2 text-gray-400" />}
              label="위치"
              value={`${facilityData.facilityType} ${facilityData.facilityNumber}`}
            />
            <FacilityDetailItem
              icon={<Users className="w-5 h-5 mr-2 text-gray-400" />}
              label="수용인원"
              value={`${facilityData.capacity}명`}
            />
            <FacilityDetailItem
              icon={<Lightbulb className="w-5 h-5 mr-2 text-gray-400" />}
              label="구비 시설"
              value={facilityData.supportFacilities.join(', ')}
            />
            <FacilityDetailItem
              icon={<Users className="w-5 h-5 mr-2 text-gray-400" />}
              label="사용 가능 대상"
              value={facilityData.allowedBoundary}
            />
          </dl>
        </div>
      </div>
    </div>
  );
};
