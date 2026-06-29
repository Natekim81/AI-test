import { exportToXlsx, exportToCsv } from '../utils/exportUtil';

export default function ResultsTable({ results, progress, busy }) {
  const total = progress?.total ?? 0;
  const done = progress?.done ?? 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="font-semibold text-slate-800">
          분석 결과 <span className="text-slate-400 text-sm">({results.length}건)</span>
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-secondary"
            disabled={!results.length}
            onClick={() => exportToXlsx(results)}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17a4 4 0 004 4h10a4 4 0 004-4" />
            </svg>
            Excel (.xlsx)
          </button>
          <button
            type="button"
            className="btn-secondary"
            disabled={!results.length}
            onClick={() => exportToCsv(results)}
          >
            CSV (.csv)
          </button>
        </div>
      </div>

      {(busy || (total > 0 && done < total)) && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span>분석 중... {done}/{total}</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-600 h-2 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left font-medium">파일명</th>
              <th className="px-3 py-2 text-left font-medium">제목</th>
              <th className="px-3 py-2 text-left font-medium">보도일자</th>
              <th className="px-3 py-2 text-left font-medium">작성자</th>
              <th className="px-3 py-2 text-left font-medium">내용 요약(300자 이내)</th>
              <th className="px-3 py-2 text-left font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-slate-400">
                  아직 분석된 결과가 없습니다.
                </td>
              </tr>
            )}
            {results.map((r, idx) => (
              <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 align-top max-w-xs truncate" title={r.fileName}>{r.fileName}</td>
                <td className="px-3 py-2 align-top">{r.title || '-'}</td>
                <td className="px-3 py-2 align-top whitespace-nowrap">{r.date || '-'}</td>
                <td className="px-3 py-2 align-top">{r.author || '-'}</td>
                <td className="px-3 py-2 align-top whitespace-pre-line">{r.summary || '-'}</td>
                <td className="px-3 py-2 align-top">
                  {r.status === 'pending' && <span className="text-xs text-slate-500">대기</span>}
                  {r.status === 'processing' && (
                    <span className="inline-flex items-center gap-1 text-xs text-brand-600">
                      <span className="w-3 h-3 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                      분석 중
                    </span>
                  )}
                  {r.status === 'done' && <span className="text-xs text-emerald-600">완료 ✓</span>}
                  {r.status === 'error' && (
                    <span className="text-xs text-red-600" title={r.error}>오류</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
