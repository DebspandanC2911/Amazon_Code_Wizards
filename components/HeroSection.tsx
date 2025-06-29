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
          <p className="text-lg text-gray-600 mb-6">
            Discover smart home devices, Echo speakers, Fire tablets, and more. Experience the convenience of voice
            control with Alexa.
          </p>
          <div className="flex items-center mb-6">
            <Image src="/images/hero-alexa.png" alt="Alexa" width={100} height={40} className="mr-4" />
            <span className="text-sm text-gray-500">Voice control made simple</span>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <Image
            src="/images/hero-devices.png"
            alt="Amazon Devices"
            width={400}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  )
}
