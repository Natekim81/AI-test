# 보도자료 AI 분석기 (Press Release AI Analyzer)

여러 개의 보도자료 PDF를 업로드하면 **MiniMax API (모델: minimax/minimax-m3)** 를 통해 핵심 정보를 자동으로 추출하여 표 형태로 보여주는 웹 애플리케이션입니다.

## 추출 항목
- **작성자** (부서 / 담당자)
- **보도일자**
- **제목**
- **내용 요약** (공백 포함 300자 이내)

## 주요 기능
- PDF 다중 드래그 앤 드롭 업로드
- 사용자 직접 MiniMax API Key 입력 (브라우저 세션 저장)
- 실시간 추출 결과 테이블 표시
- 결과 Excel(.xlsx) / CSV 다운로드
- 진행률 표시(스피너 + 프로그레스 바)

## 기술 스택
- React 18 + Vite 5
- Tailwind CSS 3
- pdfjs-dist (PDF 텍스트 추출)
- xlsx (Excel/CSV 내보내기)

## 시작하기
```bash
npm install
npm run dev
```
브라우저에서 `http://localhost:5173` 접속.

## 사용 방법
1. 우측 상단 **설정** 버튼을 눌러 MiniMax API Key 입력 → 저장
2. PDF 파일들을 드래그하거나 클릭하여 업로드
3. 자동으로 PDF 분석 → 표에 행이 채워짐
4. **Excel/CSV 다운로드** 버튼으로 결과 저장

## 주의
- API Key는 브라우저 세션/로컬스토리지에만 저장되며 외부로 전송되지 않습니다.
- 텍스트가 추출되지 않는 스캔본 PDF는 분석이 어렵습니다.
