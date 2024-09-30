
import Navbar from "@/components/navbar";
import Footer from '@/components/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
          <body className="main-blue">
              {children}        
      </body>
    </html>
  );
}