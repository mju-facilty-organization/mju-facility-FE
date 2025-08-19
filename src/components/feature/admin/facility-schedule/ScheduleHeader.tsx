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
    <div className="rounded-lg">
      <div className="max-w-7xl  px-6 py-4">
        <div className="flex items-center  gap-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-myongji">시설 스케줄</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-myongji" />
              <span className="text-lg font-semibold text-myongji">
                시설 선택
              </span>
              <select
                value={selectedFacilityId || ''}
                onChange={(e) => onFacilityChange(Number(e.target.value))}
                className="px-3 py-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 appearance-none shadow-sm transition-all duration-200 text-slate-700 font-medium text-sm"
              >
                <option value="">시설 선택</option>
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.facilityNumber}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onRefresh}
              disabled={loading || !selectedFacilityId}
              className="px-3 py-2 bg-white text-myongji rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-semibold text-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />
              새로고침
            </button>
          </div>

          {selectedFacility && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-myongji" />
                <span className="font-bold text-lg text-myongji">
                  {selectedFacility.facilityNumber}
                </span>
                {selectedFacility.facilityType && (
                  <span className="px-2 py-1 text-base bg-slate-100 text-slate-700 rounded-full font-semibold border border-slate-200">
                    {getFacilityTypeInKorean(selectedFacility.facilityType)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-myongji">
                <Clock className="w-4 h-4" />
                <span className="text-base font-medium">08:00-22:00</span>
              </div>
            </div>
          )}

          <ScheduleLegend />
        </div>

        {error && (
          <div className="mt-3 p-3 ">
            <div className="flex items-center">
              <div className="p-1 rounded-full mr-2">
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
