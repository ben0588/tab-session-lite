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

- 🚀 **원클릭 즉시 저장**: 열려 있는 모든 창의 모든 탭을 한 번의 클릭으로 캡처
- 📋 **세션 기록 관리**: 시간 순서대로 저장된 세션 목록 확인
- 🔄 **유연한 복원 기능**:
  - 전체 복원: 모든 창과 탭을 한 번에 복원
  - 특정 창 복원: 선택한 창과 해당 탭만 복원
  - 단일 탭 열기: 목록에서 특정 페이지만 즉시 열기
- 📍 **완벽한 상태 복원**:
  - 창 위치 및 크기 복원: 원래의 창 크기와 화면 좌표를 자동으로 복원
  - 탭 그룹 복원: 탭 그룹의 이름, 색상 및 배치 순서 완벽 유지
- ✏️ **사용자 맞춤 관리**:
  - 세션 이름 수정으로 손쉬운 정리
  - 기록 업데이트: 현재 열린 탭으로 기존 세션 덮어쓰기
  - 세부 삭제: 단일 탭, 특정 창 또는 전체 세션 삭제
  - 필요 시 전체 기록 초기화
- 📦 **내보내기 / 가져오기**: JSON 형식의 백업 및 데이터 마이그레이션 지원
- 🔒 **철저한 개인정보 보호**:
  - 데이터는 브라우저 로컬 저장소(`chrome.storage.local`)에만 저장되며 외부 서버로 절대 전송되지 않음
  - 시크릿 모드(Incognito) 창 자동 제외
- ⚡ **Zero-CPU Lazy Loading 아키텍처**:
  - 4KB 미만의 초경량 플레이스홀더 기술로 200개 이상의 탭을 복원해도 CPU/메모리 부하 제로
  - 사용자가 실제로 클릭하여 활성화한 탭만 실제 웹 페이지를 로드
  - 지연 없는 복원: 탭 바에 즉시 모든 탭이 표시됨
- 🌐 **다국어 지원**: 번체 한국어, 영어, 일본어, 한국어, 간체 중국어

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
