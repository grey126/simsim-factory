# 심심공장

서버·DB·로그인 없이 즐기는 무료 SNS 놀이 MVP.

- 공개 사이트: https://grey126.github.io/simsim-factory/
- 친구 퀴즈: `#know-me` → 8개 정답 선택 → `#challenge/<base64url>` 공유 → 친구의 점수 확인
- 단톡방 캐릭터: `#group-chat` → 12문항 → 6개 결과
- 내 인생 사용설명서: `#manual` → 8문항 → 4개 결과
- 결과 이미지: 브라우저 Canvas로 1080 × 1920 PNG 생성
- 공유: Web Share 지원 시 기기 공유 메뉴, 미지원 시 복사/이미지 다운로드

## 개발과 배포
Node 20 이상(권장 22). 외부 패키지 설치 없음.

```sh
npm test
npm run build
npm start
```

미리 보기: http://127.0.0.1:4173/simsim-factory/
`npm start`는 개발 확인용 정적 파일 서버이며 실제 서비스에는 서버 프로그램이 없습니다.

GitHub Settings → Pages → Source를 GitHub Actions로 설정합니다.
main에 push하면 검증 후 dist만 Pages에 배포합니다. PR은 검증만 실행합니다.
기본 워크플로는 외부 유료 서비스나 API 키를 사용하지 않습니다.

## 구조
- index.html / assets/: 공통 페이지·스타일
- js/app.js: 화면과 URL fragment 라우팅
- js/core.js: 정답 처리, 점수, 입력 검증
- js/share.js: 이미지 생성·저장·공유
- content/*.json: 질문·선택지·결과 (콘텐츠 원본)
- scripts/build.mjs: 공개 파일만 dist에 복사
- scripts/serve.mjs: 로컬 미리 보기
- qa/core.test.mjs: 링크·점수·콘텐츠 검증
- company/: 운영 기준 및 에이전트 역할 문서
- .github/workflows/pages.yml: 검증과 Pages 배포

JSON과 화면 엔진을 분리했습니다. 새 콘텐츠 종류를 등록할 때는 app.js의 로딩 목록·홈 카드·허용 경로에도 등록합니다. JSON 추가만으로 자동 등록되지는 않습니다.

## 공유와 개인정보
친구 퀴즈의 별명과 정답은 링크의 # 뒤에 포함됩니다. 일반 HTTP 요청에는 fragment가 전송되지 않지만 암호화는 아닙니다. 링크 소유자는 답변을 디코딩할 수 있습니다. 민감한 정보를 입력하지 않도록 안내합니다. 경쟁·보상용 부정행위 방지 기능은 없습니다.

답변·진행 상태·참여자 순위는 저장하지 않습니다. 새로고침 시 진행 답변은 초기화됩니다. 친구 점수는 만든 사람에게 자동 전송되지 않습니다. 점수 이미지를 수동 공유합니다. 결과 링크에는 결과 ID만 포함됩니다.

분석·광고·추적 스크립트가 없습니다. 호스팅 업체 GitHub는 접속 제공을 위해 IP 등 접속 정보를 처리할 수 있습니다. 앱의 개인정보 안내를 참고하세요.

SNS 봇은 # 뒤를 읽지 않으므로 링크 미리 보기는 공통 사이트 설명입니다. 개인별 동적 OG 이미지와 자동 Instagram 게시 기능은 없습니다. 다운로드한 결과 이미지를 사용자가 직접 게시합니다.

## 콘텐츠 유지보수
동점이면 JSON 결과 배열의 앞선 유형을 사용합니다. 분포나 과학적 타당성을 주장하지 않습니다.
공유된 친구 링크 호환을 위해 v1 질문의 순서·선택지 순서를 변경하지 마세요. 필요하면 v2 데이터를 별도로 만들고 기존 디코더를 유지해야 합니다.

GitHub Pages의 사업·상업적 이용에는 제한이 있습니다. 이 MVP는 광고와 결제 없는 무료 놀이입니다. 광고 수익화 전 공식 정책을 검토하고 필요한 경우 호스팅을 이전해야 합니다.
https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
