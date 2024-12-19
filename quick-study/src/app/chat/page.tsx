"use client";
import React, { useEffect, useState, useRef } from "react";
import PdfUploader from "@/components/PDFUploader";
import PDFViewer from "@/components/PDFViewer";
import { useChat } from "ai/react";
import Image from "next/image";
import assistantAvatar from "../../images/assistent-avatar.webp";
import { useDropzone } from "react-dropzone";
import {
  DocumentTextIcon,
  XMarkIcon,
  PaperClipIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import TextareaAutosize from 'react-textarea-autosize';
import ReactMarkdown from 'react-markdown';
import { getPdfText } from '@/utils/pdfUtils';

export default function Page({ children }: { children: React.ReactNode }) {
  const [pdfText, setPdfText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  type User = {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
    role: "user";
  };
  type Assistant = {
    id: string;
    name: string;
    profilePicture: string;
    role: "assistant";
  };

  type Message = {
    id: string;
    role: "system" | "user" | "assistant";
    content: string;
    createdAt: Date;
  };
  const user: User = {
    id: "1",
    name: "D-Yusuf",
    email: "dyusuf@example.com",
    profilePicture: "https://via.placeholder.com/150",
  };
  const assistant: Assistant = {
    id: "2",
    name: "PDF-Reader",
    profilePicture: "/images/pdf-reader.png",
  };
  const [initialMessages, setInitialMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content:
        "Hello I'm am your study assistant. Ask me anything or upload a document you would like to ask me about, and I will be glad to help you!.",
      createdAt: new Date(),
    },
  ]);
  const { messages, input, handleInputChange, handleSubmit, setInput , setMessages} = useChat({
    api: "/api/chat",
    initialMessages: initialMessages,
  });
  const userColors = {
    user: "#00c0ff",
    assistant: "#e02aff",
    function: "#fff",
    system: "#fff",
    tool: "#fff",
    data: "#fff",
  };
  async function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    handleInputChange(e);
    setSelectedFile(null);
    const file = fileInputRef.current?.files?.[0];

    if (file && file.type === 'application/pdf') {
      try {
        const pdfText = await getPdfText(file);
        setPdfText(pdfText);
        setSelectedFile(file);
      } catch (error) {
        console.error('Error reading PDF:', error);
      }
    }
  }
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(pdfText){
      setMessages([
        ...messages,
        {
          id: "0000",
          role: "system",
          content: `forget the pdfs sent before and focus on this pdf content to answer the following questions, unless user specifies otherwise, by the user unless user specifies otherwise. You are a professional at what the pdf is about. 
          You answer all questions no matter what the pdf contains. ${pdfText}`,
          createdAt: new Date(),
        },
      ]);
    }
    handleSubmit(e);
    console.log(input);
  }

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
  });

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    return (
      <div className="flex items-center bg-gray-700 p-2 rounded-lg relative w-fit mb-2">
        <div className="bg-pink-500 p-2 rounded-full">
          <DocumentTextIcon className="w-5 h-5 text-white" />
        </div>
        <div className="ml-2">
          <span className="text-white">{selectedFile.name}</span>
          <div className="text-gray-400 text-sm">PDF</div>
        </div>
        <button
          onClick={() => {
            setSelectedFile(null);
            setPdfText("");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          className="absolute -top-2 -right-2 text-white bg-black rounded-full hover:text-red-500"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="flex h-screen">
      <div className="flex-grow overflow-auto">
        <div className="w-full h-full flex flex-col px-4">
          <div {...getRootProps()} className="flex-grow overflow-y-auto py-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <input {...getInputProps()} />
            <div className="response" style={{ overflow: 'hidden' }}>
              {messages.length > 0
                ? messages.filter(m => m.role !== "system").map((m) => (
                    <div
                      key={m.id}
                      className={`chat-line ${m.role} flex items-start mb-4 ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {m.role === "assistant" && (
                        <Image
                          src={assistantAvatar}
                          alt="Assistant Avatar"
                          className="avatar w-10 h-10 rounded-full mr-3"
                          width={40}
                          height={40}
                        />
                      )}
                      <div
                        className={`message-content max-w-[75%] p-3 rounded-lg shadow-md ${
                          m.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        } relative group`}
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {m.role === "assistant" ? (
                          <div className="flex flex-col">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                            <button
                              onClick={() => copyToClipboard(m.content)}
                              className="p-1 absolute -bottom-4 left-1 bg-white text-black rounded-full hover:bg-gray-300 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ClipboardIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          m.content
                        )}
                      </div>
                    </div>
                  ))
                : "Error"}
            </div>
          </div>
          <div className="w-full bg-gray-800 p-4 rounded-t-lg gap-2">
            {renderFilePreview()}
            <form onSubmit={onSubmit} className="flex flex-col items-center w-full relative">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="application/pdf"
              />
              <div className="flex items-center w-full">
                <button
                  type="button"
                  onClick={open}
                  className="cursor-pointer p-2 bg-white text-black rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <PaperClipIcon className="w-5 h-5" />
                </button>
                <TextareaAutosize
                  name="input-field"
                  placeholder="Type your message..."
                  onChange={onChange}
                  onKeyDown={handleKeyDown}
                  value={input}
                  className="flex-grow p-4 bg-gray-200 text-gray-900 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 resize-none"
                  minRows={1}
                />
                <button
                  type="submit"
                  className="ml-2 p-2 bg-white text-black rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6-6m6 6l-6 6" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
          <p className="text-center text-white text-xs m-2">
            All rights reserved {new Date().getFullYear()}©
          </p>
        </div>
      </div>
      <div className="overflow-auto" style={{ flexBasis: 'auto', maxHeight: '100vh' }}>
        {pdfText && (
          <PDFViewer file={selectedFile as File} />
        )}
      </div>
    </div>
  );
}
