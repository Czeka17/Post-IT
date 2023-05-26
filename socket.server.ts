const { Server } = require('socket.io');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // If the request is for a static asset, let Next.js handle it
    if (pathname.startsWith('/_next') || pathname.startsWith('/static')) {
      await handle(req, res, parsedUrl);
    } else {
      // Handle any other GET requests if needed
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Socket.IO server is running');
    }
  } else {
    const server = createServer((req, res) => {
      // Let Next.js handle all other HTTP requests
      handle(req, res);
    });

    const io = new Server(server, {
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
      server.listen(process.env.PORT || 3001, () => {
        console.log('Socket.IO server is running');
      });
    });
  }
};
