// src/index.ts

import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",  // 허용할 도메인
      methods: ["GET", "POST"]
    }
  });

interface RoomInfo {
  maxPeople: number;
  roomName: string;
  members: string[];
}

const rooms: { [key: string]: RoomInfo } = {};

io.on('connection', (socket: Socket) => {
  socket.on('createRoom', (roomInfo) => {
    const roomId = Math.random().toString(36).substr(2, 9);
    socket.join(roomId);
    rooms[roomId] = { ...roomInfo, members: [socket.id] };
    socket.emit('roomCreated', roomId);
  });

  socket.on('joinRoom', (roomId, nickname) => {
    if (rooms[roomId]) {
      if (rooms[roomId].members.length < rooms[roomId].maxPeople) {
        socket.join(roomId);
        rooms[roomId].members.push(socket.id);
        io.to(roomId).emit('userJoined', nickname);
      } else {
        socket.emit('roomFull');
      }
    } else {
      socket.emit('roomNotExist');
    }
  });

  socket.on('sendMessage', (roomId, message) => {
    if (rooms[roomId]) {
      io.to(roomId).emit('newMessage', message);
    }
  });
});

server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/');
});
