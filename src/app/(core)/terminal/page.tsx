"use client"
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
  type: 'info' | 'error' | 'summary' | 'none' | 'pass'
}

const cardsInfo = [
  {
    name: "Success",
    description: "Audit Passed",
    time: "15m ago",
    icon: "💸",
    color: "#00C9A7",
    count: 0, // Add count for successes
  },
  {
    name: "Failed",
    description: "Audit Failed",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
    count: 0, // Add count for failures
  },
  {
    name: "Severity",
    description: "Audit Severity",
    time: "5m ago",
    icon: "💬",
    color: "#FF3D71",
  },
];

interface NotificationProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
  count?: number; // Optional count for notifications
}

function Notification({ name, description, icon, color, time, count }: NotificationProps) {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-black text-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
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
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium  ">
            <span className="text-sm sm:text-lg">{name} {count !== undefined && `(${count})`}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal">
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
  const [totalLogs, setTotalLogs] = useState(11) // Total number of logs to simulate
  const router = useRouter()
  const terminalRef = useRef<HTMLDivElement>(null)

  const failedScriptsTitles: any[] = []
  
 // Total number of logs to simulate
  const logsEndRef = useRef<HTMLDivElement | null>(null); // Create a ref for auto-scrolling

  const [successCount, setSuccessCount] = useState(0); // Track success logs
  const [failureCount, setFailureCount] = useState(0); // Track failure logs

  useEffect(() => {
    const generateFiles = async () => {
      await fetch("http://localhost:5000/generate_files");
      const eventSource = new EventSource('http://localhost:5000/stream/run-audit');
  
    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const logType = message.type === "fail" ? 'error' : message.type === 'none' || message.type === 'summary' ? 'none' : 'pass';
      if (message.type === 'fail') {
        failedScriptsTitles.push(message.title)
      }
      if (message.type === 'summary') {
        localStorage.setItem('failedScriptsTitles', JSON.stringify(failedScriptsTitles));
        localStorage.setItem('summary', JSON.stringify({
          success: successCount,
          failure: failureCount,
          total: totalLogs
        }));
        setIsComplete(true);
      }
      if (message.type === 'number') {
        setTotalLogs(message.number);
      }
      setLogs((prevLogs) => [...prevLogs, { message:message.message, type: logType }]);

      // Update success and failure counts based on message content
      if (logType === 'pass') {
        setSuccessCount((prev) => prev + 1);
      } else if (logType === 'error') {
        setFailureCount((prev) => prev + 1);
      }
    };
  
    eventSource.onerror = () => {
      console.error("EventSource failed.");
      eventSource.close();
      setIsComplete(true);
    };
  
    return () => {
      eventSource.close();
      eventSource.close();
    };
    }
    generateFiles()
    
  }, []);

  useEffect(() => {
    // Scroll to the latest log entry whenever logs update
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]); // Dependency on logs

  const handleGenerateReport = () => {
    router.push('/report')
  }

  console.log("logs", logs.length, "totalLogs", totalLogs)

  const progressPercentage = (logs.length / totalLogs) * 100

  return (
    <div className="p-4 h-screen flex flex-col">
      <ResizablePanelGroup direction='vertical' className="rounded-lg border md:min-w-[450px] flex-1">
        <ResizablePanel defaultSize={20} minSize={20} maxSize={20}>
          <div className='bg-gray-500 p-4 h-full flex flex-col'>
            <div className='flex'>
              {
                cardsInfo.map((cardInfo, index) => (
                  <Notification key={index} {...cardInfo} count={index === 0 ? successCount : index === 1 ? failureCount : undefined} />
                ))
              }
            </div>
          
            <div>
  <h1 className="text-3xl font-bold text-white">Progress</h1>
  <div className="bg-gray-800 rounded-lg h-4 w-full overflow-hidden"> {/* Parent container with overflow-hidden */}
    <div
      className="bg-green-500 h-full transition-all duration-300"
      style={{ width: `${progressPercentage}%`, maxWidth: '100%' }}
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
                className={`mb-2 ${log.type === 'error' ? 'text-red-500 font-bold' : log.type === 'none' ? 'text-yellow-500 font-bold': ''}`}
              >
                {log.message} [{log.type.toUpperCase()}] {/* Added terminal type here */}
              </div>
            ))}
            <div ref={logsEndRef} /> {/* This div acts as the scroll target */}
            {logs.length < totalLogs && (
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