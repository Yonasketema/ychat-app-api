import db from "../db";
import { Request, Response, NextFunction } from "express";

interface SignupBody {
  username: string;
  password: string;
}

export const signup = async (
  req: Request<any, {}, SignupBody>,
  res: Response
) => {
  const { username, password } = req.body;

  const newUser = await db.user.create({
    data: {
      username,
      password,
    },
  });

  res.status(201).json({
    status: "success",

    data: {
      newUser,
    },
  });
};
