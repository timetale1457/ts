import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

const App = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!socket) return;

    socket.on('roomFull', () => {
      setError('The room is full.');
    });

    socket.on('roomNotExist', () => {
      setError('The room does not exist.');
    });
  }, []);

  const createRoom = () => {
    socket = io('http://localhost:4000');
    socket.emit('createRoom', { maxPeople: 10, roomName: 'My Room', nickname });
    socket.on('roomCreated', (roomId: string) => {
      setRoomId(roomId);
    });
  };

  const joinRoom = () => {
    socket = io('http://localhost:4000');
    socket.emit('joinRoom', roomId, nickname);
    socket.on('userJoined', (nickname: string) => {
      setChat([...chat, `${nickname} has joined`]);
    });
  };

  const sendMessage = () => {
    socket.emit('sendMessage', roomId, message);
    socket.on('newMessage', (message: string) => {
      setChat([...chat, message]);
    });
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}
      {!roomId ? (
        <button onClick={createRoom}>Create Room</button>
      ) : (
        <>
          <h1>Room ID: {roomId}</h1>
          <button onClick={joinRoom}>Join Room</button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
          <div>
            {chat.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
