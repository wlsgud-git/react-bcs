import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { config } from "../config.js";

class Bcrypt {
  constructor() {}

  async createHashText(text) {
    try {
      const hash_text = await bcrypt.hash(text, config.bcrypt.salt);
      return hash_text;
    } catch (err) {
      throw err;
    }
  }

  async compareHashes(text, hash_pw) {
    try {
      const result = await bcrypt.compare(text, hash_pw);

      if (!result) throw new Error("두 텍스트가 같지 않습니다");
      return true;
    } catch (err) {
      throw err;
    }
  }
}

class Jwt {
  constructor() {}

  async createAccesstoken(email) {
    try {
      const access_token = await jwt.sign(
        { email: email },
        config.jwt.a_secret_key,
        { expiresIn: "10s" }
      );
      return access_token;
    } catch (err) {
      throw err;
    }
  }

  async verifyAccesstoken(access_token) {
    try {
      const decoded = await jwt.verify(access_token, config.jwt.a_secret_key);
      return decoded;
    } catch (err) {
      throw err;
    }
  }

  async createRefreshtoken(email) {
    try {
      const refresh_token = await jwt.sign(
        { email: email },
        config.jwt.r_secret_key,
        { expiresIn: "1m" }
      );
      return refresh_token;
    } catch (err) {
      throw err;
    }
  }

  async verfiyRefreshtoken(refresh_token) {
    try {
      const decoded = await jwt.verify(refresh_token, config.jwt.r_secret_key);
      return decoded;
    } catch (err) {
      throw err;
    }
  }

  async tokenControl(info) {}
}

export let fbcrypt = new Bcrypt();
export let fjwt = new Jwt();
