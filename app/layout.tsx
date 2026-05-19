import type { Metadata, Viewport } from 'next';
import './globals.css';
import MswProvider from '@/components/providers/MswProvider';

const siteName = '로또 번호 생성 마법진';

const siteDescription =
    '행운 요소 3개를 선택하면 오늘의 로또 번호와 행운 점수를 만들어주는 사이트입니다.';

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),

    title: {
        default: siteName,
        template: `%s | ${siteName}`,
    },

    description: siteDescription,

    applicationName: siteName,

    keywords: [
        '로또',
        '로또 번호',
        '로또 번호 생성',
        '로또 추천',
        '행운',
        '마법진',
        '오늘의 운세',
    ],

    authors: [
        {
            name: 'OddCoding',
        },
    ],

    creator: 'OddCoding',

    openGraph: {
        title: siteName,
        description: siteDescription,
        url: '/',
        siteName,
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: '로또 번호 생성 마법진 미리보기 이미지',
            },
        ],
        locale: 'ko_KR',
        type: 'website',
    },

    twitter: {
        card: 'summary_large_image',
        title: siteName,
        description: siteDescription,
        images: ['/og-image.png'],
    },

    icons: {
        icon: '/favicon.ico',
        apple: '/apple-icon.png',
    },

    manifest: '/manifest.json',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#efefef',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
        <body>
        <MswProvider>{children}</MswProvider>
        </body>
        </html>
    );
}