import { useMemo, useState, useEffect } from 'react';
import { useProfessors } from '@/hooks/useProfessor';
import { Professor } from '@/types/professor';
import {
  DEPARTMENTS,
  DEPARTMENT_ENGLISH_TO_KOREAN,
} from '@/constants/department';

type ProfessorSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (professorName: string, professorId: number) => void;
};

function ProfessorSearchModal({
  isOpen,
  onClose,
  onSelect,
}: ProfessorSearchModalProps) {
  const [filters, setFilters] = useState({
    campus: '서울',
    college: 'ICT융합대학',
    major: '데이터테크놀로지전공',
  });

  const [page, setPage] = useState(0);

  const majorOptions: readonly string[] = useMemo(() => {
    return DEPARTMENTS[filters.college as keyof typeof DEPARTMENTS] ?? [];
  }, [filters.college]);

  const collegeOptions = useMemo(() => {
    return Object.keys(DEPARTMENTS);
  }, []);

  useEffect(() => {
    if (majorOptions.length > 0 && !majorOptions.includes(filters.major)) {
      setFilters((prev) => ({ ...prev, major: majorOptions[0] }));
    }
  }, [majorOptions, filters.major]);

  const queryParams = {
    page,
    size: 10,
    campus: filters.campus,
    college: filters.college,
    major: filters.major,
    enabled: false,
  };

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useProfessors(queryParams);

  const [hasSearched, setHasSearched] = useState(false);

  const professors = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;
  const error = queryError ? '교수 정보를 불러오는데 실패했습니다.' : null;

  const handleSearch = () => {
    setPage(0);
    setHasSearched(true);
    refetch();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b rounded-t-lg">
          <div className="text-lg font-medium">담당 교수님 검색</div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-white text-myongji font-bold rounded-md hover:bg-gray-100"
          >
            조회
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="">
                  <td className="p-3 border border-gray-300 w-24 bg-gray-100">
                    캠퍼스
                  </td>
                  <td className="p-3 border border-gray-300">
                    <select
                      value={filters.campus}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          campus: e.target.value,
                        }))
                      }
                      className="w-full border-none focus:outline-none focus:ring-0"
                    >
                      <option value="서울">서울</option>
                      <option value="용인">용인</option>
                    </select>
                  </td>
                  <td className="p-3 border border-gray-300 bg-gray-100 w-24">
                    대학
                  </td>
                  <td className="p-3 border border-gray-300">
                    <select
                      value={filters.college}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          college: e.target.value,
                        }))
                      }
                      className="w-full bg-white border-none focus:outline-none focus:ring-0"
                    >
                      {collegeOptions.map((college) => (
                        <option key={college} value={college}>
                          {college}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-300 bg-gray-100">
                    학과
                  </td>
                  <td className="p-3 border border-gray-300" colSpan={3}>
                    <select
                      value={filters.major}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          major: e.target.value,
                        }))
                      }
                      className="w-full bg-white border-none focus:outline-none focus:ring-0"
                    >
                      {majorOptions.map((major) => (
                        <option key={major} value={major}>
                          {major}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {hasSearched && (
            <>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">
                    교수 정보를 불러오는 중...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : (
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  {professors.length > 0 ? (
                    <div className="divide-y">
                      {professors.map((professor: Professor, index: number) => (
                        <div
                          key={index}
                          className="p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            onSelect(professor.name, professor.id);
                            onClose();
                          }}
                        >
                          <div className="font-medium">{professor.name}</div>
                          <div className="text-gray-600 text-sm flex justify-between">
                            <div>
                              소속:{' '}
                              {DEPARTMENT_ENGLISH_TO_KOREAN[professor.major] ||
                                professor.major}
                            </div>
                            <div>email: {professor.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-500">
                      검색 결과가 없습니다.
                    </div>
                  )}
                </div>
              )}

              {!isLoading && data && totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <button
                    onClick={() => {
                      const newPage = Math.max(0, page - 1);
                      setPage(newPage);
                      refetch();
                    }}
                    disabled={page === 0}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    이전
                  </button>
                  <span className="px-3 py-1">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => {
                      const newPage = Math.min(totalPages - 1, page + 1);
                      setPage(newPage);
                      refetch();
                    }}
                    disabled={page === totalPages - 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfessorSearchModal;
