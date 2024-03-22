import { DbPlay } from "../db/db.js";

class CoversongDb {
  constructor() {}

  async getCoversongById(id) {
    try {
      let query = `select id from coversongs where id = $1`;
      const data = [id];
      return await DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }

  async getVideoByCoversongId(id) {}

  async createCoversong(info) {
    try {
      let { id, title, artists, thumbnail_url } = info;
      let query = `insert into coversongs values($1,$2,$3,$4)`;
      let data = [id, title, artists, thumbnail_url];
      return await DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }
}

export let coversong_db = new CoversongDb();
