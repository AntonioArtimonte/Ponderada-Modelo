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
    <html lang="en" className="h-full">
      <body style={{ backgroundColor: '#FDE8D0' }} className={`h-full flex flex-col ${inter.className}`}>
        <ClientOnlyNavbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="py-10 w-full mt-auto">
          <p className="text-center">© 2024 Crypto Predict | Todos os direitos reservados</p>
        </footer>
      </body>
    </html>
  );
}
