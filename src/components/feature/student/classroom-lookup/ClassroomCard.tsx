import { ReactNode } from 'react';

type ClassroomCardProps = {
  imageContent: ReactNode;
  number: string;
  location: string;
  capacity: string;
  facilities: string;
  onReserve: (classroomId: string) => void;
};

export const ClassroomCard = ({
  imageContent,
  number,
  location,
  capacity,
  facilities,
  onReserve,
}: ClassroomCardProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="w-full h-52">{imageContent}</div>
      <div className="p-4">
        <h3 className="text-2xl font-bold mb-2">{number}</h3>
        <div className="flex mb-1">
          <span className="text-lg font-medium text-gray-custom">위치 : </span>
          <span className="text-lg text-gray-custom ml-2">{location}</span>
        </div>
        <div className="flex mb-1">
          <span className="text-lg font-medium text-gray-custom">
            수용인원 :{' '}
          </span>
          <span className="text-lg text-gray-custom ml-2">{capacity}</span>
        </div>
        <div className="flex mb-4">
          <span className="text-lg font-medium text-gray-custom">
            구비시설 :{' '}
          </span>
          <span className="text-lg text-gray-custom ml-2">{facilities}</span>
        </div>
        <button
          onClick={() => onReserve(number)}
          className="w-full py-2 text-lg bg-white border border-gray-200 rounded-lg hover:bg-myongji hover:text-white hover:border-myongji transition-colors"
        >
          예약하기
        </button>
      </div>
    </div>
  );
};
