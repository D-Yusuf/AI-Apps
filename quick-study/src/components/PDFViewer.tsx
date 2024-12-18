import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useRef } from "react";

// Fix pdf.js workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
console.log(pdfjs.version); // Should match the worker's version
console.log(pdfjs.GlobalWorkerOptions.workerSrc); // Should be the same as the API version

const PDFViewer = ({ file }: { file: File | string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const observer = useRef<IntersectionObserver>();
  const pageElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    pageElementsRef.current = pageElementsRef.current.slice(0, numPages);
  };

  // Intersection observer to track visible pages
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    observer.current = new IntersectionObserver((entries) => {
      const visiblePage = entries.find((entry) => entry.isIntersecting);
      if (visiblePage) {
        setPageNumber(Number(visiblePage.target.getAttribute("data-page-number")));
      }
    }, options);

    const { current: currentObserver } = observer;

    pageElementsRef.current.forEach((page) => {
      if (page) currentObserver.observe(page);
    });

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [numPages]);

  return (
    <>
      {/* Page Counter */}
      <div className="text-center rounded-3xl my-2 z-50 fixed bottom-4 right-4 bg-blue-600 text-white py-1 px-4">
        {pageNumber}/{numPages}
      </div>

      {/* PDF Viewer Container */}
      <div className="h-[600px] md:h-full overflow-y-scroll">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading="Loading PDF..."
          error="Failed to load PDF."
        >
          {/* Safely map pages */}
          {Array.from({ length: numPages }, (_, index) => (
            <div
              key={index}
              ref={(el) => (pageElementsRef.current[index] = el)}
              data-page-number={index + 1}
              className="mb-4"
            >
              <Page
                pageNumber={index + 1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>
    </>
  );
};

export default PDFViewer;
