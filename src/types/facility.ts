export type Facility = {
  facilityType: string;
  facilityNumber: string;
  fileNames: string[];
  capacity: string;
  allowedBoundary: string;
  supportFacilities: string[];
  isAvailable: string;
  college: string;
  startTime: string;
  endTime: string;
  id?: number;
  images?: string[];
};
