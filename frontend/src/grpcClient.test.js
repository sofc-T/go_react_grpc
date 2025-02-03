import { PingServiceClient } from "./generated/ping_grpc_web_pb";
import { PingRequest } from "./generated/ping_pb";
import { sendPing } from "./grpcClient";


jest.mock("./generated/ping_grpc_web_pb", () => {
    const mockPing = jest.fn((request, metadata, callback) => {
        
        const mockResponse = { getMessage: () => "Pong" };
        callback(null, mockResponse);
    });

    return {
        PingServiceClient: jest.fn(() => ({
            ping: mockPing,
        })),
        PingRequest: jest.fn(() => ({
            setMessage: jest.fn(),
            getMessage: jest.fn(),
        })),
    };
});

describe("sendPing", () => {
    jest.setTimeout(10000); 

    it("should send a ping and receive a pong", (done) => {
        const message = "Ping";
        const callback = (response) => {
            try {
                expect(response).toBe("Pong");
                done();
            } catch (error) {
                done(error);
            }
        };

        sendPing(message, callback);
    });

    it("should handle gRPC errors", (done) => {
        
        jest.mock("./generated/ping_grpc_web_pb", () => {
            const mockPing = jest.fn((request, metadata, callback) => {
            
                callback(new Error("gRPC error"), null);
            });

            return {
                PingServiceClient: jest.fn(() => ({
                    ping: mockPing,
                })),
                PingRequest: jest.fn(() => ({
                    setMessage: jest.fn(),
                    getMessage: jest.fn(),
                })),
            };
        });

        const message = "Ping";
        const callback = (response) => {
            try {
                expect(response).toBeNull();
                done();
            } catch (error) {
                done(error);
            }
        };

        sendPing(message, callback);
    });
});