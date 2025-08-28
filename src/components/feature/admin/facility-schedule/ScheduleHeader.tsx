import { MapPin, RefreshCw, Building2, Clock, AlertCircle } from 'lucide-react';
import ScheduleLegend from './ScheduleLegend';
import { getFacilityTypeInKorean } from '@/utils/schedule';
import { Facility } from '@/types/facility';

type ScheduleHeaderProps = {
  facilities: Facility[];
  selectedFacilityId: number | null;
  onFacilityChange: (id: number) => void;
  onRefresh: () => void;
  loading: boolean;
  error: string | null;
  selectedFacility: Facility | null;
};

const ScheduleHeader = ({
  facilities,
  selectedFacilityId,
  onFacilityChange,
  onRefresh,
  loading,
  error,
  selectedFacility,
}: ScheduleHeaderProps) => {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-lg">
      <div className=" mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-myongji rounded-full"></div>
              <h1 className="text-3xl font-bold text-gray-900">시설 스케줄</h1>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <MapPin className="w-4 h-4 text-myongji" />
              <span className="text-base font-medium text-gray-700">
                시설 선택
              </span>
              <select
                value={selectedFacilityId || ''}
                onChange={(e) => onFacilityChange(Number(e.target.value))}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-myongji/20 focus:border-myongji text-base font-medium text-gray-700 shadow-sm transition-all duration-200 min-w-[160px]"
              >
                <option value="">시설 선택</option>
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.facilityNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading || !selectedFacilityId}
            className="px-3 py-2 bg-myongji hover:bg-myongji/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 font-medium text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        {selectedFacility && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-myongji/5 px-3 py-2 rounded-lg border border-myongji/10">
                <Building2 className="w-4 h-4 text-myongji" />
                <span className="font-bold text-lg text-myongji">
                  {selectedFacility.facilityNumber}
                </span>
                {selectedFacility.facilityType && (
                  <span className="px-2 py-1 text-xs bg-myongji/10 text-myongji rounded-full font-medium border border-myongji/20">
                    {getFacilityTypeInKorean(selectedFacility.facilityType)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">운영시간</span>
                <span className="text-sm font-bold text-gray-800">
                  08:00 - 22:00
                </span>
              </div>
            </div>

            <ScheduleLegend />
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleHeader;
