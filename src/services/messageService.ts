import { responderComDeepseek } from './deepseekService';
import { prisma } from '../config/prisma';

export class MessageService {
    static async process(message: string): Promise<string> {
        await prisma.message.create({
            data: {
                role: 'user',
                content: message,
            },
        });

        const botReply = await responderComDeepseek([
            ...((await this.getHistoryAsChat())),
            { role: 'user', content: message },
        ]);

        await prisma.message.create({
            data: {
                role: 'assistant',
                content: botReply,
            },
        });

        return botReply;
    }

    static async getAllMessages() {
        return prisma.message.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    static async getHistoryAsChat(): Promise<{ role: 'user' | 'assistant'; content: string }[]> {
        const messages = await this.getAllMessages();
        return messages.map((m: any)  => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
        }));
    }
}
