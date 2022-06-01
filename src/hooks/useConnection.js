import { useEffect, useState } from "react";
import io from 'socket.io-client';

export const useConnection = (uri) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    !socket &&
      setSocket(io(uri));
    return () => {
      socket && socket.close();
    }
  }, [uri, socket]);

  return {
    socket
  }
}