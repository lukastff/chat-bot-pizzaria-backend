import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setupWebSocket } from './ws/socket';
import messageRoutes from './routes/messageRoutes';


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
    },
});

setupWebSocket(io);

app.use(cors());
app.use(express.json());
app.use('/messages', messageRoutes);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Backend rodando na porta ${PORT}`);
});