import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import FacilityCreation from '@/components/feature/admin/facility/FacilityCreation';
import FacilityExcelUpload from '@/components/feature/admin/facility/FacilityExcelUpload';

const AdminFacilityCreate = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'csv'>('single');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleFacilityCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['facilities'] });
    navigate('/admin/facilities');
  };

  const handleCancel = () => {
    navigate('/admin/facilities');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-myongji">시설 생성</h1>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('single')}
              className={`py-4 px-1 border-b-2 font-medium text-xl ${
                activeTab === 'single'
                  ? 'border-myongji text-myongji'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              개별 등록
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className={`py-4 px-1 border-b-2 font-medium text-xl ${
                activeTab === 'csv'
                  ? 'border-myongji text-myongji'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Excel 일괄 등록
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'single' ? (
        <FacilityCreation
          onCreated={handleFacilityCreated}
          onCancel={handleCancel}
        />
      ) : (
        <FacilityExcelUpload
          onCreated={handleFacilityCreated}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AdminFacilityCreate;
