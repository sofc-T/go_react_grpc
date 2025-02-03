import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { sendPing } from "./grpcClient";


jest.mock("./grpcClient");

describe("App Component", () => {
  it("renders correctly", () => {
    render(<App />);

    
    expect(screen.getByText(/gRPC Web Client/i)).toBeInTheDocument();
  });

  it("handles input change", () => {
    render(<App />);

    
    const input = screen.getByPlaceholderText("Enter message");

    
    fireEvent.change(input, { target: { value: "Test message" } });

    
    expect(input.value).toBe("Test message");
  });

  it("sends message to gRPC and updates response", () => {
    render(<App />);

    
    sendPing.mockImplementation((message, callback) => {
      callback("Success response");
    });

    
    const input = screen.getByPlaceholderText("Enter message");
    fireEvent.change(input, { target: { value: "Test message" } });

    
    const button = screen.getByText("Send to gRPC");
    fireEvent.click(button);

    
    expect(screen.getByText("Response:")).toHaveTextContent("Response: Success response");
  });

  it("displays error if gRPC call fails", () => {
    render(<App />);

    
    sendPing.mockImplementation((message, callback) => {
      callback(null);
    });

    
    const input = screen.getByPlaceholderText("Enter message");
    fireEvent.change(input, { target: { value: "Test message" } });

    
    const button = screen.getByText("Send to gRPC");
    fireEvent.click(button);

    
    expect(screen.getByText("Response:")).toHaveTextContent("Response: Error in response");
  });
});
