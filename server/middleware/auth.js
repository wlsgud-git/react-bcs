import qs from "qs";
import axios from "axios";
import { body, validationResult } from "express-validator";

import { Bcrypt, Jwt, Otp } from "./secure.js";
import { GetUserByEmail } from "../data/user.js";
import { config } from "../config.js";
import { RedisDB, DbPlay } from "../db/db.js";
import { DateControl } from "./time.js";

// use auth
export class Oauth {
  constructor() {}

  // 네이버
  async getNaverToken(code, state) {
    try {
      let api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${config.naver.client_id}&client_secret=${config.naver.client_secret}&code=${code}&state=${state}`;
      const result = await axios(api_url, { method: "get" });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async NaverRenewToken(refresh_token) {
    try {
      let api_url = `https://nid.naver.com/oauth2.0/token?grant_type=refresh_token&client_id=${config.naver.client_id}&client_secret=${config.naver.client_secret}&refresh_token=${refresh_token}`;
      const result = await axios(api_url, { method: "get" });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getNaverUserInfo(access_token) {
    try {
      let api_url = "https://openapi.naver.com/v1/nid/me";
      const result = await axios(api_url, {
        method: "get",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  // 카카오
  async getKakaoToken(code) {
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
      return result;
    } catch (err) {
      throw err;
    }
  }

  async KakaoRenewToken(refresh_token) {
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
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getKakaoUserInfo(ACCESS_TOKEN) {
    try {
      const api_url = "https://kapi.kakao.com/v2/user/me";
      const result = await axios(api_url, {
        method: "post",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export async function EmailOverlapCheck(email) {
  try {
    const user = await DbPlay("select * from users where email = $1", [email]);

    if (user.data.length == 0) return true;
    return false;
  } catch (err) {
    throw new Error(err);
  }
}

export function PasswordValid(password) {
  let password_regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

  if (password_regex.test(password)) {
    return true;
  }
  return false;
}

export const SignupValidation = () => {
  return async (req, res, next) => {
    const validations = [
      body("email")
        .trim()
        .toLowerCase()
        .isEmail()
        .withMessage("이메일 형식이 올바르지 않습니다")
        .notEmpty()
        .withMessage("필수항목 입니다")
        .custom(async (value) => {
          let result = await EmailOverlapCheck(value);
          if (!result) throw new Error("영차");
          return true;
        })
        .withMessage("이미 가입된 이메일입니다"),
      body("password")
        .toLowerCase()
        .notEmpty()
        .withMessage("필수항목 입니다")
        .isLength({ min: 6, max: 20 })
        .withMessage("비밀번호는 최소 6자 최대 20자 이내로 설정하여야 합니다")
        .custom((value) => {
          let result = PasswordValid(value);
          return result;
        })
        .withMessage(
          "비밀번호는 영문, 숫자, 특수문자를 최소 1개 이상 포함하여야 합니다"
        ),
      body("password_check")
        .toLowerCase()
        .notEmpty()
        .withMessage("필수항목 입니다")
        .custom((value, { req }) => {
          return value === req.body.password;
        })
        .withMessage("비밀번호 확인값이 비밀번호 값과 다릅니다"),
    ];
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({ errors: errors.array() });
  };
};

function TokenCheck(req) {
  let token;
  let company;

  let authHeader = req.headers.authorization;

  if (authHeader && authHeader.split(" ")[0] == "Bearer") {
    token = authHeader.split(" ")[1];
    company = req.headers["bcs-com"];
  }

  if (!token) {
    token = req.cookies["b_id"];
    company = req.cookies["bcs-com"];
  }

  if (!token || token == "null") {
    let err = new Error("token undefined");
    err.status = 400;
    throw err;
  }

  return [token, company];
}

// auth service
export async function IsAuth(req, res, next) {
  try {
    let auth = new Oauth();
    let [access_token, company] = await TokenCheck(req);

    let email;
    if (company == "bcs") {
      const jj = new Jwt();
      let { status, decoded } = await jj.verifyAccesstoken(access_token);
      email = decoded.email;
    } else if (company == "naver") {
      const result = await auth.getNaverUserInfo(access_token);
      email = result.data.response.email;
    } else if (company == "kakao") {
      const result = await auth.getKakaoUserInfo(access_token);
      email = result.data.kakao_account.email;
    }
    req.email = email;
    next();
  } catch (err) {
    // return res.status(400).json({ err: err });
    next(err);
  }
}

export function CookieSetToken(res, token_info) {
  let token_option = {
    httpOnly: true,
    secure: true,
    maxAge: 3600 * 1000,
    sameSite: "none",
  };

  res.cookie(token_info["key"], token_info["token"]);
}

export async function GetCsrfToken(req, res, next) {
  try {
    let b = new Bcrypt();

    let csrf_info = await b.createHashText(config.csrf.csrf_text);
    let csrftoken = await csrf_info.hash_text;
    res.cookie("csrf-token", csrftoken);
    return res.status(200).json({ csrftoken });
  } catch (err) {
    next(rr);
  }
}

export async function CsrfVerify(req, res, next) {
  if (req.method === "GET" || req.method === "OPTIONS" || req.method === "HEAD")
    return next();

  let token = req.get("csrf-token");
  let b = new Bcrypt();

  await b
    .compareHashes(config.csrf.csrf_text, token)
    .then(() => {
      next();
    })
    .catch((err) => {
      return res.status(400).json({ err: "csrf err" });
    });
}

// otp
export async function SendmailOtpWithEmail(req, res, next) {
  try {
    const body = req.body;
    const email = body.email;

    let option = {
      from: config.nodemailer.email,
      to: email,
      subject: "BCS이메일 인증번호입니다",
      text: "",
    };
    let o = new Otp();
    const result = await o.SendEmailOtp(option);
    console.log(result);
    return res.status(200).json({ message: result.message });
  } catch (err) {
    next(err);
  }
}

export async function EmailOtpVerify(req, res, next) {
  try {
    const body = req.body;
    let email = body.email;
    let otpnum = body.otpnum;

    let o = new Otp();
    await o.VerifyOtp(email, otpnum);

    next();
  } catch (err) {
    next(err);
  }
}

export async function EmailOtpRenew(req, res) {
  try {
  } catch (err) {}
}
