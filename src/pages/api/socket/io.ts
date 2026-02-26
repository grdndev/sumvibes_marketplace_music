import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      // @ts-ignore
      addTrailingSlash: false,
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      socket.on('join-room', (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined their personal room.`);
      });

      socket.on('send-message', (data: any) => {
        // data should contain { id, senderId, recipientId, content, time, ... }
        // Broadcast to the recipient in real-time
        io.to(data.recipientId).emit('new-message', data);
        // We can also emit back to the sender if needed, but the client usually optimistically adds it.
      });

      socket.on('typing', ({ senderId, recipientId }) => {
        io.to(recipientId).emit('typing', { senderId });
      });

      socket.on('stop-typing', ({ senderId, recipientId }) => {
        io.to(recipientId).emit('stop-typing', { senderId });
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });
  }
  res.end();
};

export default ioHandler;
