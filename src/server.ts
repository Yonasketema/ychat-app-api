import "dotenv/config";

import config from "./config";
import { server } from "./socket";

const PORT = config.port;
server.listen(PORT, () => {
  console.log(`> Server Running on http://localhost:${PORT} ...`);
});
