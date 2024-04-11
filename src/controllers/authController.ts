import { Request, Response, NextFunction } from "express";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

import { createJWT } from "../lib/jwt";
import db from "../db";
import config from "../config";

import { hashPassword, verifyPassword } from "../lib/auth";
interface SignupBody {
  username: string;
  password: string;
}

export const signup = async (req: Request, res: Response, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw Error("provide email and password");
    }

    const user = await db.user.create({
      data: {
        username,
        password: await hashPassword(password),
      },
    });

    const token = createJWT(user);

    res.setHeader(
      "Set-Cookie",
      serialize(config.cookie_name, token, {
        httpOnly: true,
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
    );

    res.status(201);
    res.json({});
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const login = async (req, res: Response, next) => {
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

  res.setHeader(
    "Set-Cookie",
    serialize(config.cookie_name, token, {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })
  );

  res.status(201);
  res.json({});
};

export const protect = async (req, res, next) => {
  let token = req.cookies[config.cookie_name];

  if (!token) {
    return next(new Error("unauthorization"));
  }

  const user = await jwt.verify(token, config.jwt_secret);

  const sign_user = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!sign_user) {
    return next(new Error("The user does not exist"));
  }

  req.user = sign_user;

  /// Access to protected route
  next();
};
