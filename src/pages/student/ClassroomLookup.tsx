import { useState, useEffect, useMemo } from 'react';
import {
  DEPARTMENTS,
  DEPARTMENT_ENGLISH_TO_KOREAN,
} from '@/constants/department';
import { BUILDINGS } from '@/constants/building';
import { ClassroomCard } from '@/components/feature/student/classroom-lookup/ClassroomCard';
import { Dropdown } from '@/components/feature/student/classroom-lookup/Dropdown';
import { SearchInput } from '@/components/feature/student/classroom-lookup/SearchInput';
import { useNavigate } from 'react-router-dom';

import { useFacilities } from '@/hooks/useFacility';
import Pagination from '@/components/common/Pagination';
import { Facility } from '@/types/facility';
import { School } from 'lucide-react';

const PAGE_SIZE = 9;

const KOREAN_TO_ENGLISH_DEPARTMENT: Record<string, string> = Object.entries(
  DEPARTMENT_ENGLISH_TO_KOREAN
).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

const ClassroomLookup = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('본관');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const { data, isLoading, isError } = useFacilities(
    currentPage,
    PAGE_SIZE,
    selectedBuilding
  );

  const facilities = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility: Facility) => {
      if (selectedDepartment && selectedMajor) {
        const majorCode = KOREAN_TO_ENGLISH_DEPARTMENT[selectedMajor];
        if (
          !majorCode ||
          !facility.allowedBoundary ||
          !facility.allowedBoundary.includes(majorCode)
        ) {
          return false;
        }
      }

      if (searchQuery && !facility.facilityNumber.includes(searchQuery)) {
        return false;
      }

      return true;
    });
  }, [facilities, selectedDepartment, selectedMajor, searchQuery]);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedDepartment, selectedMajor, searchQuery, selectedBuilding]);

  const handleBuildingSelect = (building: string) => {
    setSelectedBuilding(building);
  };

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    setSelectedMajor('');
  };

  const handleMajorSelect = (major: string) => {
    setSelectedMajor(major);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReservation = (id: number | string) => {
    navigate(`/reservation/${id}`);
  };

  const handleImageError = (facilityId: number | string) => {
    setFailedImages((prev) => ({
      ...prev,
      [facilityId.toString()]: true,
    }));
  };

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <p className="text-lg text-red-600 mb-4">
          시설 목록을 불러오는데 실패했습니다.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-myongji text-white rounded-md hover:bg-opacity-90"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">
        인문캠퍼스 공간 예약하기
      </h1>

      <div className="bg-white rounded-2xl p-3 shadow-md mb-8">
        <div className="flex flex-wrap">
          {BUILDINGS.map((building) => (
            <button
              key={building}
              onClick={() => handleBuildingSelect(building)}
              className={`px-8 py-3 text-xl rounded-full transition-colors hover:text-myongji ${
                selectedBuilding === building
                  ? 'text-myongji font-bold'
                  : 'text-gray-600'
              }`}
              aria-pressed={selectedBuilding === building}
            >
              {building}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-6 mb-8">
        <div className="flex gap-4">
          <Dropdown
            value={selectedDepartment}
            placeholder="대학/학부"
            options={Object.keys(DEPARTMENTS)}
            onChange={(value) => handleDepartmentSelect(value)}
          />
          <Dropdown
            value={selectedMajor}
            placeholder="학과/전공"
            options={
              selectedDepartment
                ? DEPARTMENTS[selectedDepartment as keyof typeof DEPARTMENTS]
                : []
            }
            onChange={handleMajorSelect}
            disabled={!selectedDepartment}
          />
        </div>

        <div />
        <SearchInput
          value={searchQuery}
          onChange={handleSearch}
          placeholder="강의실 검색"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-myongji"></div>
        </div>
      ) : filteredFacilities.length === 0 ? (
        <div className="col-span-3 text-center py-12 text-gray-500">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFacilities.map((facility: Facility) => {
            const facilityId =
              facility.id?.toString() || facility.facilityNumber;
            const imageLoadFailed = failedImages[facilityId];

            return (
              <ClassroomCard
                key={facility.id}
                imageContent={
                  facility.images &&
                  facility.images.length > 0 &&
                  !imageLoadFailed ? (
                    <img
                      src={facility.images[0]}
                      alt="강의실"
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(facilityId)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <School size={48} className="text-gray-400" />
                    </div>
                  )
                }
                facility={facility}
                onReserve={handleReservation}
              />
            );
          })}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ClassroomLookup;
