"use client";
import React, { useState, useRef } from "react";
import Chat from "@/components/Chat";
import PDFViewer from "@/components/PDFViewer";

export default function Page() {
  const [pdfText, setPdfText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="grid grid-cols-3 bg-gray-900 ">
      <div className={`${selectedFile ? "col-span-2" : "col-span-3"}`}>
        <Chat
          setPdfText={setPdfText}
          setSelectedFile={setSelectedFile}
          fileInputRef={fileInputRef}
        />
      </div>
        {selectedFile && (
      <div className="col-span-1 overflow-hidden">
          <PDFViewer file={selectedFile} />
        </div>
      )}
    </div>
  );
}
