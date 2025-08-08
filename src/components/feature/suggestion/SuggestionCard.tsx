import React, { useState } from 'react';
import { Edit2, Trash2, MessageSquare, Save, X } from 'lucide-react';
import {
  getSuggestionStatusStyles,
  getSuggestionStatusText,
  getSuggestionCategoryStyles,
  getSuggestionCategoryText,
} from '@/utils/suggestion';
import { STATUS_OPTIONS } from '@/constants/suggestion';
import type { Suggestion, SuggestionPayload } from '@/types/suggestion';
import { SuggestionEditForm } from '@/components/feature/suggestion/SuggestionEditForm';

type SuggestionCardProps = {
  suggestion: Suggestion;
  isLoggedIn: boolean;
  isMyPosts: boolean;
  isActionLoading: boolean;
  editingId: number | null;
  editForm: SuggestionPayload;
  userRole?: string;
  onEdit: (suggestion: Suggestion) => void;
  onDelete: (id: number) => void;
  onEditFormChange: (
    field: keyof SuggestionPayload,
    value: string | number
  ) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onCreateAnswer?: (suggestionId: number, answer: string) => void;
  onUpdateAnswer?: (suggestionId: number, answer: string) => void;
  onUpdateStatus?: (
    suggestionId: number,
    status: 'RECEIVED' | 'IN_REVIEW' | 'COMPLETED'
  ) => void;
};

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  isLoggedIn,
  isMyPosts,
  isActionLoading,
  editingId,
  editForm,
  userRole,
  onEdit,
  onDelete,
  onEditFormChange,
  onSaveEdit,
  onCancelEdit,
  onCreateAnswer,
  onUpdateAnswer,
  onUpdateStatus,
}) => {
  const isEditing = editingId === suggestion.id;
  const isAdmin = userRole === 'ADMIN';

  const [isAnswering, setIsAnswering] = useState(false);
  const [answerText, setAnswerText] = useState(suggestion.answer || '');
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);

  const handleSaveAnswer = () => {
    if (!answerText.trim()) return;

    if (suggestion.answer) {
      onUpdateAnswer?.(suggestion.id, answerText);
    } else {
      onCreateAnswer?.(suggestion.id, answerText);
    }

    setIsAnswering(false);
    setIsEditingAnswer(false);
  };

  const handleCancelAnswer = () => {
    setAnswerText(suggestion.answer || '');
    setIsAnswering(false);
    setIsEditingAnswer(false);
  };

  const handleStatusChange = (status: string) => {
    onUpdateStatus?.(
      suggestion.id,
      status as 'RECEIVED' | 'IN_REVIEW' | 'COMPLETED'
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={getSuggestionCategoryStyles(suggestion.categoryCode)}
            >
              {getSuggestionCategoryText(suggestion.categoryCode)}
            </span>

            {isAdmin ? (
              <select
                value={suggestion.statusCode}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`${getSuggestionStatusStyles(
                  suggestion.statusCode
                )} border-0 bg-transparent cursor-pointer`}
                style={
                  suggestion.statusCode === 'RECEIVED'
                    ? { backgroundColor: '#002e66' }
                    : {}
                }
                disabled={isActionLoading}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <span
                className={getSuggestionStatusStyles(suggestion.statusCode)}
                style={
                  suggestion.statusCode === 'RECEIVED'
                    ? { backgroundColor: '#002e66' }
                    : {}
                }
              >
                {getSuggestionStatusText(suggestion.statusCode)}
              </span>
            )}

            {isMyPosts && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                내 글
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              {new Date(suggestion.createdAt).toLocaleDateString()}
            </div>

            {isLoggedIn && isMyPosts && (
              <div className="flex items-center gap-2">
                {!suggestion.answer && (
                  <button
                    onClick={() => onEdit(suggestion)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="수정"
                    disabled={isActionLoading}
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(suggestion.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="삭제"
                  disabled={isActionLoading}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {isAdmin && !isAnswering && !isEditingAnswer && (
              <div className="flex items-center gap-2">
                {suggestion.answer ? (
                  <button
                    onClick={() => {
                      setIsEditingAnswer(true);
                      setAnswerText(suggestion.answer || '');
                    }}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="답변 수정"
                    disabled={isActionLoading}
                  >
                    <Edit2 size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsAnswering(true);
                      setAnswerText('');
                    }}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="답변 등록"
                    disabled={isActionLoading}
                  >
                    <MessageSquare size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <SuggestionEditForm
            editForm={editForm}
            isActionLoading={isActionLoading}
            onFormChange={onEditFormChange}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
          />
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-500 text-sm font-medium flex items-center gap-1">
                <span className="text-blue-500">📍</span>
                {suggestion.facilityNumber}
              </span>
              <span className="text-gray-300">•</span>
              <h3 className="text-lg font-semibold text-gray-900">
                {suggestion.title}
              </h3>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {suggestion.content}
            </p>

            <div className="text-sm text-gray-500">
              작성자: {suggestion.maskedStudentName}
            </div>
          </>
        )}

        {(suggestion.answer || isAnswering || isEditingAnswer) && (
          <div
            className="border-l-4 p-4 mt-4"
            style={{
              backgroundColor: 'rgba(0, 46, 102, 0.05)',
              borderLeftColor: '#002e66',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span
                  className="text-sm font-medium"
                  style={{ color: '#002e66' }}
                >
                  담당자 답변
                </span>
                {suggestion.answeredAt && !isAnswering && !isEditingAnswer && (
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(suggestion.answeredAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {(isAnswering || isEditingAnswer) && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveAnswer}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                    title="저장"
                    disabled={isActionLoading || !answerText.trim()}
                  >
                    <Save size={14} />
                  </button>
                  <button
                    onClick={handleCancelAnswer}
                    className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                    title="취소"
                    disabled={isActionLoading}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {isAnswering || isEditingAnswer ? (
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="답변을 입력해주세요..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                style={{ color: '#002e66' }}
              />
            ) : (
              <p
                className="text-sm leading-relaxed"
                style={{ color: '#002e66' }}
              >
                {suggestion.answer}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
