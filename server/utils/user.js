import qs from "qs";
import axios from "axios";
import nodemailer from "nodemailer";

import { config } from "../config.js";
import { fbcrypt } from "./secure.js";
import { redis_db } from "./redis.js";
import { date } from "../utils/date.js";
import { DbPlay } from "../db/db.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  port: config.nodemailer.port,
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: config.nodemailer.email,
    pass: config.nodemailer.password,
  },
});

export class Oauth {
  constructor() {}

  // 네이버
  async naverToken(code, state) {
    try {
      let api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${config.naver.client_id}&client_secret=${config.naver.client_secret}&code=${code}&state=${state}`;
      const result = await axios(api_url, { method: "get" });
      return result.data;
    } catch (err) {
      throw err;
    }
  }

  async naverRenewToken(refresh_token) {
    try {
      let api_url = `https://nid.naver.com/oauth2.0/token?grant_type=refresh_token&client_id=${config.naver.client_id}&client_secret=${config.naver.client_secret}&refresh_token=${refresh_token}`;
      const result = await axios(api_url, { method: "get" });
      return result.data;
    } catch (err) {
      throw err;
    }
  }

  async naverUserinfo(access_token) {
    try {
      let api_url = "https://openapi.naver.com/v1/nid/me";
      const result = await axios(api_url, {
        method: "get",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return result.data;
    } catch (err) {
      throw err;
    }
  }

  // 카카오
  async kakaoToken(code) {
    try {
      let api_url = "https://kauth.kakao.com/oauth/token";
      const result = await axios(api_url, {
        method: "post",
        data: qs.stringify({
          grant_type: "authorization_code",
          client_id: config.kakao.rest_key,
          redirect_uri: config.host.callback_url,
          code: code,
          client_secret: config.kakao.secret_key,
        }),
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      return result.data;
    } catch (err) {
      throw err;
    }
  }

  async kakaoRenewToken(refresh_token) {
    try {
      let api_url = "https://kauth.kakao.com/oauth/token";
      const result = await axios(api_url, {
        method: "post",
        data: qs.stringify({
          grant_type: "refresh_token",
          client_id: config.kakao.rest_key,
          refresh_token: refresh_token,
          client_secret: config.kakao.secret_key,
        }),
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      return result.data;
    } catch (err) {
      throw err;
    }
  }

  async kakaoUserinfo(ACCESS_TOKEN) {
    try {
      const api_url = "https://kapi.kakao.com/v2/user/me";
      const result = await axios(api_url, {
        method: "post",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      return result.data;
    } catch (err) {
      throw err;
    }
  }
}

export class Otp {
  constructor() {}

  otpnum() {
    let otp = "";

    for (var i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  async sendEmailOtp(option) {
    try {
      let otp = this.otpnum();
      option["html"] = `<p> ${otp} </p>`;
      transport.sendMail(option);

      let hash_otp = await fbcrypt.createHashText(otp);
      let expires_otp = date.SecondAdd(180);

      await redis_db.redisSet(`otp-${option.to}`, 3600, () => {
        return { otp: hash_otp, expires_in: expires_otp };
      });
      return {
        status: 200,
        message: `${option.to}로 인증번호가 발송되었습니다`,
      };
    } catch (err) {
      throw err;
    }
  }

  async verifyOtp(email, otpnum) {
    try {
      const otp_info = await redis_db.redisGet(`otp-${email}`);
      const { otp, expires_in } = otp_info.data;

      const current = date.CurrentDate().getTime();
      if (expires_in <= current) throw new Error("유효기간이 만료되었습니다");
      await fbcrypt.compareHashes(otpnum, otp);

      await redis_db.redisDelete(`otp-${email}`);
      return;
    } catch (err) {
      throw err;
    }
  }
}

export class AuthValidate {
  constructor() {}

  async emailOverlapCheck(email) {
    try {
      const user = await DbPlay("select * from users where email = $1", [
        email,
      ]);

      if (!user.length) return true;
      throw new Error("이미 존재하는 유저입니다");
    } catch (err) {
      throw new Error(err);
    }
  }

  async passwordValid(password) {
    let password_regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

    if (password_regex.test(password)) {
      return true;
    }
    throw new Error("비밀번호 규정에 어긋납니다");
  }
}

export class AuthCookie {
  constructor() {}

  setCookie(res, info) {
    let token_option = {
      httpOnly: true,
      secure: true,
      maxAge: 3600 * 1000,
      sameSite: "none",
    };

    for (let [key, value] of Object.entries(info)) {
      res.cookie(key, value, token_option);
    }
  }

  deleteCookie(res, info) {
    info.map((key) => res.clearCookie(key));
  }
}

export let oauth = new Oauth();
export let otp = new Otp();
export let auth_valid = new AuthValidate();
export let auth_cookie = new AuthCookie();
