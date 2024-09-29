"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, MessageSquare, PlusCircle, Send, X } from "lucide-react"
import { cn } from "@/lib/utils"
import DotPattern from '@/components/ui/dot-pattern'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function ChatInterface() {
  const [chatHistory, setChatHistory] = useState([]) // Holds all chats
  const [currentChat, setCurrentChat] = useState([
    { role: "assistant", content: "Hello! How can I assist you today?" },
    { role: "user", content: "Can you explain what React is?" },
    { role: "assistant", content: "React is a popular JavaScript library for building user interfaces." },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setCurrentChat([...currentChat, { role: "user", content: inputMessage }])
      setInputMessage("")
      // Here you would typically send the message to your AI backend
      // and then add the response to the messages array
    }
  }

  const handleNewChat = () => {
    // Save the current chat to history and reset the chat state
    setChatHistory([...chatHistory, currentChat]);
    setCurrentChat([]); // Reset current chat for new conversation
  }

  const handleChatSelect = (index) => {
    // Set the selected chat as the current chat
    setCurrentChat(chatHistory[index]);
    setIsSidebarOpen(false); // Close the sidebar after selecting a chat
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen w-full bg-[radial-gradient(97.14%_56.45%_at_51.63%_0%,_#7D56F4_0%,_#4517D7_30%,_#000_100%)] flex flex-col items-center justify-center px-6 py-12">
        <DotPattern className={cn("[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]")} />
        <div className="relative z-10 w-full max-w-4xl bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden">
          <div className="flex h-[calc(100vh-6rem)]">
            {/* Sidebar */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  className="w-64 bg-white bg-opacity-20 backdrop-blur-lg text-white p-4 overflow-y-auto"
                >
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-4 right-4 text-white hover:text-gray-300"
                  >
                    <X size={24} />
                  </button>
                  <h2 className="text-2xl font-bold mb-4">Chat History</h2>
                  <ul>
                    {chatHistory.map((chat, index) => (
                      <li key={index} className="mb-2 flex items-center cursor-pointer" onClick={() => handleChatSelect(index)}>
                        <MessageSquare size={18} className="mr-2" />
                        <span>Chat {index + 1}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 flex items-center text-sm" onClick={handleNewChat}>
                    <PlusCircle size={18} className="mr-2" />
                    <span>New Chat</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="bg-white bg-opacity-20 backdrop-blur-lg shadow p-4 flex justify-between items-center">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white hover:text-gray-300">
                  <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-white">Chat with us!</h1>
                <div className="w-6" /> {/* Placeholder for symmetry */}
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {currentChat.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${message.role === "user" ? "bg-blue-500 text-white" : "bg-white bg-opacity-20 backdrop-blur-lg text-white"}`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <div className="bg-white bg-opacity-20 backdrop-blur-lg border-t border-white border-opacity-20 p-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message here..."
                    className="flex-1 bg-white bg-opacity-20 backdrop-blur-lg text-white placeholder-gray-300 border border-white border-opacity-20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
