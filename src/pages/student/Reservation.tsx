import { useState } from 'react';
import { DEPARTMENTS, Department } from '@/constants/department';
import { BUILDINGS, Building } from '@/constants/building';
import { Dropdown } from '@/components/feature/student/reservation/Dropdown';
import { SearchInput } from '@/components/feature/student/reservation/SearchInput';
import { ClassroomCard } from '@/components/feature/student/reservation/ClassroomCard';

import { useNavigate } from 'react-router-dom';

const Reservation = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building>('본관');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>(
    ''
  );
  const [selectedMajor, setSelectedMajor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleBuildingSelect = (building: Building) => {
    setSelectedBuilding(building);
  };

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    setSelectedMajor('');
  };

  const handleMajorSelect = (major: string) => {
    setSelectedMajor(major);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const navigate = useNavigate();

  const handleReservation = (classroomId: string) => {
    navigate(`/student/reservation/${classroomId}`);
  };

  return (
    <div className="max-w-7xl mx-auto ">
      <h1 className="text-4xl font-bold text-center mb-12">
        인문캠퍼스 공간 예약하기
      </h1>

      {/* 건물 선택 */}
      <div className="bg-white rounded-2xl p-3 shadow-md mb-8">
        <div className="flex flex-wrap ">
          {BUILDINGS.map((building) => (
            <button
              key={building}
              onClick={() => handleBuildingSelect(building)}
              className={`px-8 py-3 text-xl rounded-full transition-colors hover:text-myongji ${
                selectedBuilding === building
                  ? 'text-myongji font-bold'
                  : 'text-gray-600'
              }`}
            >
              {building}
            </button>
          ))}
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div className="flex gap-4">
          <Dropdown
            value={selectedDepartment}
            placeholder="대학/학부"
            options={Object.keys(DEPARTMENTS)}
            onChange={(value) => handleDepartmentSelect(value as Department)}
          />
          <Dropdown
            value={selectedMajor}
            placeholder="학과/전공"
            options={selectedDepartment ? DEPARTMENTS[selectedDepartment] : []}
            onChange={handleMajorSelect}
            disabled={!selectedDepartment}
          />
        </div>

        <div className="flex-grow" />
        <SearchInput
          value={searchQuery}
          onChange={handleSearch}
          placeholder="강의실 검색"
        />
      </div>

      {/* 강의실 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(9)
          .fill(null)
          .map((_, index) => (
            <ClassroomCard
              imageUrl="https://m.s1campus.co.kr:1543/comm/images/facility/b_lecture1.jpg"
              key={index}
              number={`${1350 + index}`}
              location={`${selectedBuilding} ${3 + Math.floor(index / 3)}층`}
              capacity={`${30 + index * 5}명`}
              facilities="빔프로젝터, 스크린, 화이트보드"
              onReserve={handleReservation}
            />
          ))}
      </div>

      <div className="mt-12 flex justify-center">
        <nav className="flex gap-4">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`px-6 py-3 text-lg rounded-lg ${
                page === 1
                  ? 'bg-myongji text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Reservation;
