import {
  MessageCircle,
  X,
  MessageSquare,
  Maximize2,
  Minimize2,
  Send,
} from 'lucide-react';
import { CATEGORIES } from '@/constants/chatbot';
import { useChatbot } from '@/hooks/useChatbot';

const ChatbotFloatingButton = () => {
  const {
    isOpen,
    isExpanded,
    messages,
    inputValue,
    isLoading,
    selectedCategory,
    toggleChat,
    toggleExpand,
    selectCategory,
    resetCategory,
    sendMessage,
    handleKeyPress,
    setInputValue,
  } = useChatbot();

  return (
    <>
      <button
        onClick={toggleChat}
        className={`
          fixed bottom-6 right-6 w-14 h-14 md:bottom-10 md:right-10 md:w-16 md:h-16
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
        <div className="relative w-5 h-5 md:w-6 md:h-6">
          <MessageCircle
            className={`
              absolute inset-0 w-5 h-5 md:w-6 md:h-6 text-white
              transition-all duration-200
              ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}
            `}
          />
          <X
            className={`
              absolute inset-0 w-5 h-5 md:w-6 md:h-6 text-white
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
          hidden md:block
        `}
        >
          시설 예약 챗봇
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
        </div>
      </button>

      {isOpen && (
        <>
          {(isExpanded || window.innerWidth < 768) && (
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
              window.innerWidth < 768
                ? 'top-16 bottom-16 left-4 right-4 rounded-lg'
                : isExpanded
                ? 'top-8 left-1/2 transform -translate-x-1/2 w-1/3 max-w-4xl h-5/6 mx-4'
                : 'bottom-28 right-6 w-1/4 h-1/2'
            }
            md:rounded-lg
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
                  className="p-1.5 hover:bg-blue-700 rounded transition-colors hidden md:block"
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

            <div className="flex-1 p-4 bg-slate-50 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div
                      className={`flex ${
                        message.isBot ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                          message.isBot
                            ? 'bg-white text-slate-800 border border-slate-200'
                            : message.isCategory
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-myongji text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.text}
                        </p>
                      </div>
                    </div>
                    {message.showCategories && (
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {CATEGORIES.map((category) => (
                          <button
                            key={category.key}
                            onClick={() => selectCategory(category)}
                            className="p-3 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{category.icon}</span>
                              <div>
                                <div className="font-medium text-slate-800">
                                  {category.name}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {category.description}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-slate-800 border border-slate-200 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
              {selectedCategory && (
                <div className="mb-3 flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{selectedCategory.icon}</span>
                    <span className="text-sm font-medium text-blue-800">
                      {selectedCategory.name}
                    </span>
                  </div>
                  <button
                    onClick={resetCategory}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    변경
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedCategory
                      ? '메시지를 입력하세요...'
                      : '먼저 문의 유형을 선택해주세요'
                  }
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myongji focus:border-myongji text-sm"
                  disabled={isLoading || !selectedCategory}
                />
                <button
                  onClick={sendMessage}
                  disabled={
                    !inputValue.trim() || isLoading || !selectedCategory
                  }
                  className="px-4 py-2 bg-myongji text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isLoading ? '전송중...' : '전송'}
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
