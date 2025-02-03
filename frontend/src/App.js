import React, { useState } from "react";
import logo from "./logo.svg"; // Keep the default logo
import "./App.css";
import { sendPing } from "./grpcClient"; // Import your gRPC function

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleClick = () => {
    console.log("Sending message:", input);
    sendPing(input, (res) => {
      console.log("Received response:", res);
      setResponse(res || "Error in response");
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <p>Edit <code>src/App.js</code> and save to reload.</p> */}
        <p> gRPC Web Client</p>

        {/* gRPC Web UI Fields */}
        <input
          type="text"
          placeholder="Enter message"
          className="grpc-input"
          value={input}
          onChange={(e) => {
            console.log("Input changed:", e.target.value);
            setInput(e.target.value);
          }}
        />
        <button className="grpc-button" onClick={handleClick}>Send to gRPC</button>
        <p>Response: <strong>{response}</strong></p>

        
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        > */}
          Try gRPC
        {/* </a> */}
      </header>
    </div>
  );
}

export default App;
