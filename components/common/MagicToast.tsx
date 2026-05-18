'use client';

import { Toaster, toast } from 'sonner';

type MagicToastOptions = {
    duration?: number;
};

export function showMagicToast(
    message: string,
    options?: MagicToastOptions
) {
    toast.custom(
        (toastId) => (
            <button
                type="button"
                onClick={() => toast.dismiss(toastId)}
                style={{
                    width: 'min(286px, calc(100vw - 48px))',
                    minHeight: '52px',
                    padding: '14px 22px',
                    transform: 'translateX(12.5%)',
                    border: 'none',
                    borderRadius: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background:
                        'linear-gradient(90deg, rgba(181, 162, 242, 0.96) 0%, rgba(193, 232, 252, 0.96) 100%)',
                    color: '#111111',
                    fontSize: 'clamp(0.88rem, 3.6vw, 1.08rem)',
                    fontWeight: 700,
                    lineHeight: 1.25,
                    fontFamily: 'OngleipParkDahyeon, sans-serif !important',
                    boxShadow:
                        '0 16px 38px rgba(134, 104, 214, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.55)',
                    backdropFilter: 'blur(6px)',
                }}
            >
                {/* 전달받은 message를 토스트 안에 표시한다. */}
                {message}
            </button>
        ),
        {
            duration: options?.duration ?? 1700,
            position: 'top-center',
        }
    );
}

export function MagicToaster() {
    return (
        <Toaster
            position="top-center"
            duration={1700}
            visibleToasts={2}
            gap={14}
            offset={70}
        />
    );
}