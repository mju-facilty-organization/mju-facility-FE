export interface TimeValue {
  hour: string;
  minute: string;
}

export interface FormData {
  date: string;
  startTime: TimeValue;
  endTime: TimeValue;
  groupName: string;
  attendeesName: string;
  attendeesCount: string;
  purpose: UsagePurpose | '';
  purposeDetail: string;
  professor: string;
}
