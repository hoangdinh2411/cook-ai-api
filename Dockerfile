# Stage 1: Build
FROM node:18 AS builder

# Tạo thư mục làm việc
WORKDIR /app

# Copy package files trước để cache dependencies
COPY package*.json ./

# Cài dependencies (bao gồm dev để build)
RUN npm ci

# Copy toàn bộ source
COPY . .

# Build NestJS (ra dist/)
RUN npm run build

# Stage 2: Run
FROM node:18-alpine AS runner

WORKDIR /app

# Cài thêm toolchain nếu có native modules (bcrypt, sharp, prisma…)
RUN apk add --no-cache python3 make g++

# Copy package files để install production deps
COPY package*.json ./

# Chỉ cài production dependencies
RUN npm ci --omit=dev

# Copy dist từ builder
COPY --from=builder /app/dist ./dist

# Copy node_modules từ builder (đảm bảo có đủ deps)
COPY --from=builder /app/node_modules ./node_modules

# Copy các file cần thiết (.env, prisma schema, config…)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./

# Expose port cho Render (Render sẽ inject PORT env)
EXPOSE 3000

# Lệnh chạy NestJS
CMD ["node", "dist/main.js"]