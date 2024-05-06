import express from "express";
import "dotenv/config";

import userController from "./app/controller/userController.js";
import registrationUserQueue from "./app/lib/Queue.js";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter.js";
import { ExpressAdapter } from "@bull-board/express";

const app = express();
const port = process.env.APPLICATION_PORT || 3000;

app.use(express.json());

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullAdapter(registrationUserQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

app.post("/users", userController.create);

app.listen(port, () => console.log(`Server is running on port ${port}!`));
