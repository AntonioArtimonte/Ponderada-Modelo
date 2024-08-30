import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import Navbar from './components/navbar/NavBar'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finanças NextJS",
  description: "Modelo para finanças com front em NextJS",
};

export default function RootLayout() {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#FDE8D0'}}>
        <Navbar />
      </body>
    </html>
  );
}