import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { CATEGORY_OPTIONS } from '@/constants/suggestion';
import type { SuggestionPayload } from '@/types/suggestion';

type SuggestionEditFormProps = {
  editForm: SuggestionPayload;
  isActionLoading: boolean;
  onFormChange: (
    field: keyof SuggestionPayload,
    value: string | number
  ) => void;
  onSave: () => void;
  onCancel: () => void;
};

export const SuggestionEditForm: React.FC<SuggestionEditFormProps> = ({
  editForm,
  isActionLoading,
  onFormChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          분야
        </label>
        <select
          value={editForm.category}
          onChange={(e) => onFormChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          제목
        </label>
        <input
          type="text"
          value={editForm.title}
          onChange={(e) => onFormChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          내용
        </label>
        <textarea
          value={editForm.content}
          onChange={(e) => onFormChange('content', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent resize-none"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          disabled={isActionLoading}
        >
          취소
        </button>
        <button
          onClick={onSave}
          disabled={isActionLoading}
          className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          style={{ backgroundColor: '#002e66' }}
        >
          {isActionLoading && (
            <LoaderCircle size={16} className="animate-spin" />
          )}
          저장
        </button>
      </div>
    </div>
  );
};
