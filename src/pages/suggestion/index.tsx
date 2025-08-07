import { useSuggestionBox } from '@/hooks/useSuggestionBox';
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
              isActionLoading={isActionLoading}
              editingId={editingId}
              editForm={editForm}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onEditFormChange={handleEditFormChange}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
            />
          ))}
        </div>
      )}

      {!isLoading && !isLoadingFacilities && suggestions.length === 0 && (
        <SuggestionEmptyState isMyPosts={isMyPosts} />
      )}

      {!isMyPosts && !isLoading && !isLoadingFacilities && currentData && (
        <SuggestionStatistics
          total={currentData.total || suggestions.length}
          received={statistics.received}
          inReview={statistics.inReview}
          completed={statistics.completed}
        />
      )}
    </div>
  );
};

export default Suggestion;
