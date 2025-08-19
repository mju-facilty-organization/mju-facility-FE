import { useState } from 'react';
import { askChatbot } from '@/api/chatbot';
import { INITIAL_MESSAGE } from '@/constants/chatbot';
import type { Message, Category } from '@/types/chatbot';

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);

    const categoryMessage: Message = {
      id: Date.now(),
      text: `"${category.name}" 선택됨`,
      isBot: false,
      isCategory: true,
    };

    const botResponse: Message = {
      id: Date.now() + 1,
      text: `${category.icon} ${category.name}에 대해 문의하시는군요!\n\n${category.description}에 대해 궁금한 점을 자유롭게 질문해주세요.`,
      isBot: true,
    };

    setMessages((prev) => [...prev, categoryMessage, botResponse]);
  };

  const resetCategory = () => {
    setSelectedCategory(null);
    const resetMessage: Message = {
      id: Date.now(),
      text: '문의 유형을 다시 선택해주세요:',
      isBot: true,
      showCategories: true,
    };
    setMessages((prev) => [...prev, resetMessage]);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !selectedCategory) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentQuestion = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await askChatbot({
        queryCategory: selectedCategory.key,
        question: currentQuestion,
      });

      if (data.resultType === 'SUCCESS') {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: data.data,
          isBot: true,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          id: Date.now() + 1,
          text:
            data.message ||
            '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
          isBot: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('채팅 오류:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
        isBot: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return {
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
  };
};
