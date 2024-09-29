'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function TerminalPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  const totalLogs = 11 // Total number of logs to simulate (same as commands array length)

  useEffect(() => {
    const simulateLogs = async () => {
      const commands: LogEntry[] = [
        { message: 'Initializing system...', type: 'info' },
        { message: 'Checking dependencies...', type: 'info' },
        { message: 'Loading modules...', type: 'info' },
        { message: 'ERROR: Failed to load module "xyz"', type: 'error' },
        { message: 'Analyzing document structure...', type: 'info' },
        { message: 'Extracting metadata...', type: 'info' },
        { message: 'Processing content...', type: 'info' },
        { message: 'WARNING: Unexpected file format', type: 'error' },
        { message: 'Generating report...', type: 'info' },
        { message: 'Finalizing results...', type: 'info' },
        { message: 'Process complete.', type: 'info' },
      ]

      for (const command of commands) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setLogs(prevLogs => [...prevLogs, command])
      }
      setIsComplete(true)
    }

    simulateLogs()
  }, [])

  const handleGenerateReport = () => {
    router.push('/report')
  }

  // Calculate progress percentage based on the number of logs
  const progressPercentage = (logs.length / totalLogs) * 100

  return (
    <div className="bg-black p-4 h-screen flex flex-col">
      <ResizablePanelGroup direction='vertical' className="rounded-lg border md:min-w-[450px] flex-1">
        {/* Upper panel */}
        <ResizablePanel defaultSize={50}>
          <div className='bg-gray-900 p-4 h-full flex flex-col justify-between'>
            <AnimatedListDemo />
            <div>
              <h1 className="text-3xl font-bold text-white">Progress</h1>
              {/* Progress bar */}
              <div className="bg-gray-800 rounded-lg h-4 mt-2 w-full">
                <div
                  className="bg-green-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }} // Adjust the width dynamically
                />
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle/>
        {/* Lower panel */}
        <ResizablePanel defaultSize={50}>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-green-400 h-full overflow-y-scroll">
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
            {logs.length < totalLogs && (
              <div className="animate-pulse">_</div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Button to generate report */}
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



// export function ResizableDemo() {
//   return (
//     <ResizablePanelGroup
//       direction="vertical"
//     >
//       <ResizablePanel defaultSize={50}>
//         <div className="flex h-[200px] items-center justify-center p-6">
//           <span className="font-semibold">One</span>
//         </div>
//       </ResizablePanel>
//       <ResizableHandle />
//       <ResizablePanel defaultSize={50}>
//         <ResizablePanelGroup direction="vertical">
//           <ResizablePanel defaultSize={25}>
//             <div className="flex h-full items-center justify-center p-6">
//               <span className="font-semibold">Two</span>
//             </div>
//           </ResizablePanel>
//           <ResizableHandle />
//           <ResizablePanel defaultSize={75}>
//             <div className="flex h-full items-center justify-center p-6">
//               <span className="font-semibold">Three</span>
//             </div>
//           </ResizablePanel>
//         </ResizablePanelGroup>
//       </ResizablePanel>
//     </ResizablePanelGroup>
//   )
// }
