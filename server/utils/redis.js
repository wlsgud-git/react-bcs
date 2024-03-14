import redis from "redis";
const RedisClient = redis.createClient({ legacyMode: true });

RedisClient.on("connect", () => {
  console.log("connect redis");
});

RedisClient.on("error", (err) => {
  console.log("Redis Client Error", "it me");
});

await RedisClient.connect();

class RedisDb {
  constructor() {}

  async redisGet(key) {
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

  async redisSet(key, extime, cd) {
    try {
      let value = await cd();
      await RedisClient.set(key, JSON.stringify(value), "ex", extime);
      return { status: 201, message: "레디스 저장완료" };
    } catch (err) {
      throw err;
    }
  }

  async redisUpdate(key, extime, cd) {
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

  async redisDelete(key) {
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

export let redis_db = new RedisDb()
