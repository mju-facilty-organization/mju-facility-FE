export interface TimeSlotData {
  [key: string]: string;
}

export interface FacilityData {
  id: number;
  facilityType: string;
  facilityNumber: string;
  images: string[];
  capacity: number;
  allowedBoundary: string;
  supportFacilities: string[];
  pic: string;
  date: string;
  timeSlot: TimeSlotData;
}

export interface FacilityInfoProps {
  facilityData?: FacilityData;
}
