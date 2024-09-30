'use client'
import { useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import LoadingAnimation from '../../../components/LoadingAnimation'
import OSRecognitionMessage from '../../../components/OSRecognitionMsg'
import { Button } from '@/components/ui/button'
import DotPattern from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/utils'
import { url } from 'inspector'

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

    // setIsUploading(true)

    // const formData = new FormData()
    // formData.append('file', file)
    // formData.append('IP address', additionalInfo)

    // try {
    //   const response = await fetch('/api/upload', {
    //     method: 'POST',
    //     body: formData, // FormData automatically sets the correct headers
    //   })

    //   if (response.ok) {
    //     setIsUploading(false)
    //     setShowOSMessage(true)
    //   } else {
    //     console.error('File upload failed: ', await response.text())
    //     setIsUploading(false)
    //   }
    // } catch (error) {
    //   console.error('Error uploading file:', error)
    //   setIsUploading(false)
    // }
    router.push("/terminal")
  }

  // Handle uploading the second file
  const handleSecondUpload = async () => {
    if (!secondFile) {
      alert('Please select a file to upload')
      return;
    }

    setIsUploading(true);
    // Create a unique file name
    const fileName = `${secondFile.name}`;

    try {
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('Documents') // Replace with your bucket name
        .upload(fileName, secondFile, {
          cacheControl: '3600',
          upsert: true, // Change to true if you want to overwrite existing files
        });

      const publicUrl = supabase.storage.from('Documents').getPublicUrl(fileName);

      console.log('File uploaded to:', publicUrl.data.publicUrl);
      
      if (error) {
        throw error;
      }

      alert('File uploaded successfully');
      setSecondFile(null);

      const response = await fetch('https://d7f2-2402-e280-3e1b-1b4-8d7-2362-752-fb14.ngrok-free.app/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: fileName,
          url: publicUrl.data.publicUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const os = localStorage.getItem('os') ? JSON.parse(localStorage.getItem('os') as string) : [];
      os.push(fileName);
      localStorage.setItem('os', JSON.stringify(os));

      setIsUploading(false);
      await response.json();


      router.push("/chat");


      return;
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

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
          <div className="w-full lg:w-1/2 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-lg transition-shadow duration-300 min-h-[400px] flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-4">Option 1 - Upload Document</h1>
              <p className="text-sm text-gray-300 mb-6">Choose a document to upload and start the process.</p>
              <div className="flex flex-col items-center lg:items-start space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <input id="file-upload" type="file" onChange={handleSecondFileChange} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 transition duration-300 text-white rounded-lg shadow-md text-sm" accept='application/pdf' />
                  {/* <Button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 transition duration-300 text-white rounded-md shadow-md text-sm">Choose File</Button> */}
                </label>
              </div>
            </div>
            <Button
              className="px-6 py-2 bg-green-500 hover:bg-green-600 transition duration-300 text-white shadow-md text-sm mt-4 w-[70%] flex justify-center mx-auto rounded-xl"
              onClick={handleSecondUpload}
              // disabled={!file || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
            {isUploading && <LoadingAnimation className="mt-4" />}
          </div>

          {/* Right Section: Additional Upload */}
          <div className="w-full lg:w-1/2 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-lg transition-shadow duration-300 min-h-[400px] flex flex-col justify-between">
            <div>
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
                  <input id="second-file-upload" type="file" onChange={handleFileChange} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 transition duration-300 text-white shadow-md text-sm max-w-md rounded-lg" accept='.pem,.ppk'/>
                  
                </label>
              </div>
            </div>
            <Button
              className="px-6 py-2 bg-green-500 hover:bg-green-600 transition duration-300 text-white shadow-md text-sm mt-4 w-[70%] rounded-xl mx-auto"
              onClick={handleUpload}
              // disabled={!secondFile || isSecondUploading}
            >
              {isSecondUploading ? 'Uploading...' : 'Upload'}
            </Button>
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
      </div>
    </div>
  )
}
