# Use official Golang image as builder
FROM golang:1.23 AS builder

WORKDIR /app

# Copy Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code and build
COPY . .
RUN go build -o /app/server ./server/main.go


# Use a minimal image for the final container
FROM gcr.io/distroless/base-debian12

WORKDIR /app
COPY --from=builder /app/server .

EXPOSE 8082

CMD ["/app/server"]
