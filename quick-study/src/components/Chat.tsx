"use client"
import React, { useState } from 'react'
import { useChat } from 'ai/react'
import Image from 'next/image'
import assistantAvatar from "../images/assistent-avatar.webp"
import { useDropzone } from 'react-dropzone';
import { DocumentTextIcon, XMarkIcon, PaperClipIcon } from '@heroicons/react/24/outline';

export default function Chat() {
    type User = {
        id: string;
        name: string;
        email: string;
        profilePicture: string;
        role: "user";
    }
    type Assistant = {
        id: string;
        name: string;
        profilePicture: string;
        role: "assistant";
    }
    
    type Message = {
        id: string;
        role: "system" | "user" | "assistant";
        content: string;
        createdAt: Date;
    }
    const user: User = {
        id: "1",
        name: "D-Yusuf",
        email: "dyusuf@example.com",
        profilePicture: "https://via.placeholder.com/150"
    }
    const assistant: Assistant = {
        id: "2",
        name: "PDF-Reader",
        profilePicture: "/images/pdf-reader.png"
    }
    const initialMessages: Message[] = [{id: "0", role: "assistant", content: "Hello I'm am your study assistant. Ask me anything or upload a document you would like to ask me about, and I will be glad to help you!.", createdAt: new Date()}]
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/chat',
        initialMessages: initialMessages,
      });
      const userColors = {
        user: '#00c0ff',
        assistant: '#e02aff',
        function: '#fff',
        system: '#fff',
        tool: '#fff',
        data: '#fff'
      }
      function onSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        handleSubmit(e)
      }
      const [file, setFile] = useState<File | null>(null);

      const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles[0]) {
          setFile(acceptedFiles[0]);
        }
      };

      const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        noClick: true,
      });

      const renderFilePreview = () => {
        if (!file) return null;

        const fileType = file.type.split('/')[0];
        const fileName = file.name;

        if (fileType === 'image') {
          return (
            <div className="relative">
              <Image
                src={URL.createObjectURL(file)}
                alt={fileName}
                className="w-16 h-16 rounded-lg"
                width={64}
                height={64}
              />
              <button
                onClick={() => setFile(null)}
                className="absolute top-0 left-0 text-white bg-black rounded-full hover:text-red-500"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          );
        } else {
          return (
            <div className="flex items-center bg-gray-700 p-2 rounded-lg relative">
              <div className="bg-pink-500 p-2 rounded-full">
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-2">
                <span className="text-white">{fileName}</span>
                <div className="text-gray-400 text-sm">{fileType.toUpperCase()}</div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="absolute top-0 right-0 text-white bg-black rounded-full hover:text-red-500"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          );
        }
      };

  return (
    <div className="w-full h-screen flex flex-col px-4">
      <div {...getRootProps()} className="flex-grow overflow-y-auto py-4">
        <input {...getInputProps()} />
        <div className="response">
          {messages.length > 0
            ? messages.map(m => (
                <div key={m.id} className={`chat-line ${m.role} flex items-center mb-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <Image src={assistantAvatar} alt="Assistant Avatar" className="avatar w-8 h-8 rounded-full mr-2" width={30} height={30} />
                  )}
                  <span className={`message-content max-w-[60%] p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}>
                    {m.content}
                  </span>
                </div>
              ))
            : "Error"}
        </div>
      </div>
      <div className="w-full bg-gray-800 p-2 rounded-t-lg">
        <form onSubmit={onSubmit} className="flex items-center w-full relative">
          <div className="absolute left-2 top-2">
            {renderFilePreview()}
          </div>
          <button
            type="button"
            onClick={open}
            className="cursor-pointer p-2 bg-white text-black rounded-full hover:bg-gray-300 focus:outline-none"
          >
            <PaperClipIcon className="w-5 h-5" />
          </button>
          <input
            name="input-field"
            placeholder="Message ChatGPT"
            onChange={handleInputChange}
            value={input}
            className="flex-grow p-2 bg-gray-800 text-white border-none focus:outline-none"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6-6m6 6l-6 6"
              />
            </svg>
          </button>
        </form>
      </div>
        <p className="text-center text-white text-xs m-2">All rights reserved {new Date().getFullYear()}©</p>
    </div>
  )
}
