import React, { useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { BUILDINGS } from '@/constants/building';
import { DEPARTMENTS, College, Department } from '@/constants/department';
import { useCreateFacility } from '@/hooks/useFacility';
import { Facility } from '@/types/facility';

type FacilityCreationProps = {
  onCreated?: () => void;
  onCancel?: () => void;
};

type FacilityFormData = Omit<
  Facility,
  'capacity' | 'isAvailable' | 'allowedBoundary'
> & {
  capacity: string;
  isAvailable: boolean;
  allowedBoundary: Department[];
};

const FacilityCreation: React.FC<FacilityCreationProps> = ({
  onCreated,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FacilityFormData>({
    mode: 'onChange',
  });

  const createFacilityMutation = useCreateFacility();

  const selectedCollege = watch('college');

  const [files, setFiles] = React.useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = React.useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedCollege) {
      setValue('allowedBoundary', []);
    }
  }, [selectedCollege, setValue]);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      const validFiles = selectedFiles.filter((file) => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name}: 이미지 파일만 업로드 가능합니다.`);
          return false;
        }

        return true;
      });

      if (validFiles.length === 0) return;

      const newPreviewUrls = validFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      setFilePreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(filePreviewUrls[index]);

    const newFiles = [...files];
    const newPreviewUrls = [...filePreviewUrls];

    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setFiles(newFiles);
    setFilePreviewUrls(newPreviewUrls);
  };

  const handleDepartmentChange = (department: Department) => {
    const currentDepartments = watch('allowedBoundary') || [];

    const updatedDepartments = currentDepartments.includes(department)
      ? currentDepartments.filter((item) => item !== department)
      : [...currentDepartments, department];

    setValue('allowedBoundary', updatedDepartments, { shouldValidate: true });
  };

  const handleSupportFacilityChange = (facility: string) => {
    const currentFacilities = watch('supportFacilities') || [];

    const updatedFacilities = currentFacilities.includes(facility)
      ? currentFacilities.filter((item) => item !== facility)
      : [...currentFacilities, facility];

    setValue('supportFacilities', updatedFacilities);
  };

  const onSubmit = async (data: FacilityFormData) => {
    if (files.length === 0) {
      toast.error('최소 1개 이상의 시설 이미지가 필요합니다.');
      return;
    }

    try {
      data.fileNames = files.map((file) => file.name);

      const facilityData: Facility = {
        ...data,
        capacity: parseInt(data.capacity),
        isAvailable: String(data.isAvailable || false),
        allowedBoundary: data.allowedBoundary || [],
        supportFacilities: data.supportFacilities || [],
      };

      const result = await createFacilityMutation.mutateAsync({
        facilityData,
        files,
      });

      if (result.resultType === 'SUCCESS') {
        toast.success('시설이 성공적으로 생성되었습니다.');
        resetForm();

        if (onCreated) {
          onCreated();
        }
      } else {
        toast.error(
          `시설 생성에 실패했습니다: ${result.message || '알 수 없는 오류'}`
        );
      }
    } catch (error) {
      toast.error(
        `시설 생성 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`
      );
    }
  };

  const resetForm = () => {
    reset({});

    filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setFilePreviewUrls([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  useEffect(() => {
    return () => {
      filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviewUrls]);

  const validateTimeRange = () => {
    const startTime = watch('startTime');
    const endTime = watch('endTime');

    if (!startTime || !endTime) return true;

    return (
      startTime < endTime || '시작 시간은 종료 시간보다 이전이어야 합니다.'
    );
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-myongji">시설 생성</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="facilityType"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              시설 유형 <span className="text-red-500">*</span>
            </label>
            <select
              id="facilityType"
              {...register('facilityType', {
                required: '시설 유형을 선택해주세요.',
              })}
              className={`w-full px-4 py-3 text-lg border ${
                errors.facilityType ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-myongji`}
            >
              <option value="">선택하세요</option>
              {BUILDINGS.map((building) => (
                <option key={building} value={building}>
                  {building}
                </option>
              ))}
            </select>
            {errors.facilityType && (
              <p className="mt-2 text-base text-red-500">
                {errors.facilityType.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="facilityNumber"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              시설 번호
            </label>
            <input
              type="text"
              id="facilityNumber"
              placeholder="예: 1350 (선택사항)"
              {...register('facilityNumber')}
              className={`w-full px-4 py-3 text-lg border ${
                errors.facilityNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-myongji`}
            />
            {errors.facilityNumber && (
              <p className="mt-2 text-base text-red-500">
                {errors.facilityNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label
              htmlFor="capacity"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              수용 인원 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="capacity"
              placeholder="예: 40"
              min="1"
              {...register('capacity', {
                required: '수용 인원을 입력해주세요.',
                min: { value: 1, message: '유효한 수용 인원을 입력해주세요.' },
                validate: {
                  positive: (value) =>
                    parseInt(value) > 0 || '유효한 수용 인원을 입력해주세요.',
                },
              })}
              className={`w-full px-4 py-3 text-lg border ${
                errors.capacity ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-myongji`}
            />
            {errors.capacity && (
              <p className="mt-2 text-base text-red-500">
                {errors.capacity.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="startTime"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              시작 시간 <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="startTime"
              defaultValue="11:00"
              {...register('startTime', {
                required: '시작 시간을 설정해주세요.',
                validate: validateTimeRange,
              })}
              className={`w-full px-4 py-3 text-lg border ${
                errors.startTime ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-myongji`}
            />
            {errors.startTime && (
              <p className="mt-2 text-base text-red-500">
                {errors.startTime.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              종료 시간 <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="endTime"
              defaultValue="17:00"
              {...register('endTime', {
                required: '종료 시간을 설정해주세요.',
                validate: validateTimeRange,
              })}
              className={`w-full px-4 py-3 text-lg border ${
                errors.endTime ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-myongji`}
            />
            {errors.endTime && (
              <p className="mt-2 text-base text-red-500">
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label
              htmlFor="college"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              단과대학 <span className="text-red-500">*</span>
            </label>
            <select
              id="college"
              {...register('college', { required: '단과대학을 선택해주세요.' })}
              className={`w-full px-4 py-3 text-lg border ${
                errors.college ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-myongji`}
            >
              <option value="">선택하세요</option>
              {Object.keys(DEPARTMENTS).map((collegeName) => (
                <option key={collegeName} value={collegeName}>
                  {collegeName}
                </option>
              ))}
            </select>
            {errors.college && (
              <p className="mt-2 text-base text-red-500">
                {errors.college.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              이용 범위 <span className="text-red-500">*</span>
            </label>
            <div
              className={`max-h-64 overflow-y-auto border ${
                errors.allowedBoundary ? 'border-red-500' : 'border-gray-300'
              } rounded-md p-4`}
            >
              {selectedCollege ? (
                <div className="grid grid-cols-2 gap-3">
                  {DEPARTMENTS[selectedCollege as College]?.map(
                    (department) => (
                      <label
                        key={department}
                        className="inline-flex items-center"
                      >
                        <input
                          type="checkbox"
                          checked={(watch('allowedBoundary') || []).includes(
                            department
                          )}
                          onChange={() => handleDepartmentChange(department)}
                          className="form-checkbox h-5 w-5 text-myongji rounded focus:ring-myongji"
                        />
                        <span className="ml-2 text-base">{department}</span>
                      </label>
                    )
                  )}
                </div>
              ) : (
                <p className="text-base text-gray-500">
                  단과대학을 먼저 선택하세요.
                </p>
              )}
            </div>

            <input
              type="hidden"
              {...register('allowedBoundary', {
                validate: (value) =>
                  (value || []).length > 0 ||
                  '최소 하나 이상의 학과를 선택해주세요.',
              })}
            />
            {errors.allowedBoundary && (
              <p className="mt-2 text-base text-red-500">
                {errors.allowedBoundary.message}
              </p>
            )}
            {(watch('allowedBoundary') || []).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {(watch('allowedBoundary') || []).map((dept) => (
                  <span
                    key={dept}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            지원 시설
          </label>
          <div className="flex flex-wrap gap-6">
            {['마이크', 'TV', '프로젝터', '컴퓨터', '화이트보드'].map(
              (facility) => (
                <label key={facility} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={(watch('supportFacilities') || []).includes(
                      facility
                    )}
                    onChange={() => handleSupportFacilityChange(facility)}
                    className="form-checkbox h-6 w-6 text-myongji rounded focus:ring-myongji"
                  />
                  <span className="ml-2 text-lg">{facility}</span>
                </label>
              )
            )}
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            사용 가능 여부
          </label>
          <div className="flex space-x-8">
            <Controller
              name="isAvailable"
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                      className="form-radio h-6 w-6 text-myongji focus:ring-myongji"
                    />
                    <span className="ml-2 text-lg">사용 가능</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                      className="form-radio h-6 w-6 text-myongji focus:ring-myongji"
                    />
                    <span className="ml-2 text-lg">사용 불가</span>
                  </label>
                </>
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            시설 이미지 <span className="text-red-500">*</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleFileButtonClick}
            className="w-full py-3 px-4 text-lg border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-myongji"
          >
            이미지 추가 ({files.length}개 선택됨)
          </button>

          {files.length === 0 && (
            <p className="mt-2 text-base text-red-500">
              최소 1개 이상의 시설 이미지가 필요합니다.
            </p>
          )}

          {filePreviewUrls.length > 0 && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {filePreviewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`미리보기 ${index + 1}`}
                    className="h-32 w-full object-cover rounded-md transition-all duration-200 group-hover:opacity-75"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 text-center">
                    {index + 1}번사진
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-xl"
                    aria-label={`이미지 ${index + 1} 삭제`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-10">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 mr-4 text-lg bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            disabled={isSubmitting || createFacilityMutation.isPending}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-3 text-lg bg-myongji text-white rounded-md hover:bg-myongji-dark focus:outline-none focus:ring-2 focus:ring-myongji transition-colors"
            disabled={isSubmitting || createFacilityMutation.isPending}
          >
            {isSubmitting || createFacilityMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 mr-3 border-b-2 border-white"></div>
                <span>처리 중...</span>
              </div>
            ) : (
              '시설 생성'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacilityCreation;
