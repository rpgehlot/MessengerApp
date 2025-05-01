import { User } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

type useWebSocketProps = {
    user : User;
    wsurl : string;
    onWsMessage : (event : string, payload : any) => void;
};

export function useWebSocket(props : useWebSocketProps) {

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectionAttempts = useRef(0);
    const maxAttempts = 6;

    const connect = () => {
        // if (wsRef.current?.OPEN === WebSocket.OPEN) return;

        wsRef.current = new WebSocket(props.wsurl);

        wsRef.current.onopen = () => {
            reconnectionAttempts.current = 0; 
            console.log('opened');

            const joinMessage = {
                event: 'authenticate',
                payload: { userId: props.user.id },
            };
            wsRef.current?.send(JSON.stringify(joinMessage));
        };

        wsRef.current.onmessage = (ev) => {
            try {
                const data = JSON.parse(ev.data) as {event : string; payload : any;};
                const { event, payload } = data;
                props.onWsMessage(event, payload);

            } catch (error) {
                console.error('Websocket message parsing error : ',error);
            }
        };

        wsRef.current.onerror = (error) => {
            console.error('Websocket error : ',error);
        };

        wsRef.current.onclose = () =>  {
            console.error('Websocket closed');
            if (reconnectionAttempts.current < maxAttempts) {
                // const delay = Math.min(1000 * 2 ** reconnectionAttempts.current, 10000);
                reconnectionAttempts.current += 1;
                setTimeout(connect, 5000);
              }
        };
    };


    useEffect(() => {
        connect();

        return () => {
            wsRef.current?.close();
            wsRef.current = null;
        };
    }, []);

    return {
        socket : wsRef
    }

}