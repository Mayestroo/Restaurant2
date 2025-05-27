import { useEffect } from "react";
import connection from "../api/signalR/connection"; // adjust path

export const useSignalR = () => {
  useEffect(() => {
    const startConnection = async () => {
      try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
          await connection.start();
          console.log("✅ SignalR connected");
        }
      } catch (err) {
        console.error("❌ SignalR connection failed:", err);
      }
    };

    startConnection();

    return () => {
      connection.stop();
    };
  }, []);

  return connection;
};
