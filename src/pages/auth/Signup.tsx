import AuthLayout from '@/components/feature/auth/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useSignup } from '@/hooks/useSignup';
import { useEmailVerification } from '@/hooks/useEmail';
import { useState } from 'react';
import { DEPARTMENTS, Department } from '@/constants/department';

const EMAIL_REGEX = /@mju.ac.kr$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
const PHONE_REGEX = /^(010\d{4}|01[1|6|7|8|9]\d{3})(\d{4})$/;

const signupSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해주세요'),
    email: z
      .string()
      .min(1, '이메일을 입력해주세요')
      .email('올바른 이메일 형식이 아닙니다')
      .regex(EMAIL_REGEX, '명지대학교 이메일을 입력해주세요'),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요')
      .regex(
        PASSWORD_REGEX,
        '비밀번호는 영문/숫자/특수문자를 포함해서 8-20글자로 작성해주세요'
      ),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),
    studentId: z.string().min(1, '학번을 입력해주세요'),
    department: z.string().min(1, '단과대학을 선택해주세요'),
    major: z.string().min(1, '학과를 선택해주세요'),
    phone: z
      .string()
      .regex(PHONE_REGEX, '올바른 휴대폰 번호를 입력해주세요')
      .min(1, '연락처를 입력해주세요'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useSignup();
  const { checkDuplicateMutation, sendCodeMutation, verifyCodeMutation } =
    useEmailVerification();

  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const watchDepartment = watch('department');

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue('department', value);
    setValue('major', '');
  };

  const isVerifying =
    checkDuplicateMutation.isPending ||
    sendCodeMutation.isPending ||
    verifyCodeMutation.isPending;

  const sendVerificationEmail = async () => {
    const isEmailValid = await trigger('email');
    if (!isEmailValid) return;

    const email = getValues('email');
    setVerificationError('');

    try {
      const duplicateResult = await checkDuplicateMutation.mutateAsync(email);

      if (duplicateResult.resultType === 'SUCCESS') {
        const codeResult = await sendCodeMutation.mutateAsync(email);
        if (codeResult.resultType === 'SUCCESS') {
          setIsEmailSent(true);
          alert('인증번호가 발송되었습니다.');
        } else {
          setVerificationError('인증번호 발송에 실패했습니다.');
        }
      } else {
        setVerificationError('이미 등록된 이메일입니다.');
      }
    } catch {
      setVerificationError('이메일 인증 중 오류가 발생했습니다.');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerificationError('인증번호를 입력해주세요.');
      return;
    }

    try {
      const result = await verifyCodeMutation.mutateAsync({
        email: getValues('email'),
        authCode: Number(verificationCode),
      });

      if (result.data.authResult) {
        setIsEmailVerified(true);
        setVerificationError('');
        alert('이메일 인증이 완료되었습니다.');
      } else {
        const errorMsg = result.message || '인증번호가 일치하지 않습니다.';
        setVerificationError(errorMsg);
      }
    } catch {
      setVerificationError('인증에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    if (phone.length === 10) {
      return `${phone.substring(0, 3)}-${phone.substring(
        3,
        6
      )}-${phone.substring(6)}`;
    } else if (phone.length === 11) {
      return `${phone.substring(0, 3)}-${phone.substring(
        3,
        7
      )}-${phone.substring(7)}`;
    }
    return phone;
  };

  const onSubmit = (data: SignupFormData) => {
    if (!isEmailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    const formattedPhone = formatPhoneNumber(data.phone);

    mutate({
      name: data.name,
      studentNumber: data.studentId,
      password: data.password,
      email: data.email,
      major: data.major,
      phoneNumber: formattedPhone,
    });
  };

  return (
    <AuthLayout title="회원가입">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <div className="text-red-500 text-sm">
            {error instanceof Error
              ? error.message
              : '회원가입 중 오류가 발생했습니다.'}
          </div>
        )}

        <div className="space-y-8">
          <Input
            label="이름"
            {...register('name')}
            error={errors.name?.message}
          />

          <div className="space-y-4">
            <div className="relative">
              <Input
                type="email"
                label="이메일"
                {...register('email')}
                error={errors.email?.message}
                description="※ 인증번호를 받기 위해 정확한 명지대학교 이메일 주소를 입력해주세요"
              />
              <button
                type="button"
                onClick={sendVerificationEmail}
                disabled={isEmailVerified || isVerifying}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-6 py-2 bg-myongji text-white rounded text-lg disabled:bg-gray-400"
                aria-label={isEmailSent ? '인증번호 재발송' : '인증번호 발송'}
              >
                {isVerifying ? '처리중...' : isEmailSent ? '재발송' : '발송'}
              </button>
            </div>

            {isEmailSent && (
              <div className="relative">
                <Input
                  type="text"
                  label="인증번호"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="인증번호 6자리를 입력하세요"
                  error={verificationError}
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isEmailVerified || isVerifying}
                  className="absolute right-0 top-1/2 -translate-y-1/2 px-6 py-2 bg-myongji text-white rounded text-lg disabled:bg-gray-400"
                  aria-label="인증번호 확인"
                >
                  {isVerifying ? '확인중...' : '확인'}
                </button>
                {isEmailVerified && (
                  <div className="text-green-500 mt-1">인증 완료</div>
                )}
              </div>
            )}
          </div>

          <Input
            type="password"
            label="비밀번호"
            {...register('password')}
            error={errors.password?.message}
            description="※ 비밀번호는 영문/숫자/특수문자를 포함해서 8-20글자로 작성해주세요"
          />

          <Input
            type="password"
            label="비밀번호 확인"
            {...register('passwordConfirm')}
            error={errors.passwordConfirm?.message}
          />

          <Input
            label="학번"
            {...register('studentId')}
            error={errors.studentId?.message}
          />

          <div className="space-y-2 relative">
            <div className="relative">
              <span className="text-red-500 absolute -left-4 text-xl">*</span>
              <label htmlFor="department" className="block font-medium text-xl">
                단과대학
              </label>
            </div>
            <select
              id="department"
              {...register('department')}
              onChange={handleDepartmentChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-myongji"
            >
              <option value="">단과대학</option>
              {Object.keys(DEPARTMENTS).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-red-500 text-sm">
                {errors.department.message}
              </p>
            )}
          </div>

          <div className="space-y-2 relative">
            <div className="relative">
              <span className="text-red-500 absolute -left-4 text-xl">*</span>
              <label htmlFor="major" className="block font-medium text-xl">
                학과
              </label>
            </div>
            <select
              id="major"
              {...register('major')}
              disabled={!watchDepartment}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-myongji disabled:bg-gray-100"
            >
              <option value="">학과</option>
              {watchDepartment &&
                DEPARTMENTS[watchDepartment as Department]?.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
            </select>
            {errors.major && (
              <p className="text-red-500 text-sm">{errors.major.message}</p>
            )}
          </div>

          <Input
            type="tel"
            label="연락처"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="'-' 없이 숫자만 입력하세요"
          />
        </div>

        <div className="pt-8 space-y-4">
          <Button variant="primary" type="submit" disabled={isPending}>
            {isPending ? '처리중...' : '완료'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/login')}
            disabled={isPending}
          >
            취소
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
