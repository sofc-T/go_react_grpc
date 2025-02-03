package main_test

import (
	"context"
	"log"
	"net"
	"testing"

	pb "github.com/sofc-t/gRPC_go/gen"
	"google.golang.org/grpc"
	"github.com/stretchr/testify/assert"
	server "github.com/sofc-t/gRPC_go/server"
)

// Start an in-memory gRPC server for testing
func startTestServer(t *testing.T) (*grpc.Server, net.Listener) {
	listener, err := net.Listen("tcp", ":0") // Random available port
	if err != nil {
		t.Fatalf("Failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterPingServiceServer(grpcServer, &server.Server{})

	go func() {
		if err := grpcServer.Serve(listener); err != nil {
			log.Fatalf("Failed to serve test server: %v", err)
		}
	}()

	return grpcServer, listener
}

// Test the Ping service
func TestPingService(t *testing.T) {
	grpcServer, listener := startTestServer(t)
	defer grpcServer.Stop()

	// Create a client connection
	conn, err := grpc.Dial(listener.Addr().String(), grpc.WithInsecure())
	if err != nil {
		t.Fatalf("Failed to connect to test server: %v", err)
	}
	defer conn.Close()

	client := pb.NewPingServiceClient(conn)

	// Send a Ping request
	req := &pb.PingRequest{Message: "Hello, test!"}
	resp, err := client.Ping(context.Background(), req)

	// Assertions
	assert.NoError(t, err)
	assert.NotNil(t, resp)
	assert.Equal(t, req.Message, resp.Message)
}
