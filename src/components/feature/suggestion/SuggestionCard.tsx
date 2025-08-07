import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import {
  getSuggestionStatusStyles,
  getSuggestionStatusText,
  getSuggestionCategoryStyles,
  getSuggestionCategoryText,
} from '@/utils/suggestion';
import type { Suggestion, SuggestionPayload } from '@/types/suggestion';
import { SuggestionEditForm } from '@/components/feature/suggestion/SuggestionEditForm';

type SuggestionCardProps = {
  suggestion: Suggestion;
  isLoggedIn: boolean;
  isMyPosts: boolean;
  isActionLoading: boolean;
  editingId: number | null;
  editForm: SuggestionPayload;
  onEdit: (suggestion: Suggestion) => void;
  onDelete: (id: number) => void;
  onEditFormChange: (
    field: keyof SuggestionPayload,
    value: string | number
  ) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
};

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  isLoggedIn,
  isMyPosts,
  isActionLoading,
  editingId,
  editForm,
  onEdit,
  onDelete,
  onEditFormChange,
  onSaveEdit,
  onCancelEdit,
}) => {
  const isEditing = editingId === suggestion.id;

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
                {/* 답변이 없는 경우에만 수정 가능 */}
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

        {suggestion.answer && (
          <div
            className="border-l-4 p-4 mt-4"
            style={{
              backgroundColor: 'rgba(0, 46, 102, 0.05)',
              borderLeftColor: '#002e66',
            }}
          >
            <div className="flex items-center mb-2">
              <span
                className="text-sm font-medium"
                style={{ color: '#002e66' }}
              >
                담당자 답변
              </span>
              {suggestion.answeredAt && (
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(suggestion.answeredAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#002e66' }}>
              {suggestion.answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
