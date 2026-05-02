import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ToastProvider from "./ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://urlshare.sushanka.com.np"),
  title: "UrlShare - Share Any File with Just a URL | Free File Sharing",
  description: "Share files instantly with a simple URL. Fast, secure, and easy file sharing for everyone. No sign-up needed. Upload, get a link, and share in seconds.",
  keywords: [
    "file sharing",
    "url sharing",
    "instant sharing",
    "urlshare",
    "free file sharing",
    "temporary file sharing",
    "share files online",
    "quick file sharing",
  ],
  authors: [{ name: "UrlShare" }],
  creator: "UrlShare",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  openGraph: {
    title: "UrlShare - Share Any File with Just a URL",
    description: "Share files instantly with a simple URL. Fast, secure, and easy file sharing.",
    type: "website",
    url: "https://urlshare.sushanka.com.np",
    images: [
      {
        url: "https://urlshare.sushanka.com.np/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UrlShare - Share Any File with Just a URL",
    description: "The fastest way to share files instantly with just a URL",
  },
  alternates: {
    canonical: "https://urlshare.sushanka.com.np",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
