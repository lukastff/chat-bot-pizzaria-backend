import { Request, Response } from 'express';
import { MessagesService } from '../services/messagesService.js';
import {Message} from "../repositories/messageRepository.js";

const service = new MessagesService();

export async function postMessage(req: Request, res: Response) {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Campo "message" é obrigatório e deve ser string.' });
    }

    const saved = await service.sendMessage(message);
    return res.status(201).json(saved);
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro interno no servidor', detail: String(err?.message || err) });
  }
}

export async function getMessages(_req: Request, res: Response) {
  try {
      const message: Message = {id: 1, texto: 'Mama aqui poli', remetente: 'bot'};
      return  res.json(message);
    const all = await service.listHistory();
    return res.json(all);
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro interno no servidor', detail: String(err?.message || err) });
  }
}
