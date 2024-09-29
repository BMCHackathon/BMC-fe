export default function Navbar() {
    return (
        <>
        <nav className="bg-white text-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">BrandName</h1>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:text-gray-400">Home</a></li>
            <li><a href="/#features" className="hover:text-gray-400">Features</a></li>
            <li><a href="/#process" className="hover:text-gray-400">Process</a></li>
            <li><a href="/#contact" className="hover:text-gray-400">Contact</a></li>
          </ul>
        </div>
      </nav> 
        </>
    )
}