import { DbPlay } from "../db/db.js";

class VideoDb {
  constructor() {}

  // get
  async getVideos() {
    try {
      const query = `
      select 
          vd.id,
          vd.title,
          vd.video_url ,
          vd.views,
          vd.likes,
          vd.dislikes,
          vd.create_at,
          vd.release,
    
          json_agg(distinct jsonb_build_object(
             'id', us.id,
             'email', us.email,
             'nickname', us.nickname,
             'profile_image_url', us.profile_image_url
          )) as oner,
    
          json_agg(distinct jsonb_build_object(
            'id', cs.id,
            'title', cs.title,
            'thumbnail_url', cs.thumbnail_url
          )) as coversong_info,
        
          case when count(distinct co.id) > 0 then 
          json_agg(distinct jsonb_build_object(
            'id', co.id,
            'user_id', u.id,
            'nickname', u.nickname,
            'profile_image_url', u.profile_image_url,
            'body', co.body
          )) else '[]' end as comments
    
      from videos as vd
      left join users as us on us.id = vd.writer_id
      left join coversongs as cs on cs.id = vd.coversong_id
      left join comments as co on co.video_id = vd.id
      left join users as u on co.commenter_id = u.id
      where vd.release = true
      group by vd.id`;
      const data = [];
      return await DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }
  // post
  async createVideo(info) {
    try {
      let { id, writer_id, coversong_id, title, video_url, release } = info;
      const query =
        "insert into videos values($1, $2, $3, $4, $5, default, default, default, $6, default, default)";
      const data = [id, writer_id, coversong_id, title, video_url, release];
      return DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }
  // put
  async modifyVideo(info) {
    try {
      const query = "";
      const data = [];
      return await DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }
  // delete
  async deleteVideo(id) {
    try {
      const query = "";
      const data = [];
      return DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }
}

export let video_db = new VideoDb();
