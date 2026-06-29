import { useMemo, useState } from 'react';
import Settings from './components/Settings';
import FileDropzone from './components/FileDropzone';
import ResultsTable from './components/ResultsTable';
import { extractTextFromPdf } from './utils/pdfExtractor';
import { analyzePressRelease } from './utils/apiClient';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ total: 0, done: 0 });

  const handleFilesAdded = async (files) => {
    if (!apiKey) {
      alert('먼저 우측 상단 설정에서 MiniMax API Key를 입력/저장해 주세요.');
      return;
    }

    // 1. FileList 대용 및 안전한 배열 변환
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setBusy(true);

    // 2. 고유 ID(id)를 추가하여 파일명 중복이나 비동기 상태 꼬임 완전히 방지
    const initial = fileArray.map((f, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      fileName: f.name,
      title: '',
      date: '',
      author: '',
      summary: '',
      status: 'pending',
      _file: f
    }));

    setResults((prev) => [...prev, ...initial]);
    setProgress((p) => ({ total: p.total + fileArray.length, done: p.done }));

    // 3. 각 파일을 순차적으로 안전하게 처리
    for (const item of initial) {
      // 고유 id를 기준으로 status를 processing으로 변경
      setResults((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: 'processing' } : r))
      );

      try {
        const text = await extractTextFromPdf(item._file);
        const data = await analyzePressRelease(apiKey, text);

        // 성공 시 고유 id 기준 데이터 갱신
        setResults((prev) =>
          prev.map((r) => (r.id === item.id ? { ...r, ...data, status: 'done' } : r))
        );
      } catch (err) {
        console.error('원인 분석:', err); // ✨ 콘솔창에 진짜 이유가 찍힙니다
        // 에러 발생 시 고유 id 기준 에러 기록
        setResults((prev) =>
          prev.map((r) =>
            r.id === item.id
              ? { ...r, status: 'error', error: String(err?.message || err) }
              : r
          )
        );
      } finally {
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    }

    setBusy(false);
  };

  const handleClear = () => {
    if (busy) return;
    if (results.length && !confirm('모든 분석 결과를 삭제하시겠습니까?')) return;
    setResults([]);
    setProgress({ total: 0, done: 0 });
  };

  const hasResults = useMemo(() => results.length > 0, [results]);

  return (
    <div className="min-h-full">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-brand-600 text-white grid place-items-center font-bold">PR</div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">보도자료 AI 분석기</h1>
              <p className="text-xs text-slate-500">Press Release Analyzer · powered by MiniMax API</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Settings apiKey={apiKey} setApiKey={setApiKey} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FileDropzone onFilesAdded={handleFilesAdded} disabled={busy} />
            <ResultsTable
              results={results.map((r) => {
                // 내부 상태(id, _file, error)는 화면 컴포넌트에 넘길 때 정제
                const { id, _file, error, ...rest } = r;
                return { ...rest, _hasError: !!error };
              })}
              progress={progress}
              busy={busy}
            />
          </div>

          <aside className="space-y-4">
            <div className="card p-4">
              <h3 className="font-semibold text-slate-800 mb-2">상태</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>API Key: {apiKey ? <span className="text-emerald-600">설정됨</span> : <span className="text-red-500">미설정</span>}</li>
                <li>처리 대기/완료: {progress.done}/{progress.total}</li>
                <li>결과 행 수: {results.length}</li>
              </ul>
            </div>

            <div className="card p-4">
              <h3 className="font-semibold text-slate-800 mb-2">도움말</h3>
              <ol className="text-sm text-slate-600 list-decimal list-inside space-y-1">
                <li>설정에서 API Key 입력 후 저장</li>
                <li>여러 PDF를 드래그&드롭</li>
                <li>표가 채워지면 Excel/CSV로 저장</li>
              </ol>
              <button
                type="button"
                onClick={handleClear}
                disabled={!hasResults || busy}
                className="btn-secondary mt-4 w-full"
              >
                결과 초기화
              </button>
            </div>
          </aside>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-6 text-xs text-slate-400 text-center">
        © {new Date().getFullYear()} Press Release Analyzer. All processing happens in your browser via the API.
      </footer>
    </div>
  );
}
