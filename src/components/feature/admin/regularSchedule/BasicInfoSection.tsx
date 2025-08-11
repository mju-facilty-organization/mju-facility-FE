import { Building } from 'lucide-react';
import { BasicInfoSectionProps } from '@/types/RegularSchedule';

const BasicInfoSection = ({
  organization,
  setOrganization,
  formData,
  setFormData,
  facilities,
  isLoadingFacilities,
  scheduleTypes,
  createScheduleMutation,
}: BasicInfoSectionProps) => (
  <div className="bg-white rounded-lg border p-6 mb-6">
    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
      <Building className="w-5 h-5" />
      기본 정보 설정
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">조직</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="조직명을 입력하세요"
          disabled={createScheduleMutation.isPending}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">시설</label>
        <select
          className="w-full p-3 border rounded-lg"
          value={formData.facilityId}
          onChange={(e) =>
            setFormData({ ...formData, facilityId: e.target.value })
          }
          disabled={isLoadingFacilities || createScheduleMutation.isPending}
        >
          <option value="">시설을 선택하세요</option>
          {facilities.map((facility) => (
            <option key={facility.id} value={facility.id}>
              {facility.facilityNumber}
            </option>
          ))}
        </select>
        {isLoadingFacilities && (
          <p className="text-sm text-gray-500 mt-1">
            시설 정보를 불러오는 중...
          </p>
        )}
        {facilities.length === 0 && !isLoadingFacilities && (
          <p className="text-sm text-red-500 mt-1">
            사용 가능한 시설이 없습니다.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">용도</label>
        <select
          className="w-full p-3 border rounded-lg"
          value={formData.scheduleType}
          onChange={(e) =>
            setFormData({ ...formData, scheduleType: e.target.value })
          }
          disabled={createScheduleMutation.isPending}
        >
          {scheduleTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

export default BasicInfoSection;
