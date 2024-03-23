import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../lib/auth";
import { createJWT } from "../lib/jwt";
import db from "../db";
import config from "../config";

interface SignupBody {
  username: string;
  password: string;
}

export const signup = async (
  req: Request<any, {}, SignupBody>,
  res: Response
) => {
  const { username, password } = req.body;

  const user = await db.user.create({
    data: {
      username,
      password: await hashPassword(password),
    },
  });

  const token = createJWT(user);

  res.status(201).json({
    status: "success",
    token,
  });
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new Error("provide email and password"));
  }

  const user = await db.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user || !(await verifyPassword(password, user.password))) {
    return next(new Error("incorrect email or password"));
  }

  const token = createJWT(user);

  res.status(200).json({
    status: "success",
    token,
  });
};

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new Error("unauthorization"));
  }

  const user = jwt.verify(token, config.jwt_secret);

  const sign_user = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!sign_user) {
    return next(new Error("The user does not exist"));
  }

  req.user = user;

  /// Access to protected route
  next();
};
