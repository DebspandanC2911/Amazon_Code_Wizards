import Image from "next/image"

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 py-12">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Shop Amazon Devices
            <br />
            with Alexa
          </h1>
          <div className="flex items-center mb-6">
            <Image src="/placeholder.svg?height=40&width=100" alt="Alexa" width={100} height={40} className="mr-4" />
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="Amazon Devices"
            width={400}
            height={300}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}
