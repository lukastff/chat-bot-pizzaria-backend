import { Request, Response } from 'express';
import { MessageService } from '../services/messageService';

export async function getMessages(_: Request, res: Response) {
    try {
        const messages = await MessageService.getAllMessages();
        console.log('messages: ', messages);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar histórico.' });
    }
}