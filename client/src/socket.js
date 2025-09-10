import { io } from "socket.io-client";

const LOCAL_BACKEND = "http://localhost:5000";
const PROD_BACKEND = "https://your-backend.onrender.com";

export const initSocket = () => {
  return io(
    process.env.NODE_ENV === "development" ? LOCAL_BACKEND : PROD_BACKEND,
    {
      transports: ["websocket"],
      secure: true,
    }
  );
};
