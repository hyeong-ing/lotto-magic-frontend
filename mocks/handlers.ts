import { http, HttpResponse } from 'msw';

const optionItems = [
    '행운',
    '조상님의도움',
    '제왕의자리',
    '개쩌는꿈',
    '나의직감',
    '엘프의선견지명',
    '한치앞이보이는내인생',
    '내돈',
    '다이아몬드광산주인',
    '개꿈',
    '내인생수직상승황금티켓',
    '요정님도와죠',
    '내집마련',
    '외계인의텔레파시',
    '퇴사각',
    '1등이필요해',
];

type DrawRequestBody = {
    selectedOptions: string[];
};

export const handlers = [
    http.get('/api/lotto/options', () => {
        return HttpResponse.json({
            options: optionItems,
        });
    }),

    http.post('/api/lotto/draw', async ({ request }) => {
        const body = (await request.json()) as Partial<DrawRequestBody>;
        const selectedOptions = body.selectedOptions ?? [];

        if (selectedOptions.length !== 3) {
            return HttpResponse.json(
                {
                    message: '요소 3가지를 선택해주세요.',
                },
                { status: 400 }
            );
        }

        return HttpResponse.json({
            numbers: [3, 11, 19, 27, 34, 42],
            luckScore: 84,
            luckMessage: '우주 통신 연결 완료',
            selectedOptions,
            spellNumber: 3,
            spellImageUrl: '/images/spells/3.png',
        });
    }),
];