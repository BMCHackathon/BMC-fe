'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { SendIcon, Loader2, ChevronDown } from 'lucide-react';
import Navbar from "@/components/Navbar";  // Adjust the import path as needed
import Footer from "@/components/Footer";  // Adjust the import path as needed

const osOptions = ["Linux", "CentOS", "Debian", "Azure"];

export default function ChatInterface() {
  const [selectedOS, setSelectedOS] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const chatContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Scroll to the bottom of the chat container when chatHistory updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setIsLoading(true);
      const newMessage = { role: "user", content: inputMessage };
      setChatHistory(prev => [...prev, newMessage]);

      try {
        const response = await fetch('https://ad98-2402-e280-3e1b-1b4-11ca-cacc-5620-2933.ngrok-free.app/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            os_version: selectedOS.toLowerCase(),
            message: inputMessage
          })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        setChatHistory(prev => [...prev, { role: "assistant", content: data.response }]);
      } catch (error) {
        console.error("Error sending message:", error);
        setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, there was an error processing your request." }]);
      } finally {
        setIsLoading(false);
      }

      setInputMessage("");
    }
  };

  const handleStartChat = () => {
    setIsChatVisible(true);
    setChatHistory([{ role: "assistant", content: `Hello! You've selected ${selectedOS}. How can I assist you today?` }]);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 flex flex-col">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow w-full h-full max-w-6xl mx-auto bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col p-4"
      >
        <div className="flex-grow flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-6 relative"
            ref={dropdownRef}
          >
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 justify-between"
            >
              {selectedOS || "Select OS"}
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isDropdownOpen ? "transform rotate-180" : "")} />
            </Button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 w-full mt-2 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden"
                >
                  {osOptions.map((os) => (
                    <motion.li
                      key={os}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      className="cursor-pointer text-white p-3 transition-colors duration-200"
                      onClick={() => {
                        setSelectedOS(os);
                        setIsDropdownOpen(false);
                        setIsChatVisible(false);
                      }}
                    >
                      {os}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>

          {selectedOS && !isChatVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleStartChat}
                className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                Start Chat
              </Button>
            </motion.div>
          )}

          <AnimatePresence>
            {isChatVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-grow flex flex-col"
              >
                <motion.div
                  ref={chatContainerRef}
                  className="flex-grow overflow-y-auto mb-6 border rounded-lg border-gray-500 bg-white bg-opacity-5 p-4"
                  style={{ maxHeight: '400px' }}
                >
                  <AnimatePresence>
                    {chatHistory.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                      >
                        <div className={cn(
                          "inline-block p-3 rounded-lg max-w-[80%]",
                          message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'
                        )}>
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex"
                >
                  <Input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message here..."
                    className="flex-grow mr-2 border-none rounded-full bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out rounded-full"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <SendIcon className="w-5 h-5" />
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
