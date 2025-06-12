import { useEffect, useRef, useState } from "react"
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr"

const createConnection = () => {
  return new HubConnectionBuilder()
    .withUrl("http://localhost:5050/OrderHub")
    .withAutomaticReconnect()
    .build();
};

export const useSignalR = () => {
  const connectionRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let isMounted = true
    const connection = createConnection()
    connectionRef.current = connection

    const startConnection = async () => {
      try {
        if (connection.state === HubConnectionState.Disconnected && isMounted) {
          await connection.start();
          if (isMounted) {
            setIsConnected(true);
          }
        }
      } catch (err) {
        console.error(err)
      }
    };

    startConnection();

    return () => {
      isMounted = false
      if (connectionRef.current) {
        connectionRef.current.stop()
        setIsConnected(false)
      }
    }
  }, [])

  return { connection: connectionRef, isConnected }
}