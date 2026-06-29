/**
 * MiniMax API 클라이언트
 * 모델: minimax/minimax-m3
 * 엔드포인트: https://api.MiniMax.chat/v1/chat/completions (OpenAI 호환 형식)
 */

const API_ENDPOINT = 'https://api.MiniMax.chat/v1/chat/completions';
const MODEL = 'MiniMax/MiniMax-m3';

const SYSTEM_PROMPT = `당신은 보도자료(프레스 릴리스) 분석 전문가입니다.
사용자가 입력으로 주는 한국어 보도자료 본문에서 다음 4개 정보를 추출하여 **반드시 순수 JSON**으로만 응답해야 합니다.
추측할 수 없는 정보는 빈 문자열("")로 두세요.

응답 JSON 스키마:
{
  "author": "작성자(부서 또는 담당자, 예: 마케팅팀 김철수 과장)",
  "date": "보도일자(YYYY-MM-DD 형식, 본문에 명시된 경우만)",
  "title": "보도자료 제목",
  "summary": "내용 요약 (공백 포함 300자 이내, 명조/개조식 또는 깔끔한 문장형)"
}

규칙:
- JSON 외 어떤 텍스트, 마크다운, 코드블록도 출력하지 마세요.
- 4개 키 모두 반드시 포함하세요.
- 요약은 핵심 사실 위주로 간결하게 작성하세요.`;

/**
 * 텍스트를 MiniMax API에 보내 핵심 정보를 추출합니다.
 * @param {string} apiKey - 사용자 입력 API Key
 * @param {string} pdfText - PDF에서 추출한 텍스트
 * @returns {Promise<{author:string,date:string,title:string,summary:string}>}
 */
export async function analyzePressRelease(apiKey, pdfText) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API Key가 비어 있습니다. 설정에서 MiniMax API Key를 입력해 주세요.');
  }

  // 너무 긴 텍스트는 모델 컨텍스트 보호를 위해 잘라냄 (약 12,000자)
  const trimmed = (pdfText || '').slice(0, 12000);

  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `다음은 한 보도자료의 본문 텍스트입니다. 규칙에 따라 JSON으로 응답하세요.\n\n---\n${trimmed}\n---`
      }
    ],
    temperature: 0.2
  };

  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`API 오류 (${res.status}): ${errText || res.statusText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? '';

  // 응답에서 JSON 추출 (혹시 모를 마크다운 펜스 제거)
  const cleaned = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    // 실패 시 부분 파싱 시도
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) {
      parsed = JSON.parse(m[0]);
    } else {
      throw new Error('API 응답을 JSON으로 파싱할 수 없습니다. 응답: ' + cleaned.slice(0, 200));
    }
  }

  return {
    author: (parsed.author ?? '').toString().trim(),
    date: (parsed.date ?? '').toString().trim(),
    title: (parsed.title ?? '').toString().trim(),
    summary: (parsed.summary ?? '').toString().trim().slice(0, 300)
  };
}
