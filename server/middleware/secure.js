import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { config } from "../config.js";
import { transport } from "./variable.js";
import { DateControl } from "./time.js";
import { RedisDB } from "../db/db.js";

export class Bcrypt {
  constructor() {}

  async createHashText(text) {
    try {
      const hash_text = await bcrypt.hash(text, config.bcrypt.salt);
      return { status: 200, hash_text };
    } catch (err) {
      throw err;
    }
  }

  async compareHashes(text, hash_pw) {
    try {
      const result = await bcrypt.compare(text, hash_pw);
      if (!result) throw new Error("두 텍스트가 같지 않습니다");
      return { status: 200, result };
    } catch (err) {
      throw err;
    }
  }
}

export class Jwt {
  constructor() {}

  async createAccesstoken(email) {
    try {
      const access_token = await jwt.sign(
        { email: email },
        config.jwt.a_secret_key,
        { expiresIn: "1d" }
      );
      return { status: 200, access_token };
    } catch (err) {
      throw err;
    }
  }

  async verifyAccesstoken(access_token) {
    try {
      const decoded = await jwt.verify(access_token, config.jwt.a_secret_key);
      return { status: 200, decoded };
    } catch (err) {
      throw err;
    }
  }

  async createRefreshtoken(email) {
    try {
      const refresh_token = await jwt.sign(
        { email: email },
        config.jwt.r_secret_key,
        { expiresIn: "2d" }
      );
      return { status: 200, refresh_token };
    } catch (err) {
      throw err;
    }
  }

  async verfiyRefreshtoken(refresh_token) {
    try {
      const decoded = await jwt.verify(refresh_token, config.jwt.r_secret_key);
      return { status: 200, decoded };
    } catch (err) {
      throw err;
    }
  }
}

export class Otp {
  constructor() {}

  GetOtpnum() {
    let otp = "";

    for (var i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  async SendEmailOtp(option) {
    try {
      let b = new Bcrypt();
      let t = new DateControl();
      let r = new RedisDB();

      let otp = this.GetOtpnum();
      option["html"] = `<p> ${otp} </p>`;

      transport.sendMail(option);

      let hash_otp = await b.createHashText(otp);
      let expires_otp = t.SecondAdd(180);

      await r.RedisSet(`otp-${option.to}`, 3600, () => {
        return { otp: hash_otp.hash_text, expires_in: expires_otp };
      });
      return {
        status: 200,
        message: `${option.to}로 인증번호가 발송되었습니다`,
      };
    } catch (err) {
      throw err;
    }
  }

  async VerifyOtp(email, otpnum) {
    try {
      let r = new RedisDB();
      let t = new DateControl();
      let b = new Bcrypt();

      const otp_info = await r.RedisGet(`otp-${email}`);
      const { otp, expires_in } = otp_info.data;

      const current = t.CurrentDate().getTime();
      if (expires_in <= current) throw new Error("유효기간이 만료되었습니다");

      const { status, result } = await b.compareHashes(otpnum, otp);

      await r.RedisDelete(`otp-${email}`);
      return { status, result };
    } catch (err) {
      throw err;
    }
  }
}
