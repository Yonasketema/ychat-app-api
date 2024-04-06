export default {
  env: process.env.NODE_ENV,
  port: 8080,
  dbUrl: process.env.DATABASE_URL_DEV,
  jwt_secret: process.env.JWT_SECRET_KEY_DEV,
  jwt_expireIn: process.env.EXPIRE_IN_DEV || "30d",
  cookie_name: process.env.COOKIE_NAME_DEV,
};
