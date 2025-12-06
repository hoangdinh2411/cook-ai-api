# Stage 1: Build
FROM node:18-alpine AS builder

# Tạo thư mục làm việc
WORKDIR /app

# Copy package files trước để cache dependencies
COPY package*.json ./

# Cài dependencies (không cài dev tool nặng)
RUN npm ci

# Copy toàn bộ source
COPY . .

# Build NestJS (ra dist/)
RUN npm run build

# Stage 2: Run
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package files để install production deps
COPY package*.json ./

# Chỉ cài production dependencies
RUN npm ci --omit=dev

# Copy dist từ builder
COPY --from=builder /app/dist ./dist

# Copy các file cần thiết (ví dụ config, prisma schema nếu có)
COPY --from=builder /app/node_modules ./node_modules

# Expose port cho Render
EXPOSE 3000

# Lệnh chạy NestJS
CMD ["node", "dist/main.js"]