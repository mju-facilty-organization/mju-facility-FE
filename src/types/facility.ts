export type Facility = {
  facilityType: string;
  facilityNumber: string;
  fileNames: string[];
  capacity: number;
  allowedBoundary: string;
  supportFacilities: string[];
  isAvailable: boolean;
  college: string;
  startTime: string;
  endTime: string;
  id?: number;
  images?: string[];
};
