import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { DalSocket } from './socket/socket';

class Dalmuti {
    private app: express.Express;
    private server: http.Server;
    private io: Server;
    private sock: DalSocket;
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.app.use(cors());
        this.io = new Server(this.server, {
            cors: {
              origin: ["http://localhost:3000", "http://172.18.10.86:3000"], // 둘 다 허용
              methods: ["GET", "POST"]
            }
        });
        this.sock = new DalSocket();
    }
    public serverStart() {
        this.server.listen(4000, () => {
            console.log('Server is running on http://localhost:4000/');
        });
        this.sock.initialize(this.io);
    }
}

new Dalmuti().serverStart();