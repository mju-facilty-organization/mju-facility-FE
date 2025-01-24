export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-medium text-2xl mb-4">{children}</h2>
);

export const SectionContent = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-custom text-lg pl-4">{children}</p>
);
