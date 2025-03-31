import { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { FACILITY_TYPE_MAP } from '@/constants/building';
import { Student } from '@/types/student';
import { Facility } from '@/types/facility';
import { useApprovalData, useProcessApproval } from '@/hooks/useApproval';
import { ApprovalResult } from '@/api/approval';

type RentalInfo = {
  date: string;
  time: string;
  numberOfPeople: number;
};

type ApprovalData = {
  professorApprovalId: number;
  studentInfoResponse: Student;
  rentalInfoResponse: RentalInfo;
  facilityResponse: Partial<Facility> & {
    facilityType: keyof typeof FACILITY_TYPE_MAP;
  };
};

type FormState = {
  loading: boolean;
  message: string;
  isSuccess: boolean;
  completed: boolean;
  isModalOpen: boolean;
  rejectionReason: string;
  showResultModal: boolean;
};

const StudentInfoTable = ({ student }: { student: Student }) => (
  <div>
    <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
      요청자 정보
    </h3>
    <table className="w-full text-xl">
      <tbody className="divide-y divide-gray-200">
        <tr>
          <td className="bg-[#CCE9F7] border p-4 w-1/4 font-medium">학번</td>
          <td className="border p-4 w-1/4">{student.studentNumber}</td>
          <td className="bg-[#CCE9F7] border p-4 w-1/4 font-medium">이름</td>
          <td className="border p-4 w-1/4">{student.studentName}</td>
        </tr>
        <tr>
          <td className="bg-[#CCE9F7] border p-4 font-medium">소속</td>
          <td className="border p-4" colSpan={3}>
            {student.major}
          </td>
        </tr>
        <tr>
          <td className="bg-[#CCE9F7] border p-4 font-medium">이메일</td>
          <td className="border p-4">{student.email}</td>
          <td className="bg-[#CCE9F7] border p-4 font-medium">휴대폰 번호</td>
          <td className="border p-4">{student.phoneNumber}</td>
        </tr>
        <tr>
          <td className="bg-[#CCE9F7] border p-4 font-medium">상태</td>
          <td className="border p-4">{student.status}</td>
          <td className="bg-[#CCE9F7] border p-4 font-medium">경고 횟수</td>
          <td className="border p-4">{student.warning}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const ReservationInfoTable = ({
  facility,
  rental,
}: {
  facility: Partial<Facility> & {
    facilityType: keyof typeof FACILITY_TYPE_MAP;
  };
  rental: RentalInfo;
}) => (
  <div>
    <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
      공간 예약 정보
    </h3>
    <table className="w-full text-xl">
      <tbody className="divide-y divide-gray-200">
        <tr>
          <td className="bg-[#CCE9F7] border p-4 w-1/4 font-medium">
            대여 공간
          </td>
          <td className="border p-4 w-1/4">
            {FACILITY_TYPE_MAP[facility.facilityType]} -{' '}
            {facility.facilityNumber}
          </td>
          <td className="bg-[#CCE9F7] border p-4 w-1/4 font-medium">
            예약 일시
          </td>
          <td className="border p-4 w-1/4">{rental.date}</td>
        </tr>
        <tr>
          <td className="bg-[#CCE9F7] border p-4 w-1/4 font-medium">
            예약 시간
          </td>
          <td className="border p-4 w-1/4">{rental.time}</td>
          <td className="bg-[#CCE9F7] border p-4 w-1/4 font-medium">인원 수</td>
          <td className="border p-4 w-1/4">{rental.numberOfPeople}명</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Notification = ({
  message,
  isSuccess,
}: {
  message: string;
  isSuccess: boolean;
}) => (
  <div
    className={`fixed top-0 inset-x-0 p-4 ${
      isSuccess ? 'bg-green-100' : 'bg-red-100'
    } text-center z-50 animate-fade-in-down`}
  >
    <p className={`text-lg ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
      {message}
    </p>
  </div>
);

const ResultModal = ({
  isOpen,
  message,
  isSuccess,
  onClose,
}: {
  isOpen: boolean;
  message: string;
  isSuccess: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl animate-fade-in">
        <div className="text-center">
          {isSuccess ? (
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
          )}

          <h3
            className={`text-xl font-medium ${
              isSuccess ? 'text-green-900' : 'text-red-900'
            } mb-4`}
          >
            {isSuccess ? '처리 완료' : '오류 발생'}
          </h3>

          <p className="text-gray-700 mb-6">{message}</p>

          <button
            onClick={onClose}
            className={`w-full py-3 px-4 rounded-md ${
              isSuccess ? 'bg-green-600' : 'bg-red-600'
            } text-white font-medium hover:opacity-90 transition-opacity`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

const RejectionModal = ({
  isOpen,
  loading,
  reason,
  onReasonChange,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  loading: boolean;
  reason: string;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg border-4 border-[#CCE9F7]">
        <div className="flex justify-between items-center p-4 border-b border-[#CCE9F7]">
          <h3 className="text-2xl font-bold flex-1 text-center">
            반려 사유 작성
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-circle">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700">
              반려 사유
            </label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="반려 사유를 상세히 작성해주세요."
              className="textarea textarea-bordered w-full h-20 text-lg"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="btn btn-ghost"
            >
              취소
            </button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className={`btn ${loading ? 'bg-blue-300' : 'btn-primary'}`}
            >
              {loading ? '처리 중...' : '반려하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApprovalPage = () => {
  const { professorApprovalId } = useParams<{ professorApprovalId: string }>();
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    message: '',
    isSuccess: false,
    completed: false,
    isModalOpen: false,
    rejectionReason: '',
    showResultModal: false,
  });

  const { data: response, isError: isQueryError } =
    useApprovalData(professorApprovalId);

  const approvalData = response?.data as ApprovalData | undefined;

  const { mutate: processApprovalMutation, isPending: isMutationPending } =
    useProcessApproval();

  const updateFormState = (updates: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  if (isQueryError && !formState.message) {
    updateFormState({
      message: '데이터를 불러오는데 실패했습니다.',
      isSuccess: false,
    });
  }

  const handleApprovalAction = (result: ApprovalResult, reason = '') => {
    if (result === 'DENIED' && reason.trim() === '') {
      alert('반려 사유를 입력해주세요.');
      return;
    }

    updateFormState({ loading: true });

    const professorResult = `PROFESSOR_${result}`;

    processApprovalMutation(
      {
        professorApprovalId: professorApprovalId!,
        result: professorResult,
        reason,
      },
      {
        onSuccess: (response) => {
          if (response.resultType === 'SUCCESS') {
            updateFormState({
              isSuccess: true,
              message:
                result === 'PERMITTED'
                  ? '요청이 성공적으로 승인되었습니다.'
                  : '요청이 성공적으로 반려되었습니다.',
              completed: true,
              showResultModal: true,
            });
          } else {
            updateFormState({
              isSuccess: false,
              message:
                result === 'PERMITTED'
                  ? '승인 처리 중 오류가 발생했습니다.'
                  : '반려 처리 중 오류가 발생했습니다.',
              showResultModal: true,
            });
          }
        },
        onError: (error) => {
          updateFormState({
            isSuccess: false,
            message:
              result === 'PERMITTED'
                ? '승인 처리 중 오류가 발생했습니다.'
                : '반려 처리 중 오류가 발생했습니다.',
            showResultModal: true,
          });
          console.error(
            `${result === 'PERMITTED' ? '승인' : '반려'} 처리 오류:`,
            error
          );
        },
        onSettled: () => {
          updateFormState({
            loading: false,
            isModalOpen: false,
            rejectionReason: '',
          });
        },
      }
    );
  };

  const handleReject = () => updateFormState({ isModalOpen: true });

  const handleSubmitRejection = () =>
    handleApprovalAction('DENIED', formState.rejectionReason);

  const handleApprove = () => handleApprovalAction('PERMITTED');

  const closeModal = () =>
    updateFormState({
      isModalOpen: false,
      rejectionReason: '',
    });

  const handleCloseResultModal = () => {
    updateFormState({ showResultModal: false });
  };

  return (
    <>
      {formState.message && !formState.completed && (
        <Notification
          message={formState.message}
          isSuccess={formState.isSuccess}
        />
      )}

      <div className="w-full max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white shadow-lg rounded-xl border-2 border-myongji">
          <h2 className="text-3xl font-bold text-myongji text-center mt-8">
            공간 예약 신청서
          </h2>
          <p className="text-center text-gray-600 mt-2">
            교수님, 해당 신청에 대한 승인 또는 반려를 결정해주세요.
          </p>

          <div className="px-8 py-12 space-y-10 md:px-14">
            {approvalData && (
              <>
                <StudentInfoTable student={approvalData.studentInfoResponse} />
                <ReservationInfoTable
                  facility={approvalData.facilityResponse}
                  rental={approvalData.rentalInfoResponse}
                />
              </>
            )}

            <div className="flex gap-6 pt-6">
              <button
                onClick={handleReject}
                disabled={isMutationPending || formState.completed}
                className={`flex-1 px-8 py-4 ${
                  isMutationPending || formState.completed
                    ? 'bg-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200'
                } text-gray-700 rounded-lg transition-colors duration-200 text-xl font-medium`}
              >
                {isMutationPending ? '처리 중...' : '반려'}
              </button>
              <button
                onClick={handleApprove}
                disabled={isMutationPending || formState.completed}
                className={`flex-1 px-8 py-4 ${
                  isMutationPending || formState.completed
                    ? 'bg-blue-300'
                    : 'bg-myongji hover:bg-blue-900'
                } text-white rounded-lg transition-colors duration-200 text-xl font-medium`}
              >
                {isMutationPending ? '처리 중...' : '승인'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <RejectionModal
        isOpen={formState.isModalOpen}
        loading={isMutationPending}
        reason={formState.rejectionReason}
        onReasonChange={(reason) =>
          updateFormState({ rejectionReason: reason })
        }
        onClose={closeModal}
        onSubmit={handleSubmitRejection}
      />

      <ResultModal
        isOpen={formState.showResultModal}
        message={formState.message}
        isSuccess={formState.isSuccess}
        onClose={handleCloseResultModal}
      />
    </>
  );
};

export default ApprovalPage;
