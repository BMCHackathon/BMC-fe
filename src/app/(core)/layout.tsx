
import Navbar from "@/components/navbar";
import Footer from '@/components/footer';
import BottomDock from "@/components/BottomDock";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

          <body className="">
             <TooltipProvider>
              {children}    
          <BottomDock />
          </TooltipProvider>
              
      </body>
    </html>
  );
}