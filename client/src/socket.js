import { io } from "socket.io-client";

// For development (local)
const LOCAL_BACKEND = "http://localhost:5000";

// For production (Render)
const PROD_BACKEND = "https://your-backend.onrender.com";

const socket = io(
  process.env.NODE_ENV === "development" ? LOCAL_BACKEND : PROD_BACKEND,
  {
    transports: ["websocket"],
    secure: true,
  }
);

export default socket;

