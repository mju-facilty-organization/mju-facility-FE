export type Facility = {
  facilityType: string;
  facilityNumber: string;
  fileNames: string[];
  capacity: number;
  allowedBoundary: string[];
  supportFacilities: string[];
  isAvailable: string;
  college: string;
  startTime: string;
  endTime: string;
  id?: string | number;
  images?: string[];
  timeSlot?: Record<string, string>;
};
