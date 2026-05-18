'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {FadeLoader} from 'react-spinners';
import styles from './LoadingPage.module.css';

export default function LoadingPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/result');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);


    return (
        <main className={styles.loadingPage}>
            <section className={styles.loadingShell}>
                <header className={styles.logoWrap}>
                    <div className={styles.logoLine} />
                    <h1 className={styles.logoTitle}>로또 번호 생성 마법진</h1>
                    <div className={styles.logoSub}>을 만들어주는 사이트</div>
                </header>

                <div className={styles.visualSection}>
                    <div className={styles.spaceFrame}>
                        <Image
                            src="/space.png"
                            alt="우주 배경"
                            fill
                            priority
                            className={styles.spaceImage}
                        />

                        <div className={styles.spinnerNearHead}>
                            <FadeLoader
                                color="#B9FF9D99"
                                loading={true}
                                speedMultiplier={1}
                                height={13}
                                width={3.5}
                                radius={2}
                                margin={2}
                                aria-label="loading-spinner"
                            />
                        </div>

                        <div className={styles.alienLayer}>
                            <Image
                                src="/alien.png"
                                alt="외계인"
                                width={270}
                                height={270}
                                priority
                                className={styles.alienImage}
                            />
                        </div>
                    </div>
                </div>

                <p className={styles.loadingText}>우주에서 미래를 엿보는 중...</p>

            </section>
        </main>
    );
}