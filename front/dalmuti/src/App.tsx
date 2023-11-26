import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import CreateRoom from './component/CreateRoom';
import ChatRoom from './component/ChatRoom';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const newSocket = io('http://localhost:4000');

    newSocket.on('connect', () => {
      console.log('Connected to the server');
    });

    newSocket.on('roomFull', () => {
      setError('The room is full.');
    });
    
    newSocket.on('roomNotExist', () => {
      setError('The room does not exist.');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!socket) return <div>Loading...</div>;

  return (
    <div>
      {error && <div>Error: {error}</div>}
      {!roomId ? (
        <CreateRoom setRoomId={setRoomId} setNickname={setNickname} socket={socket} />
      ) : (
        <ChatRoom roomId={roomId} nickname={nickname} socket={socket} />
      )}
    </div>
  );
};

export default App;
