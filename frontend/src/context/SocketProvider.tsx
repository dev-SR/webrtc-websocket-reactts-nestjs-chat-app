import React, { useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface Context {
  socket: Socket | null;
  isWSUnAuthorized: WSUnAuthorizedError | null;
}

export const SocketContext = React.createContext<Context>({} as Context);
export function useSocket(): Context {
  return useContext(SocketContext);
}

interface ProviderProps {
  children: React.ReactNode;
}
interface WSUnAuthorizedError {
  statusCode: 401;
  message: 'Unauthorized';
}
const SocketProvider: React.FC<ProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isWSUnAuthorized, SetWSUnAuthorized] = useState<WSUnAuthorizedError | null>(
    null,
  );

  const dev = import.meta.env.VITE_SOCKET_IO_URL;
  // let url = 'https://dev-sr-chat-backend.herokuapp.com';

  // if (dev) url = 'http://localhost:5000';

  useEffect(() => {
    const s = io({ withCredentials: true });
    setSocket(s);

    return () => {
      s.close();
    };
  }, []);

  useEffect(() => {
    socket?.on('Error', (m) => {
      SetWSUnAuthorized(m.response);
    });
    return () => {
      socket?.off('Error');
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isWSUnAuthorized }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

/*
import { useSocket } from '../utils/context/SocketProvider';

function Mes() {
	let [con, setCon] = useState(false);
	const { socket } = useSocket();
	const handleInviteAccepted = useCallback(() => {
		setCon(true);
	}, []);
	const [msg, setMsg] = useState(null);
	const onclick = () => {
		socket?.emit('SEND_MSG', 'soikat');
	};

	const receiveMsg = useCallback((d) => {
		setMsg(d);
	}, []);

	useEffect(() => {
		socket?.emit('USER_ONLINE');
		socket?.on('USER_ONLINE', handleInviteAccepted);
		socket?.on('SEND_MSG', receiveMsg);
		return () => {
			// clear only event listener....no need to clean emit
			socket?.off('USER_ONLINE', handleInviteAccepted);
			socket?.off('SEND_MSG', receiveMsg);
		};
	}, [handleInviteAccepted, socket, receiveMsg]);
	return (
		<>
			<h1 className='text-white'>{con && 'Connected'}</h1>
			<button onClick={onclick} className='bg-yellow-200 p-4'>
				Say Hi
			</button>
			<h1 className='text-white'>{msg && JSON.stringify(msg)}</h1>
		</>
	);
}

*/
