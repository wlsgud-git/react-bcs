import { DbPlay } from "../db/db.js";

export async function GetUserByEmail(email) {
  try {
    let query = `
    select 
      us.id,
	    us.email,
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

export async function GetPassWordByEmail(email) {
  try {
    let query = `select password from users where email=$1`;
    const data = [email];
    const password = await DbPlay(query, data);
    return password;
  } catch (err) {
    throw err;
  }
}

export async function CreatUser(info) {
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

export async function ModifyUser(info) {
  try {
    const query = "";
    const data = [];
    return await DbPlay(query, data);
  } catch (err) {
    throw err;
  }
}

export async function DeleteUser(id) {
  try {
    const query = "";
    const data = [];
    return await DbPlay(query, data);
  } catch (err) {
    throw err;
  }
}

export async function FollowModify(type, a, b) {
  try {
    let query = `${
      type == "add"
        ? "insert into follows values($1, $2, default)"
        : "delete from follows where follwer_id = $1 and follwing_id = $2"
    }`;
    const data = [a, b];
    return await DbPlay(query, data);
  } catch (err) {
    throw err;
  }
}
