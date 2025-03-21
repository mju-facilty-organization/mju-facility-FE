import React, { useState, useEffect } from 'react';
import { formatDate } from '@/utils/date';
import { getStatusText, getStatusStyles } from '@/utils/statusStyles';
import { FACILITY_TYPE_MAP } from '@/constants/building';
import { DEPARTMENT_ENGLISH_TO_KOREAN } from '@/constants/department';
import { Student } from '@/types/student';
import { ApprovalStatus, ApprovalInfo, Reservation } from '@/types/reservation';

type ReservationDetailResponse = {
  data: {
    studentResponse: Student;
    rentalHistoryResponseDto: Reservation;
  };
};

const ReservationDetailModal = ({
  detailData,
  onClose,
  isLoading,
  error,
  onSave,
}: {
  detailData: ReservationDetailResponse | undefined;
  onClose: () => void;
  isLoading: boolean;
  error: unknown;
  onSave?: (approvalInfo: ApprovalInfo) => void;
}) => {
  const [approvalInfo, setApprovalInfo] = useState<ApprovalInfo>({
    approvalStatus: '',
    reason: '',
  });

  useEffect(() => {
    if (detailData?.data) {
      setApprovalInfo({
        approvalStatus:
          (detailData.data.rentalHistoryResponseDto
            .applicationResult as ApprovalStatus) || '',
        reason: '',
      });
    }
  }, [detailData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setApprovalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 저장 핸들러
  const handleSave = () => {
    if (onSave) {
      onSave(approvalInfo);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          {isLoading ? (
            <div className="p-4 text-center">로딩 중...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              상세 정보를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : detailData ? (
            <div className="p-4">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">시설 대여 정보</h2>
                <div className="p-3">
                  <span
                    className={getStatusStyles(
                      detailData.data.rentalHistoryResponseDto.applicationResult
                    )}
                  >
                    {getStatusText(
                      detailData.data.rentalHistoryResponseDto.applicationResult
                    )}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">요청자 정보</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="bg-blue-100 border border-gray-300 p-3 w-1/6 text-center">
                        학번
                      </td>
                      <td className="border border-gray-300 p-3 w-1/3">
                        {detailData.data.studentResponse.studentNumber || '--'}
                      </td>
                      <td className="bg-blue-100 border border-gray-300 p-3 w-1/6 text-center">
                        이름
                      </td>
                      <td className="border border-gray-300 p-3 w-1/3">
                        {detailData.data.studentResponse.studentName || '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        이메일
                      </td>
                      <td className="border border-gray-300 p-3">
                        {detailData.data.studentResponse.email || '--'}
                      </td>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        소속 학과
                      </td>
                      <td className="border border-gray-300 p-3">
                        {detailData.data.studentResponse.major || '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        소속 단체
                      </td>
                      <td className="border border-gray-300 p-3">
                        {detailData.data.rentalHistoryResponseDto
                          .organization || '--'}
                      </td>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        휴대폰 번호
                      </td>
                      <td className="border border-gray-300 p-3">
                        {detailData.data.studentResponse.phoneNumber || '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        계정 상태
                      </td>
                      <td className="border border-gray-300 p-3">
                        {detailData.data.studentResponse.status || '--'}
                      </td>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        경고 횟수
                      </td>
                      <td className="border border-gray-300 p-3">
                        {detailData.data.studentResponse.warning || '0'}회
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">공간 대여 정보</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="bg-blue-100 border border-gray-300 p-3 w-1/6 text-center">
                        공간명
                      </td>
                      <td className="border border-gray-300 p-3 w-1/3">
                        {FACILITY_TYPE_MAP[
                          detailData.data.rentalHistoryResponseDto
                            .facilityResponse?.facilityType || ''
                        ] ||
                          detailData.data.rentalHistoryResponseDto
                            .facilityResponse?.facilityType ||
                          '--'}
                      </td>
                      <td className="bg-blue-100 border border-gray-300 p-3 w-1/6 text-center">
                        위치
                      </td>
                      <td className="border border-gray-300 p-3 w-1/3">
                        {detailData.data.rentalHistoryResponseDto
                          .facilityResponse?.facilityNumber || '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        담당 교수
                      </td>
                      <td className="border border-gray-300 p-3">
                        {detailData.data.rentalHistoryResponseDto
                          .professorApprovalResponse?.professorName || '--'}
                      </td>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        담당 소속 학과
                      </td>
                      <td className="border border-gray-300 p-3">
                        {DEPARTMENT_ENGLISH_TO_KOREAN[
                          detailData.data.rentalHistoryResponseDto
                            .professorApprovalResponse?.professorAffiliation ||
                            ''
                        ] ||
                          detailData.data.rentalHistoryResponseDto
                            .professorApprovalResponse?.professorAffiliation ||
                          '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        신청 일시
                      </td>
                      <td className="border border-gray-300 p-3">
                        {formatDate(
                          detailData.data.rentalHistoryResponseDto.createAt ||
                            ''
                        ) || '--'}
                      </td>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        처리 일시
                      </td>
                      <td className="border border-gray-300 p-3">
                        {detailData.data.rentalHistoryResponseDto.defineDateTime
                          ? formatDate(
                              detailData.data.rentalHistoryResponseDto
                                .defineDateTime
                            )
                          : '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        교수님 이메일
                      </td>
                      <td className="border border-gray-300 p-3" colSpan={3}>
                        {detailData.data.rentalHistoryResponseDto
                          .professorApprovalResponse?.professorEmail || '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        사용 시간
                      </td>
                      <td className="border border-gray-300 p-3" colSpan={3}>
                        {formatDate(
                          detailData.data.rentalHistoryResponseDto.startTime ||
                            ''
                        ) || '--'}{' '}
                        ~{' '}
                        {formatDate(
                          detailData.data.rentalHistoryResponseDto.endTime || ''
                        ) || '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        사용 목적
                      </td>
                      <td className="border border-gray-300 p-3">
                        {detailData.data.rentalHistoryResponseDto.purpose ||
                          '--'}
                      </td>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        상태
                      </td>
                      <td className="border border-gray-300 p-3">
                        <span
                          className={getStatusStyles(
                            detailData.data.rentalHistoryResponseDto
                              .applicationResult || ''
                          )}
                        >
                          {getStatusText(
                            detailData.data.rentalHistoryResponseDto
                              .applicationResult || ''
                          ) || '--'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-blue-100 border border-gray-300 p-3 text-center">
                        비고
                      </td>
                      <td className="border border-gray-300 p-3" colSpan={3}>
                        {detailData.data.rentalHistoryResponseDto
                          .professorApprovalResponse?.reason || '--'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">대여 승인</h3>
                <div className="p-4 border border-gray-300 rounded">
                  <div className="flex items-center mb-4">
                    <span className="mr-4 font-medium">승인 상태:</span>
                    <select
                      name="approvalStatus"
                      value={approvalInfo.approvalStatus}
                      onChange={handleChange}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">상태 선택</option>
                      <option value="WAITING">승인대기</option>
                      <option value="APPROVED">승인</option>
                      <option value="REJECTED">반려</option>
                    </select>
                  </div>

                  {approvalInfo.approvalStatus === 'REJECTED' && (
                    <div className="mt-4">
                      <span className="block mb-2 font-medium">거부 사유:</span>
                      <textarea
                        name="reason"
                        value={approvalInfo.reason}
                        onChange={handleChange}
                        placeholder="거부 사유를 입력해주세요"
                        className="w-full border rounded px-2 py-1 h-24"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-center space-x-4 mt-8">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-myongji text-white rounded-md hover:bg-myongji/80"
                  disabled={
                    !approvalInfo.approvalStatus ||
                    (approvalInfo.approvalStatus === 'REJECTED' &&
                      !approvalInfo.reason)
                  }
                >
                  저장하기
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">정보를 찾을 수 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailModal;
