import https from "https";
import fs from "fs";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import sequelize from "./models";

import authRouter from "./router/auth";
import listRouter from "./router/list";
import userRouter from "./router/user";
import partyRouter from "./router/party";
import favoriteRouter from "./router/favorite";
import searchRouter from "./router/search";
import notificationRouter from "./router/notification";

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  "Access-Control-Allow-Credentials" : true,
  credentials: true
};

app.use(cors(corsOption));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
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
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: `Something went wrong: ${err}` });
});

const HTTPS_PORT = config.port || 80;

let server;
if (fs.existsSync('./key.pem') && fs.existsSync('./cert.pem')) {
  const privateKey = fs.readFileSync(__dirname + '/key.pem', 'utf8');
  const certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(HTTPS_PORT, async () => {
    await sequelize.authenticate()
      .then(async () => console.log("✅ DB connection success"))
      .catch(error => console.log(error));
    console.log(`✅ https server running in ${HTTPS_PORT}`);
  });
} 
else {
  server = app.listen(HTTPS_PORT, () => console.log('✅ http server running'));
}

export default server;