import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Casa de Bloom",
  description: "Where connections become opportunities. Register for upcoming Casa de Bloom day clubs, singles events, and community trade parties.",
  metadataBase: new URL("https://register.casadebloomsd.com"),
  keywords: ["Casa de Bloom", "Event Registration", "Day Club", "San Diego Events", "Community"],
  openGraph: {
    title: "Casa de Bloom | Event Registration",
    description: "Where connections become opportunities. Register for upcoming Casa de Bloom day clubs, singles events, and community trade parties.",
    url: "https://register.casadebloomsd.com",
    siteName: "Casa de Bloom",
    images: [
      {
        url: "/assets/images/Casa_de_Bloom_logo_2.png",
        width: 1200,
        height: 630,
        alt: "Casa de Bloom — Where connections become opportunities",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* <Navbar /> */}
        <main>{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}