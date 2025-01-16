FROM golang:1.22.5-alpine

# SQLite requirements
RUN apk add --no-cache gcc musl-dev sqlite sqlite-dev

# Set working directory to match your backend structure
WORKDIR /app/backend

# Copy only backend files first
COPY backend/ .

# Copy frontend files to serve them from the backend
COPY frontend/ ../frontend/

# Copy database directory (for schema and migrations)
COPY database/ ../database/

# Copy go.mod and go.sum (they should be in project root)
COPY backend/go.mod backend/go.sum ./

# Build
RUN go mod download && \
    go build -o main

# Ensure database directory exists with proper permissions
RUN mkdir -p ../database/ && \
    chmod 777 ../database/

EXPOSE 8080

CMD ["./main"]
