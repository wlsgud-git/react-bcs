import qs from "qs";
import axios from "axios";
import { body, validationResult } from "express-validator";

import { config } from "../config.js";
import { oauth, otp, auth_valid } from "../utils/user.js";
import { fbcrypt, fjwt } from "../utils/secure.js";
import { DbPlay } from "../db/db.js";

export const signupValidation = () => {
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
          let result = await auth_valid.emailOverlapCheck(value);
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
          let result = auth_valid.passwordValid(value);
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

    return res
      .status(400)
      .json({ message: `${errors.errors[0].msg}-${errors.errors[0].path}` });
  };
};

function getToken(req) {
  let access_token;
  let company;

  let authHeader = req.headers.authorization;

  if (authHeader && authHeader.split(" ")[0] == "Bearer") {
    access_token = authHeader.split(" ")[1];
    company = req.headers["bcs-com"];
  }

  if (!access_token) {
    access_token = req.cookies["b_id"];
    company = req.cookies["bcs-com"];
  }

  if (!access_token || access_token == "null") {
    let err = new Error("access_token undefined");
    err.status = 400;
    throw err;
  }

  return { access_token, company };
}

// auth service
export async function IsAuth(req, res, next) {
  try {
    let { access_token, company } = getToken(req);
    let email;

    if (company == "bcs") {
      let decoded = await fjwt.verifyAccesstoken(access_token);
      email = decoded.email;
    } else if (company == "naver") {
      const result = await oauth.naverUserinfo(access_token);
      email = result.response.email;
    } else if (company == "kakao") {
      const result = await oauth.kakaoUserinfo(access_token);
      email = result.kakao_account.email;
    }
    req.email = email;
    next();
  } catch (err) {
    console.log({ status: err.status, name: err.name, message: err.message });
    next(err);
  }
}

export async function getCsrftoken(req, res, next) {
  try {
    let csrftoken = await fbcrypt.createHashText(config.csrf.csrf_text);
    res.cookie("csrf-token", csrftoken);
    return res.status(200).json({ csrftoken });
  } catch (err) {
    next(err);
  }
}

export async function csrfVerify(req, res, next) {
  if (req.method === "GET" || req.method === "OPTIONS" || req.method === "HEAD")
    return next();

  let token = req.get("csrf-token");

  await fbcrypt
    .compareHashes(config.csrf.csrf_text, token)
    .then(() => {
      next();
    })
    .catch((err) => {
      return res.status(400).json({ message: "csrftoken이 올바르지 않습니다" });
    });
}

// otp
export async function sendOtpWithEmail(req, res, next) {
  try {
    const body = req.body;
    const email = body.email;

    let option = {
      from: config.nodemailer.email,
      to: email,
      subject: "BCS이메일 인증번호입니다",
      text: "",
    };
    const result = await otp.sendEmailOtp(option);
    return res.status(200).json({ message: result.message });
  } catch (err) {
    next(err);
  }
}

export async function emailOtpVerify(req, res, next) {
  try {
    const body = req.body;
    let email = body.email;
    let otpnum = body.otpnum;

    await otp.verifyOtp(email, otpnum);

    next();
  } catch (err) {
    next(err);
  }
}
