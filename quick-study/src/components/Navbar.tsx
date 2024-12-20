import React from 'react'
import Link from 'next/link'
import { HomeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  return (
    <nav className="flex flex-col justify-between items-center p-4 bg-gray-900 text-white">
        <div className="flex justify-between items-center w-full">
            <div className="text-xl font-bold">Chat with PDF</div>
            <div className="flex space-x-4 text-lg font-bold">
                <Link href="/" className="flex items-center space-x-1">
                    <HomeIcon className="h-5 w-5" />
                    <span>Home</span>
                </Link>
                <Link href="/chat" className="flex items-center space-x-1">
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    <span>Chat</span>
                </Link>
            </div>
        </div>
        <hr className="w-full border-gray-700 my-4" />
    </nav>
  )
}
