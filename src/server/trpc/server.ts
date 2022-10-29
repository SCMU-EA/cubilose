import http from "http";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { appRouter } from "./router/_app";
const trpcHandler = createHTTPHandler({
  router: appRouter,
  createContext: () => ({}),
});

http
  .createServer((req, res) => {
    // act on the req/res objects

    // enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      return res.end();
    }
    trpcHandler(req, res);
  })
  .listen(8080);
