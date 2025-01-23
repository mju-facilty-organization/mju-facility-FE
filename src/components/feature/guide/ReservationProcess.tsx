interface ReservationProcessProps {
  title: string;
  steps: string[];
}

const ReservationProcess = ({ title, steps }: ReservationProcessProps) => (
  <div>
    <h2 className="text-3xl font-semibold mb-4">{title}</h2>
    <p className="text-2xl text-gray-custom leading-relaxed">
      {steps.join(' > ')}
    </p>
  </div>
);

export default ReservationProcess;
