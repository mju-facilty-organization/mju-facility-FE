interface PageTitleProps {
  children: React.ReactNode;
}

const PageTitle = ({ children }: PageTitleProps) => {
  return <h1 className="text-center text-4xl font-black">{children}</h1>;
};

export default PageTitle;
