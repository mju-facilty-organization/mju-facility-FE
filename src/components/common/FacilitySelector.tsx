import { useState, useEffect } from 'react';
import { Building2, MapPin } from 'lucide-react';
import { getFacilityTypeInKorean } from '@/utils/schedule';
import { Facility } from '@/types/facility';

type FacilitySelectorProps = {
  facilities: Facility[];
  selectedFacilityId: number | string | null;
  onFacilityChange: (id: number | string) => void;
  disabled?: boolean;
  loading?: boolean;
  showTypeLabel?: boolean;
  showFacilityLabel?: boolean;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  placeholder?: {
    type?: string;
    facility?: string;
  };
};

const FacilitySelector = ({
  facilities,
  selectedFacilityId,
  onFacilityChange,
  disabled = false,
  loading = false,
  showTypeLabel = true,
  showFacilityLabel = true,
  className = '',
  layout = 'horizontal',
  placeholder = {
    type: '건물 선택',
    facility: '시설 선택',
  },
}: FacilitySelectorProps) => {
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('');

  const facilityTypes = Array.from(
    new Set(facilities.map((f) => f.facilityType).filter(Boolean))
  );

  const filteredFacilities = selectedFacilityType
    ? facilities.filter((f) => f.facilityType === selectedFacilityType)
    : [];

  useEffect(() => {
    if (selectedFacilityId) {
      const selectedFacility = facilities.find(
        (f) =>
          f.id === Number(selectedFacilityId) || f.id === selectedFacilityId
      );
      if (selectedFacility && selectedFacility.facilityType) {
        setSelectedFacilityType(selectedFacility.facilityType);
      }
    }
  }, [selectedFacilityId, facilities]);

  const handleFacilityTypeChange = (type: string) => {
    setSelectedFacilityType(type);

    const currentFacility = facilities.find(
      (f) => f.id === Number(selectedFacilityId) || f.id === selectedFacilityId
    );
    if (currentFacility && currentFacility.facilityType !== type) {
      onFacilityChange('');
    }
  };

  const selectClass = `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-myongji/20 focus:border-myongji text-base font-medium text-gray-700 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
    loading ? 'animate-pulse' : ''
  }`;

  if (layout === 'horizontal' && !showTypeLabel && !showFacilityLabel) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
          <MapPin className="w-4 h-4 text-myongji" />
          <span className="text-base font-medium text-gray-700 whitespace-nowrap">
            건물
          </span>
          <select
            value={selectedFacilityType}
            onChange={(e) => handleFacilityTypeChange(e.target.value)}
            disabled={disabled || loading}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-myongji/20 focus:border-myongji text-base font-medium text-gray-700 shadow-sm transition-all duration-200 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">{placeholder.type}</option>
            {facilityTypes.map((type) => (
              <option key={type} value={type}>
                {getFacilityTypeInKorean(type)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
          <Building2 className="w-4 h-4 text-myongji" />
          <span className="text-base font-medium text-gray-700 whitespace-nowrap">
            시설 선택
          </span>
          <select
            value={selectedFacilityId || ''}
            onChange={(e) => onFacilityChange(e.target.value)}
            disabled={disabled || loading || !selectedFacilityType}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-myongji/20 focus:border-myongji text-base font-medium text-gray-700 shadow-sm transition-all duration-200 min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">{placeholder.facility}</option>
            {filteredFacilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.facilityNumber}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  const containerClass =
    layout === 'vertical' ? 'flex flex-col gap-4' : 'flex items-center gap-4';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className={layout === 'vertical' ? 'w-full' : 'flex-1'}>
        {showTypeLabel && (
          <label className="block text-sm font-medium mb-2">건물</label>
        )}
        <select
          value={selectedFacilityType}
          onChange={(e) => handleFacilityTypeChange(e.target.value)}
          disabled={disabled || loading}
          className={selectClass}
        >
          <option value="">{placeholder.type}</option>
          {facilityTypes.map((type) => (
            <option key={type} value={type}>
              {getFacilityTypeInKorean(type)}
            </option>
          ))}
        </select>
      </div>

      <div className={layout === 'vertical' ? 'w-full' : 'flex-1'}>
        {showFacilityLabel && (
          <label className="block text-sm font-medium mb-2">시설</label>
        )}
        <select
          value={selectedFacilityId || ''}
          onChange={(e) => onFacilityChange(e.target.value)}
          disabled={disabled || loading || !selectedFacilityType}
          className={selectClass}
        >
          <option value="">{placeholder.facility}</option>
          {filteredFacilities.map((facility) => (
            <option key={facility.id} value={facility.id}>
              {facility.facilityNumber}
            </option>
          ))}
        </select>
        {loading && (
          <p className="text-sm text-gray-500 mt-1">
            시설 정보를 불러오는 중...
          </p>
        )}
        {facilities.length === 0 && !loading && (
          <p className="text-sm text-red-500 mt-1">
            사용 가능한 시설이 없습니다.
          </p>
        )}
        {selectedFacilityType &&
          filteredFacilities.length === 0 &&
          facilities.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              해당 타입의 시설이 없습니다.
            </p>
          )}
      </div>
    </div>
  );
};

export default FacilitySelector;
