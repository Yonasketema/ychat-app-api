import db from "../db";

export const getAllUser = async (req, res) => {
  const users = await db.user.findMany({
    where: {
      id: {
        not: req.user.id,
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: users,
  });
};
