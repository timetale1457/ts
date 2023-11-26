import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  setRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  setNickname: React.Dispatch<React.SetStateAction<string>>;
  socket: Socket;
}

const CreateRoom: React.FC<Props> = ({ setRoomId, setNickname, socket }) => {
  const [inputNickname, setInputNickname] = useState<string>('');
  const [inputRoomId, setInputRoomId] = useState<string>('');
  const createRoom = () => {
    if (inputNickname) {
      setNickname(inputNickname);
      console.log(`createRoom inputNickName: ${inputNickname}, socket: ${socket}`);
      socket.emit('createRoom', { maxPeople: 10, roomName: 'My Room', nickname: inputNickname });
    }
  };
  const joinRoomById = () => {
    if (inputNickname && inputRoomId) {
      setRoomId(inputRoomId);
      setNickname(inputNickname);
      socket.emit('joinRoom', inputRoomId, inputNickname);
    }
  };
  useEffect(() => {
    const handleRoomCreated = (roomId: string, chatHistory: string[]) => {
      console.log(`roomCreated roomId: ${roomId} chatHistory: ${chatHistory}`);
      setRoomId(roomId);
    };

    socket.on('roomCreated', handleRoomCreated);

    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      socket.off('roomCreated', handleRoomCreated);
    };
  }, [socket, setRoomId]);
  return (
    <>
      <input
        type="text"
        placeholder="Nickname"
        value={inputNickname}
        onChange={(e) => setInputNickname(e.target.value)}
      />
      <button onClick={createRoom}>Create Room</button>
      <br/>
      <input
        type="text"
        placeholder="Room ID"
        value={inputRoomId}
        onChange={(e) => setInputRoomId(e.target.value)}
      />
      <button onClick={joinRoomById}>Join Room by ID</button>
    </>
  );
};

export default CreateRoom;
