'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { SendIcon, Loader2, ChevronDown } from 'lucide-react';
import DotPattern from '@/components/ui/dot-pattern';
import rehypeRaw from 'rehype-raw';

// const osOptions = ["Linux", "CentOS", "Debian", "Azure"];

export default function ChatInterface() {
  const [selectedOS, setSelectedOS] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  interface ChatMessage {
    role: string;
    content: string;
  }

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [osOptions, setOsOptions] = useState<string[]>(["Linux", "CentOS", "Debian", "Azure"]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // const chatContainerRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState(0);

  // Calculate max width of the container
  useEffect(() => {
    if (chatContainerRef.current) {
      const { width } = chatContainerRef.current.getBoundingClientRect();
      console.log(width);
      setMaxWidth(width * 0.8); // Example, set max width to 80% of the container
    }
  }, [chatHistory]);

  useEffect(() => {
    if (localStorage.getItem('os')) {
      const os = localStorage.getItem('os');
      console.log("oss", os);
      setOsOptions(os ? JSON.parse(os) :[...osOptions]);
    } else {
      localStorage.setItem('os', JSON.stringify(osOptions));
    }
  }
  , []);


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    const handleClickOutside = (event: { target: any; }) => {
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
      setChatHistory((prev) => [...prev, newMessage]);

      try {
        const response = await fetch('https://d7f2-2402-e280-3e1b-1b4-8d7-2362-752-fb14.ngrok-free.app/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            os_version: selectedOS === "CentOS" ? "centOS" : selectedOS.toLowerCase(),
            message: inputMessage,
          }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        setChatHistory((prev) => [...prev, { role: "assistant", content: data.response }]);
      } catch (error) {
        console.error("Error sending message:", error);
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, there was an error processing your request." },
        ]);
      } finally {
        setIsLoading(false);
      }

      setInputMessage("");
    }
  };

  const handleStartChat = () => {
    setIsChatVisible(true);
    setChatHistory([
      { role: "assistant", content: `Hello! You've selected ${selectedOS}. How can I assist you today?` },
    ]);
  };

  console.log(osOptions);

  return (
    <div className="relative max-h-screen w-full pb-40 overflow-hidden bg-[radial-gradient(97.14%_56.45%_at_51.63%_0%,_#7D56F4_0%,_#4517D7_30%,_#000_100%)]">
      <DotPattern className={cn("[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]")} />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full border p-2 rounded-xl bg-white bg-opacity-10 backdrop-blur-lg max-w-4xl" >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-6 relative z-30"
            ref={dropdownRef}
          >
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full text-white hover:bg-indigo-950 justify-between bg-white bg-opacity-10 backdrop-blur-lg rounded-xl border border-gray-400"
            >
              {selectedOS || "Select OS"}
              <ChevronDown
                className={cn("w-4 h-4 transition-transform duration-200", isDropdownOpen ? "transform rotate-180" : "")}
              />
            </Button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-40 w-full mt-2 bg-black rounded-lg shadow-lg overflow-hidden"
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
                className="bg-purple-500 text-white hover:bg-purple-400 transition duration-300 ease-in-out"
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
                className="flex-grow flex flex-col z-20"
              >
                <motion.div
                  className="flex-grow overflow-y-auto mb-6 border rounded-xl border-gray-400 bg-white bg-opacity-10 backdrop-blur-lg p-4"
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
                        <div
                          ref={chatContainerRef}
                          className={cn(
                            "inline-block p-3 max-w-auto rounded-3xl overflow-wrap break-words text-wrap px-2 overflow-x-hidden",
                            message.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-purple-700 text-gray-100'
                          )}
                        >
                          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message.content}</ReactMarkdown>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex p-4"
                >
                  <Input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message here..."
                    className="flex-grow mr-2 border-none rounded-full bg-indigo-700 bg-opacity-70 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="bg-indigo-600 text-white hover:bg-indigo-500 transition duration-300 ease-in-out rounded-full"
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
      </div>
    </div>
  );
}
