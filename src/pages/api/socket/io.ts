import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

type NextApiResponseWithSocket = {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  };
} & {
  end: () => void;
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server as NetServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("join-room", (userId: string) => {
        socket.join(userId);
      });

      socket.on("send-message", (data: unknown) => {
        io.to(data.recipientId).emit("new-message", data);
      });

      socket.on(
        "typing",
        ({
          senderId,
          recipientId,
        }: {
          senderId: string;
          recipientId: string;
        }) => {
          io.to(recipientId).emit("typing", { senderId });
        },
      );

      socket.on(
        "stop-typing",
        ({
          senderId,
          recipientId,
        }: {
          senderId: string;
          recipientId: string;
        }) => {
          io.to(recipientId).emit("stop-typing", { senderId });
        },
      );
    });
  }

  res.end();
};

export default ioHandler;