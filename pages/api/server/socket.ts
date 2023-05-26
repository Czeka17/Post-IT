import { io } from 'socket.io-client';

const socket = io('https://facebook-clone-git-main-czeka17.vercel.app/api/server/socket.server'); // Replace with your Socket.IO server URL

export default socket;