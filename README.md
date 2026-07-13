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
+ Swagger와 OpenAPI를 활용해 요청과 응답 규격을 문서화하기.
+ JUnit 5, Mockito, MockMvc를 활용해 프론트엔드에 의존하지 않고 백엔드 기능 검증하기.
+ 입력값 검증과 전역 예외 처리를 적용해 일관된 오류 응답 형식 구현하기.
+ Docker, 환경 변수와 Actuator를 적용해 배포 및 운영 환경을 고려한 서버 구성하기.

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

### [ 로또 번호 계산을 인덱스 기반으로 변경 ] <br/>

1) 문제 발생 <br/>

+ 처음에는 `1~45` 범위의 로또 번호를 직접 생성한 뒤, 선택 요소 점수만큼 이동시키도록 구현했습니다.
+ 하지만 `45`를 초과한 번호를 순환시키기 위해 `-1`, `%45`, `+1` 처리를 반복해야했습니다.

<br/>

2) 원인 파악 <br/>

+ 작성된 계산식은 결국 번호를 잠시 `0~44` 범위로 바꿨다가 다시 로또 번호로 변환하는 구조였습니다.
+ 사실상 인덱스 방식과 동일한 계산을 하고 있었습니다.

<br/>

3) 문제 해결 <br/>

+ 처음부터 `0~44` 범위의 인덱스를 생성하고 점수만큼 이동한 뒤, 마지막에 `1`을 더해 로또 번호로 변환했습니다.
+ 계산용 인덱스와 실제 로또 번호를 분리하면서 코드가 간결해졌고 순환 이동 로직의 의도가 더 명확해졌습니다.

```java
int randomIndex = random.nextInt(45);
int movedIndex = (randomIndex + selectedOptionScore) % 45;
int lottoNumber = movedIndex + 1;
```

<br/>
<br/>


### [ @Valid 검증 예외 미처리 ] <br/>

1) 문제 발생 <br/>

+ 선택 요소를 2개만 전달했을 때 `400 Bad Request`가 반환되는지 확인하는 테스트를 작성했습니다.
+ 그러나 예상과 달리 `500 Internal Service Error`가 반환되었습니다.

<br/>

2) 원인 파악 <br/>

+ `LottoRequst`에 요소 개수를 3개로 제한하는 `@Size`가 적용되어 있었습니다.
+ 컨트롤러의 `@Valid`가 서비스 호출 전에 요청값을 검증하면서 `MethodArgumentNotValidException`이 먼저 발생했습니다.
+ 해당 예외를 처리하는 메서드가 없어, 모든 예외를 처리하는 `Exception` 핸들러가 이를 잡고 500 응답을 반환했습니다.
+ 따라서 Mock으로 설정한 `lottoService.draw()`는 실제로 호출되지 않았습니다.

```java
@Size(min = 3, max = 3, message = "3개의 요소를 선택해주세요.")
List<String> selectedOptions
```
<br/>

3) 문제 해결 <br/>

+ `MethodArgumentNotValidException` 전용 핸들러를 추가했습니다.
+ DTO에 작성한 검증 메시지를 추출해 일관된 `400 Bad Request` 응답으로 반환하도록 수정했습니다.

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidation(
        MethodArgumentNotValidException exception,
        HttpServletRequest request
) {
    String message = exception.getBindingResult()
            .getFieldErrors()
            .getFirst()
            .getDefaultMessage();

    return ResponseEntity.badRequest()
            .body(createErrorResponse(message, request));
}
```

<br/>
<br/>

### [ CORS 문제 ] <br/>

1) 문제 발생 <br/>

+ 프론트엔드와 백엔드가 서로 다른 주소에서 실행되어 요청이 CORS 정책에 의해 차단되었습니다.

<br/>

2) 원인 파악 <br/>

+ 백엔드에 프론트엔드 출처를 허용하는 CORS 설정이 필요했습니다.
+ 여러 API에 같은 정책을 적용해야 해 컨트롤러별 `@CrossOrigin`보다 전역 설정이 적합해보였습니다.
  
<br/>

3) 문제 해결 <br/>

+ `WebMvcConfigurer`로 `/api/**` 요청에 CORS 정책을 공통 적용했습니다.
+ 로컬과 배포 환경에서 허용할 주소가 다르므로, 주소는 설정값으로 주입받도록 구성했습니다.

```java
@Value("${app.cors.allowed-origin:http://localhost:3000}")
private String allowedOrigin;

registry.addMapping("/api/**")
        .allowedOrigins(allowedOrigin)
        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(false)
        .maxAge(3600);
```

<br/>
<br/>










