import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

type EventHandlers = {
  [event: string]: (data: any) => void;
};

export const useSignalREvents = (eventHandlers: EventHandlers, groupName?: string) => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/hub/signalR`, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    for (const [event, handler] of Object.entries(eventHandlers)) {
      connection.on(event, handler);
    }

  connection
    .start()
    .then(async () => {

      if (groupName) {
        try {
          await connection.invoke("JoinGroup", groupName);
        } catch (err) {
          console.error("Failed to join group:", err);
        }
      }
    })
    .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      connection.stop();
    };
  }, []);

  const stopConnection = async () => {
    if (connectionRef.current) {
      try {
        await connectionRef.current.stop();
      } catch (err) {
        console.error("Error stopping SignalR connection:", err);
      }
    }
  };

  return { stopConnection };
};
