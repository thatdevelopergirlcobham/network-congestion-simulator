import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SimulationProvider } from "@/context/SimulationContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SimulationProvider>
              <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </SimulationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
