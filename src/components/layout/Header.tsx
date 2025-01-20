import logo from '@/assets/logo.png';
export default function Header() {
  return (
    <div className="w-full h-32 bg-myongji shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center">
      <img className="h-16 ml-6" src={logo} alt="명지대학교" />
    </div>
  );
}
