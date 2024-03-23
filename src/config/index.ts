process.env.NODE_ENV = process.env.NODE_ENV || "development";

type EnvConfig = {
  env: string;
  port: number;
  dbUrl: string;
  jwt_secret: string;
  jwt_expireIn: string;
};

let envConfig: EnvConfig;

if (process.env.NODE_ENV === "production") {
  envConfig = require("./prod").default;
} else if (process.env.NODE_ENV === "development") {
  envConfig = require("./dev").default;
}

export default envConfig;
