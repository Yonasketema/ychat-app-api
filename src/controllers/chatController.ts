import db from "../db";
import { Request, Response, NextFunction } from "express";

const senderId = "cef42dca-1c93-4b07-bac9-3921d32bed09"; //req.user.id;

interface MessageBody {
  text: string;
  receiverId: string;
}

export const createMessage = async (
  req: Request<any, {}, MessageBody>,
  res: Response
) => {
  const { receiverId, text } = req.body;

  let chat = await db.chat.findFirst({
    where: {
      users: {
        hasEvery: [senderId, receiverId],
      },
    },
  });

  if (!chat) {
    chat = await db.chat.create({
      data: {
        users: [senderId, receiverId],
      },
    });
  }

  const message = await db.message.create({
    data: {
      senderId,
      receiverId,
      text,
    },
  });

  if (message) {
    await db.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        messages: {
          push: [message.id],
        },
      },
    });
  }

  res.status(201).json({
    status: "success",
    data: message,
  });
};

export const getMessages = async (req: Request, res: Response) => {
  const receiverId = req.params.id;

  const chat = await db.chat.findFirst({
    where: {
      users: {
        hasEvery: [senderId, receiverId],
      },
    },
    select: {
      messages: true,
    },
  });

  const messages = await db.message.findMany({
    where: {
      id: {
        in: [...chat.messages],
      },
    },
  });

  res.status(201).json({
    status: "success",
    data: messages,
  });
};
