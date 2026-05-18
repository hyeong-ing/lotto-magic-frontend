import { z } from 'zod';

export const LottoOptionsResponseSchema = z.object({
    options: z.array(z.string()),
});

export const DrawLottoRequestSchema = z.object({
    selectedOptions: z.array(z.string()).length(3),
});

export const LottoDrawResponseSchema = z.object({
    numbers: z
        .array(z.number().int().min(1).max(45))
        .length(6)
        .refine(
            (numbers) => new Set(numbers).size === numbers.length,
            {
                message: '로또 번호는 중복될 수 없습니다.',
            }
        ),

    luckScore: z.number().int().min(0).max(100),
    luckMessage: z.string(),
    selectedOptions: z.array(z.string()).length(3),

    spellNumber: z.number().int().min(1).max(9),
    spellImageUrl: z.string(),
});

export type LottoOptionsResponse = z.infer<typeof LottoOptionsResponseSchema>;
export type DrawLottoRequest = z.infer<typeof DrawLottoRequestSchema>;
export type LottoDrawResponse = z.infer<typeof LottoDrawResponseSchema>;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

function createApiUrl(path: string) {
    return `${API_BASE_URL}${path}`;
}

async function getErrorMessage(response: Response) {
    try {
        const errorBody = await response.json();

        if (
            errorBody &&
            typeof errorBody === 'object' &&
            'message' in errorBody &&
            typeof errorBody.message === 'string'
        ) {
            return errorBody.message;
        }

        return '요청 처리 중 오류가 발생했어요.';
    } catch {
        return '요청 처리 중 오류가 발생했어요.';
    }
}

export async function getLottoOptions(): Promise<LottoOptionsResponse> {
    const response = await fetch(createApiUrl('/api/lotto/options'));

    if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
    }

    const data = await response.json();

    return LottoOptionsResponseSchema.parse(data);
}

export async function drawLottoNumbers(
    requestBody: DrawLottoRequest
): Promise<LottoDrawResponse> {
    const safeRequestBody = DrawLottoRequestSchema.parse(requestBody);

    const response = await fetch(createApiUrl('/api/lotto/draw'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(safeRequestBody),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
    }

    const data = await response.json();

    return LottoDrawResponseSchema.parse(data);
}