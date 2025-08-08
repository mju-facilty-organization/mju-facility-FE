import { useNavigate } from 'react-router-dom';
import FacilityList from '@/components/feature/admin/facility/FacilityList';

const AdminFacilities = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-myongji">시설 목록</h1>
        <button
          onClick={() => navigate('/admin/facilities/create')}
          className="bg-myongji text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
        >
          시설 생성
        </button>
      </div>
      <FacilityList />
    </div>
  );
};

export default AdminFacilities;
