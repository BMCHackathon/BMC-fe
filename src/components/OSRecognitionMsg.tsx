interface OSRecognitionMessageProps {
    onClose: () => void
  }
  
  export default function OSRecognitionMessage({ onClose }: OSRecognitionMessageProps) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">OS Recognized</h2>
          <p className="mb-4">The operating system has been successfully recognized.</p>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    )
  }