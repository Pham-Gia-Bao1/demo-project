// Frontend WebSocket functions

const WEBSOCKET_URL = 'wss:/3menmbd33k.execute-api.us-west-2.amazonaws.com/dev'; // Replace with your WebSocket API Gateway URL

let socket;

// Function to connect to WebSocket
export const connectToWebSocket = (userId) => {
  return new Promise((resolve, reject) => {
    socket = new WebSocket(`${WEBSOCKET_URL}?userId=${userId}`);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
      resolve(true);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      reject(error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  });
};

// Function to disconnect from WebSocket
export const disconnectFromWebSocket = () => {
  if (socket) {
    socket.close();
    console.log('Disconnected from WebSocket');
  } else {
    console.warn('No active WebSocket connection to disconnect');
  }
};

// Function to send a message
export const sendMessage = (senderId, recipientId, message) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not connected');
    return;
  }

  const payload = {
    action: 'sendMessage', // Matches the route in your serverless.yml
    senderId,
    recipientId,
    message,
  };

  socket.send(JSON.stringify(payload));
  console.log('Message sent:', payload);
};

// Function to handle incoming messages
export const handleIncomingMessages = (onMessageCallback) => {
  if (!socket) {
    console.error('WebSocket is not connected');
    return;
  }

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Message received:', data);
    onMessageCallback(data);
  };
};