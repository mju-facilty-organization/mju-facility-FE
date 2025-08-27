import { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import { uploadScheduleExcel } from '@/api/facilityschedule';

const TimetableUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [validStartDate, setValidStartDate] = useState('');
  const [validEndDate, setValidEndDate] = useState('');
  const [overwrite, setOverwrite] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    data?: unknown;
    error?: unknown;
  } | null>(null);
  const [error, setError] = useState('');

  const isValidExcel = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext === 'xlsx' || ext === 'xls';
  };

  const handleFileSelect = (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    if (isValidExcel(selectedFile.name)) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
      setFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('파일을 선택해주세요.');
      return;
    }

    if (validStartDate >= validEndDate) {
      setError('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadResult(null);

    try {
      const result = await uploadScheduleExcel(file, {
        overwrite,
        validStartDate,
        validEndDate,
      });

      setUploadResult({
        success: true,
        message: '시간표가 성공적으로 업로드되었습니다.',
        data: result,
      });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setUploadResult({
        success: false,
        message:
          error.response?.data?.message || '업로드 중 오류가 발생했습니다.',
        error: err,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setValidStartDate('');
    setValidEndDate('');
    setOverwrite(true);
    setUploadResult(null);
    setError('');
  };

  const isUploadDisabled =
    !file || !validStartDate || !validEndDate || isUploading;

  return (
    <div className="p-6 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">시간표 등록</h1>
        <p className="text-gray-600">
          엑셀 파일을 업로드하여 시간표를 등록할 수 있습니다.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileSpreadsheet className="mr-2 h-5 w-5 text-blue-600" />
            파일 업로드
          </h2>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              file
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <p className="text-green-700 font-medium">{file.name}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-600">
                  엑셀 파일을 드래그하거나 클릭하여 선택하세요
                </p>
                <p className="text-sm text-gray-500">지원 형식: .xlsx, .xls</p>
              </div>
            )}

            <input
              type="file"
              onChange={handleFileChange}
              accept=".xlsx,.xls"
              className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-purple-600" />
            시간표 적용 기간 설정
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: '시작일',
                value: validStartDate,
                setter: setValidStartDate,
                help: '시간표 적용 시작일을 선택해주세요',
              },
              {
                label: '종료일',
                value: validEndDate,
                setter: setValidEndDate,
                help: '시간표 적용 종료일을 선택해주세요',
              },
            ].map(({ label, value, setter, help }) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{help}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-start">
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={overwrite}
                  onChange={(e) => setOverwrite(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  기존 데이터 덮어쓰기
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-7">
                {overwrite
                  ? '기존 스케줄 데이터를 삭제하고 새로 등록합니다.'
                  : '기존 스케줄과 겹치는 경우 처리하지 않습니다.'}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              초기화
            </button>
          </div>
        </div>

        {(error || uploadResult) && (
          <div
            className={`border rounded-lg p-4 flex items-center ${
              error
                ? 'bg-red-50 border-red-200'
                : uploadResult?.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            {error ? (
              <>
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-red-700">{error}</span>
              </>
            ) : uploadResult?.success ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-green-700">{uploadResult.message}</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-red-700">{uploadResult?.message}</span>
              </>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={isUploadDisabled}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
              isUploadDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-myongji text-white hover:bg-blue-700'
            }`}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                업로드 중...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                시간표 업로드
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimetableUpload;
