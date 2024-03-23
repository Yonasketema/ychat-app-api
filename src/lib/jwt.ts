import jwt from "jsonwebtoken";
import config from "../config";

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    config.jwt_secret,
    {
      expiresIn: config.jwt_expireIn,
    }
  );

  return token;
};
