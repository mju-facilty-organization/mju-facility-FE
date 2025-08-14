import { AlertCircle, Clock, Calendar } from 'lucide-react';

type LoadingStateProps = {
  message?: string;
};

export const LoadingState = ({ message = '로딩 중' }: LoadingStateProps) => (
  <div className="h-96 flex items-center justify-center">
    <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mb-6 mx-auto"></div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-800">로딩 중</h3>
        <p className="text-slate-600">{message}</p>
      </div>
    </div>
  </div>
);

export const NoFacilityState = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
    <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl px-12 max-w-md">
      <div className="bg-red-50 rounded-full p-4 w-20 h-20 mx-auto mb-6">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">
        등록된 시설이 없습니다
      </h3>
      <p className="text-slate-600 leading-relaxed">
        시설 스케줄을 확인하려면 먼저 시설을 등록해주세요.
      </p>
    </div>
  </div>
);

export const NoSelectionState = () => (
  <div className="h-96 flex items-center justify-center">
    <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
      <div className="bg-blue-50 rounded-full p-6 w-24 h-24 mx-auto mb-6">
        <Clock className="mx-auto h-12 w-12 text-blue-500" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">
        시설을 선택해주세요
      </h3>
      <p className="text-slate-600 leading-relaxed max-w-md">
        상단에서 시설을 선택하시면 해당 시설의 주간 스케줄을 확인할 수 있습니다.
      </p>
    </div>
  </div>
);

export const NoDataState = () => (
  <div className="h-96 flex items-center justify-center">
    <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
      <div className="bg-amber-50 rounded-full p-6 w-24 h-24 mx-auto mb-6">
        <Calendar className="mx-auto h-12 w-12 text-amber-500" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">
        스케줄 데이터가 없습니다
      </h3>
      <p className="text-slate-600 leading-relaxed max-w-md">
        선택한 기간에 대한 스케줄 정보를 찾을 수 없습니다. 다른 주차를
        선택해보세요.
      </p>
    </div>
  </div>
);
