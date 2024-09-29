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
        <DotPattern className={cn("[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]")}/>
      <div className='relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen space-y-6 lg:space-y-0 lg:space-x-12 px-4 lg:px-20'>  
        <div className='flex flex-col items-center lg:items-start space-y-6 lg:space-y-8'>
          <h1 className='text-4xl font-bold text-white text-center lg:text-left'>Upload your document</h1>
          <p className='text-lg text-white text-center lg:text-left'>Upload a document to get started</p>
          <div className='flex flex-col items-center lg:items-start space-y-4 lg:space-y-0 lg:flex-row'>
            <label htmlFor='file-upload' className='cursor-pointer'>
              <input id='file-upload' type='file' className='hidden' onChange={handleFileChange}/>
              <Button>Choose file</Button>
            </label>
            <Button onClick={handleUpload} disabled={!file || isUploading}>Upload</Button>
          </div>
          {isUploading && <LoadingAnimation />}
        </div>
        <div className='relative flex items-center justify-center w-full lg:w-1/2 h-[400px] lg:h-[500px]'>
          <img src='/images/upload.svg' alt='Upload document' className='w-full h-full object-contain'/>
        </div>
      </div>
        </div>
  )
}