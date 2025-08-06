export type ApprovalRole = 'PIC' | 'PROFESSOR';
export type ApprovalStatus = 'PERMITTED' | 'DENIED';
export type RentalApplicationResult = `${ApprovalRole}_${ApprovalStatus}`;

export type ApprovalResponse = {
  rentalApplicationResult: RentalApplicationResult;
  reason: string | null;
};
