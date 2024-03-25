import db from "../db";

export const createMessage = async (req, res) => {
  const { receiverId, text } = req.body;
  const senderId = req.user.id;

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

export const getMessages = async (req, res) => {
  const senderId = req.user.id;

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

  res.status(200).json({
    status: "success",
    data: messages,
  });
};
