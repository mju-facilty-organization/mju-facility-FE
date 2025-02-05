interface ClassroomCardProps {
  imageUrl: string;
  number: string;
  location: string;
  capacity: string;
  facilities: string;
  onReserve: (classroomId: string) => void;
}

export const ClassroomCard = ({
  imageUrl,
  number,
  location,
  capacity,
  facilities,
  onReserve,
}: ClassroomCardProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm ">
      <img src={imageUrl} alt="강의실" className="w-full h-52 object-cover" />
      <div className="p-4">
        <h3 className="text-2xl font-bold mb-2">{number}</h3>
        <p className="text-lg text-gray-600 mb-1">{location}</p>
        <p className="text-lg text-gray-600 mb-1">{capacity}</p>
        <p className="text-lg text-gray-600 mb-4">{facilities}</p>
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
