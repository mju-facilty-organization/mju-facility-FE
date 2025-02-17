import { useState } from 'react';
import { X } from 'lucide-react';

const ApprovalPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const mockData = {
    studentId: '60201234',
    name: '김명지',
    email: 'tester@mju.ac.kr',
    department: '융합소프트웨어학부',
    organization: 'COW',
    phoneNumber: '010-3323-5126',
    purpose: '동아리 활동',
    responsibility: '0',
    spaceName: '1350s',
    spaceType: '본관',
    reservationDate: '2025년 2월 5일',
    reservationTime: '13:00 ~ 15:00',
    numberOfPeople: '10',
  };

  const handleReject = () => {
    setIsModalOpen(true);
  };

  const handleSubmitRejection = () => {
    if (rejectionReason.trim() === '') {
      alert('반려 사유를 입력해주세요.');
      return;
    }

    console.log('반려 사유:', rejectionReason);
    setIsModalOpen(false);
    setRejectionReason('');
    // TODO: API 호출
  };

  const handleApprove = () => {
    console.log('승인 처리');
    // TODO: API 호출
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl border-2 border-myongji">
          <h2 className="text-3xl font-bold text-myongji text-center mt-8">
            공간 예약 신청서
          </h2>

          <div className="px-14 py-12 space-y-10">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                요청자 정보
              </h3>
              <table className="w-full text-xl">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="bg-[#CCE9F7] border p-4 w-1/4 font-medium">
                      학번
                    </td>
                    <td className="border p-4 w-1/4">{mockData.studentId}</td>
                    <td className="bg-[#CCE9F7] border p-4 w-1/4 font-medium">
                      이름
                    </td>
                    <td className="border p-4 w-1/4">{mockData.name}</td>
                  </tr>
                  <tr>
                    <td className="bg-[#CCE9F7] border p-4 font-medium">
                      이메일
                    </td>
                    <td className="border p-4">{mockData.email}</td>
                    <td className="bg-[#CCE9F7] border p-4 font-medium">
                      소속
                    </td>
                    <td className="border p-4">{mockData.department}</td>
                  </tr>
                  <tr>
                    <td className="bg-[#CCE9F7] border p-4 font-medium">
                      소속 단체
                    </td>
                    <td className="border p-4">{mockData.organization}</td>
                    <td className="bg-[#CCE9F7] border p-4 font-medium">
                      휴대폰 번호
                    </td>
                    <td className="border p-4">{mockData.phoneNumber}</td>
                  </tr>
                  <tr>
                    <td className="bg-[#CCE9F7] border p-4 font-medium">
                      사유
                    </td>
                    <td className="border p-4">{mockData.purpose}</td>
                    <td className="bg-[#CCE9F7] border p-4 font-medium">
                      경고 횟수
                    </td>
                    <td className="border p-4">{mockData.responsibility}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                공간 예약 정보
              </h3>
              <table className="w-full text-xl">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="bg-[#CCE9F7] border p-4 w-1/4 font-medium">
                      공간명
                    </td>
                    <td className="border p-4 w-1/4">{mockData.spaceName}</td>
                    <td className="bg-[#CCE9F7] border p-4 w-1/4 font-medium">
                      사용 타입
                    </td>
                    <td className="border p-4 w-1/4">{mockData.spaceType}</td>
                  </tr>
                  <tr>
                    <td className="bg-[#CCE9F7] border p-4 font-medium">
                      예약 일시
                    </td>
                    <td className="border p-4">{mockData.reservationDate}</td>
                    <td className="bg-[#CCE9F7] border p-4 font-medium">
                      예약 시간
                    </td>
                    <td className="border p-4">{mockData.reservationTime}</td>
                  </tr>
                  <tr>
                    <td className="bg-[#CCE9F7] border p-4 font-medium">
                      인원수
                    </td>
                    <td className="border p-4" colSpan={3}>
                      {mockData.numberOfPeople}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-6 pt-6">
              <button
                onClick={handleReject}
                className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-xl font-medium"
              >
                반려
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 px-8 py-4 bg-myongji text-white rounded-lg hover:bg-blue-900 transition-colors duration-200 text-xl font-medium"
              >
                승인
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg border-4 border-[#CCE9F7] ">
            <div className="flex justify-between items-center p-4 border-b border-[#CCE9F7]">
              <h3 className="text-2xl font-bold flex-1 text-center">
                반려 사유 작성
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-circle "
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">
                  반려 사유
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="반려 사유를 상세히 작성해주세요."
                  className="textarea textarea-bordered w-full h-20 text-lg"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setRejectionReason('');
                  }}
                  className="btn btn-ghost"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitRejection}
                  className="btn btn-primary"
                >
                  반려하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApprovalPage;
