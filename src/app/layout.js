import Cheking from "@/components/Cheking";
import NavigationWrapper from "@/components/NavWrapper";
import { AnimatePresence } from 'framer-motion';
import { Geist, Geist_Mono } from "next/font/google";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import "./globals.css";
import Snow from "@/components/animations/Snow";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Admin Panel',
  description: 'Admin panel for managing application data',
};


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <AnimatePresence mode="wait">
        <body>
          <Cheking />
          <NavigationWrapper />
          <main>
            {/* <AuthWrapper> */}
            <Snow />
            {children}
            <Toaster richColors position="top-right" />
            {/* </AuthWrapper> */}
          </main>
        </body>

      </AnimatePresence>
    </html>
  );
}
