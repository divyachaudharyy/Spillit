import Navbar from '@/components/Navbar';
import { Syne } from "next/font/google";
const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });
interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}

