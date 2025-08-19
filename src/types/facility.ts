import { TimeSlot } from '@/types/timeSlot';

export type Facility = {
  id: number;
  facilityType: string;
  facilityNumber: string;
  images: string[];
  capacity: number;
  allowedBoundary: string[];
  supportFacilities: string[];
  pic: string;
  date: string;
  timeSlot?: TimeSlot;
  fileNames: string[];
  college: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};
