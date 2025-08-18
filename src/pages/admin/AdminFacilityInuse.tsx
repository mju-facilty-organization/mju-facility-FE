import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Users, Clock, Mail, Phone, Building } from 'lucide-react';
import { getFacilityInUse } from '@/api/reservation';
import { DEPARTMENT_ENGLISH_TO_KOREAN } from '@/constants/department';
import { formatDate } from '@/utils/date';

type InUseStudent = {
  rentalHistoryId: number;
  organization: string;
  purpose: string;
  numberOfPeople: number;
  startTime: string;
  endTime: string;
  applicant: {
    studentName: string;
    studentNumber: string;
    email: string;
    major: string;
    phoneNumber: string;
    status: string;
    warning: string;
  };
};

const FacilityInUsePage = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<InUseStudent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!facilityId) {
        toast.error('시설 ID가 없습니다.');
        return;
      }

      try {
        setIsLoading(true);
        const numericFacilityId = parseInt(facilityId, 10);

        if (isNaN(numericFacilityId)) {
          toast.error('올바르지 않은 시설 ID입니다.');
          return;
        }

        const response = await getFacilityInUse(numericFacilityId);
        setCurrentUser(response.data?.[0] || null);
      } catch (error) {
        toast.error('이용현황을 불러오는데 실패했습니다.');
        console.error('Failed to fetch facility usage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [facilityId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-myongji"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/facilities')}
            className="flex items-center gap-2 text-gray-600 hover:text-myongji transition-colors duration-200 mb-6 px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm"
          >
            <ArrowLeft size={20} />
            시설 목록으로 돌아가기
          </button>
        </div>

        {!currentUser ? (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                현재 이용중인 학생이 없습니다
              </h2>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="bg-myongji text-white px-8 py-6">
              <h2 className="text-2xl font-bold">현재 이용 중인 학생</h2>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                    📋 예약 정보
                  </h3>

                  <div className="space-y-5">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-myongji rounded-lg flex items-center justify-center">
                        <Building className="text-white" size={20} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          단체명
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {currentUser.organization}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">🎯</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          사용목적
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {currentUser.purpose}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <Users className="text-white" size={20} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          인원
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {currentUser.numberOfPeople}명
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Clock className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-500 block mb-3">
                            이용시간
                          </span>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <div>
                                <span className="text-xs font-medium text-green-700 block">
                                  시작
                                </span>
                                <span className="font-semibold text-gray-800">
                                  {formatDate(currentUser.startTime)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div>
                                <span className="text-xs font-medium text-red-700 block">
                                  종료
                                </span>
                                <span className="font-semibold text-gray-800">
                                  {formatDate(currentUser.endTime)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                    👤 신청자 정보
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-12 h-12 bg-myongji rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {currentUser.applicant.studentName.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          이름
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {currentUser.applicant.studentName}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-myongji text-lg">🎓</span>
                        <div>
                          <span className="text-sm font-medium text-gray-500 block">
                            학번
                          </span>
                          <span className="font-semibold text-gray-800">
                            {currentUser.applicant.studentNumber}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Building className="text-myongji" size={18} />
                        <div>
                          <span className="text-sm font-medium text-gray-500 block">
                            학과
                          </span>
                          <span className="font-semibold text-gray-800">
                            {DEPARTMENT_ENGLISH_TO_KOREAN[
                              currentUser.applicant.major
                            ] || currentUser.applicant.major}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="text-myongji" size={18} />
                        <div>
                          <span className="text-sm font-medium text-gray-500 block">
                            이메일
                          </span>
                          <a
                            href={`mailto:${currentUser.applicant.email}`}
                            className="text-blue-600 hover:text-blue-800 underline font-semibold"
                          >
                            {currentUser.applicant.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="text-myongji" size={18} />
                        <div>
                          <span className="text-sm font-medium text-gray-500 block">
                            전화번호
                          </span>
                          <a
                            href={`tel:${currentUser.applicant.phoneNumber}`}
                            className="text-blue-600 hover:text-blue-800 underline font-semibold"
                          >
                            {currentUser.applicant.phoneNumber}
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-myongji text-lg">📋</span>
                          <div>
                            <span className="text-sm font-medium text-gray-500 block">
                              상태
                            </span>
                            <span className="font-semibold text-gray-800">
                              {currentUser.applicant.status}
                            </span>
                          </div>
                        </div>

                        {currentUser.applicant.warning ? (
                          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <span className="text-red-500 text-lg">⚠️</span>
                            <div>
                              <span className="text-sm font-medium text-red-700 block">
                                경고횟수
                              </span>
                              <span className="text-red-800 font-bold bg-red-100 px-2 py-1 rounded">
                                {currentUser.applicant.warning}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <span className="text-green-500 text-lg">✅</span>
                            <div>
                              <span className="text-sm font-medium text-green-700 block">
                                경고횟수
                              </span>
                              <span className="text-green-800 font-bold bg-green-100 px-2 py-1 rounded">
                                없음
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityInUsePage;
