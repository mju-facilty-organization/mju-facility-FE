import React from 'react';
import { Eye, X } from 'lucide-react';

const ReservationSuccessModal = ({
  isOpen,
  onClose,
  onViewReservations,
}: {
  isOpen: boolean;
  onClose: () => void;
  onViewReservations: () => void;
}): React.ReactNode => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-4">
            예약 신청이 완료되었습니다!
          </h3>
          <p className="text-gray-600 text-sm">
            시설 이용은 신청에 대한 승인이 이루어진 다음에 이용 하실 수
            있습니다. 승인에 대한 결과는 이메일로 전달됩니다.
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={onViewReservations}
            className="w-full py-3 bg-blue-500 text-white rounded-md font-medium flex items-center justify-center"
          >
            <Eye className="w-5 h-5 mr-2" />
            예약 내역 바로가기
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 text-gray-800 rounded-md font-medium flex items-center justify-center"
          >
            <X className="w-5 h-5 mr-2" />
            메인 페이지
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationSuccessModal;
