import * as XLSX from 'xlsx';

const COLUMNS = [
  { key: 'fileName', header: '파일명' },
  { key: 'title',    header: '제목' },
  { key: 'date',     header: '보도일자' },
  { key: 'author',   header: '작성자' },
  { key: 'summary',  header: '내용 요약(300자 이내)' }
];

function rowsFromResults(results) {
  return results.map((r) => ({
    파일명: r.fileName ?? '',
    제목: r.title ?? '',
    보도일자: r.date ?? '',
    작성자: r.author ?? '',
    '내용 요약(300자 이내)': r.summary ?? ''
  }));
}

export function exportToXlsx(results, filename = 'press-release-results.xlsx') {
  const rows = rowsFromResults(results);
  const ws = XLSX.utils.json_to_sheet(rows, { header: COLUMNS.map((c) => c.header) });
  ws['!cols'] = COLUMNS.map((c) => ({ wch: Math.max(12, c.header.length * 2) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '보도자료 분석 결과');
  XLSX.writeFile(wb, filename);
}

export function exportToCsv(results, filename = 'press-release-results.csv') {
  const rows = rowsFromResults(results);
  const ws = XLSX.utils.json_to_sheet(rows, { header: COLUMNS.map((c) => c.header) });
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
