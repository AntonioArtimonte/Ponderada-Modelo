

# Base image with Go 1.19
FROM golang:1.22.4

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire project
COPY . .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -o /golang_app ./main.go

# Expose port 9000 (your Go app's port)
EXPOSE 9000

# Run the Go app
CMD ["/golang_app"]
