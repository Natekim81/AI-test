import { useRef, useState } from 'react';

export default function FileDropzone({ onFilesAdded, disabled }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (fileList) => {
    const pdfs = Array.from(fileList).filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfs.length) onFilesAdded(pdfs);
  };

  return (
    <div
      className={`card border-2 border-dashed transition-colors p-8 text-center cursor-pointer
        ${dragOver ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400'}
        ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <svg className="mx-auto h-12 w-12 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p className="mt-3 text-slate-700 font-medium">PDF 파일을 여기로 드래그하거나 클릭하여 선택</p>
      <p className="mt-1 text-xs text-slate-500">여러 파일을 한 번에 업로드할 수 있습니다.</p>
    </div>
  );
}
