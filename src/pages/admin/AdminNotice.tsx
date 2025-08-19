import { useState } from 'react';
import { Upload, X, FileText, ImageIcon } from 'lucide-react';
import { createNotice, uploadFileToPresignedUrl } from '@/api/notice';
import { useNavigate } from 'react-router-dom';

type FormData = {
  title: string;
  content: string;
  imageName: string;
};

type FormErrors = {
  title?: string;
  content?: string;
};

const CreateNoticePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    imageName: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('JPG, PNG, GIF 파일만 업로드 가능합니다.');
        return;
      }
      setSelectedImage(file);
      setFormData((prev) => ({
        ...prev,
        imageName: file.name,
      }));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setFormData((prev) => ({
      ...prev,
      imageName: '',
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const noticeData = {
        title: formData.title,
        content: formData.content,
        imageName: selectedImage ? selectedImage.name : '',
      };

      console.log('공지사항 생성 요청:', noticeData);

      const response = await createNotice(noticeData);

      console.log('공지사항 생성 응답:', response);

      if (selectedImage && response.data?.data?.presignedUrlForPut) {
        console.log('파일 업로드 시작:', response.data.data.presignedUrlForPut);

        const uploadResponse = await uploadFileToPresignedUrl(
          response.data.data.presignedUrlForPut,
          selectedImage
        );

        console.log('업로드 응답:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          ok: uploadResponse.ok,
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `파일 업로드 실패: ${uploadResponse.status} ${uploadResponse.statusText}`
          );
        }

        console.log('파일 업로드 성공');
      }

      setFormData({ title: '', content: '', imageName: '' });
      setSelectedImage(null);
      setErrors({});
      alert('공지사항이 성공적으로 등록되었습니다.');
      navigate('/admin');
    } catch (error: unknown) {
      console.error('공지사항 등록 실패:', error);

      let errorMessage = '공지사항 등록에 실패했습니다. 다시 시도해주세요.';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ title: '', content: '', imageName: '' });
    setSelectedImage(null);
    setErrors({});
  };

  return (
    <div className="mx-auto px-2 sm:px-2 lg:px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-myongji" />
            <h1 className="text-3xl font-bold text-myongji">공지사항 등록</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            새로운 공지사항을 작성하고 등록하세요.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="공지사항 제목을 입력하세요"
                maxLength={100}
                aria-describedby={errors.title ? 'title-error' : 'title-help'}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p
                  id="title-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.title}
                </p>
              )}
              <p id="title-help" className="mt-1 text-sm text-gray-500">
                {formData.title.length}/100자
              </p>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="공지사항 내용을 입력하세요"
                maxLength={2000}
                aria-describedby={
                  errors.content ? 'content-error' : 'content-help'
                }
                disabled={isSubmitting}
              />
              {errors.content && (
                <p
                  id="content-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.content}
                </p>
              )}
              <p id="content-help" className="mt-1 text-sm text-gray-500">
                {formData.content.length}/2000자
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지
              </label>

              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer ${
                      isSubmitting ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      클릭하여 이미지를 선택하세요
                    </p>
                  </label>
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
                  <ImageIcon className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedImage.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                초기화
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-myongji text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? '등록 중...' : '공지사항 등록'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoticePage;
