import express from "express";

const app = express();
const port = process.env.APPLICATION_PORT || 3000;

app.get("/users", (req, res) => {
  return res.send("hello world");
});

app.listen(port, () => console.log(`Server is running on port ${port}!`));
