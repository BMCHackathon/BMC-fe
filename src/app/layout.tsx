import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '../components/navbar';
import Footer from '../components/footer';


const inter = Inter({ subsets: ["latin"] });

// app/layout.tsx

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