import { io, Socket } from 'socket.io-client';

const socket: Socket = io('/api/socket');

socket.on('connect', () => {
  console.log('Socket.io connection established');
});

export default socket;
