import { useEffect } from "react";
import connection from "../api/signalR/connection";
import { HubConnectionState } from "@microsoft/signalr"; // <-- Import this!

export const useSignalR = () => {
  useEffect(() => {
    const startConnection = async () => {
      try {
        if (connection.state === HubConnectionState.Disconnected) {
          // Use HubConnectionState
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
