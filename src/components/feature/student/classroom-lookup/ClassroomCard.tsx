import { ReactNode } from 'react';
import { Facility } from '@/types/facility';
import { FACILITY_TYPE_MAP } from '@/constants/building';

type ClassroomCardProps = {
  imageContent: ReactNode;
  facility: Facility;
  onReserve: (id: number | string) => void;
};

export const ClassroomCard = ({
  imageContent,
  facility,
  onReserve,
}: ClassroomCardProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="w-full h-52">{imageContent}</div>
      <div className="p-4">
        <h3 className="text-2xl font-bold mb-2">{facility.facilityNumber}</h3>
        <div className="flex mb-1">
          <span className="text-lg font-medium text-gray-custom">위치 : </span>
          <span className="text-lg text-gray-custom ml-2">
            {FACILITY_TYPE_MAP[facility.facilityType] || facility.facilityType}
          </span>
        </div>
        <div className="flex mb-1">
          <span className="text-lg font-medium text-gray-custom">
            수용인원 :{' '}
          </span>
          <span className="text-lg text-gray-custom ml-2">
            {facility.capacity}명
          </span>
        </div>
        <div className="flex mb-4">
          <span className="text-lg font-medium text-gray-custom">
            구비시설 :{' '}
          </span>
          <span className="text-lg text-gray-custom ml-2">
            {facility.supportFacilities?.join(', ') || ''}
          </span>
        </div>
        <button
          onClick={() =>
            onReserve(
              facility.id !== undefined ? facility.id : facility.facilityNumber
            )
          }
          className="w-full py-2 text-lg bg-white border border-gray-200 rounded-lg hover:bg-myongji hover:text-white hover:border-myongji transition-colors"
        >
          예약하기
        </button>
      </div>
    </div>
  );
};
