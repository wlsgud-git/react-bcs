import { comment_db } from "../data/comment.js";
import { fbcrypt, fjwt } from "../utils/secure.js";
import { date } from "../utils/date.js";

export async function getComments(req, res) {}

export async function createComment(req, res) {
  try {
    let { body, video_id, user_id } = req.body;

    let id = await fbcrypt.createHashText(
      `comment-${user_id}-${video_id}-${date.CurrentDateString()}`
    );
    let info = {
      id,
      body,
      video_id,
      commenter_id: user_id,
    };
    await comment_db.createComment(info);
    return res.status(200).json({ message: "댓글이 작성되었습니다" });
  } catch (err) {
    return res.status(400).json({ err: err });
  }
}

export async function modifyComment(req, res) {
  try {
    let id = req.params.id;
    const { body } = req.body;
    let info = {
      id,
      body,
    };
    await comment_db.modifyComment(info);
    return res.status(201).json({ message: "댓글이 수정되었습니다" });
  } catch (err) {
    return res.status(400).json({ err: "문자 수정을 다시 시도해주세요." });
  }
}

export async function deleteComment(req, res) {
  try {
    let id = req.params.id;
    await comment_db.deleteComment(id);
    return res.status(200).json({ message: "삭제완료" });
  } catch (err) {
    return res.status(400).json({ err: "err" });
  }
}
