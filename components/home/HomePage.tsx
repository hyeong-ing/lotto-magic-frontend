'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

import styles from './HomePage.module.css';
import { getLottoOptions, drawLottoNumbers } from '@/lib/api/lottoApi';
import { showMagicToast } from '@/components/common/MagicToast';

type OptionItem = {
    value: string;
    label: string;
    emoji: string;
};

const optionMetaMap: Record<string, { label: string; emoji: string }> = {
    행운: { label: '행운', emoji: '🍀' },
    조상님의도움: { label: '조상님의 도움', emoji: '💀' },
    개쩌는꿈: { label: '개쩌는꿈', emoji: '☁️' },
    나의직감: { label: '나의 직감', emoji: '🫵' },
    외계인의텔레파시: { label: '외계인의 텔레파시', emoji: '🛸' },
    내인생수직상승황금티켓: { label: '내인생수직상승황금티켓', emoji: '🎫' },
    내집마련: { label: '내집마련', emoji: '🏠' },
    다이아몬드광산주인: { label: '다이아몬드 광산주인', emoji: '💎' },
    퇴사각: { label: '퇴사각...', emoji: '✍️' },
    제왕의자리: { label: '제왕의 자리', emoji: '👑' },
    한치앞이보이는내인생: { label: '한치 앞이 보이는 내인생', emoji: '🕶️' },
    요정님도와죠: { label: '요정님 도와죠', emoji: '🧚' },
    '1등이필요해': { label: '1등이 필요해', emoji: '🥇' },
    내돈: { label: '내 돈', emoji: '💵' },
    엘프의선견지명: { label: '엘프의 선견지명', emoji: '🧝‍♀️' },
    개꿈: { label: '개꿈', emoji: '🐕' },
};

export default function HomePage() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const {
        data: optionData,
        isLoading: isLoadingOptions,
        isError: isOptionError,
    } = useQuery({
        queryKey: ['lotto-options'],
        queryFn: getLottoOptions,
    });

    const optionItems = useMemo<OptionItem[]>(() => {
        const options = optionData?.options ?? [];

        return options.map((value) => {
            const meta = optionMetaMap[value];

            return {
                value,
                label: meta?.label ?? value,
                emoji: meta?.emoji ?? '✨',
            };
        });
    }, [optionData]);

    const drawMutation = useMutation({
        mutationFn: drawLottoNumbers,

        onSuccess: (result) => {
            sessionStorage.setItem('lotto-result', JSON.stringify(result));
            router.push('/loading');
        },

        onError: (error) => {
            const message =
                error instanceof Error
                    ? error.message
                    : '결과를 생성하지 못했습니다.';

            showMagicToast(message);
        },
    });

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleOptionClick = (value: string) => {
        const isSelected = selectedOptions.includes(value);

        if (isSelected) {
            setSelectedOptions((prev) => prev.filter((item) => item !== value));
            return;
        }

        if (selectedOptions.length >= 3) {
            showMagicToast('요소는 3개까지만 선택할 수 있어요.');
            return;
        }

        setSelectedOptions((prev) => [...prev, value]);
    };

    const handleCreateClick = () => {
        if (selectedOptions.length !== 3) {
            showMagicToast('요소 3가지를 선택해주세요.');
            return;
        }

        drawMutation.mutate({
            selectedOptions,
        });
    };

    return (
        <main className={styles.home}>
            <section className={styles.shell}>
                <div className={styles.logoWrap}>
                    <div className={styles.logoLine} />

                    <h1 className={styles.logoTitle}>
                        로또 번호 생성 마법진
                    </h1>

                    <div className={styles.logoSub}>
                        을 만들어주는 사이트
                    </div>
                </div>

                <div className={styles.descBox}>
                    <div className={styles.descHead}>
                        ___/ᐠ｡ꞈ｡ᐟ\___ ㅤ설명ㅤ___/ᐠ｡ꞈ｡ᐟ\___
                    </div>

                    <p className={styles.descText}>
                        로또 번호 주문진을 만들어주는 사이트입니다.
                        <br />
                        원하는 요소 3가지를 넣어주시면
                        <br />
                        쿵짝쿵짝~ 쨔잔! 하고 만들어드립니다.
                        <br />
                        무료 배포라 로딩이 느리니 이해부탁드려요.
                    </p>
                </div>

                <div className={styles.toggleWrap}>
                    <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={handleToggle}
                        aria-expanded={isOpen}
                        aria-label="선택 요소 열기"
                    >
                        <div className={styles.toggleBar} />

                        <div
                            className={clsx(
                                styles.toggleArrow,
                                isOpen && styles.rotated
                            )}
                        >
                            ↓
                        </div>
                    </button>
                </div>

                <div
                    className={clsx(
                        styles.optionsPanel,
                        isOpen && styles.optionsPanelOpen
                    )}
                >
                    {isLoadingOptions && (
                        <div className={styles.selectedInfo}>
                            선택 요소를 불러오는 중...
                        </div>
                    )}

                    {!isLoadingOptions && isOptionError && (
                        <div className={styles.selectedInfo}>
                            선택 요소를 불러오지 못했습니다.
                        </div>
                    )}

                    {!isLoadingOptions && !isOptionError && (
                        <>
                            <div className={styles.optionsGrid}>
                                {optionItems.map((item) => {
                                    const isSelected = selectedOptions.includes(item.value);

                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            className={clsx(
                                                styles.optionButton,
                                                isSelected && styles.optionButtonSelected
                                            )}
                                            onClick={() => handleOptionClick(item.value)}
                                        >
                                            <span className={styles.optionInner}>
                                                <span className={styles.checkboxBox}>
                                                    {isSelected ? '✓' : ''}
                                                </span>

                                                <span className={styles.optionLabel}>
                                                    <span>{item.emoji}</span>
                                                    <span className={styles.labelText}>
                                                        {item.label}
                                                    </span>
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className={styles.selectedInfo}>
                                선택한 요소:{' '}
                                <strong>{selectedOptions.length}</strong> / 3
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.createArea}>
                    <button
                        type="button"
                        className={styles.createButton}
                        onClick={handleCreateClick}
                        disabled={drawMutation.isPending}
                    >
                        {drawMutation.isPending ? (
                            <>
                                결과 생성
                                <br />
                                중...
                            </>
                        ) : (
                            <>
                                쿵짝쿵짝
                                <br />
                                만들기
                            </>
                        )}
                    </button>
                </div>

                <footer className={styles.footer}>
                    <strong>오류제보_</strong>
                    <strong>e-mail : oddcoding64@gmail.com</strong>
                </footer>
            </section>
        </main>
    );
}