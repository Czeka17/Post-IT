import { Server } from 'socket.io';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

export default async function socketServer(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'GET') {
    const parsedUrl = parse(req.url || '', true);
    const { pathname } = parsedUrl;

    // If the request is for a static asset, let Next.js handle it
    if (pathname && (pathname.startsWith('/_next') || pathname.startsWith('/static'))) {
      await handle(req, res, parsedUrl);
    } else {
      // Handle any other GET requests if needed
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Socket.IO server is running');
    }
  } else {
    const httpServer = createServer((req, res) => {
      // Let Next.js handle all other HTTP requests
      handle(req, res);
    });

    const io = new Server(httpServer, {
      cors: {
        origin: '*', // Update with your frontend URL or restrict it to specific origins
      },
    });

    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.join('global');

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });

      socket.on('sendMessage', (message) => {
        io.to('global').emit('message', message);
      });
    });

    // Start the Next.js app and listen to the HTTP server created by Next.js
    app.prepare().then(() => {
      httpServer.listen(process.env.PORT || 3001, () => {
        console.log('Socket.IO server is running');
      });
    });
  }
}