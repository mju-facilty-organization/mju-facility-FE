import { Calendar } from 'lucide-react';
import { RecurringSettingsSectionProps } from '@/types/RegularSchedule';

const RecurringSettingsSection = ({
  formData,
  handleFormDataChange,
  isPending,
}: RecurringSettingsSectionProps) => (
  <div className="bg-white rounded-lg border p-6 mb-6">
    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
      <Calendar className="w-5 h-5" />
      유효 기간 설정
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-sm text-gray-600">시작일</label>
        <input
          type="date"
          value={formData.validStartDate}
          onChange={(e) =>
            handleFormDataChange({
              ...formData,
              validStartDate: e.target.value,
            })
          }
          disabled={isPending}
          className="w-full p-3 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label className="text-sm text-gray-600">종료일</label>
        <input
          type="date"
          value={formData.validEndDate}
          onChange={(e) =>
            handleFormDataChange({
              ...formData,
              validEndDate: e.target.value,
            })
          }
          disabled={isPending}
          className="w-full p-3 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  </div>
);

export default RecurringSettingsSection;
