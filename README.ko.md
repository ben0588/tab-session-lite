<p align="right">
  <a href="./README.md">繁體中文</a> | <a href="./README.en.md">English</a> | <a href="./README.ja.md">日本語</a> | <strong>한국어</strong> | <a href="./README.zh-Hans.md">简体中文</a>
</p>

# Tab Session Lite - 가볍고 빠른 탭 세션 관리자

극도로 가볍고 속도를 최우선으로 하는 Chrome 탭 세션 관리 확장 프로그램입니다.

**핵심 가치: Instant Save, Zero CPU, Local Only.**

[![Version](https://img.shields.io/badge/version-1.6.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/pdfabpgjkeplngckadhocdioamjbdpdf?label=Version&logo=google-chrome)](https://chromewebstore.google.com/detail/tab-session-lite/pdfabpgjkeplngckadhocdioamjbdpdf)

## 주요 기능

- **원클릭 즉시 저장 (Instant Save)**: 열려 있는 모든 창, 탭 및 그룹을 밀리초 단위로 즉시 캡처.
- **Zero-CPU Lazy Loading 아키텍처**:
  - 4KB 미만의 초경량 자리표시자 기술로 200개 이상의 탭을 복원해도 CPU/메모리 부하 제로.
  - 실제로 클릭하여 활성화한 탭만 웹페이지를 로드하여 메모리 낭비와 브라우저 멈춤 방지.
  - 지연 없는 복원: 탭 바에 즉시 모든 탭이 표시됨.
- **완벽한 상태 복원 (Full Fidelity)**:
  - 창 위치 및 크기 복원: 원래의 창 크기, 화면 좌표 및 다중 모니터 배치를 자동으로 복원.
  - 탭 그룹 복원: Chrome 기본 탭 그룹(이름, 색상, 배치 순서) 완벽 보존.
- **유연한 복원 옵션**:
  - 전체 복원: 모든 창과 탭을 한 번에 복원.
  - 특정 창 복원: 선택한 창과 해당 탭만 복원.
  - 단일 탭 열기: 목록에서 특정 페이지만 즉시 열기.
- **최근 삭제 보관함 (Recently Deleted Buffer)**:
  - 최근 삭제된 세션 7개를 자동으로 임시 보관(FIFO).
  - 실수로 인한 데이터 유실 걱정 없이 클릭 한 번으로 메인 목록 복구.
- **듀얼 테마 시스템 (Dual Theme System)**:
  - 클래식 라이트: 깔끔하고 산뜻한 표준 UI 스타일.
  - Raycast 다크: 순수 블랙 캔버스와 1px 헤어라인 테두리를 적용한 개발자 맞춤형 다크 모드.
- **철저한 개인정보 보호 (Local-Only Architecture)**:
  - 데이터는 100% 브라우저 로컬 저장소(`chrome.storage.local`)에만 저장되며 외부 서버 전송 일체 없음.
  - 시크릿 모드(Incognito) 창 자동 제외.
- **오프라인 데이터 관리**:
  - 인플레이스 이름 수정 및 현재 활성 탭으로 원클릭 덮어쓰기 지원.
  - 표준 JSON 형식 가져오기/내보내기(병합/대체 모드 지원)를 통한 안전한 영구 백업.
- **다국어 완벽 지원**:
  - 한국어, 번체 중국어, 영어, 일본어, 간체 중국어.

## 기술 스택

- **프레임워크**: React 19 + Vite 5
- **스타일링**: Tailwind CSS 3.x (Raycast Dark 스타일)
- **확장 프로그램 엔진**: @crxjs/vite-plugin + Manifest V3
- **다국어 처리**: react-i18next + i18next
- **스토리지**: chrome.storage.local

## 개발 명령어

```bash
# 종속성 설치
npm install

# 개발 모드 (HMR 지원)
npm run dev

# 프로덕션 빌드
npm run build

# 아이콘 생성
npm run icons
```

## 개발자 모드 설치 방법

1. `npm run build` 명령어로 `dist` 디렉터리를 생성합니다.
2. Chrome 브라우저에서 `chrome://extensions/`로 이동합니다.
3. 우측 상단의 **개발자 모드**를 활성화합니다.
4. **압축해제된 확장 프로그램을 로드합니다**를 클릭하고 `dist` 폴더를 선택합니다.

## 라이선스

[MIT](./LICENSE) © ben0588
