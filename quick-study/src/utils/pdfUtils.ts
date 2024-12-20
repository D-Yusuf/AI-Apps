import { TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';

export const mergeTextContent = (textContent: TextContent) => {
  return textContent.items
    .map((item) => {
      const { str, hasEOL } = item as TextItem;
      return str + (hasEOL ? '\n' : '');
    })
    .join('');
};

export const getPdfText = async (pdfFile: File): Promise<string> => {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result;
      if (arrayBuffer && arrayBuffer instanceof ArrayBuffer) {
        const loadingTask = pdfjs.getDocument(new Uint8Array(arrayBuffer));
        loadingTask.promise.then(
          (pdfDoc) => {
            const numPages = pdfDoc.numPages;
            let pdfText = '';
            const pagePromises: Promise<void>[] = [];

            for (let i = 1; i <= Math.min(numPages, 10); i++) {
              pagePromises.push(
                pdfDoc.getPage(i).then((page) =>
                  page.getTextContent().then((textContent) => {
                    pdfText += `PAGE ${i}:\n\n${mergeTextContent(textContent)}\n------\n`;
                  })
                )
              );
            }

            Promise.all(pagePromises).then(() => resolve(pdfText));
          },
          (reason) => reject(`Error during PDF loading: ${reason}`)
        );
      }
    };
    reader.readAsArrayBuffer(pdfFile);
  });
};
