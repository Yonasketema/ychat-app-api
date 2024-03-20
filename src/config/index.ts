process.env.NODE_ENV = process.env.NODE_ENV || "development";

let envConfig;

if (process.env.NODE_ENV === "production") {
  envConfig = require("./prod").default;
} else if (process.env.NODE_ENV === "development") {
  envConfig = require("./dev").default;
}

export default envConfig;
