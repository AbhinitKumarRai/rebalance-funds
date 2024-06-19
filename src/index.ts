import cors from "cors";
import { Server } from "hyper-express";
import { MiddlewareHandler } from "hyper-express";
import { apiRouter } from "./routers/rest.js";
import { environment, setupEnvironment } from "./utils/environment.js";

// ------------------------initialize environment variables ------------------------

await setupEnvironment();
//  ---------------------------- hyper-express server ----------------------------

const app = new Server();

// json body parser middleware
const jsonParser: MiddlewareHandler = async (req) => {
  const result = await req.json();
  req.body = result;
};

app.use(
  cors({
    origin: "*",
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/", jsonParser);

//  ---------------------------- routes ----------------------------
app.get("/", (_request, response) => {
  response.send("API Working!");
});
app.use("/api", apiRouter);

app.listen(environment.port);