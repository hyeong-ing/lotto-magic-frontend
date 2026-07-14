# 🔮 Lotto Magic 🪄

<br/>

<p align="center">

  <br/>
  프론트엔드와 백엔드를 분리한 프로젝트를 여러 번 진행했지만, <br/>
  두 영역을 독립적인 관점에서 설계하고 개발한 경험은 부족했습니다. <br/>
  그래서 이번 프로젝트에서는 역할과 책임을 명확히 나누고, <br/>
  API 규격을 기준으로 독립적으로 개발할 수 있는 구조를 구현해보고자 했습니다. <br/>
  <br/>

  <br/>
  
  <img width="800" height="450" alt="image" src="https://github.com/user-attachments/assets/f6e5751e-2a42-4f00-ae1c-4f7bae3f1a28" />
  
</p>

<br/>
<br/>
<br/>

### 🔶 프로젝트 관련 링크

+ [Blog (프로젝트 기록)](https://post-this.tistory.com/category/%F0%9F%92%BB%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%F0%9F%8D%80%ED%96%89%EC%9A%B4%EC%9D%98%20%EB%A1%9C%EB%98%90%20%EB%A7%88%EB%B2%95%EC%A7%84%F0%9F%9B%B8)
+ Youtube (동작화면)
+ [Figma (다이어그램)](https://www.figma.com/board/l2IJSK7tnbOUJtfsGLfCHB/Lotto-Magic-Circle?node-id=0-1&t=GXmAo1ozuWh2cIsq-1)


<br/>
<br/>

### 🔶 프로젝트 설명

<br/>

<p align="center">
  <img width="800" height="500" alt="image" src="https://github.com/user-attachments/assets/26fa638a-5937-4133-87e0-91c0ca8db71c" />
</p>

<br/>

+ 사용자는 16개의 행운의 요소 중 원하는 요소 3개를 선택할 수 있습니다.
+ 선택한 요소의 점수를 반영해서 중복되지 않는 로또 번호 6개를 생성합니다.
+ 요소 점수와 날짜, 무작위 값을 조합해 행운 점수를 계산합니다.
+ 점수 구간에 따른 행운의 메시지와 무작위 마법진 이미지를 제공합니다.
+ 별도의 데이터베이스 없이 요청마다 새로운 결과를 생성합니다.

<br/>
<br/>

### 🔶 기술 스택 & 라이브러리
+ 프론트엔드 : TypeScript, Next.js 16, React 19
+ 서버 상태 관리 : TanStack React Query
+ 데이터 검증 : Zod
+ API 모킹 : MSW
+ UI 및 애니메이션 : Framer Motion, React Spinners, Sonner
+ 배포 : Vercel

<br/>
<br/>


### 🔶 프로젝트 목표
+ Next.js의 App Router의 파일 기반 라우팅과 프로젝트 구조 이해하기
+ MSW로 백엔드 API를 모킹하여 프론트엔드 기능을 독립적으로 개발하고 검증하기
+ React Query, Zod, Framer Motion 등 다양한 라이브러리의 역할과 사용 방법 익히기
+ 모바일 화면을 고려한 반응형 UI를 구현하며 화면 크기에 따른 요소 배치와 크기 조정 경험하기


<br/>
<br/>

### 🔶 핵심 로직
1) 선택 요소 상태 관리 <br/>

+ 서버에서 선택 요소 목록을 불러와 화면에 표시했습니다.
+ 사용자가 요소를 선택하거나 해제할 수 있으며, 최대 3개까지만 선택하도록 제한했습니다.

```tsx
if (selectedOptions.includes(value)) {
    setSelectedOptions((prev) => prev.filter((item) => item !== value));
} else if (selectedOptions.length < 3) {
    setSelectedOptions((prev) => [...prev, value]);
}
```

<br/>
<br/>

----

2) API 요청 및 응답 검증 <br/>

+ React Query의 `useMutation`으로 선택한 요소를 백엔드에 전달했습니다.
+ Zod로 요청과 응답의 데이터 구조를 정의하고 `parse()`를 사용해 실제 값이 형식에 맞는지 검증했습니다.

```tsx
drawMutation.mutate({ selectedOptions });
```
```tsx
const DrawLottoRequestSchema = z.object({
    selectedOptions: z.array(z.string()).length(3),
});

const safeRequest = DrawLottoRequestSchema.parse(requestBody);
const safeResponse = LottoDrawResponseSchema.parse(data);
```

<br/>
<br/>

----

3) 페이지 간 결과 전달 <br/>

+ API 응답을 `sessionStorage`에 저장한 뒤 로딩 페이지로 이동했습니다.
+ 로딩이 끝나면 결과 페이지에서 데이터를 다시 불러와 화면에 표시했습니다.
+ 저장된 값이 없거나 형식이 잘못된 경우 메인 페이지로 이동하도록 처리했습니다.

```tsx
sessionStorage.setItem('lotto-result', JSON.stringify(result));
router.push('/loading');
```
```tsx
const savedResult = sessionStorage.getItem('lotto-result');
const result = LottoDrawResponseSchema.parse(JSON.parse(savedResult));
```

<br/>
<br/>
<br/>


### 🔶 문제 해결

### [ 모바일 화면 요소 배치 문제 ] <br/>

1) 문제 발생 <br/>

+ 초기 레이아웃이 데스크톱 화면에 최적화되어 있어, 모바일 기기에서는 UI 요소가 서로 겹치거나 정렬이 어긋나는 현상이 있었습니다
+ 특히 절대 위치로 배치된 로또 공은 화면 너비가 줄어들어도 기존 좌표를 유지해 별도의 조정이 필요했습니다.

<br/>

2) 원인 파악 <br/>

+ 마법진과 로또 공에 고정된 크기와 위치값이 사용되어 화면만 줄이면 요소 사이의 비율과 간격이 함께 유지되지 않았습니다.
+ 따라서 모든 요소를 일괄적으로 축소하기보다 화면 크기에 따라 크기와 위치를 각각 조정해야 했습니다.

<br/>

3) 문제 해결 <br/>

+ 콘텐츠 너비는 화면을 넘지 않도록 제한하고 높이는 모바일 브라우저 영역을 반영하는 `dvh` 단위를 사용했습니다.
+ `420px`과 `360px`을 기준으로 마법진, 로또 공과 버튼의 크기 및 위치를 단계적으로 조정했습니다.
 
```css
.resultShell {
    width: min(100%, 366px);
    min-height: calc(100dvh - 54px);
}

@media (max-width: 420px) {
    .lottoBall {
        width: 64px;
        height: 64px;
    }
}

@media (max-width: 360px) {
    .lottoBall {
        width: 58px;
        height: 58px;
    }
}
```

<br/>
<br/>












