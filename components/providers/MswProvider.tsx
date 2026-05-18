'use client';

import { useEffect, useState, type ReactNode } from 'react';

type MswProviderProps = {
    children: ReactNode;
};

export default function MswProvider({ children }: MswProviderProps) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isMockingEnabled = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';

    const shouldUseMock = isDevelopment && isMockingEnabled;

    const [isReady, setIsReady] = useState(!shouldUseMock);

    useEffect(() => {
        let isMounted = true;

        const initMocks = async () => {
            if (!shouldUseMock) {
                setIsReady(true);
                return;
            }

            const { worker } = await import('../../mocks/browser');

            await worker.start({
                onUnhandledRequest: 'bypass',
            });

            if (isMounted) {
                setIsReady(true);
            }
        };

        initMocks();

        return () => {
            isMounted = false;
        };
    }, [shouldUseMock]);

    if (!isReady) {
        return null;
    }

    return <>{children}</>;
}