import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useCreateReservation } from '@/hooks/useReservation';
import { useAuthStore } from '@/store/useAuthStore';
import { Reservation } from '@/types/reservation';
import ProfessorSearchModal from '@/components/feature/student/reservation/ProfessorSearchModal';
import ReservationSuccessModal from '@/components/feature/student/reservation/ReservationSuccessModal';

type ReservationFormProps = {
  selectedDate: string;
};

type ApiResponse = {
  httpStatusCode: number;
  message: string;
  resultType: string;
};

type ProfessorInputProps = {
  value: string;
  onChange: (value: string, id: number) => void;
  error?: string;
};

function ProfessorInput({ value, onChange, error }: ProfessorInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <label className="block text-lg font-medium mb-2">담당 교수</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          readOnly
          onClick={() => setIsModalOpen(true)}
          placeholder="담당 교수를 선택해주세요."
          className={`w-full px-4 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md cursor-pointer`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <ProfessorSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(professorName, professorId) => {
          onChange(professorName, professorId);
        }}
      />
    </div>
  );
}

function ReservationForm({ selectedDate }: ReservationFormProps) {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [professorName, setProfessorName] = useState('');
  const [professorId, setProfessorId] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Reservation>({
    defaultValues: {
      purpose: '',
      organization: '',
      numberOfPeople: '',
      professorId: '',
      startDateTime: '',
      endDateTime: '',
      applicationResult: '',
    },
  });

  const handleProfessorChange = (name: string, id: number) => {
    setProfessorName(name);
    setProfessorId(id);
    setValue('professorId', id.toString());
  };

  const createReservationMutation = useCreateReservation();

  const startDateTime = watch('startDateTime');

  const timeOptions = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const hour = Math.floor(i / 2) + 6;
        const minute = (i % 2) * 30;
        return `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
      }),
    []
  );

  const onSubmit = async (data: Reservation) => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    try {
      const formattedStartTime = `${selectedDate}T${data.startDateTime}:00`;
      const formattedEndTime = `${selectedDate}T${data.endDateTime}:00`;

      const reservationData: Reservation = {
        ...data,
        professorId: professorId ? professorId.toString() : '',
        facilityId,
        startDateTime: formattedStartTime,
        endDateTime: formattedEndTime,
      };

      const response = await createReservationMutation.mutateAsync(
        reservationData
      );

      const apiResponse = response as unknown as ApiResponse;

      if (apiResponse.resultType === 'SUCCESS') {
        setShowSuccessModal(true);
        reset();
        setProfessorName('');
        setProfessorId(null);
      } else {
        alert(`예약 신청 실패: ${apiResponse.message}`);
      }
    } catch (error) {
      console.error('예약 처리 중 오류 발생:', error);
      alert('예약 처리 중 오류가 발생했습니다.');
    }
  };

  const handleViewReservations = () => {
    setShowSuccessModal(false);
    navigate('/my-reservations');
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/reservation');
  };

  const renderField = (
    name: keyof Reservation,
    label: string,
    placeholder: string,
    type: string = 'text',
    rules: Record<string, unknown> = {},
    options?: React.ReactNode
  ) => (
    <div>
      <label className="block text-lg font-medium mb-2" htmlFor={name}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) =>
          type === 'select' ? (
            <select
              {...field}
              id={name}
              className={`w-full px-4 py-2 border ${
                errors[name] ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
              disabled={name === 'endDateTime' && !startDateTime}
              value={field.value?.toString() || ''}
            >
              <option value="">{placeholder}</option>
              {options}
            </select>
          ) : (
            <input
              {...field}
              type={type}
              id={name}
              className={`w-full px-4 py-2 border ${
                errors[name] ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
              placeholder={placeholder}
              min={type === 'number' ? '1' : undefined}
              value={field.value?.toString() || ''}
            />
          )
        }
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  );

  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-2xl font-bold mb-6">예약 정보 입력</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField(
            'purpose',
            '사용 목적',
            '예: 동아리 모임, 스터디, 회의 등',
            'text',
            { required: '사용 목적을 입력해주세요' }
          )}

          {renderField('organization', '단체명', '단체명', 'text')}

          {renderField('numberOfPeople', '참석 인원', '인원 수', 'number', {
            required: '참석 인원을 입력해주세요',
            min: { value: 1, message: '최소 1명 이상이어야 합니다' },
          })}

          <div>
            <ProfessorInput
              value={professorName}
              onChange={handleProfessorChange}
              error={errors.professorId?.message?.toString()}
            />

            <Controller
              name="professorId"
              control={control}
              rules={{ required: '담당 교수를 선택해주세요' }}
              render={({ field }) => <input type="hidden" {...field} />}
            />
          </div>

          {renderField(
            'startDateTime',
            '시작 시간',
            '시작 시간 선택',
            'select',
            { required: '시작 시간을 선택해주세요' },
            timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))
          )}

          {renderField(
            'endDateTime',
            '종료 시간',
            '종료 시간 선택',
            'select',
            {
              required: '종료 시간을 선택해주세요',
            },
            timeOptions.map((time) => (
              <option
                key={time}
                value={time}
                disabled={startDateTime ? time <= startDateTime : false}
              >
                {time}
              </option>
            ))
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 bg-myongji text-white text-xl font-bold rounded-lg transition-colors ${
              isSubmitting
                ? 'bg-opacity-70 cursor-not-allowed'
                : 'hover:bg-opacity-90'
            }`}
          >
            {isSubmitting ? '처리 중...' : '예약 신청하기'}
          </button>
        </div>
      </form>

      <ReservationSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        onViewReservations={handleViewReservations}
      />
    </div>
  );
}

export default ReservationForm;
