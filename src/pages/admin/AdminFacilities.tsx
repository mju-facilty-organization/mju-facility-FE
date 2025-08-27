import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FacilityList from '@/components/feature/admin/facility/FacilityList';
import { deleteAllFacilities } from '@/api/facility';

const AdminFacilities = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllFacilities,
    onSuccess: () => {
      alert('모든 시설이 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
    onError: () => {
      alert('시설 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
  });

  const handleDeleteAll = () => {
    if (
      !window.confirm(
        '정말로 모든 시설을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
      )
    ) {
      return;
    }
    deleteAllMutation.mutate();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-myongji">시설 목록</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/facilities/create')}
            className="bg-myongji text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
          >
            시설 생성
          </button>
          <button
            onClick={handleDeleteAll}
            disabled={deleteAllMutation.isPending}
            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            {deleteAllMutation.isPending ? '삭제 중...' : '전체 삭제'}
          </button>
        </div>
      </div>
      <FacilityList />
    </div>
  );
};

export default AdminFacilities;
