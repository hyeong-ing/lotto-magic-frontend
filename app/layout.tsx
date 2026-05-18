import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import MswProvider from "@/components/providers/MswProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { MagicToaster } from "@/components/common/MagicToast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "로또 번호 마법 주문진",
    description: "로또 번호 마법 주문진을 만들어주는 사이트",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MswProvider>
            <QueryProvider>
                {children}
            </QueryProvider>

            <MagicToaster />
        </MswProvider>
        </body>
        </html>
    );
}