import { memo } from 'react';

interface BackgroundVectorProps {
  position: 'left' | 'right';
  className?: string;
}

const BackgroundVector = memo(
  ({ position, className = '' }: BackgroundVectorProps) => (
    <div
      className={`absolute top-0 ${
        position === 'left' ? '-left-[5%]' : '-right-[5%]'
      } w-1/3 h-screen opacity-50 transition-opacity duration-300 hover:opacity-75 ${className}`}
      style={{
        backgroundImage: `url(/background${
          position === 'left' ? '1' : '2'
        }.svg)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `top ${position}`,
        backgroundSize: 'contain',
      }}
    />
  )
);

BackgroundVector.displayName = 'BackgroundVector';

export default BackgroundVector;
