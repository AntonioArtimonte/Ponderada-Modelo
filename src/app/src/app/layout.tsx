import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from './components/navbar/ClientOnlyNavbar';
import ClientOnlyNavbar from "./components/navbar/ClientOnlyNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finanças NextJS",
  description: "Modelo para finanças com front em NextJS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#FDE8D0' }} className={inter.className}>
        <ClientOnlyNavbar />
        <main>
          {children}  
        </main>
      </body>
    </html>
  );
}
