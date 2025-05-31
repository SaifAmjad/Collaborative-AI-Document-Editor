require("dotenv").config({ path: "../.env" });
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDb = require("./db/connectDb");
const socketConnection = require("./controllers/socket");
const aiGeneration = require("./routes/aiGeneration");
const cors = require("cors");
const user = require("./routes/user");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/v2/authenticate",user );
app.use("/v2/ai", aiGeneration);

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

socketConnection(Server, server);

const startServer = async () => {
  try {
    await connectDb(process.env.URL_STRING);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
