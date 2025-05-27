
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5063/orderHub", {
    accessTokenFactory: () => localStorage.getItem("access_token") || "",
    transport: signalR.HttpTransportType.WebSockets,
    withCredentials: true,
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

export default connection;
