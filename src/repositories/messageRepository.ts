import { getDB, MessageRow } from '../db/database.js';

export type Message = {
  id: number;
  texto: string;
  remetente: 'usuario' | 'bot';
};

export class MessageRepository {
  async getAll(): Promise<Message[]> {
    const db = getDB();
    return new Promise<Message[]>((resolve, reject) => {
      db.all<MessageRow>(`SELECT * FROM messages ORDER BY id ASC LIMIT 100`, (err, rows) => {
        if (err) return reject(err);
        // Flatten each DB row into two Message objects: one for user, one for bot
        const messages: Message[] = [];
        for (const row of rows) {
          messages.push({ id: row.id * 2 - 1, texto: row.user_message, remetente: 'usuario' });
          messages.push({ id: row.id * 2, texto: row.bot_message, remetente: 'bot' });
        }
        resolve(messages);
      });
    });
  }

  async create(userMessage: string, botMessage: string): Promise<Message> {
    const db = getDB();
    return new Promise<Message>((resolve, reject) => {
      const stmt = db.prepare(
        `INSERT INTO messages (user_message, bot_message) VALUES (?, ?)`
      );
      stmt.run(userMessage, botMessage, function (this: any, err: Error | null) {
        if (err) return reject(err);
        // As solicitado, retornar o objeto Message no formato desejado para a mensagem do usuário
        const userMsg: Message = {
          id: Date.now(),
          texto: userMessage,
          remetente: 'usuario',
        };
        resolve(userMsg);
      });
      stmt.finalize();
    });
  }
}
