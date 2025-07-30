import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { BACKEND_BASE_ADDRESS } from "../config/environment";

type EventHandlers = {
  [event: string]: (data: any) => void;
};

export const useSignalREvents = (eventHandlers: EventHandlers) => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BACKEND_BASE_ADDRESS}/hub/signalR`, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    for (const [event, handler] of Object.entries(eventHandlers)) {
      connection.on(event, handler);
    }

    connection
      .start()
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      connection.stop();
    };
  }, []);
};
