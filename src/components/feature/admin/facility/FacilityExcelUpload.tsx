import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { importFacilitiesFromExcel } from '@/api/facility';

type FacilityFileUploadProps = {
  onCreated?: () => void;
  onCancel?: () => void;
};

const FacilityFileUpload: React.FC<FacilityFileUploadProps> = ({
  onCreated,
  onCancel,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [overwrite, setOverwrite] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];

      const allowedExtensions = ['.xlsx', '.xls'];
      const fileExtension = selectedFile.name
        .toLowerCase()
        .substring(selectedFile.name.lastIndexOf('.'));

      if (
        allowedTypes.includes(selectedFile.type) ||
        allowedExtensions.includes(fileExtension)
      ) {
        setFile(selectedFile);
      } else {
        toast.error('Excel 파일(XLSX, XLS)만 업로드 가능합니다.');
        e.target.value = '';
      }
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName
      .toLowerCase()
      .substring(fileName.lastIndexOf('.'));
    if (extension === '.xlsx' || extension === '.xls') {
      return '📊';
    }
    return '📄';
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('파일을 선택해주세요.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await importFacilitiesFromExcel(file, false, overwrite);

      toast.success(
        `파일이 성공적으로 업로드되었습니다. ${
          result.data.success || 0
        }개의 시설이 등록되었습니다.`
      );
      onCreated?.();

      console.log('업로드 결과:', result);
    } catch (error: unknown) {
      console.error('파일 업로드 오류:', error);

      let errorMessage = '파일 업로드 중 오류가 발생했습니다.';

      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        errorMessage = apiError.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    onCancel?.();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-myongji">
        Excel 파일로 시설 일괄 등록
      </h2>

      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            파일 업로드
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excel 파일 선택
              </label>
              <input
                type="file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-myongji file:text-white hover:file:bg-opacity-90"
              />
              <p className="text-xs text-gray-500 mt-1">지원 형식: XLSX, XLS</p>
            </div>

            {file && (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-green-800 flex items-center">
                  <span className="mr-2">{getFileIcon(file.name)}</span>
                  선택된 파일:{' '}
                  <span className="font-medium ml-1">{file.name}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            업로드 옵션
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="overwrite"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="h-4 w-4 text-myongji focus:ring-myongji border-gray-300 rounded"
              />
              <label htmlFor="overwrite" className="ml-2 text-sm text-gray-700">
                기존 시설 덮어쓰기
              </label>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            📋 지원 파일 형식
          </h3>
          <div className="text-blue-700 space-y-2 text-sm">
            <div className="flex items-center">
              <span className="mr-2">📊</span>
              <span className="font-medium">Excel 파일 (.xlsx, .xls)</span>
              <span className="ml-2 text-xs bg-blue-100 px-2 py-1 rounded">
                스프레드시트
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 text-lg bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isUploading}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-6 py-3 text-lg bg-myongji text-white rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <div className="flex items-center">
                <div className="animate-spin h-5 w-5 mr-3 border-b-2 border-white"></div>
                업로드 중...
              </div>
            ) : (
              '파일 업로드'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacilityFileUpload;
