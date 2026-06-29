import * as pdfjsLib from 'pdfjs-dist/build/pdf';

/**
 * PDF 파일에서 텍스트를 추출합니다.
 * @param {File} file - PDF File 객체
 * @returns {Promise<string>} 추출된 전체 텍스트
 */
export async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + '\n';
  }
  return fullText.trim();
}
