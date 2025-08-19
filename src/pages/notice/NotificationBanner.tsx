import { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNotices } from '@/api/notice';

type NoticeData = {
  id: number;
  title: string;
  htmlContent: string;
  createAt: string;
};

const NotificationBanner = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [notice, setNotice] = useState<NoticeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestNotice = async () => {
      try {
        setIsLoading(true);

        const response = await getNotices({ page: 0, size: 1 });

        if (response.resultType === 'SUCCESS' && response.data) {
          setNotice({
            id: response.data.id,
            title: response.data.title,
            htmlContent: response.data.htmlContent,
            createAt: response.data.createAt,
          });
        }
      } catch (error) {
        console.error('공지사항 조회 실패:', error);
        setNotice(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestNotice();
  }, []);

  const handleNoticeClick = () => {
    if (notice) {
      navigate(`/notice/${notice.id}`);
    }
  };

  if (!isVisible || isLoading || !notice) return null;

  return (
    <div className="w-full bg-white border-l-4 border-red-500 shadow-md">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleNoticeClick}
            className="flex items-center gap-3 flex-1 hover:bg-red-50 rounded-lg px-3 py-1 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Bell size={20} className="text-red-500 animate-pulse" />
              <span className="font-semibold text-red-600">공지 사항</span>

              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                NEW
              </span>
            </div>
            <span className="font-medium text-gray-800 truncate">
              {notice.title}
            </span>
            <span className="text-red-400 text-sm ml-auto hidden sm:block">
              자세히 보기 →
            </span>
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-gray-700"
            aria-label="공지 배너 닫기"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;
