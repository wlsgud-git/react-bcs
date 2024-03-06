import { Bcrypt } from "../middleware/secure.js";
import { DateControl } from "../middleware/time.js";
import { Makecomment, AmendComment, DeleteCom } from "../data/comment.js";

export async function GetComments(req, res) {}

export async function CreateComment(req, res) {
  try {
    let { body, video_id, user_id } = req.body;

    // console.log(body, video_id, user_id);

    const b = new Bcrypt();
    const d = new DateControl();
    let id = await b.createHashText(
      `comment-${user_id}-${video_id}-${d.CurrentDateString()}`
    );
    let info = {
      id: id.hash_text,
      body,
      video_id,
      commenter_id: user_id,
    };
    await Makecomment(info);
    return res.status(200).json({ message: "create comment!" });
  } catch (err) {
    return res.status(400).json({ err: err });
  }
}

export async function ModifyComment(req, res) {
  try {
    let id = req.param("id");
    const { body } = req.body;
    let info = {
      id,
      body,
    };
    await AmendComment(info);
    return res.status(201).json({ message: "수정완료" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: "문제" });
  }
}

export async function DeleteComment(req, res) {
  console.log("여 옴")
  try {
    let id = req.param("id");
    await DeleteCom(id)
    return res.status(200).json({message: '삭제완료'})
  } catch (err) {
    return res.status(400).json({ err: "err" });
  }
}
