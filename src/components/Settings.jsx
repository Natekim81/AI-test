import { useState, useEffect } from 'react';

const STORAGE_KEY = 'MiniMax_api_key';

export default function Settings({ apiKey, setApiKey }) {
  const [draft, setDraft] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY) || '';
    if (stored) setApiKey(stored);
  }, []);

  const handleSave = () => {
    setApiKey(draft.trim());
    sessionStorage.setItem(STORAGE_KEY, draft.trim());
    localStorage.setItem(STORAGE_KEY, draft.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleClear = () => {
    setDraft('');
    setApiKey('');
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="card p-4">
      <button
        type="button"
        className="flex items-center justify-between w-full text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317a1 1 0 011.35 0l.708.708a1 1 0 001.06.219l.973-.325a1 1 0 011.272.706l.243.999a1 1 0 00.732.732l.999.243a1 1 0 01.706 1.272l-.325.973a1 1 0 00.219 1.06l.708.708a1 1 0 010 1.35l-.708.708a1 1 0 00-.219 1.06l.325.973a1 1 0 01-.706 1.272l-.999.243a1 1 0 00-.732.732l-.243.999a1 1 0 01-1.272.706l-.973-.325a1 1 0 00-1.06.219l-.708.708a1 1 0 01-1.35 0l-.708-.708a1 1 0 00-1.06-.219l-.973.325a1 1 0 01-1.272-.706l-.243-.999a1 1 0 00-.732-.732l-.999-.243a1 1 0 01-.706-1.272l.325-.973a1 1 0 00-.219-1.06l-.708-.708a1 1 0 010-1.35l.708-.708a1 1 0 00.219-1.06l-.325-.973a1 1 0 01.706-1.272l.999-.243a1 1 0 00.732-.732l.243-.999a1 1 0 011.272-.706l.973.325a1 1 0 001.06-.219l.708-.708zM12 15a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
          설정 (Settings)
        </span>
        <span className="text-xs text-slate-500">{open ? '접기' : '펼치기'}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            MiniMax API Key
            <input
              type="password"
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              placeholder="sk-..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoComplete="off"
            />
          </label>
          <p className="text-xs text-slate-500">
            * 브라우저 세션/로컬스토리지에만 저장됩니다. 코드/저장소에 하드코딩되지 않습니다.
          </p>
          <div className="flex items-center gap-2">
            <button type="button" className="btn-primary" onClick={handleSave}>저장</button>
            <button type="button" className="btn-secondary" onClick={handleClear}>삭제</button>
            {saved && <span className="text-xs text-emerald-600">저장되었습니다 ✓</span>}
          </div>
        </div>
      )}
    </div>
  );
}
