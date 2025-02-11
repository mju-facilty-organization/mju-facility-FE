import { ReactNode } from 'react';

interface FacilityDetailItemProps {
  icon: ReactNode;
  label: string;
  value: string | number;
}

export const FacilityDetailItem = ({
  icon,
  label,
  value,
}: FacilityDetailItemProps) => {
  return (
    <div className="flex items-start">
      <dt className="w-32 text-gray-600 flex items-center">
        {icon}
        {label}
      </dt>
      <dd className="flex-1">{value}</dd>
    </div>
  );
};
