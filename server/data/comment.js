import { DbPlay } from "../db/db.js";

// export async function GetComments(){
//     try{
//         const query = ''
//         const data = []
//         return await DbPlay(query, data)
//     }catch(err){
//         throw err
//     }
// }

export async function Makecomment(info) {
  try {
    const { id, body, video_id, commenter_id } = info;
    const query = `insert into comments values($1, $2, $3,$4, default, default)`;
    const data = [id, body, video_id, commenter_id];
    return await DbPlay(query, data);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function AmendComment(info) {
  const { id, body } = info;
  try {
    const query = "update comments set body = $1 where id=$2";
    const data = [body, id];
    return await DbPlay(query, data);
  } catch (err) {
    throw err;
  }
}

export async function DeleteCom(id) {
  try {
    const query = "delete from comments where id = $1";
    const data = [id];
    return await DbPlay(query, data);
  } catch (err) {
    throw err;
  }
}
