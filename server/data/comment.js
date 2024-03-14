import { DbPlay } from "../db/db.js";

class CommentDb {
  constructor() {}

  // get
  async getComments() {
    try {
      const query = "select * from comments";
      const data = [];
      return DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }

  // post
  async createComment(info) {
    try {
      const { id, body, video_id, commenter_id } = info;
      const query = `insert into comments values($1, $2, $3,$4, default, default)`;
      const data = [id, body, video_id, commenter_id];
      return DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }

  // put
  async modifyComment(info) {
    const { id, body } = info;
    try {
      const query = "update comments set body = $1 where id=$2";
      const data = [body, id];
      return await DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }

  // delete
  async deleteComment(id) {
    try {
      const query = "delete from comments where id = $1";
      const data = [id];
      return await DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }
}

export let comment_db = new CommentDb();
