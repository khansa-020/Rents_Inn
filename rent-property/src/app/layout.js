import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingContacts from "./components/FloatingContacts";
import { GoogleAnalytics } from '@next/third-parties/google'
import { GoogleTagManager } from '@next/third-parties/google'

import { BookingProvider } from '../context/BookingContext'
import { AuthProvider } from '../context/AuthContext'  // 👈 Added this line

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Furnished Rooms For Rent In B17 Islamabad | Rents inn",
  description: "Furnished Rooms For Rent In B17 Islamabad with Security and All the amenities that you can think of on day and weekly basis at cheap prices.",
  other: {
    'google-site-verification': 'BxYNxckU2p_Qt2lrdnQr3KboFatYH4C7sp7TQS9kOYk',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T8QSSJ3B"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        {/* ✅ Wrap everything inside AuthProvider */}
        <AuthProvider>
          <BookingProvider>
            <GoogleAnalytics gaId="G-FRBTTKB25Q" />
            <GoogleTagManager gtmId="GTM-T8QSSJ3B" />
            <FloatingContacts />
            {children}
          </BookingProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
