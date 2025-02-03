package main

import (
	"context"
	"log"
	"net/http"
	"net"

	pb "github.com/sofc-t/gRPC_go/gen" 
	"google.golang.org/grpc"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/rs/cors"
)

type Server struct {
	pb.UnimplementedPingServiceServer
}

func (s *Server) Ping(ctx context.Context, req *pb.PingRequest) (*pb.PingResponse, error) {
	log.Printf("Received Ping request with message: %s", req.Message)
	response := &pb.PingResponse{Message: req.Message}
	log.Printf("Sending Ping response with message: %s", response.Message)
	return response, nil
}

func main() {
	log.Println("Starting gRPC server...")

	listener, err := net.Listen("tcp", ":8082")
	if err != nil {
		log.Fatalf("Failed to listen on port 8082: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterPingServiceServer(grpcServer, &Server{})

	// Wrap the gRPC server with grpc-web
	wrappedServer := grpcweb.WrapServer(grpcServer)

	// Set up CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}).Handler

	// Start the HTTP server for grpc-web
	httpServer := &http.Server{
		Handler: corsHandler(http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
			if wrappedServer.IsGrpcWebRequest(req) {
				wrappedServer.ServeHTTP(resp, req)
				return
			}
			// Fallback to other handlers if needed
			http.DefaultServeMux.ServeHTTP(resp, req)
		})),
	}

	log.Println("gRPC server is running on port 8082")
	if err := httpServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}