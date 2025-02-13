export interface Reservation {
  id: number;
  organization: string;
  purpose: string;
  createAt: string;
  defineDateTime: string | null;
  result: '승인대기' | '승인' | '반려' | '완료';
  facilityResponse: {
    facilityType: string;
  };
}
