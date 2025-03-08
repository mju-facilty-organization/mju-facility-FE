import { useState } from 'react';
import FacilityCreation from '@/components/feature/admin/facility/FacilityCreation';
import FacilityList from '@/components/feature/admin/facility/FacilityList';
import { useQueryClient } from '@tanstack/react-query';

const AdminFacilities = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const queryClient = useQueryClient();

  const handleFacilityCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['facilities'] });
    setActiveTab('list');
  };

  const handleCancel = () => {
    setActiveTab('list');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-myongji">시설 관리</h1>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-1 border-b-2 font-medium text-xl ${
                activeTab === 'list'
                  ? 'border-myongji text-myongji'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              시설 목록
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-xl ${
                activeTab === 'create'
                  ? 'border-myongji text-myongji'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              시설 생성
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'list' ? (
        <FacilityList />
      ) : (
        <FacilityCreation
          onCreated={handleFacilityCreated}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AdminFacilities;
