import { useState, useMemo } from 'react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateSuggestion } from '@/hooks/useSuggestion';
import { useAuthStore } from '@/store/useAuthStore';
import { useFacilityMapper } from '@/hooks/useFacilityMapper';
import { Facility } from '@/types/facility';
import { SuggestionPayload } from '@/types/suggestion';
import {
  DEPARTMENTS,
  DEPARTMENT_ENGLISH_TO_KOREAN,
  type College,
  type Department,
} from '@/constants/department';
import { FACILITY_TYPE_MAP } from '@/constants/building';

const CATEGORY_OPTIONS = [
  { value: 'NONE', label: '없어요' },
  { value: 'DIRTY', label: '더러워요' },
  { value: 'REQUEST', label: '해주세요' },
  { value: 'BROKEN', label: '안돼요' },
  { value: 'ETC', label: '기타' },
] as const;

const SuggestionCreate = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const createMutation = useCreateSuggestion();
  const { facilities, getFacilityId, isLoadingFacilities } =
    useFacilityMapper();

  const [formData, setFormData] = useState<SuggestionPayload>({
    category: '',
    facilityId: 1,
    title: '',
    content: '',
  });

  const [selectedCollege, setSelectedCollege] = useState<College | ''>('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>(
    ''
  );
  const [contentLength, setContentLength] = useState<number>(0);

  const collegeOptions = Object.keys(DEPARTMENTS).map((college) => ({
    value: college as College,
    label: college,
  }));

  const koreanToEnglishMap = useMemo(() => {
    const map: Record<Department, string> = {} as Record<Department, string>;
    Object.entries(DEPARTMENT_ENGLISH_TO_KOREAN).forEach(
      ([english, korean]) => {
        map[korean] = english;
      }
    );
    return map;
  }, []);

  const filteredFacilities = useMemo((): Facility[] => {
    if (!selectedDepartment || !facilities.length) return [];

    const englishDepartmentCode = koreanToEnglishMap[selectedDepartment];
    if (!englishDepartmentCode) return [];

    return facilities.filter((facility: Facility) =>
      facility.allowedBoundary?.includes(englishDepartmentCode)
    );
  }, [selectedDepartment, facilities, koreanToEnglishMap]);

  const handleInputChange = (
    field: keyof SuggestionPayload,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setContentLength(value.length);
      handleInputChange('content', value);
    }
  };

  const handleCollegeChange = (collegeValue: College | '') => {
    setSelectedCollege(collegeValue);
    setSelectedDepartment('');
    setFormData((prev) => ({ ...prev, facilityId: 1 }));
  };

  const handleDepartmentChange = (departmentValue: Department | '') => {
    setSelectedDepartment(departmentValue);
    setFormData((prev) => ({ ...prev, facilityId: 1 }));
  };

  const handleFacilityChange = (facilityNumber: string) => {
    const facilityId = getFacilityId(facilityNumber);
    handleInputChange('facilityId', facilityId);
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    if (!formData.category || !formData.title || !formData.content) {
      alert('분야, 제목, 내용은 필수 입력 항목입니다.');
      return;
    }

    try {
      const suggestionData: SuggestionPayload = {
        category: formData.category,
        facilityId: formData.facilityId,
        title: formData.title,
        content: formData.content,
      };

      await createMutation.mutateAsync(suggestionData);

      navigate('/suggestions');
    } catch (error) {
      console.error('건의사항 등록 실패:', error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div
        className="text-white p-8 rounded-lg mb-8"
        style={{ background: `linear-gradient(to right, #002e66, #003d80)` }}
      >
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleGoBack}
            className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
            disabled={createMutation.isPending}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold">건의함</h1>
        </div>
        <p className="text-blue-100">
          여러분의 소중한 의견을 들려주세요. 더 나은 대학을 만들어나가겠습니다.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              분야 선택 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('category', option.value)}
                  disabled={createMutation.isPending}
                  className={`p-3 border rounded-lg transition-colors text-center font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.category === option.value
                      ? 'text-white border-transparent'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                  style={
                    formData.category === option.value
                      ? { backgroundColor: '#002e66' }
                      : {}
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대학/학부
                </label>
                <select
                  value={selectedCollege}
                  onChange={(e) =>
                    handleCollegeChange(e.target.value as College)
                  }
                  disabled={createMutation.isPending}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  onFocus={(e) =>
                    (e.target.style.boxShadow = `0 0 0 2px rgba(0, 46, 102, 0.2)`)
                  }
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                >
                  <option value="">대학/학부 선택</option>
                  {collegeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  학과/전공
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) =>
                    handleDepartmentChange(e.target.value as Department)
                  }
                  disabled={createMutation.isPending || !selectedCollege}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  onFocus={(e) =>
                    (e.target.style.boxShadow = `0 0 0 2px rgba(0, 46, 102, 0.2)`)
                  }
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                >
                  <option value="">학과/전공 선택</option>
                  {selectedCollege &&
                    DEPARTMENTS[selectedCollege]?.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  강의실/장소
                </label>
                {isLoadingFacilities ? (
                  <div className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <LoaderCircle size={16} className="animate-spin" />
                      <span className="text-gray-500 text-sm">로딩중...</span>
                    </div>
                  </div>
                ) : (
                  <select
                    value={
                      formData.facilityId
                        ? filteredFacilities.find(
                            (f: Facility) => f.id === formData.facilityId
                          )?.facilityNumber || ''
                        : ''
                    }
                    onChange={(e) => handleFacilityChange(e.target.value)}
                    disabled={
                      createMutation.isPending ||
                      !selectedDepartment ||
                      filteredFacilities.length === 0
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    onFocus={(e) =>
                      (e.target.style.boxShadow = `0 0 0 2px rgba(0, 46, 102, 0.2)`)
                    }
                    onBlur={(e) => (e.target.style.boxShadow = 'none')}
                  >
                    <option value="">
                      {!selectedDepartment
                        ? '학과/전공 먼저 선택'
                        : filteredFacilities.length === 0
                        ? '이용 가능한 시설 없음'
                        : '강의실/장소 선택'}
                    </option>
                    {filteredFacilities.map((facility: Facility) => (
                      <option key={facility.id} value={facility.facilityNumber}>
                        {FACILITY_TYPE_MAP[facility.facilityType] ||
                          facility.facilityType}{' '}
                        {facility.facilityNumber}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {selectedDepartment &&
              filteredFacilities.length === 0 &&
              !isLoadingFacilities && (
                <p className="text-sm text-gray-500 mt-2">
                  선택한 학과/전공에서 이용할 수 있는 시설이 없습니다.
                </p>
              )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="간단하게 내용을 입력해주세요"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={createMutation.isPending}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              onFocus={(e) =>
                (e.target.style.boxShadow = `0 0 0 2px rgba(0, 46, 102, 0.2)`)
              }
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="구체적인 건의사항을 작성해주세요. 상세할수록 검토에 도움이 됩니다."
              value={formData.content}
              onChange={handleContentChange}
              disabled={createMutation.isPending}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              onFocus={(e) =>
                (e.target.style.boxShadow = `0 0 0 2px rgba(0, 46, 102, 0.2)`)
              }
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                최대 500자까지 입력 가능합니다.
              </p>
              <p className="text-sm text-gray-500">{contentLength}/500</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={
                createMutation.isPending ||
                !formData.category ||
                !formData.title ||
                !formData.content
              }
              className="px-8 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              style={{ backgroundColor: '#002e66' }}
            >
              {createMutation.isPending && (
                <LoaderCircle size={16} className="animate-spin" />
              )}
              {createMutation.isPending ? '등록 중...' : '건의사항 제출'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCreate;
