import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useUpdateFacility, useFacilityDetail } from '@/hooks/useFacility';
import {
  DEPARTMENT_ENGLISH_TO_KOREAN,
  DEPARTMENTS,
  College,
  Department,
} from '@/constants/department';
import { BUILDINGS, FACILITY_TYPE_MAP } from '@/constants/building';

import TimeSelect from '@/components/common/TimeSelect';

type FacilityEditFormData = {
  supportFacilities: string[];
  startTime: string;
  endTime: string;
  capacity: number;
  isAvailable: boolean;
  allowedBoundary: Department[];
  addFileNames: string[];
  removeKeys: string[];
  newOrder: string[];
};

const FacilityEditForm = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const updateFacilityMutation = useUpdateFacility();

  const {
    data: facilityDetail,
    isLoading,
    isError,
  } = useFacilityDetail(facilityId ? Number(facilityId) : undefined);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FacilityEditFormData>({
    mode: 'onChange',
    defaultValues: {
      supportFacilities: [],
      startTime: '',
      endTime: '',
      capacity: 0,
      isAvailable: true,
      allowedBoundary: [],
      addFileNames: [],
      removeKeys: [],
      newOrder: [],
    },
  });

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

  const [selectedCollege, setSelectedCollege] = useState<College | ''>('');
  const [facilityType, setFacilityType] = useState('');
  const [facilityNumber, setFacilityNumber] = useState('');
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractS3KeyFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const s3Key = decodeURIComponent(urlObj.pathname.substring(1));
      return s3Key;
    } catch (error) {
      console.warn('Failed to parse URL:', url, error);
      return url;
    }
  };

  useEffect(() => {
    if (facilityDetail?.data) {
      const facility = facilityDetail.data;

      const koreanFacilityType =
        FACILITY_TYPE_MAP[facility.facilityType] || facility.facilityType;

      const koreanDepartments = facility.allowedBoundary.map(
        (deptEng: string) => DEPARTMENT_ENGLISH_TO_KOREAN[deptEng] || deptEng
      ) as Department[];

      let facilityCollege: College | '' = '';
      for (const [college, departments] of Object.entries(DEPARTMENTS)) {
        if (departments.some((dept) => koreanDepartments.includes(dept))) {
          facilityCollege = college as College;
          break;
        }
      }

      setFacilityType(koreanFacilityType);
      setFacilityNumber(facility.facilityNumber);
      setSelectedCollege(facilityCollege);

      const formData = {
        supportFacilities: facility.supportFacilities || [],
        startTime: '',
        endTime: '',
        capacity: facility.capacity,
        isAvailable: facility.isAvailable ?? true,
        allowedBoundary: koreanDepartments,
        addFileNames: [],
        removeKeys: [],
        newOrder: [],
      };

      reset(formData);

      if (facility.imageMetas && facility.imageMetas.length > 0) {
        const imageUrls = facility.imageMetas.map((meta) => meta.url);
        setExistingFiles(imageUrls);
      }
    }
  }, [facilityDetail, reset]);

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
    const fileUrl = existingFiles[index];
    const s3Key = extractS3KeyFromUrl(fileUrl);
    setValue('removeKeys', [...removeKeys, s3Key]);
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
      await updateFacilityMutation.mutateAsync({
        facilityId: Number(facilityId),
        facilityData: data,
        newFiles: newFiles.length > 0 ? newFiles : undefined,
      });

      navigate('/admin/facilities');
    } catch (error) {
      console.error('시설 수정 오류:', error);
    }
  };

  const validateTimeRange = () => {
    if (!startTime || !endTime) return true;
    return (
      startTime < endTime || '시작 시간은 종료 시간보다 이전이어야 합니다.'
    );
  };

  const hasImages = existingFiles.length > 0 || newFiles.length > 0;

  useEffect(() => {
    return () => {
      filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviewUrls]);

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-b-2 border-myongji"></div>
          <span className="ml-3 text-lg">시설 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h2>
          <p className="text-gray-600 mb-4">시설 정보를 불러올 수 없습니다.</p>
          <button
            onClick={() => navigate('/admin/facilities')}
            className="px-4 py-2 bg-myongji text-white rounded-md hover:bg-myongji-dark"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

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
              value={facilityType}
              disabled
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            >
              <option value="">선택하세요</option>
              {BUILDINGS.map((building) => (
                <option key={building} value={building}>
                  {building}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              시설 유형은 수정할 수 없습니다.
            </p>
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
              value={facilityNumber}
              disabled
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="mt-1 text-sm text-gray-500">
              시설 번호는 수정할 수 없습니다.
            </p>
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

          <Controller
            name="startTime"
            control={control}
            rules={{
              required: '시작 시간을 설정해주세요.',
              validate: validateTimeRange,
            }}
            render={({ field }) => (
              <TimeSelect
                id="startTime"
                value={field.value}
                onChange={field.onChange}
                error={errors.startTime?.message}
                label="시작 시간"
                required
                placeholder="시작 시간 선택"
              />
            )}
          />

          <Controller
            name="endTime"
            control={control}
            rules={{
              required: '종료 시간을 설정해주세요.',
              validate: validateTimeRange,
            }}
            render={({ field }) => (
              <TimeSelect
                id="endTime"
                value={field.value}
                onChange={field.onChange}
                error={errors.endTime?.message}
                label="종료 시간"
                required
                placeholder="종료 시간 선택"
              />
            )}
          />
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
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value as College)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-myongji"
            >
              <option value="">선택하세요</option>
              {Object.keys(DEPARTMENTS).map((collegeName) => (
                <option key={collegeName} value={collegeName}>
                  {collegeName}
                </option>
              ))}
            </select>
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
            지원 시설 <span className="text-red-500">*</span>
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
          <input
            type="hidden"
            {...register('supportFacilities', {
              validate: (value) =>
                (value || []).length > 0 ||
                '최소 하나 이상의 지원 시설을 선택해주세요.',
            })}
          />
          {errors.supportFacilities && (
            <p className="mt-2 text-base text-red-500" role="alert">
              {errors.supportFacilities.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            사용 가능 여부 <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-8" role="group">
            <Controller
              name="isAvailable"
              control={control}
              rules={{ required: '사용 가능 여부를 선택해주세요.' }}
              render={({ field }) => (
                <>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                      onBlur={field.onBlur}
                      className="form-radio h-6 w-6 text-myongji focus:ring-myongji"
                    />
                    <span className="ml-2 text-lg">사용 가능</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                      onBlur={field.onBlur}
                      className="form-radio h-6 w-6 text-myongji focus:ring-myongji"
                    />
                    <span className="ml-2 text-lg">사용 불가</span>
                  </label>
                </>
              )}
            />
          </div>
          {errors.isAvailable && (
            <p className="mt-2 text-base text-red-500" role="alert">
              {errors.isAvailable.message}
            </p>
          )}
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

          {!hasImages && (
            <p className="mt-2 text-base text-red-500" role="alert">
              최소 하나 이상의 이미지를 등록해주세요.
            </p>
          )}

          {existingFiles.length > 0 && (
            <div className="mt-5">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                기존 파일:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {existingFiles.map((file, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <div className="h-32 w-full bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      <img
                        src={file}
                        alt={`기존 시설 이미지 ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<span class="text-sm text-gray-600">이미지 ${
                            index + 1
                          }</span>`;
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 text-center">
                      기존 파일
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingFile(index)}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-xl"
                      aria-label={`기존 파일 ${index + 1} 삭제`}
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
            disabled={
              isSubmitting || updateFacilityMutation.isPending || !hasImages
            }
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
