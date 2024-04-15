import db from "../db";
import client from "../lib/redis";
import { getReceiverSocketId, io } from "../socket";

export const createMessage = async (req, res) => {
  const { text } = req.body;
  const senderId = req.user.id;
  const receiverId = req.params.receiverId;

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

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", message);
  }

  await client.hDel(senderId, receiverId);

  res.status(201).json({
    status: "success",
    cache_data: false,
    data: message,
  });
};

export const getMessages = async (req, res) => {
  const senderId = req.user.id;

  const receiverId = req.params.userId;

  const redis_chat = await client.hGet(senderId, receiverId);

  if (redis_chat) {
    return res.status(200).json({
      status: "success",
      cache_data: true,
      data: JSON.parse(redis_chat),
    });
  }

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

  if (!chat) {
    return res.status(200).json({
      status: "success",
      data: null,
    });
  }

  const messages = await db.message.findMany({
    where: {
      id: {
        in: [...chat.messages],
      },
    },
  });

  await client.hSet(senderId, receiverId, JSON.stringify(messages));

  res.status(200).json({
    status: "success",
    cache_data: false,
    data: messages,
  });
};
