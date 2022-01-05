const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config");
require("express-async-errors");

const authRouter = require("./router/auth");
const listRouter = require("./router/list");
const userRouter = require("./router/user");
const partyRouter = require("./router/party");
const favoriteRouter = require("./router/favorite");
const searchRouter = require("./router/search");
const notificationRouter = require("./router/notification");

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log("HELLO HERE IS APP.JS");
  res.status(200).send("Welcome to Full Party!");
});

app.use("/", authRouter);
app.use("/list", listRouter);
app.use("/user", userRouter);
app.use("/party", partyRouter);
app.use("/favorite", favoriteRouter);
app.use("/search", searchRouter);
app.use("/notification", notificationRouter);
app.use((req, res) => {
  res.status(400).json({ message: "Invalid request" });
});
app.use((err, req, res, next) => {
  res.status(500).json({ message: `Something went wrong: ${err}` });
});

const HTTPS_PORT = config.port || 80;

let server;
if (fs.existsSync('./key.pem') && fs.existsSync('./cert.pem')) {
  const privateKey = fs.readFileSync(__dirname + '/key.pem', 'utf8');
  const certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(HTTPS_PORT, () => console.log('https server runnning'));
} else {
  server = app.listen(HTTPS_PORT, () => console.log('http server runnning'));
}
module.exports = server;
