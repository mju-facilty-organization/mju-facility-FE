export interface FacilityData {
  id: number;
  facilityType: string;
  facilityNumber: string;
  images: string[];
  capacity: number;
  allowedBoundary: string;
  supportFacilities: string[];
}

export interface FacilityInfoProps {
  facilityData?: FacilityData;
}
