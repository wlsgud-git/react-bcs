import pg from "pg";
import { config } from "../config.js";

// postgre
const Pgclient = new pg.Client({
  user: config.db.bcs_user,
  host: config.db.bcs_host,
  database: config.db.bcs_database,
  password: config.db.bcs_password,
  port: 5432,
});

Pgclient.connect();

export async function DbPlay(query, info) {
  try {
    let data = await Pgclient.query(query, info);
    return { status: 200, data: data.rows };
  } catch (err) {
    throw err;
  }
}

import redis from "redis";
const RedisClient = redis.createClient({ legacyMode: true });

RedisClient.on("connect", () => {
  console.log("connect redis");
});

RedisClient.on("error", (err) => {
  console.log("Redis Client Error", "it me");
});

await RedisClient.connect();

export class RedisDB {
  constructor() {}

  async RedisGet(key) {
    return new Promise((resolve, reject) => {
      RedisClient.get(key, async (err, data) => {
        if (err) return reject({ status: 400, err: err });
        if (data) return resolve({ status: 200, data: JSON.parse(data) });
        else {
          return resolve({
            status: 404,
            message: "가지고 있는 정보가 없습니다",
          });
        }
      });
    });
  }

  async RedisSet(key, extime, cd) {
    try {
      let value = await cd();
      await RedisClient.set(key, JSON.stringify(value), "ex", extime);
      return { status: 201, message: "레디스 저장완료" };
    } catch (err) {
      throw err;
    }
  }

  async RedisUpdate(key, extime, cd) {
    try {
      let data = await RedisClient.exists(key);
      const value = await cd();
      if (data) {
        await RedisClient.set(key, JSON.stringify(value), "ex", extime);
        return { status: 200, message: "레디스 업데이트 완료" };
      }
    } catch (err) {
      throw err;
    }
  }

  async RedisDelete(key) {
    try {
      const data = await RedisClient.exists(key);
      if (data) {
        RedisClient.del(key);
        return { status: 200, message: "레디스 삭제완료" };
      }
    } catch (err) {
      throw err;
    }
  }
}
