import { DbPlay } from "../db/db.js";

class UserDb {
  constructor() {}

  // get
  async findUserByEmail(email) {
    try {
      let query = "select email from users where email = $1";
      let data = [email];
      const user = await DbPlay(query, data);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getUserByEmail(email) {
    try {
      let query = `
      select 
        us.id,
        us.email,
        us.name,
        us.nickname,
        us.description,
        us.profile_image_url,
      
        json_object_agg(case when fo.follower_id is null then 'null' else fo.follower_id end, true) as following
  
      from users as us 
      left join follows as fo on us.id = fo.following_id
      where us.email = $1
      group by us.id`;
      let data = [email];
      const user = await DbPlay(query, data);
      return user;
    } catch (err) {
      throw err;
    }
  }
  async getPasswordByEmail(email) {
    try {
      let query = `select password from users where email=$1`;
      const data = [email];
      const password = await DbPlay(query, data);
      return password;
    } catch (err) {
      throw err;
    }
  }
  async getUserDetailInfo(email) {
    try {
      let query = `
      select
        us.id,
        us.email,
        us.name,
        us.nickname,
        us.profile_image_url,
        us.description,
    
        count(distinct fo.following_id) as follower_count,
        count(distinct f.follower_id) as following_count,
    
        json_agg(distinct jsonb_build_object(
           'id', vd.id,
           'title', vd.title,
           'video_url' , vd.video_url
        )) as my_video
    
      from users as us 
      left join follows as f on us.id = f.following_id
      left join follows as fo on us.id = fo.follower_id
      left join videos as vd on us.id = vd.writer_id 
      where us.email = $1
      group by us.id`;
      const data = [email];
      return DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }

  // post
  async creatUser(info) {
    try {
      const { id, email, password, company } = info;
      const query =
        "insert into users values($1, $2, default, default, $3, default, default, default, $4, default, default, default)";
      const data = [id, email, password, company];
      return await DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }
  // put
  async modifyUser(email, info) {
    let count = 0;
    let floor = ["name", "nickname", "description"];
    let mo = info
      .map((val, idx) => {
        if (val) {
          count += 1;
          return `${floor[idx]}=$${count}`;
        }
      })
      .filter((val) => val);
    try {
      const query = `update users set ${mo
        .join(",")
        .toString()} where email=$${(mo.length + 1).toString()}`;
      const data = info.filter((val) => val);
      data.push(email);
      return await DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }
  // delete
  async deleteUser(id) {
    try {
      const query = "delete users where id = $1";
      const data = [id];
      return await DbPlay(query, data);
    } catch (err) {
      throw err;
    }
  }
}

export let user_db = new UserDb();
