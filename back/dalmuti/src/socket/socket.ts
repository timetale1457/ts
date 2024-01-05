import { Server, Socket } from 'socket.io';
export class DalSocket {
    private rooms: { [key: string]: RoomInfo } = {};
    public constructor() {
    }
    public initialize(io: Server) {
        this.setEventListner(io);
    }
    private setEventListner(io: Server): void {
        io.on('connection', (socket: Socket) => {
            socket.on('createRoom', (roomInfo) => {
                const roomId = Math.random().toString(36).substr(2, 9);
                socket.join(roomId);
                this.rooms[roomId] = {
                    maxPeople: roomInfo.maxPeople,
                    roomName: roomInfo.roomName,
                    members: { [socket.id]: roomInfo.nickname }, // 자신이 입력한 닉네임을 저장
                    chatHistory: ["Room created"]
                };
                const history = this.rooms[roomId].chatHistory;
                io.to(roomId).emit('roomCreated', roomId, history);
            });
            socket.on('joinRoomById', (roomId, nickname) => {
                if (this.rooms[roomId]) {
                    if (Object.keys(this.rooms[roomId].members).length < this.rooms[roomId].maxPeople) {
                        socket.join(roomId);
                        this.rooms[roomId].members[socket.id] = nickname;
                        io.to(roomId).emit('userJoined', nickname);
                        socket.emit('roomHistory', this.rooms[roomId].chatHistory);  // 이 줄을 추가합니다.
                    } else {
                        socket.emit('roomFull');
                    }
                } else {
                    socket.emit('roomNotExist');
                }
            });
            socket.on('joinRoom', (roomId, nickname) => {
                if (this.rooms[roomId]) {
                    if (Object.keys(this.rooms[roomId].members).length < this.rooms[roomId].maxPeople) {
                        socket.join(roomId);
                        this.rooms[roomId].members[socket.id] = nickname;
                        io.to(roomId).emit('userJoined', nickname);
                        socket.emit('roomHistory', this.rooms[roomId].chatHistory); // 채팅 내역 전송
                    } else {
                        socket.emit('roomFull');
                    }
                } else {
                    socket.emit('roomNotExist');
                }
            });
            socket.on('sendMessage', (roomId, message) => {
                if (this.rooms[roomId]) {
                    this.rooms[roomId].chatHistory.push(message); // 채팅 내역 저장
                    io.to(roomId).emit('newMessage', message);
                }
            });
        });
    }
}