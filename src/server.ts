import "dotenv/config";

import config from "./config";
import { server } from "./socket";
import client from "./lib/redis";

const PORT = config.port;
server.listen(PORT, async () => {
  await client.connect();
  console.log(`> Server Running on http://localhost:${PORT} ...`);
});
