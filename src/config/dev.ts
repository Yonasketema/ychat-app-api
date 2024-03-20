export default {
  env: process.env.NODE_ENV,
  port: 8080,
  dbUrl: process.env.DATABASE_URL_DEV,
  jwt_secret: process.env.JWT_SECRET_KEY_DEV,
};
