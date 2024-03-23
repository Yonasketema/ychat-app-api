export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL_PROD,
  jwt_secret: process.env.JWT_SECRET_KEY_PROD,
  jwt_expireIn: process.env.EXPIRE_IN_PROD || "90d",
};
