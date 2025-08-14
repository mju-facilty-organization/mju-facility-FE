import { useSuggestionBox } from '@/hooks/useSuggestionBox';
import { useSuggestionAdminActions } from '@/hooks/useSuggestion';
import { SuggestionHeader } from '@/components/feature/suggestion/SuggestionHeader';
import { SuggestionFilters } from '@/components/feature/suggestion/SuggestionFilters';
import { SuggestionLoading } from '@/components/feature/suggestion/SuggestionLoading';
import { SuggestionError } from '@/components/feature/suggestion/SuggestionError';
import { SuggestionCard } from '@/components/feature/suggestion/SuggestionCard';
import { SuggestionEmptyState } from '@/components/feature/suggestion/SuggestionEmptyState';
import { SuggestionStatistics } from '@/components/feature/suggestion/SuggestionStatistics';
import type { Suggestion } from '@/types/suggestion';

const Suggestion = () => {
  const {
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
  } = useSuggestionBox();

  const adminActions = useSuggestionAdminActions();

  const handleCreateAnswer = (suggestionId: number, answer: string) => {
    adminActions.createAnswer(suggestionId, answer);
  };

  const handleUpdateAnswer = (suggestionId: number, answer: string) => {
    adminActions.updateAnswer(suggestionId, answer);
  };

  const handleUpdateStatus = (
    suggestionId: number,
    status: 'RECEIVED' | 'IN_REVIEW' | 'COMPLETED'
  ) => {
    adminActions.updateStatus(suggestionId, status);
  };

  const totalIsActionLoading = isActionLoading || adminActions.isLoading;

  return (
    <div className="max-w-7xl mx-auto">
      <SuggestionHeader
        isLoggedIn={isLoggedIn}
        userRole={user?.role}
        onCreateButtonClick={handleCreateButtonClick}
      />

      <SuggestionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        userRole={user?.role}
        setSelectedStatus={setSelectedStatus}
        isMyPosts={isMyPosts}
        setIsMyPosts={setIsMyPosts}
        isLoggedIn={isLoggedIn}
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
        onResetFilters={resetFilters}
      />

      {(isLoading || isLoadingFacilities) && <SuggestionLoading />}

      {(suggestionsError || myPostsError) && <SuggestionError />}

      {!isLoading && !isLoadingFacilities && (
        <div className="space-y-4">
          {suggestions.map((suggestion: Suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              isLoggedIn={isLoggedIn}
              isMyPosts={isMyPosts}
              isActionLoading={totalIsActionLoading}
              editingId={editingId}
              editForm={editForm}
              userRole={user?.role}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onEditFormChange={handleEditFormChange}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onCreateAnswer={handleCreateAnswer}
              onUpdateAnswer={handleUpdateAnswer}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}

      {!isLoading && !isLoadingFacilities && suggestions.length === 0 && (
        <SuggestionEmptyState isMyPosts={isMyPosts} />
      )}

      {!isMyPosts &&
        !isLoading &&
        !isLoadingFacilities &&
        currentData &&
        user?.role === 'ADMIN' && (
          <SuggestionStatistics
            total={statistics.total}
            received={statistics.received}
            inReview={statistics.reviewing}
            completed={statistics.completed}
          />
        )}
    </div>
  );
};

export default Suggestion;
