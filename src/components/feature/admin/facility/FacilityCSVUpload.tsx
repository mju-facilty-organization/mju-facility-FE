import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

type FacilityCSVUploadProps = {
  onCreated?: () => void;
  onCancel?: () => void;
};

const FacilityCSVUpload: React.FC<FacilityCSVUploadProps> = ({
  onCreated,
  onCancel,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === 'text/csv' ||
        selectedFile.name.endsWith('.csv')
      ) {
        setFile(selectedFile);
      } else {
        toast.error('CSV 파일만 업로드 가능합니다.');
        e.target.value = '';
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('CSV 파일을 선택해주세요.');
      return;
    }

    setIsUploading(true);
    try {
      // TODO: CSV 업로드 API

      console.log('CSV 파일 업로드:', file);

      toast.success('CSV 파일이 성공적으로 업로드되었습니다.');
      onCreated?.();
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
        CSV 파일로 시설 일괄 등록
      </h2>

      <div className="space-y-6">
        {/* 파일 업로드 */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            CSV 파일 업로드
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSV 파일 선택
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-myongji file:text-white hover:file:bg-opacity-90"
              />
            </div>

            {file && (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-green-800">
                  ✅ 선택된 파일:{' '}
                  <span className="font-medium">{file.name}</span>
                </p>
                <p className="text-sm text-green-600 mt-1">
                  파일 크기: {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            ⚠️ 주의사항
          </h3>
          <div className="text-yellow-700 space-y-2 text-sm">
            <p>• 파일 인코딩은 UTF-8을 사용해주세요</p>
          </div>
        </div>

        {/* 버튼 영역 */}
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
              'CSV 업로드'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacilityCSVUpload;
