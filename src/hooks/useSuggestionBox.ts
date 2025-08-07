import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useSuggestions,
  useMySuggestions,
  useSuggestionActions,
} from '@/hooks/useSuggestion';
import { useAuthStore } from '@/store/useAuthStore';
import { useFacilities } from '@/hooks/useFacility';
import { getCategoryOptions, getStatusOptions } from '@/utils/suggestion';
import type { SuggestionPayload, Suggestion } from '@/types/suggestion';
import type { Facility } from '@/types/facility';

export const useSuggestionBox = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isMyPosts, setIsMyPosts] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<SuggestionPayload>({
    title: '',
    content: '',
    category: '',
    facilityId: 1,
  });

  const { isLoggedIn, user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filterParams = useMemo(
    () => ({
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      ...(selectedCategory && { category: selectedCategory }),
      ...(selectedStatus && { status: selectedStatus }),
    }),
    [debouncedSearchTerm, selectedCategory, selectedStatus]
  );

  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useFacilities(0, 1000);

  const facilityNumberToIdMap = useMemo(() => {
    if (!facilitiesData?.data?.content) return {};

    const map: Record<string, number> = {};
    facilitiesData.data.content.forEach((facility: Facility) => {
      map[facility.facilityNumber] = facility.id;
    });

    return map;
  }, [facilitiesData?.data?.content]);

  const getFacilityId = useCallback(
    (facilityNumber: string): number => {
      return facilityNumberToIdMap[facilityNumber] || 1;
    },
    [facilityNumberToIdMap]
  );

  const {
    data: suggestionsData,
    isLoading: isLoadingSuggestions,
    error: suggestionsError,
  } = useSuggestions(!isMyPosts ? filterParams : {});

  const {
    data: mySuggestionsData,
    isLoading: isLoadingMyPosts,
    error: myPostsError,
  } = useMySuggestions(isMyPosts ? filterParams : {}, {
    enabled: isLoggedIn && isMyPosts,
  });

  const {
    update,
    delete: deleteSuggestion,
    isLoading: isActionLoading,
  } = useSuggestionActions();

  const currentData = isMyPosts ? mySuggestionsData : suggestionsData;
  const suggestions: Suggestion[] = currentData?.data || [];
  const isLoading = isMyPosts ? isLoadingMyPosts : isLoadingSuggestions;

  const categoryOptions = useMemo(() => getCategoryOptions(), []);
  const statusOptions = useMemo(() => getStatusOptions(), []);

  const statistics = useMemo(() => {
    if (!suggestions.length) {
      return { received: 0, inReview: 0, completed: 0 };
    }

    return {
      received: suggestions.filter((s) => s.statusCode === 'RECEIVED').length,
      inReview: suggestions.filter((s) => s.statusCode === 'IN_REVIEW').length,
      completed: suggestions.filter((s) => s.statusCode === 'COMPLETED').length,
    };
  }, [suggestions]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setIsMyPosts(false);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      if (window.confirm('정말로 이 건의사항을 삭제하시겠습니까?')) {
        deleteSuggestion(id);
      }
    },
    [deleteSuggestion]
  );

  const handleEdit = useCallback(
    (suggestion: Suggestion) => {
      const facilityId = getFacilityId(suggestion.facilityNumber);

      setEditingId(suggestion.id);
      setEditForm({
        title: suggestion.title,
        content: suggestion.content,
        category: suggestion.categoryCode,
        facilityId: facilityId,
      });
    },
    [getFacilityId]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditForm({ title: '', content: '', category: '', facilityId: 1 });
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (editingId) {
      await update(editingId, editForm);
      setEditingId(null);
      setEditForm({ title: '', content: '', category: '', facilityId: 1 });
    }
  }, [editingId, editForm, update]);

  const handleCreateButtonClick = useCallback(() => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    navigate('/suggestions/create');
  }, [isLoggedIn, navigate]);

  const handleEditFormChange = useCallback(
    (field: keyof SuggestionPayload, value: string | number) => {
      setEditForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    isMyPosts,
    setIsMyPosts,
    editingId,
    editForm,

    suggestions,
    currentData,
    statistics,
    categoryOptions,
    statusOptions,

    isLoading,
    isLoadingFacilities,
    isActionLoading,
    suggestionsError,
    myPostsError,

    isLoggedIn,
    user,

    resetFilters,
    handleDelete,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleCreateButtonClick,
    handleEditFormChange,
  };
};
