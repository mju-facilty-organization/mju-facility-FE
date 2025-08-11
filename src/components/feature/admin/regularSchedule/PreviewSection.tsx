import { PreviewSectionProps } from '@/types/RegularSchedule';

const PreviewSection = ({
  organization,
  formData,

  getFacilityById,
  error,
  scheduleTypes,
  dayOrder,
  dayNames,
  getTimeRanges,
}: PreviewSectionProps) => {
  const selectedFacility = getFacilityById(parseInt(formData.facilityId));

  return (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">설정 미리보기</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            {error.message || '정기 스케줄 생성에 실패했습니다.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">기본 정보</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">조직:</span>{' '}
              {organization || '미입력'}
            </div>
            <div>
              <span className="font-medium">시설:</span>{' '}
              {selectedFacility?.name}{' '}
              {selectedFacility && `(${selectedFacility.facilityNumber})`}
            </div>
            <div>
              <span className="font-medium">용도:</span>{' '}
              {
                scheduleTypes.find((t) => t.value === formData.scheduleType)
                  ?.label
              }
            </div>
            <div>
              <span className="font-medium">기간:</span>{' '}
              {formData.validStartDate} ~ {formData.validEndDate}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-blue-800">선택된 시간대</h3>
          <div className="space-y-2 text-sm">
            {dayOrder.map((day) => {
              const ranges = getTimeRanges(day);
              if (ranges.length === 0) return null;

              return (
                <div key={day} className="text-blue-700">
                  <span className="font-medium">{dayNames[day]}요일:</span>
                  <span className="ml-2">{ranges.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewSection;
