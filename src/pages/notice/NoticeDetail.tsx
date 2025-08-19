import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Loader2 } from 'lucide-react';
import { getNoticeDetail } from '@/api/notice';
import { formatDate } from '@/utils/date';

type NoticeDetail = {
  id: number;
  title: string;
  htmlContent: string;
  createAt: string;
};

type NoticeDetailResponse = {
  httpStatusCode: number;
  message: string;
  data: NoticeDetail;
  resultType: 'SUCCESS' | 'FAILURE';
};

const NoticeDetailPage = () => {
  const { noticeId } = useParams<{ noticeId: string }>();
  const navigate = useNavigate();

  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      if (!noticeId) {
        setError('공지사항 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response: NoticeDetailResponse = await getNoticeDetail(
          Number(noticeId)
        );

        if (response.resultType === 'SUCCESS' && response.data) {
          setNotice(response.data);
        } else {
          setError('공지사항을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('공지사항 상세 조회 실패:', error);
        setError('공지사항을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [noticeId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-myongji/10 rounded-full animate-pulse"></div>
            <Loader2 className="h-8 w-8 animate-spin text-myongji absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">공지사항을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              오류가 발생했습니다
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
            <button
              onClick={handleGoBack}
              className="w-full px-6 py-3 bg-myongji text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              공지사항을 찾을 수 없습니다
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              요청하신 공지사항이 존재하지 않거나 삭제되었습니다.
            </p>
            <button
              onClick={handleGoBack}
              className="w-full px-6 py-3 bg-myongji text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-3 text-gray-600 hover:text-myongji transition-all duration-200 mb-8 group bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-semibold">돌아가기</span>
          </button>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-myongji p-1">
              <div className="bg-white rounded-xl p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 break-words leading-tight">
                        {notice.title}
                      </h1>
                    </div>
                  </div>

                  <div className="lg:text-right">
                    <div className="  ">
                      <div className="flex items-center gap-2 text-myongji mb-1 lg:justify-end">
                        <Calendar className="h-4 w-4" />
                        <div className="text-lg font-bold text-gray-600">
                          {formatDate(notice.createAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="mb-6">
              <div className="w-12 h-1 bg-myongji rounded-full"></div>
            </div>
            <div
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: notice.htmlContent,
              }}
              style={{
                lineHeight: '1.8',
                fontSize: '16px',
              }}
            />
          </div>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  );
};

export default NoticeDetailPage;
