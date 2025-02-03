import { PingServiceClient } from "./generated/ping_grpc_web_pb";
import { PingRequest } from "./generated/ping_pb";

const client = new PingServiceClient("http://localhost:8082", null, null);

export const sendPing = (message, callback) => {
    console.log("sendPing called with message:", message);
    
    const request = new PingRequest();
    request.setMessage(message);

    console.log("PingRequest created with message:", request.getMessage());

    client.ping(request, {}, (err, response) => {
        if (err) {
            console.error("gRPC error:", err);
            callback(null);
        } else {
            console.log("gRPC response received:", response.getMessage());
            callback(response.getMessage());
        }
    });
};
