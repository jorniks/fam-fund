import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import RecoidContextProvider from "@/providers/recoilContextProvider";
import Web3ContextProvider from "@/providers/web3ReactProvider";
import NavBar from "@/components/navbar";
import { Toaster } from "@/components/toaster/toaster";

const font = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Family Finance Dao",
  description: "Manage family spending by allowing family members vote on any budget",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className + " bg-no-repeat bg-cover h-screen overflow-hidden"}>
        <RecoidContextProvider>
          <Web3ContextProvider>
            <NavBar />
            
            {children}
            <Toaster />
          </Web3ContextProvider>
        </RecoidContextProvider>
      </body>
    </html>
  );
}
