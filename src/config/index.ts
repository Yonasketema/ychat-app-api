process.env.NODE_ENV = process.env.NODE_ENV || "development";

type EnvConfig = {
  env: "production" | "development";
  port: number;
  dbUrl: string;
  jwt_secret: string;
  jwt_expireIn: string;
  cookie_name: string;
};

let envConfig: EnvConfig;

if (process.env.NODE_ENV === "production") {
  envConfig = require("./prod").default;
} else if (process.env.NODE_ENV === "development") {
  envConfig = require("./dev").default;
}

export default envConfig;
