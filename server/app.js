import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import https from "https";
import fs from "fs";

import { config } from "./config.js";
import { csrfVerify } from "./middleware/auth.js";
// import {Bcrypt, Jwt} from './middleware/secure.js'

// options
const app = express();
const __dirname = path.resolve();
const corsOption = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: "http://localhost:3000",
};

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfVerify);
app.use(cors(corsOption));
app.use(express.static(path.join(__dirname, "../client/build")));

// routes
import CommentRouter from "./routes/comment.js";
import VideoRouter from "./routes/video.js";
import UserRouter from "./routes/user.js";

app.use("/", CommentRouter);
app.use("/", VideoRouter);
app.use("/", UserRouter);

app.use((req, res, next) => {
  next();
});

app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(config.host.port, () => {
  console.log("bcs server start:", config.host.port);
});
