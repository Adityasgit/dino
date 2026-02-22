# ---- Builder ----
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL in builder
RUN apt-get update -y && apt-get install -y openssl

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# ---- Runner ----
FROM node:20-slim

WORKDIR /app

# Install OpenSSL in runtime
RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /app ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]