# Build stage
FROM node:26-trixie-slim AS builder
WORKDIR /app

# Node 26 images no longer include Yarn
RUN npm install -g yarn@1.22.22

# Copy all files first
COPY . .

# Install all dependencies (including dev dependencies needed for build)
RUN yarn install --frozen-lockfile

# Build the application
RUN yarn build

# Production stage
FROM node:26-trixie-slim
WORKDIR /app
ENV NODE_ENV=production

# Node 26 images no longer include Yarn
RUN npm install -g yarn@1.22.22

# Copy only the necessary files from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json /app/yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

# Clean up unnecessary files
RUN rm -rf /app/.cache /app/.vite

# Start the application
CMD ["yarn", "start"]
