import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { DEPARTMENT_ENGLISH_TO_KOREAN } from '@/constants/department';
import { FACILITY_TYPE_MAP } from '@/constants/building';
import Pagination from '@/components/common/Pagination';
import { useFacilities } from '@/hooks/useFacility';
import { Facility } from '@/types/facility';

const FacilityList = () => {
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useFacilities(page);

  if (isError) {
    toast.error('시설 목록을 불러오는데 실패했습니다.');
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const facilities = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-myongji"></div>
        </div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">등록된 시설이 없습니다.</p>
        </div>
      ) : (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500">
                  시설 유형
                </th>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500">
                  시설 번호
                </th>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500">
                  수용 인원
                </th>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500">
                  이용 범위
                </th>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500">
                  지원 시설
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {facilities.map((facility: Facility) => (
                <tr key={facility.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-lg text-gray-custom">
                    {FACILITY_TYPE_MAP[facility.facilityType] ||
                      facility.facilityType}
                  </td>
                  <td className="px-6 py-4 text-lg text-gray-custom">
                    {facility.facilityNumber}
                  </td>
                  <td className="px-6 py-4 text-lg text-gray-custom">
                    {facility.capacity}명
                  </td>
                  <td className="px-6 py-4 text-lg text-gray-custom">
                    {facility.allowedBoundary
                      .map(
                        (dept: string) =>
                          DEPARTMENT_ENGLISH_TO_KOREAN[dept] || dept
                      )
                      .join(', ')}
                  </td>
                  <td className="px-6 py-4 text-lg text-gray-custom">
                    {facility.supportFacilities.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FacilityList;
