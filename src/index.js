import cors from "cors";
import express from "express";
import morgan from "morgan";
import { connect } from "./db/connect.js";
import { notFound } from "./middleware/utils/not-found.js";
import { Server } from "socket.io";
import nodeEvents from "./nodeEvents/nodeEvents.js";
import bodyParser from "body-parser";
import { userRouter } from "./routes/user.js";
import { coinsRouter } from "./routes/coins.js";
import { dcaRouter } from "./routes/dca.js";
import { positionRouter } from "./routes/position.js";
import { rsiRouter } from "./routes/rsi.js";
import { orderRouter } from "./routes/order.js";
import { takeProfitRouter } from "./routes/takeProfitRouter.js";
// Start the cron job
const app = express();
connect().catch((e) => {
  console.log(e);
});

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//routes:

app.use("/user", userRouter);
app.use("/coins", coinsRouter);
app.use("/dca", dcaRouter);
app.use("/position", positionRouter);
app.use("/rsi", rsiRouter);
app.use("/order", orderRouter);
app.use("/takeProfit", takeProfitRouter);

app.use(notFound);

const PORT = process.env.PORT || 3002;
const server = app.listen(PORT, () =>
  console.log(`HTTP server running on port ${PORT}`)
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});

nodeEvents.on("user-update", () => {
  io.emit("user-update");
});
nodeEvents.on("products-update", () => {
  io.emit("products-update");
});
nodeEvents.on("user-update", () => {
  io.emit("user-update");
});
nodeEvents.on("ref-content", () => {
  io.emit("ref-content");
});
