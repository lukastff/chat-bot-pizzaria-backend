import { Server } from 'socket.io';
import { MessageService } from '../services/messageService';

let io: Server;

export function setupWebSocket(server: Server) {
    io = server;

    io.on('connection', socket => {
        console.log('Cliente conectado ao WebSocket');

        socket.on('nova-mensagem', async (content: string) => {
            try {
                const reply = await MessageService.process(content);
                socket.emit('bot-message', reply);
            } catch (err) {
                console.error('Erro na IA:', err);
                socket.emit('bot-message', 'Desculpe, ocorreu um erro.');
            }
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });
}

export function emitBotResponse(message: string) {
    if (io) {
        io.emit('bot-message', message);
    }
}
