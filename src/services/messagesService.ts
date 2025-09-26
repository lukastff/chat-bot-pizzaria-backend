import axios from 'axios';
import { MessageRepository, Message } from '../repositories/messageRepository.js';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

export class MessagesService {
  private repo: MessageRepository;

  constructor(repo = new MessageRepository()) {
    this.repo = repo;
  }

  async sendMessage(userMessage: string): Promise<Message> {
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_TOKEN || '';

    if (!apiKey) {
      // If no key provided, return a mocked response but still save it for dev/testing
      const botMessage = 'Chave da API DeepSeek ausente. Configure a variável DEEPSEEK_API_KEY.';
      return this.repo.create(userMessage, botMessage);
    }

    try {
      const resposta = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: userMessage,
            },
          ],
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      // Try to read the content similar to OpenAI format
      const botMessage: string =
        resposta?.data?.choices?.[0]?.message?.content ??
        resposta?.data?.choices?.[0]?.text ??
        JSON.stringify(resposta.data);

      return this.repo.create(userMessage, botMessage);
    } catch (err: any) {
      const errorText = err?.response?.data ? JSON.stringify(err.response.data) : String(err.message || err);
      const botMessage = `Falha ao obter resposta do agente IA: ${errorText}`;
      return this.repo.create(userMessage, botMessage);
    }
  }

  async listHistory(): Promise<Message[]> {
    return this.repo.getAll();
  }
}
