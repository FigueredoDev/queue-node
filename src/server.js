import express from "express";
import "dotenv/config";

import userController from "./app/controller/userController.js";

const app = express();
const port = process.env.APPLICATION_PORT || 3000;

app.use(express.json());

app.post("/users", userController.create);

app.listen(port, () => console.log(`Server is running on port ${port}!`));
