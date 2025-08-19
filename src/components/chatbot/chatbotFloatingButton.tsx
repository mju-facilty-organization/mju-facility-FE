import { useState } from 'react';
import {
  MessageCircle,
  X,
  MessageSquare,
  Maximize2,
  Minimize2,
} from 'lucide-react';

const ChatbotFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className={`
          fixed bottom-10 right-10 w-16 h-16 
          ${
            isOpen
              ? 'bg-gray-600 hover:bg-gray-700'
              : 'bg-myongji hover:bg-blue-800'
          }
          rounded-full shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
          flex items-center justify-center 
          z-50 group
          ${isOpen ? 'rotate-0' : 'hover:scale-105'}
        `}
        aria-label={isOpen ? '채팅창 닫기' : '채팅봇 열기'}
      >
        <div className="relative w-6 h-6">
          <MessageCircle
            className={`
              absolute inset-0 w-6 h-6 text-white
              transition-all duration-200
              ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}
            `}
          />
          <X
            className={`
              absolute inset-0 w-6 h-6 text-white
              transition-all duration-200
              ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}
            `}
          />
        </div>

        <div
          className={`
          absolute right-full mr-3 px-3 py-1 
          bg-slate-800 text-white text-sm rounded-lg
          whitespace-nowrap opacity-0 group-hover:opacity-100
          transition-opacity duration-200 pointer-events-none
          ${isOpen ? 'hidden' : ''}
        `}
        >
          시설 예약 챗봇
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
        </div>
      </button>

      {isOpen && (
        <>
          {isExpanded && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={toggleExpand}
            />
          )}

          <div
            className={`
            fixed z-40 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden
            transition-all duration-300 ease-in-out
            ${
              isExpanded
                ? 'top-8 left-1/2 transform -translate-x-1/2 w-1/3 max-w-4xl h-5/6 mx-4'
                : 'bottom-28 right-6 w-1/4 h-1/2'
            }
          `}
          >
            <div className="bg-myongji text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">시설 예약 챗봇</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleExpand}
                  className="p-1.5 hover:bg-blue-700 rounded transition-colors"
                  aria-label={isExpanded ? '창 축소' : '창 확대'}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1.5 hover:bg-blue-700 rounded transition-colors"
                  aria-label="채팅창 닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 bg-slate-50 flex items-center justify-center">
              <div className="text-center text-slate-600">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                <p className="text-sm">안녕하세요! 👋</p>
                <p className="text-sm">시설 예약을 도와드릴게요</p>
                {isExpanded && (
                  <p className="text-xs text-slate-400 mt-2">전체화면 모드</p>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myongji focus:border-myongji text-sm"
                />
                <button className="px-4 py-2 bg-myongji text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium">
                  전송
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatbotFloatingButton;
