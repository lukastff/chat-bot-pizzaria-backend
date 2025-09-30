# chat-bot-pizzaria-backend

## Configuração
- Crie um arquivo .env na raiz do backend com:
  - DEEPSEEK_API_KEY=seu_token_deepseek
  - FRONTEND_ORIGIN=http://localhost:5173 (ou a URL do front)

## WebSocket (Socket.IO)

- Endpoint: ws connects on the same host/port as HTTP (e.g., http://localhost:3000)
- Library: Socket.IO v4
- CORS: set env FRONTEND_ORIGIN or FRONTEND_URL to comma-separated allowed origins. Defaults to '*'.

### Events
- Server -> Client: `message:new` with payload `{ id, user_message, bot_message, created_at }` when a new message is created via POST /messages.

### Front-end example (React)
```ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => console.log('connected', socket.id));

socket.on('message:new', (msg) => {
  // update chat
  console.log('Nova mensagem', msg);
});
```
