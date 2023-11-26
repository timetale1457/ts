import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  roomId: string;
  nickname: string;
  socket: Socket;
}

const ChatRoom: React.FC<Props> = ({ roomId, nickname, socket }) => {
  const [message, setMessage] = useState<string>('');
  const [chat, setChat] = useState<string[]>([]);

  useEffect(() => {
    const handleNewMessage = (message: string) => {
      console.log('newMessage');
      setChat((prevChat) => [...prevChat, message]);
    };

    const handleUserJoined = (nickname: string) => {
      console.log('userJoined');
      setChat((prevChat) => [...prevChat, `${nickname} has joined`]);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('userJoined', handleUserJoined);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('userJoined', handleUserJoined);
    };
  }, [socket]);

  const sendMessage = () => {
    const fullMessage = `${nickname}: ${message}`;
    console.log(fullMessage);
    socket.emit('sendMessage', roomId, fullMessage);
    setMessage('');
  };

  return (
    <>
      <h1>Room ID: {roomId}</h1>
      <h2>Nickname: {nickname}</h2> {/* 닉네임 표시 */}
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
  );
};

export default ChatRoom;
