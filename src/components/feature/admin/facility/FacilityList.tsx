import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { DEPARTMENT_ENGLISH_TO_KOREAN } from '@/constants/department';
import { FACILITY_TYPE_MAP } from '@/constants/building';
import Pagination from '@/components/common/Pagination';
import { useFacilities, useDeleteFacility } from '@/hooks/useFacility';
import { Facility } from '@/types/facility';

const FacilityList = () => {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleEdit = (facilityId: number) => {
    navigate(`/admin/facilities/${facilityId}/edit`);
  };
  const { data, isLoading } = useFacilities(page);
  const deleteFacilityMutation = useDeleteFacility();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewInUseStudents = (facilityId: number) => {
    navigate(`/admin/facilities/${facilityId}/in-use`);
  };

  const handleDeleteConfirm = (facilityId: number) => {
    setDeleteConfirmId(facilityId);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteFacilityMutation.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
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
                  건물
                </th>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500">
                  강의실
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
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500">
                  현재 이용 현황
                </th>
                <th className="px-6 py-3 text-center text-lg font-medium text-gray-500 w-24"></th>
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
                    {facility.supportFacilities
                      ? facility.supportFacilities.join(', ')
                      : ''}
                  </td>
                  <td className="px-6 py-4 text-lg">
                    <button
                      onClick={() => handleViewInUseStudents(facility.id)}
                      className="bg-myongji text-white px-3 py-1 rounded hover:bg-blue-800 text-base"
                    >
                      이용현황
                    </button>
                  </td>
                  <td className="px-6 py-4 text-lg">
                    <div className="flex justify-center space-x-1">
                      <button
                        onClick={() => handleEdit(facility.id)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
                        title="수정"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(facility.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              시설 삭제 확인
            </h3>
            <p className="text-gray-600 mb-6">
              정말로 이 시설을 삭제하시겠습니까?
              <br />
              삭제된 시설은 복구할 수 없습니다.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                disabled={deleteFacilityMutation.isPending}
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                disabled={deleteFacilityMutation.isPending}
              >
                {deleteFacilityMutation.isPending ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityList;
