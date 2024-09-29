'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingAnimation from '../../../components/LoadingAnimation'
import OSRecognitionMessage from '../../../components/OSRecognitionMsg'
import { Button } from '@/components/ui/button'
import DotPattern from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'

export default function DocumentUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showOSMessage, setShowOSMessage] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsUploading(false)
    setShowOSMessage(true)
  }

  const handleCloseOSMessage = () => {
    setShowOSMessage(false)
    router.push('/terminal')
  }

  return (
      <div className="z-0 relative max-h-screen w-full pb-40 overflow-hidden bg-[radial-gradient(97.14%_56.45%_at_51.63%_0%,_#7D56F4_0%,_#4517D7_30%,_#000_100%)]">
        <DotPattern
          className={cn("[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]")}
          />
          <div>
          <h1 className="text-2xl font-bold mb-4">Upload Document</h1>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4"
        />
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>

        {isUploading && <LoadingAnimation />}
        {showOSMessage && <OSRecognitionMessage onClose={handleCloseOSMessage} />}
      </div>
        </div>
  )
}