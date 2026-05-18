'use client';

import { ReactNode, useState } from 'react';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

type QueryProviderProps = {
    children: ReactNode;
};

export default function QueryProvider({ children }: QueryProviderProps) {

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 30,
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                    mutations: {
                        retry: 0,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}