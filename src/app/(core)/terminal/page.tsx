'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AnimatedListDemo } from '@/components/NotificationList'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

interface LogEntry {
  message: string
  type: 'info' | 'error'
}

interface NotificationProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

function Notification({ name, description, icon, color, time }: NotificationProps) {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-black [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
}

export default function TerminalPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [progress, setProgress] = useState(0);

  const router = useRouter()
  const terminalRef = useRef<HTMLDivElement>(null)

  const totalLogs = 11 // Total number of logs to simulate

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/stream/run-audit');
  
    eventSource.onmessage = (event) => {
      const message = event.data;
  
      if (message.startsWith("data: Total Successes")) {
        const successMatch = message.match(/Total Successes: (\d+)/);
        const failMatch = message.match(/Total Failures: (\d+)/);
  
        if (successMatch && failMatch) {
          const newSuccessCount = parseInt(successMatch[1], 10);
          const newFailCount = parseInt(failMatch[1], 10);
          setSuccessCount(newSuccessCount);
          setFailCount(newFailCount);
          setProgress(((newSuccessCount + newFailCount) / totalLogs) * 100);
          if (newSuccessCount + newFailCount >= totalLogs) {
            setIsComplete(true);
          }
        }
      } else {
        const logType = message.startsWith('ERROR') ? 'error' : 'info';
        setLogs((prevLogs) => [...prevLogs, { message, type: logType }]);
      }
    };
  
    eventSource.onerror = () => {
      console.error("EventSource failed.");
      eventSource.close();
      setIsComplete(true);
    };
  
    return () => {
      eventSource.close();
    };
  }, []);
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleGenerateReport = () => {
    router.push('/report')
  }

  const cardsInfo = [
    {
      name: "Success",
      description: `${successCount} audits passed`,
      time: "Just now",
      icon: "💸",
      color: "#00C9A7",
    },
    {
      name: "Failed",
      description: `${failCount} audits failed`,
      time: "Just now",
      icon: "👤",
      color: "#FFB800",
    },
    {
      name: "Severity",
      description: "Audit Severity",
      time: "5m ago",
      icon: "💬",
      color: "#FF3D71",
    },
  ];

  return (
    <div className="p-4 h-screen flex flex-col">
      <ResizablePanelGroup direction='vertical' className="rounded-lg border md:min-w-[450px] flex-1">
        <ResizablePanel defaultSize={20} minSize={20} maxSize={20}>
          <div className='bg-gray-500 p-4 h-full flex flex-col'>
            <div className='flex'>
              {cardsInfo.map((cardInfo, index) => (
                <Notification key={index} {...cardInfo} />
              ))}
            </div>
          
            <div>
              <h1 className="text-3xl font-bold text-white">Progress</h1>
              <div className="bg-gray-800 rounded-lg h-4 w-full">
                <div
                  className="bg-green-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle className='bg-white'/>
        <ResizablePanel defaultSize={50}>
          <div 
            className="bg-gray-950 rounded-lg p-4 font-mono text-green-400 h-full overflow-y-auto"
            ref={terminalRef}
          >
            <div className="mb-4">
              <span className="text-blue-400">user@system</span>:
              <span className="text-purple-400">~/documents</span>$
            </div>
            {logs.map((log, index) => (
              <div
                key={index}
                className={`mb-2 ${log.type === 'error' ? 'text-red-500 font-bold' : ''}`}
              >
                {log.message}
              </div>
            ))}
            {!isComplete && (
              <div className="animate-pulse">_</div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {isComplete && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleGenerateReport}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Generate Report
          </button>
        </div>
      )}
    </div>
  )
}