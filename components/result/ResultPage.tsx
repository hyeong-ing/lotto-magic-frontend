'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import clsx from 'clsx';

import styles from './ResultPage.module.css';
import { showMagicToast } from '@/components/common/MagicToast';
import {
    LottoDrawResponseSchema,
    type LottoDrawResponse,
} from '@/lib/api/lottoApi';

type SpellTone =
    | 'red'
    | 'pink'
    | 'orange'
    | 'green'
    | 'blue'
    | 'purple'
    | 'black';

type SpellItem = {
    tone: SpellTone;
};

const spellItemsByNumber: Record<number, SpellItem> = {
    1: {
        tone: 'red',
    },
    2: {
        tone: 'orange',
    },
    3: {
        tone: 'orange',
    },
    4: {
        tone: 'green',
    },
    5: {
        tone: 'blue',
    },
    6: {
        tone: 'blue',
    },
    7: {
        tone: 'purple',
    },
    8: {
        tone: 'pink',
    },
    9: {
        tone: 'black',
    },
};

const defaultSpellItem: SpellItem = {
    tone: 'red',
};

const ballPositionClasses = [
    styles.ballPosition1,
    styles.ballPosition2,
    styles.ballPosition3,
    styles.ballPosition4,
    styles.ballPosition5,
    styles.ballPosition6,
];

function getSpellItemByNumber(spellNumber: number): SpellItem {
    return spellItemsByNumber[spellNumber] ?? defaultSpellItem;
}

function getBallColorClass(number: number) {
    if (number >= 1 && number <= 10) {
        return styles.yellowBall;
    }

    if (number >= 11 && number <= 20) {
        return styles.blueBall;
    }

    if (number >= 21 && number <= 30) {
        return styles.redBall;
    }

    if (number >= 31 && number <= 40) {
        return styles.grayBall;
    }

    return styles.greenBall;
}

export default function ResultPage() {
    const router = useRouter();

    const [result, setResult] = useState<LottoDrawResponse | null>(null);

    const spellItem = useMemo(() => {
        if (!result) {
            return null;
        }

        return getSpellItemByNumber(result.spellNumber);
    }, [result]);

    const copiedNumberText = useMemo(() => {
        if (!result) {
            return '';
        }

        return result.numbers.join(', ');
    }, [result]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            const savedResult = sessionStorage.getItem('lotto-result');

            if (!savedResult) {
                showMagicToast('저장된 결과가 없어요.');
                router.replace('/');
                return;
            }

            try {
                const parsedJson = JSON.parse(savedResult);
                const safeResult = LottoDrawResponseSchema.parse(parsedJson);

                setResult(safeResult);
            } catch (error) {
                console.error(error);

                sessionStorage.removeItem('lotto-result');
                showMagicToast('결과 정보를 읽지 못했어요.');
                router.replace('/');
            }
        }, 0);

        return () => window.clearTimeout(timer);
    }, [router]);

    const handleRetryClick = () => {
        sessionStorage.removeItem('lotto-result');
        router.push('/');
    };

    const handleCopyClick = async () => {
        if (!copiedNumberText) {
            showMagicToast('복사할 번호가 없어요.');
            return;
        }

        try {
            await navigator.clipboard.writeText(copiedNumberText);
            showMagicToast('복사완료!');
        } catch (error) {
            console.error(error);
            showMagicToast('번호 복사에 실패했어요.');
        }
    };

    if (!result) {
        return (
            <main className={styles.resultPage}>
                <p className={styles.loadingText}>결과를 불러오는 중...</p>
            </main>
        );
    }

    return (
        <main className={styles.resultPage}>
            <section className={styles.resultShell}>
                <header className={styles.logoWrap}>
                    <div className={styles.logoLine} />

                    <h1 className={styles.logoTitle}>
                        로또 번호 생성 마법진
                    </h1>

                    <div className={styles.logoSub}>
                        을 만들어주는 사이트
                    </div>
                </header>

                <section className={styles.luckInfo}>
                    <p>
                        오늘의 행운 : <strong>{result.luckScore}점</strong>
                    </p>
                    <p>{result.luckMessage}</p>
                </section>

                <section
                    className={styles.magicStage}
                    aria-label="생성된 로또 번호"
                >
                    {spellItem && (
                        <motion.div
                            className={styles.spellImageFrame}
                            data-tone={spellItem.tone}
                            initial={{
                                opacity: 0,
                                y: 24,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                y: [0, -5, 0],
                                scale: 1,
                            }}
                            transition={{
                                opacity: {
                                    duration: 0.75,
                                    ease: 'easeOut',
                                },
                                scale: {
                                    duration: 0.75,
                                    ease: 'easeOut',
                                },
                                y: {
                                    duration: 3.4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                },
                            }}
                        >
                            <Image
                                src={result.spellImageUrl}
                                alt="랜덤 마법진"
                                width={366}
                                height={260}
                                priority
                                className={styles.spellImage}
                            />
                        </motion.div>
                    )}

                    <div className={styles.ballArea}>
                        {result.numbers.map((number, index) => (
                            <motion.div
                                key={`${number}-${index}`}
                                className={clsx(
                                    styles.lottoBall,
                                    getBallColorClass(number),
                                    ballPositionClasses[index]
                                )}
                                initial={{
                                    opacity: 0,
                                    y: 26,
                                    scale: 0.82,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: [0, -8, 0],
                                    scale: 1,
                                }}
                                transition={{
                                    opacity: {
                                        duration: 0.45,
                                        delay: 0.12 * index,
                                        ease: 'easeOut',
                                    },
                                    scale: {
                                        duration: 0.45,
                                        delay: 0.12 * index,
                                        ease: 'easeOut',
                                    },
                                    y: {
                                        duration: 2.4,
                                        delay: 0.12 * index,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    },
                                }}
                            >
                                {number}
                            </motion.div>
                        ))}
                    </div>
                </section>

                <nav className={styles.buttonArea} aria-label="결과 페이지 버튼">
                    <button
                        type="button"
                        className={styles.resultButton}
                        onClick={handleRetryClick}
                    >
                        다시
                        <br />
                        시도하기
                    </button>

                    <button
                        type="button"
                        className={styles.resultButton}
                        onClick={handleCopyClick}
                    >
                        번호
                        <br />
                        복사하기
                    </button>

                    <a
                        className={styles.resultButton}
                        href="https://www.dhlottery.co.kr/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        로또
                        <br />
                        사러가기
                    </a>
                </nav>
            </section>
        </main>
    );
}
