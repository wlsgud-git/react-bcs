import react, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "../css/video.css";
import { useAuth } from "../context/authcontext.js";
import { BcsComments } from "./comment.js";
// import { util_com } from "../utils/comment.js";

export function LsizeBcsVideo({ data, commentService }) {
  let { user, Myfollowing } = useAuth();
  let dp = JSON.parse(data);

  const comInput = useRef();

  // 댓글 부분 관련
  let [commentControl, SetcommentControl] = useState({
    value: "",
    display: false,
    list: [],
  });

  async function commentCreate(e) {
    e.preventDefault();

    await commentService
      .createComment(commentControl.value, dp.id, dp.oner[0].id)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    SetcommentControl((c) => ({ ...c, list: dp.comments }));
  }, []);

  return (
    <div className="bcs_lsize_video_container">
      {/* <!-- 비디오 내부 기능 --> */}
      <div className="bcs_lsize_video_box">
        {/* <!-- 비디오 영상과 썸네일--> */}
        <div className="bcs_lsize_video">
          <Link to={`/about/${dp.id}`} className="bcs_lsize_video_detail_go">
            <video src={dp.video_url} className="bcs_lsize_video_src"></video>
          </Link>
        </div>

        {/* <!-- 비디오 위부분 --> */}
        <div className="bcs_lsize_top">
          <div className="bcs_lsize_video_info_section">
            <div className="bcs_lsize_writer_thumbnail_section">
              <div className="bcs_lsize_wrtier_box">
                <Link
                  to={`/profile/${dp.oner[0].email}`}
                  className="bcs_lsize_writer_thumbnail_go"
                >
                  <img src={dp.oner[0].profile_image_url} />
                </Link>
              </div>
            </div>

            <div className="bcs_lsize_writer_info_section">
              <div className="bcs_lsize_writer_section">
                <span className="bcs_lsize_usernick">
                  <Link
                    to={`/profile/${dp.oner[0].email}`}
                    className="bcs_lsize_usernikcname"
                  >
                    {dp.oner[0].nickname}
                  </Link>
                </span>
                {/* here */}
                <div className="bcs_lsize_follow_btn">팔로우</div>
              </div>

              <div className="bcs_lsize_title_section"> {dp.title} </div>
            </div>
          </div>

          <div className="bcs_lsize_coversong_section">
            <div className="bcs_lsize_coversong_box">
              <Link
                to={""}
                className="bcs_lsize_coversong_go"
                title={dp.coversong_info[0].title}
              >
                <img src={dp.coversong_info[0].thumbnail_url} />
              </Link>
            </div>
          </div>
        </div>

        {/* <!-- 비디오 사이드 기능 --> */}
        <div className="bcs_lsize_sub_menu">
          <div className="video_like_box">
            <button className="video_like" title="좋아요">
              <i className="fa-solid fa-thumbs-up"></i>
            </button>
            <span className="video_likes_count">{dp.likes}</span>
          </div>
          <div className="video_dislike_box">
            <button className="video_dislike" title="싫어요">
              <i className="fa-solid fa-thumbs-down"></i>
            </button>
            <span className="video_dislikes_count">{dp.dislikes}</span>
          </div>
          <div className="video_comment_box">
            <button
              className="video_comment"
              title="댓글"
              onClick={() =>
                SetcommentControl((c) => ({ ...c, display: true }))
              }
            >
              <i className="fa-solid fa-comment"></i>
            </button>
            <span className="video_comments_count">
              {commentControl.list.length}
            </span>
          </div>
        </div>

        {/* <!-- 비디오 플레이 및 불륨 부분  --> */}
        <div className="bcs_lsize_func_control">
          <span className="control_video_play_btn">
            <button className="control_play_btn">
              <i className="fa-solid fa-play"></i>
            </button>
          </span>

          <span className="control_video_volumn_btn">
            <button className="control_volumn_btn">
              <i className="fa-solid fa-volume-high"></i>
            </button>
          </span>
        </div>

        {/* <!-- 비디오 진행 부분 --> */}
        <div className="bcs_lsize_func_bottom">
          <span className="video_current_time"></span>

          <div className="progressbar_section">
            <input className="progressbar_range" type="range" min={0}></input>
          </div>

          <span className="video_full_time"></span>
        </div>
      </div>

      {/* <!-- 댓글 부분 --> */}
      <div
        className="bcs_song_comment_container"
        style={{ display: commentControl.display ? "flex" : "none" }}
      >
        <div className="comments_info">
          <div className="comments_info_text">
            <span className="comments_text">댓글수</span>
            <span className="comments_count">{commentControl.list.length}</span>
          </div>

          <div className="comments_close">
            <button
              className="comments_close_btn"
              onClick={() =>
                SetcommentControl((c) => ({ ...c, display: false }))
              }
            >
              X
            </button>
          </div>
        </div>

        <ul className="comments_list">
          {commentControl.list.map((data, idx) => (
            <BcsComments data={data} index={idx} user={user} />
          ))}
        </ul>

        <div className="comment_write">
          <form method="post" className="comment_form" onSubmit={commentCreate}>
            <div className="writer_thumbnail">
              <span className="writer_thumb_box">
                <img src={user ? user.profile_image_url : ""} />
              </span>
            </div>

            <div className="comment_write_info">
              <div className="comment_write_input">
                <input
                  disabled={!user}
                  type="text"
                  value={commentControl.value}
                  ref={comInput}
                  onChange={(e) =>
                    SetcommentControl((c) => ({ ...c, value: e.target.value }))
                  }
                  spellCheck="false"
                  placeholder={user ? "댓글 작성" : "로그인 후 이용가능합니다"}
                  className="comment_input"
                />
              </div>

              <div className="comment_control_sec">
                <button
                  className="comment_clear"
                  onClick={() => {
                    SetcommentControl((c) => ({ ...c, value: "" }));
                    comInput.current.focus();
                  }}
                >
                  취소
                </button>
                <button className="comment_btn">댓글</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
