# Multi-stage build for Next.js client
FROM node:18-alpine AS client-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production client image
FROM node:18-alpine AS client
WORKDIR /app
COPY --from=client-builder /app/.next ./.next
COPY --from=client-builder /app/public ./public
COPY --from=client-builder /app/package*.json ./
COPY --from=client-builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]

# Node.js server
FROM node:18-alpine AS server
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .
EXPOSE 5000
CMD ["node", "server.js"]

# Python LLM service
FROM python:3.9-slim AS python-llm
WORKDIR /app
COPY python-llm/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY python-llm/ .
EXPOSE 8000
CMD ["python", "app.py"]
