import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Shield, Server, Zap, Clock, Target, BarChart, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                    Streamline Your Compliance with AI-Powered Automation
                  </h1>
                  <p className="max-w-[600px] text-gray-200 md:text-xl">
                    Automatically generate audit and remediation scripts tailored to your organization's needs, and stay
                    ahead of evolving security standards.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href={"/upload"}>
                    <Button className="bg-green-500 hover:bg-green-600 text-white" size="lg">
                    Get Started
                    </Button>
                  </Link>
                  <Button className="bg-white text-blue-600" size="lg" variant="outline">
                    Watch Demo
                    <Play className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  alt="Product preview"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  height="310"
                  src="/placeholder.svg"
                  width="550"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Why Choose Our Compliance Automation Solution?
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Zap className="h-12 w-12 text-blue-600" />
                <h3 className="text-xl font-bold">AI-Driven Automation</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Automatically generate audit and remediation scripts tailored to your environment.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Server className="h-12 w-12 text-blue-600" />
                <h3 className="text-xl font-bold">Cross-Platform Support</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Comprehensive coverage for Windows, Linux, and network devices.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <BarChart className="h-12 w-12 text-blue-600" />
                <h3 className="text-xl font-bold">Real-Time Compliance Monitoring</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Get real-time insights into your organization's security status and compliance posture.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <ChevronRight className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Step 1: Upload</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Upload your compliance template or select from built-in options.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <ChevronRight className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Step 2: Customize</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Customize and automate your audit or remediation scripts.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <ChevronRight className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Step 3: Results</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Get real-time compliance results and generate detailed reports.
                </p>
              </div>
            </div>
            <div className="mt-12 flex justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                Start Automating Now
              </Button>
            </div>
          </div>
        </section>
        </main>
    </div>
  );
}


