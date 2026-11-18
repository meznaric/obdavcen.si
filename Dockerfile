# Build stage
FROM node:23-bookworm-slim as builder
WORKDIR /app

# Copy all files first
COPY . .

# Install all dependencies (including dev dependencies needed for build)
RUN yarn install --frozen-lockfile

# Build the application
RUN yarn build

# Production stage
FROM node:23-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production

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

