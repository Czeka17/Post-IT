import { Server, Socket } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { createServer } from 'http';
import cors from 'cors';

interface SocketServer {
  io?: Server;
}

const socketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const socket = res.socket as SocketServer;

  if (!socket.io) {
    console.log('*First use, starting socket.io');

    const httpServer = createServer();

    const io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket: Socket) => {
      console.log('A user connected');

      socket.join('global');

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });

      socket.on('sendMessage', (message: any) => {
        io.to('global').emit('message', message);
      });
    });

    socket.io = io;

    httpServer.listen(() => {
      console.log('Socket.io server started');
    });
  } else {
    console.log('Socket.io already running');
  }

  res.end();
};

export default socketHandler;
