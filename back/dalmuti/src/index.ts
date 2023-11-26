import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://172.18.10.86:3000"], // 둘 다 허용
      methods: ["GET", "POST"]
    }
  });
  
interface RoomInfo {
    maxPeople: number;
    roomName: string;
    members: { [key: string]: string }; // 사용자 ID와 닉네임을 저장
    chatHistory: string[]; // 채팅 내역을 저장
}
const rooms: { [key: string]: RoomInfo } = {};
io.on('connection', (socket: Socket) => {
    socket.on('createRoom', (roomInfo) => {
        const roomId = Math.random().toString(36).substr(2, 9);
        socket.join(roomId);
        rooms[roomId] = {
            maxPeople: roomInfo.maxPeople,
            roomName: roomInfo.roomName,
            members: { [socket.id]: roomInfo.nickname }, // 자신이 입력한 닉네임을 저장
            chatHistory: ["Room created"]
        };
        const history = rooms[roomId].chatHistory;
        io.to(roomId).emit('roomCreated', roomId, history);
    });
    socket.on('joinRoomById', (roomId, nickname) => {
        if (rooms[roomId]) {
            if (Object.keys(rooms[roomId].members).length < rooms[roomId].maxPeople) {
                socket.join(roomId);
                rooms[roomId].members[socket.id] = nickname;
                io.to(roomId).emit('userJoined', nickname);
                socket.emit('roomHistory', rooms[roomId].chatHistory);  // 이 줄을 추가합니다.
            } else {
                socket.emit('roomFull');
            }
        } else {
            socket.emit('roomNotExist');
        }
    });

    socket.on('joinRoom', (roomId, nickname) => {
        if (rooms[roomId]) {
            if (Object.keys(rooms[roomId].members).length < rooms[roomId].maxPeople) {
                socket.join(roomId);
                rooms[roomId].members[socket.id] = nickname;
                io.to(roomId).emit('userJoined', nickname);
                socket.emit('roomHistory', rooms[roomId].chatHistory); // 채팅 내역 전송
            } else {
                socket.emit('roomFull');
            }
        } else {
            socket.emit('roomNotExist');
        }
    });

    socket.on('sendMessage', (roomId, message) => {
        if (rooms[roomId]) {
            rooms[roomId].chatHistory.push(message); // 채팅 내역 저장
            io.to(roomId).emit('newMessage', message);
        }
    });
});

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/');
});
