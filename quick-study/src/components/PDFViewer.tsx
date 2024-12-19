import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useRef } from "react";
import { PlusIcon, MinusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

// Fix pdf.js workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`
console.log(pdfjs.version); // Should match the worker's version
console.log(pdfjs.GlobalWorkerOptions.workerSrc); // Should be the same as the API version

const PDFViewer = ({ file }: { file: File | string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const observer = useRef<IntersectionObserver>();
  const pageElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    pageElementsRef.current = pageElementsRef.current.slice(0, numPages);
  };

  const handleZoomIn = () => setScale((prevScale) => prevScale + 0.1);
  const handleZoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  const handleRotate = () => setRotation((prevRotation) => (prevRotation + 90) % 360);

  const handlePageNumberClick = () => {
    const page = prompt(`Enter page number (1-${numPages}):`, `${pageNumber}`);
    if (page) {
      const pageNum = parseInt(page, 10);
      if (pageNum >= 1 && pageNum <= numPages) {
        setPageNumber(pageNum);
      }
    }
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
    <div className="relative h-full">
      {/* PDF Viewer Container */}
      <div className="h-full overflow-y-scroll">
        {/* Toolbar */}
        <div className="sticky top-0 flex items-center justify-center bg-gray-800 text-white p-2 z-10">
          <button onClick={handleZoomOut} className="p-2 rounded hover:bg-gray-700">
            <MinusIcon className="w-5 h-5" />
          </button>
          <button onClick={handleZoomIn} className="p-2 rounded hover:bg-gray-700">
            <PlusIcon className="w-5 h-5" />
          </button>
          <button onClick={handleRotate} className="p-2 rounded hover:bg-gray-700">
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <div className="text-center cursor-pointer p-2 rounded hover:bg-gray-700" onClick={handlePageNumberClick}>
            {pageNumber}/{numPages}
          </div>
        </div>

        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading="Loading PDF..."
          error="Failed to load PDF."
        >
          {Array.from({ length: numPages }, (_, index) => (
            <div
              key={index}
              ref={(el) => (pageElementsRef.current[index] = el)}
              data-page-number={index + 1}
              className="mb-4"
            >
              <Page
                pageNumber={index + 1}
                scale={scale}
                rotate={rotation}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
