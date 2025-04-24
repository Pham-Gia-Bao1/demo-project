import React, { useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket.ts";
import { useSelector } from "react-redux";
import { RootState } from "../store/store.ts";
const WS_URL = "wss://c4g7rarkke.execute-api.us-west-2.amazonaws.com/dev";

const WebSocketDemo = () => {
  const { isConnected, messages, sendMessage } = useWebSocket(WS_URL);
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks } = useSelector((state: RootState) => state.tasks);
  console.log(tasks);
  const lastItem = tasks[tasks.length - 1];
  console.log("hellloooooo",lastItem);

  useEffect(() => {
    console.log("All messages:", messages);
  }, [messages]);

  return (
    <div>
      <h2>WebSocket Status: {isConnected ? "Connected" : "Disconnected"}</h2>
      <button
        disabled={!user?.id}
        onClick={() => {
          if (user?.id) {
            sendMessage({
              action: "sendRandom",
              userId: user.id,
              taskId: 81,
            });
          }
        }}
      >
        Gửi yêu cầu random ID
      </button>

      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketDemo;
