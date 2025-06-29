// Configuration helper for different environments
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Server-side config (only available on server)
  server: {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/amazon-clone",
    jwtSecret: process.env.JWT_SECRET,
    llmServiceUrl: process.env.LLM_SERVICE_URL || "http://localhost:8000",
    googleAiApiKey: process.env.GOOGLE_AI_API_KEY,
  },
}

// Usage in components:
// import { config } from '@/lib/config'
// const response = await fetch(`${config.apiUrl}/api/products`)
