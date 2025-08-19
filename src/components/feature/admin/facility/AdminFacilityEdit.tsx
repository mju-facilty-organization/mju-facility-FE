import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useUpdateFacility } from '@/hooks/useFacility';
import {
  DEPARTMENT_ENGLISH_TO_KOREAN,
  DEPARTMENTS,
  College,
  Department,
} from '@/constants/department';
import { BUILDINGS } from '@/constants/building';
import { Facility } from '@/types/facility';

type FacilityEditFormData = {
  facilityType: string;
  facilityNumber: string;
  supportFacilities: string[];
  startTime: string;
  endTime: string;
  capacity: number;
  isAvailable: boolean;
  college: College;
  allowedBoundary: Department[];
  addFileNames: string[];
  removeKeys: string[];
  newOrder: string[];
  hardDelete: boolean;
};

const FacilityEditForm = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const updateFacilityMutation = useUpdateFacility();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FacilityEditFormData>({
    mode: 'onChange',
    defaultValues: {
      facilityType: '',
      facilityNumber: '',
      supportFacilities: [],
      startTime: '',
      endTime: '',
      capacity: 0,
      isAvailable: true,
      allowedBoundary: [],
      addFileNames: [],
      removeKeys: [],
      newOrder: [],
      hardDelete: false,
    },
  });

  const selectedCollege = useWatch({ control, name: 'college' });
  const allowedBoundary = useWatch({
    control,
    name: 'allowedBoundary',
    defaultValue: [],
  });
  const supportFacilities = useWatch({
    control,
    name: 'supportFacilities',
    defaultValue: [],
  });
  const addFileNames = useWatch({
    control,
    name: 'addFileNames',
    defaultValue: [],
  });
  const removeKeys = useWatch({
    control,
    name: 'removeKeys',
    defaultValue: [],
  });
  const startTime = useWatch({ control, name: 'startTime' });
  const endTime = useWatch({ control, name: 'endTime' });

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedCollege) {
      setValue('allowedBoundary', []);
    }
  }, [selectedCollege, setValue]);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);
    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name}: 이미지 파일만 업로드 가능합니다.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));

    setNewFiles((prev) => [...prev, ...validFiles]);
    setFilePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setValue('addFileNames', [
      ...addFileNames,
      ...validFiles.map((f) => f.name),
    ]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveExistingFile = (index: number) => {
    const fileToRemove = existingFiles[index];
    setValue('removeKeys', [...removeKeys, fileToRemove]);
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewFile = (index: number) => {
    URL.revokeObjectURL(filePreviewUrls[index]);

    const updatedFiles = newFiles.filter((_, i) => i !== index);
    const updatedUrls = filePreviewUrls.filter((_, i) => i !== index);
    const updatedFileNames = addFileNames.filter((_, i) => i !== index);

    setNewFiles(updatedFiles);
    setFilePreviewUrls(updatedUrls);
    setValue('addFileNames', updatedFileNames);
  };

  const handleDepartmentChange = (department: Department) => {
    const updatedDepartments = allowedBoundary.includes(department)
      ? allowedBoundary.filter((item) => item !== department)
      : [...allowedBoundary, department];

    setValue('allowedBoundary', updatedDepartments, { shouldValidate: true });
  };

  const handleSupportFacilityChange = (facility: string) => {
    const updatedFacilities = supportFacilities.includes(facility)
      ? supportFacilities.filter((item) => item !== facility)
      : [...supportFacilities, facility];

    setValue('supportFacilities', updatedFacilities);
  };

  const onSubmit = async (data: FacilityEditFormData) => {
    try {
      const allowedBoundaryInEnglish = data.allowedBoundary.map((dept) => {
        return (
          Object.keys(DEPARTMENT_ENGLISH_TO_KOREAN).find(
            (key) => DEPARTMENT_ENGLISH_TO_KOREAN[key] === dept
          ) || dept
        );
      });

      const facilityData: Facility = {
        ...data,
        allowedBoundary: allowedBoundaryInEnglish,
      };

      await updateFacilityMutation.mutateAsync({
        facilityId: Number(facilityId),
        facilityData,
        newFiles: newFiles.length > 0 ? newFiles : undefined,
      });

      toast.success('시설이 성공적으로 수정되었습니다.');
      navigate('/admin/facilities');
    } catch (error: any) {
      console.error('시설 수정 오류:', error);

      if (error?.status === 409) {
        toast.error('이미 사용 중인 시설 번호입니다.');
      } else if (error?.status === 400) {
        toast.error('입력 정보를 확인해주세요.');
      } else {
        toast.error('시설 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const validateTimeRange = () => {
    if (!startTime || !endTime) return true;
    return (
      startTime < endTime || '시작 시간은 종료 시간보다 이전이어야 합니다.'
    );
  };

  useEffect(() => {
    return () => {
      filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviewUrls]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-myongji">시설 수정</h2>

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
              aria-describedby={
                errors.facilityType ? 'facilityType-error' : undefined
              }
            >
              <option value="">선택하세요</option>
              {BUILDINGS.map((building) => (
                <option key={building} value={building}>
                  {building}
                </option>
              ))}
            </select>
            {errors.facilityType && (
              <p
                id="facilityType-error"
                className="mt-2 text-base text-red-500"
                role="alert"
              >
                {errors.facilityType.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="facilityNumber"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              시설 번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="facilityNumber"
              placeholder="예: S1350"
              {...register('facilityNumber', {
                required: '시설 번호를 입력해주세요.',
              })}
              className={`w-full px-4 py-3 text-lg border ${
                errors.facilityNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-myongji`}
              aria-describedby={
                errors.facilityNumber ? 'facilityNumber-error' : undefined
              }
            />
            {errors.facilityNumber && (
              <p
                id="facilityNumber-error"
                className="mt-2 text-base text-red-500"
                role="alert"
              >
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
              max="1000"
              {...register('capacity', {
                required: '수용 인원을 입력해주세요.',
                min: {
                  value: 1,
                  message: '수용 인원은 1명 이상이어야 합니다.',
                },
                max: {
                  value: 1000,
                  message: '수용 인원은 1000명 이하여야 합니다.',
                },
                valueAsNumber: true,
              })}
              className={`w-full px-4 py-3 text-lg border ${
                errors.capacity ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-myongji`}
              aria-describedby={errors.capacity ? 'capacity-error' : undefined}
            />
            {errors.capacity && (
              <p
                id="capacity-error"
                className="mt-2 text-base text-red-500"
                role="alert"
              >
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
              {...register('startTime', {
                required: '시작 시간을 설정해주세요.',
                validate: validateTimeRange,
              })}
              className={`w-full px-4 py-3 text-lg border ${
                errors.startTime ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-myongji`}
              aria-describedby={
                errors.startTime ? 'startTime-error' : undefined
              }
            />
            {errors.startTime && (
              <p
                id="startTime-error"
                className="mt-2 text-base text-red-500"
                role="alert"
              >
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
              {...register('endTime', {
                required: '종료 시간을 설정해주세요.',
                validate: validateTimeRange,
              })}
              className={`w-full px-4 py-3 text-lg border ${
                errors.endTime ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-myongji`}
              aria-describedby={errors.endTime ? 'endTime-error' : undefined}
            />
            {errors.endTime && (
              <p
                id="endTime-error"
                className="mt-2 text-base text-red-500"
                role="alert"
              >
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
              aria-describedby={errors.college ? 'college-error' : undefined}
            >
              <option value="">선택하세요</option>
              {Object.keys(DEPARTMENTS).map((collegeName) => (
                <option key={collegeName} value={collegeName}>
                  {collegeName}
                </option>
              ))}
            </select>
            {errors.college && (
              <p
                id="college-error"
                className="mt-2 text-base text-red-500"
                role="alert"
              >
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
              role="group"
              aria-describedby={
                errors.allowedBoundary ? 'allowedBoundary-error' : undefined
              }
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
                          checked={allowedBoundary.includes(department)}
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
              <p
                id="allowedBoundary-error"
                className="mt-2 text-base text-red-500"
                role="alert"
              >
                {errors.allowedBoundary.message}
              </p>
            )}
            {allowedBoundary.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {allowedBoundary.map((dept) => (
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
          <div className="flex flex-wrap gap-6" role="group">
            {['마이크', 'TV', '프로젝터', '컴퓨터', '화이트보드'].map(
              (facility) => (
                <label key={facility} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={supportFacilities.includes(facility)}
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
          <div className="flex space-x-8" role="group">
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
            시설 이미지
          </label>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="시설 이미지 파일 선택"
          />

          <button
            type="button"
            onClick={handleFileButtonClick}
            className="w-full py-3 px-4 text-lg border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-myongji"
            aria-label={`이미지 추가 버튼, 현재 ${newFiles.length}개 파일 선택됨`}
          >
            이미지 추가 ({newFiles.length}개 선택됨)
          </button>

          {existingFiles.length > 0 && (
            <div className="mt-5">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                기존 파일:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {existingFiles.map((file, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <div className="h-32 w-full bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-sm text-gray-600">{file}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 text-center">
                      기존 파일
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingFile(index)}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-xl"
                      aria-label={`기존 파일 ${file} 삭제`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filePreviewUrls.length > 0 && (
            <div className="mt-5">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                새로 추가된 파일:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {filePreviewUrls.map((url, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={url}
                      alt={`새로 추가된 파일 미리보기 ${index + 1}`}
                      className="h-32 w-full object-cover rounded-md transition-all duration-200 group-hover:opacity-75"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 text-center">
                      새 파일 {index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewFile(index)}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-xl"
                      aria-label={`새 파일 ${index + 1} 삭제`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('hardDelete')}
              className="form-checkbox h-5 w-5 text-myongji rounded focus:ring-myongji mr-2"
            />
            <span className="text-lg font-medium text-gray-700">
              Hard Delete
            </span>
          </label>
        </div>

        <div className="flex justify-end mt-10">
          <button
            type="button"
            onClick={() => navigate('/admin/facilities')}
            className="px-6 py-3 mr-4 text-lg bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            disabled={isSubmitting || updateFacilityMutation.isPending}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-3 text-lg bg-myongji text-white rounded-md hover:bg-myongji-dark focus:outline-none focus:ring-2 focus:ring-myongji transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || updateFacilityMutation.isPending}
          >
            {isSubmitting || updateFacilityMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 mr-3 border-b-2 border-white"></div>
                <span>수정 중...</span>
              </div>
            ) : (
              '시설 수정'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacilityEditForm;
