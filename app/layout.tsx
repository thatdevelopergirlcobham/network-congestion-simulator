import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SimulationProvider } from "@/context/SimulationContext";
import Header from "@/components/layout/Header";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Network Congestion Simulator",
  description: "A dashboard to simulate network congestion scenarios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.className} antialiased bg-gradient-to-br from-[#0a192f] to-background`}>
        <SimulationProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            {children}
          </div>
        </SimulationProvider>
      </body>
    </html>
  );
}
