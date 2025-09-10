// socket.js
import { io } from "socket.io-client";
import { SOCKET_URL } from '../config/api.js';

// Connect to the Socket.IO server using environment variable
const socket = io(SOCKET_URL);
export default socket;
