import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white bg-opacity-10 backdrop-blur-lg text-black">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center ">
        <h1 className="text-2xl font-bold">AutoComply</h1>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="hover:text-gray-300">Home</a>
          </li>
          <li>
            <Link
              href={"/upload"}
              className="bg-purple-500 text-white hover:bg-purple-600 transition duration-300 ease-in-out rounded-full px-4 py-2"
            >
              Get Started
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
