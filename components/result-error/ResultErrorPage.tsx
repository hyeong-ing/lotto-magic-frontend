import Image from 'next/image';
import Link from 'next/link';
import styles from './ResultErrorPage.module.css';

export default function ResultErrorPage() {
    return (
        <main className={styles.errorPage}>
            <section className={styles.errorShell}>
                <header className={styles.logoWrap}>
                    <div className={styles.logoLine} />

                    <h1 className={styles.logoTitle}>
                        로또 번호 생성 마법진
                    </h1>

                    <div className={styles.logoSub}>
                        만들어주는 사이트
                    </div>
                </header>

                <section className={styles.errorContent}>
                    <div className={styles.alienWrap}>
                        <Image
                            src="/alien.png"
                            alt="오류 안내 외계인"
                            width={120}
                            height={120}
                            priority
                            className={styles.alienImage}
                        />
                    </div>

                    <p className={styles.errorMessage}>
                        오류가 발생했습니다.
                    </p>

                    <Link href="/" className={styles.homeLink}>
                        메인페이지
                        <br />
                        이동하기
                    </Link>
                </section>

            </section>
        </main>
    );
}