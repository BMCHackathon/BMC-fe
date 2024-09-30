'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LoadingAnimation from '../../../components/LoadingAnimation'
import OSRecognitionMessage from '../../../components/OSRecognitionMsg'
import { Button } from '@/components/ui/button'
import DotPattern from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { MessageCircle } from 'lucide-react'

export default function DocumentUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [secondFile, setSecondFile] = useState<File | null>(null)
  const [additionalInfo, setAdditionalInfo] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSecondUploading, setIsSecondUploading] = useState(false)
  const [showOSMessage, setShowOSMessage] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSecondFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSecondFile(e.target.files[0])
    }
  }

  // Handle uploading the first file
  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('IP address', additionalInfo)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData, // FormData automatically sets the correct headers
      })

      if (response.ok) {
        setIsUploading(false)
        setShowOSMessage(true)
      } else {
        console.error('File upload failed: ', await response.text())
        setIsUploading(false)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setIsUploading(false)
    }
  }

  // Handle uploading the second file
  const handleSecondUpload = async () => {
    if (!secondFile) return

    setIsSecondUploading(true)

    const formData = new FormData()
    formData.append('secondFile', secondFile)
    formData.append('additionalInfo', additionalInfo)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData, // FormData automatically sets the correct headers
      })

      if (response.ok) {
        setIsSecondUploading(false)
      } else {
        console.error('Second file upload failed: ', await response.text())
        setIsSecondUploading(false)
      }
    } catch (error) {
      console.error('Error uploading second file:', error)
      setIsSecondUploading(false)
    }
  }

  const handleCloseOSMessage = () => {
    setShowOSMessage(false)
    router.push('/terminal')
  }

  return (
    <div>
      <div className="relative min-h-screen w-full bg-[radial-gradient(97.14%_56.45%_at_51.63%_0%,_#7D56F4_0%,_#4517D7_30%,_#000_100%)] flex flex-col items-center justify-center px-6 py-12">
        <DotPattern className={cn("[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]")} />
        <h1 className="text-4xl font-extrabold text-white mb-4 text-center relative z-10" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', letterSpacing: '0.05em' }}>
          Choose any of the below to start with the process
        </h1>

        <div className="mt-5 relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-stretch justify-between space-y-8 lg:space-y-0 lg:space-x-8">
          
          {/* Left Section: Document Upload */}
          <div className="w-full lg:w-1/2 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-lg transition-shadow duration-300 min-h-[400px]">
            <h1 className="text-2xl font-semibold text-white mb-4">Option 1 - Upload Document</h1>
            <p className="text-sm text-gray-300 mb-6">Choose a document to upload and start the process.</p>
            <div className="flex flex-col items-center lg:items-start space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                <Button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 transition duration-300 text-white rounded-md shadow-md text-sm">Choose File</Button>
              </label>
              <Button
                className="px-6 py-2 bg-green-500 hover:bg-green-600 transition duration-300 text-white rounded-md shadow-md text-sm"
                onClick={handleUpload}
                disabled={!file || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {isUploading && <LoadingAnimation className="mt-4" />}
          </div>

          {/* Right Section: Additional Upload */}
          <div className="w-full lg:w-1/2 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-lg transition-shadow duration-300 min-h-[400px]">
            <h2 className="text-2xl font-semibold text-white mb-4">Option 2 - Connect your Virtual Machine</h2>
            <p className="text-sm text-gray-300 mb-6">Enter the IP address of your system along with abc file</p>
            <input
              type="text"
              placeholder="Enter IP Address"
              className="w-full p-3 mb-4 border border-transparent focus:border-purple-600 bg-white bg-opacity-20 rounded-md text-sm text-white placeholder-gray-300 focus:outline-none transition duration-300"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
            <div className="flex flex-col items-center lg:items-start space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
              <label htmlFor="second-file-upload" className="cursor-pointer">
                <input id="second-file-upload" type="file" className="hidden" onChange={handleSecondFileChange} />
                <Button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 transition duration-300 text-white rounded-md shadow-md text-sm">Choose File</Button>
              </label>
              <Button
                className="px-6 py-2 bg-green-500 hover:bg-green-600 transition duration-300 text-white rounded-md shadow-md text-sm"
                onClick={handleSecondUpload}
                disabled={!secondFile || isSecondUploading}
              >
                {isSecondUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {isSecondUploading && <LoadingAnimation className="mt-4" />}
          </div>
        </div>

        {/* Display OS Message after Upload */}
        {showOSMessage && (
          <OSRecognitionMessage
            message="Document uploaded successfully. We have detected your OS. Would you like to proceed?"
            onClose={handleCloseOSMessage}
          />
        )}

        {/* Chat Button */}
        <Link href="/chat">
          <Button
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center shadow-lg"
            aria-label="Open Chat"
          >
            <MessageCircle size={24} color="white" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
