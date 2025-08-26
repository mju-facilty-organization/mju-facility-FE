interface ReservationProcessProps {
  title: string;
  steps: string[];
}

const ReservationProcess = ({ title, steps }: ReservationProcessProps) => (
  <div>
    <h2 className="text-xl sm:text-3xl font-semibold mb-4">{title}</h2>
    <p className="text-lg sm:text-2xl text-gray-custom leading-relaxed">
      {steps.join(' > ')}
    </p>
  </div>
);

export default ReservationProcess;
