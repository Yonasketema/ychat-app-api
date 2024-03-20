import "dotenv/config";

import config from "./config";
import app from "./app";

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`> Server Running on http://localhost:${PORT} ...`);
});
