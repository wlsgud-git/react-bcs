import nodemailer from "nodemailer";
import multer from "multer";

import { config } from "../config.js";

// nodemailer
export const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: config.nodemailer.email,
    pass: config.nodemailer.password,
  },
});

export const upload = multer({ storage: multer.memoryStorage() });
