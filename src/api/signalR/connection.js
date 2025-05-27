// src/api/signalR/connection.js
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5063/orderHub", {
    accessTokenFactory: () => localStorage.getItem("access_token"),
    transport: signalR.HttpTransportType.WebSockets, // Optional: force WebSocket
  })
  .withAutomaticReconnect()
  .build();

export default connection;
