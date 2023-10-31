import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const App = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [inputRoomId, setInputRoomId] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    socket = io('http://localhost:4000');

    socket.on('roomCreated', (roomId: string) => {
      setRoomId(roomId);
    });

    socket.on('userJoined', (nickname: string) => {
      setChat((prevChat) => [...prevChat, `${nickname} has joined`]);
    });

    socket.on('newMessage', (message: string) => {
      setChat((prevChat) => [...prevChat, message]);
    });

    socket.on('roomFull', () => {
      setError('The room is full.');
    });

    socket.on('roomNotExist', () => {
      setError('The room does not exist.');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = () => {
    if (nickname) {
      socket.emit('createRoom', { maxPeople: 10, roomName: 'My Room', nickname });
    }
  };

  const joinRoomById = () => {
    setRoomId(inputRoomId);
    joinRoom();
  };

  const joinRoom = () => {
    if (roomId && nickname) {
      socket.emit('joinRoom', roomId, nickname);
    }
  };

  const sendMessage = () => {
    if (roomId && message) {
      const fullMessage = `${nickname}: ${message}`;
      socket.emit('sendMessage', roomId, fullMessage);
      setMessage('');
    }
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}
      {!roomId ? (
        <>
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button onClick={createRoom}>Create Room</button>
          <input
            type="text"
            placeholder="Room ID"
            value={inputRoomId}
            onChange={(e) => setInputRoomId(e.target.value)}
          />
          <button onClick={joinRoomById}>Join Room by ID</button>
        </>
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

let socket: Socket;
export default App;
