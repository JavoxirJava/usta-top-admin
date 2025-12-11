
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnimatePresence } from 'framer-motion'
import NavigationWrapper from "@/components/NavWrapper";
import useAuth from "@/hooks/useAuth";
import AuthWrapper from "@/components/AuthWrapper";
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
          <NavigationWrapper />
          <main>
            {/* <AuthWrapper> */}
              {children}
            {/* </AuthWrapper> */}
          </main>
        </body>

      </AnimatePresence>
    </html>
  );
}
