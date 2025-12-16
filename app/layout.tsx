import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { ComfortProvider } from "@/contexts/ComfortContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
});

const caveat = Caveat({
    subsets: ["latin"],
    variable: '--font-caveat',
    weight: ['400', '700'],
});

export const metadata: Metadata = {
    title: "Period Comfort Companion 🌸",
    description: "Your safe space for comfort, distraction, and care during your period",
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${caveat.variable} font-sans antialiased`}>
                <ComfortProvider>
                    <CurrencyProvider>
                        {children}
                    </CurrencyProvider>
                </ComfortProvider>
            </body>
        </html>
    );
}
