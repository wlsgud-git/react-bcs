import react, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "../css/video.css";
import { useAuth } from "../context/authcontext.js";

// export function LsizeBcsComments({data}){
//   return (

//   )
// }

export function LsizeBcsVideo({ data, commentService }) {
  let { user, Myfollowing } = useAuth();
  let dp = JSON.parse(data);

  const video = useRef("");
  const playBtn = useRef("");
  const volumnBtn = useRef("");

  const commentInput = useRef(null);

  const [commentDisplay, SetcommentDisplay] = useState(false);
  const [commentText, SetcommentText] = useState("");
  const [commentList, SetcommentList] = useState([]);
  const [currentTime, SetcurrentTime] = useState(0);
  const [duration, Setduration] = useState(0);

  function PlayorPause() {
    if (video.current.paused) {
      video.current.play();
      playBtn.current.children[0].classList.replace("fa-play", "fa-pause");
      setInterval(() => {
        SetcurrentTime(video.current.currentTime);
      }, 1000);
    } else {
      video.current.pause();
      playBtn.current.children[0].classList.replace("fa-pause", "fa-play");
    }
  }

  function NoiseorSilence() {
    if (!video.current.volume) {
      video.current.volume = 1;
      volumnBtn.current.children[0].classList.replace(
        "fa-volume-xmark",
        "fa-volume-high"
      );
    } else {
      video.current.volume = 0;
      volumnBtn.current.children[0].classList.replace(
        "fa-volume-high",
        "fa-volume-xmark"
      );
    }
  }

  function formatTime(currenttime) {
    let currentTime = currenttime;

    // currents
    let currentMinute = Math.floor(currentTime / 60);
    let currentSecond = Math.floor(currentTime % 60);

    currentMinute =
      currentMinute < 10
        ? `0${currentMinute.toString()}`
        : `${currentMinute.toString()}`;
    currentSecond =
      currentSecond < 10
        ? `0${currentSecond.toString()}`
        : `${currentSecond.toString()}`;

    return `${currentMinute}:${currentSecond}`;
  }

  function HandleProgressbar(e) {
    const pos = e.target.value;
    SetcurrentTime(pos);
    video.current.currentTime = pos;
  }

  async function CreateComment(e) {
    e.preventDefault();

    await commentService
      .createComment(commentText, dp.id, user.id)
      .then((data) => {
        alert("댓글이 작성되었습니다.");
        let info = {
          id: user.id,
          nickname: user.nickname,
          body: commentText,
          profile_image_url: user.profile_image_url,
        };
        let newArr = [info, ...commentList];
        SetcommentText("");
        SetcommentList(newArr);
      })
      .catch((err) => console.log(err));
    // await commentService
    //   .modifyComment(
    //     "$2b$09$R4Q52dE5iRn.5ZIT0RLmyekZocnkvW.ZL.82rjkJ1UeDCCn3aoVGG",
    //     commentText
    //   )
    //   .then((data) => {
    //     let newArr = [...commentList];

    //     newArr[0].body = commentText;
    //     SetcommentList(newArr);
    //   })
    //   .catch((err) => console.log(err));
  }

  async function DeleteComment(index, info) {
    await commentService
      .DeleteComment(info.id)
      .then((data) => {
        alert("댓글이 삭제되었습니다");
        let newArr = [...commentList];
        newArr.splice(index, 1);
        SetcommentList(newArr);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    SetcommentList(dp.comments);
  }, []);

  return (
    <div className="bcs_lsize_video_container">
      {/* <!-- 비디오 내부 기능 --> */}
      <div className="bcs_lsize_video_box">
        {/* <!-- 비디오 영상과 썸네일--> */}
        <div className="bcs_lsize_video">
          <Link to={`/about/${dp.id}`} className="bcs_lsize_video_detail_go">
            <video
              src={dp.video_url}
              className="bcs_lsize_video_src"
              ref={video}
              onLoadedMetadata={() => Setduration(video.current.duration)}
            ></video>
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
              onClick={() => SetcommentDisplay(true)}
            >
              <i className="fa-solid fa-comment"></i>
            </button>
            <span className="video_comments_count">3.2</span>
          </div>
        </div>

        {/* <!-- 비디오 플레이 및 불륨 부분  --> */}
        <div className="bcs_lsize_func_control">
          <span className="control_video_play_btn">
            <button
              className="control_play_btn"
              ref={playBtn}
              onClick={() => {
                PlayorPause(video.current, playBtn.current);
              }}
            >
              <i className="fa-solid fa-play"></i>
            </button>
          </span>

          <span className="control_video_volumn_btn">
            <button
              className="control_volumn_btn"
              ref={volumnBtn}
              onClick={NoiseorSilence}
            >
              <i className="fa-solid fa-volume-high"></i>
            </button>
          </span>
        </div>

        {/* <!-- 비디오 진행 부분 --> */}
        <div className="bcs_lsize_func_bottom">
          <span className="video_current_time">{formatTime(currentTime)}</span>

          <div className="progressbar_section">
            <input
              className="progressbar_range"
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={HandleProgressbar}
            ></input>
          </div>

          <span className="video_full_time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* <!-- 댓글 부분 --> */}
      <div
        className="bcs_song_comment_container"
        style={{ display: commentDisplay ? "flex" : "none" }}
      >
        <div className="comments_info">
          <div className="comments_info_text">
            <span className="comments_text">댓글수</span>
            <span className="comments_count">{commentList.length}</span>
          </div>

          <div className="comments_close">
            <button
              className="comments_close_btn"
              onClick={() => SetcommentDisplay(false)}
            >
              X
            </button>
          </div>
        </div>

        <ul className="comments_list">
          {commentList.map((data, idx) => (
            <li className="c_info_box" key={idx}>
              {/* <!-- 유저 프로필 사진 부분 --> */}
              <div className="c_user_profile">
                <span className="c_user_profile_box">
                  <img src={data.profile_image_url} />
                </span>
              </div>
              {/* <!-- 댓글 내용 부분 --> */}
              <div className="c_content_info">
                <div className="c_userOrcreate">
                  <span className="c_usernick"> {data.nickname} </span>
                  <span className="c_createat">3년전</span>
                </div>

                <div className="c_content_box">
                  <span className="c_content"> {data.body} </span>
                </div>
              </div>

              <div
                className="c_other"
                style={{
                  display: user && data.user_id == user.id ? "block" : "none",
                }}
              >
                <button className="c_other_btn">
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>

                <div className="c_content_control">
                  <button
                    className="c_modify"
                    onClick={() => {
                      SetcommentText(commentList[idx].body);
                      commentInput.current.focus();
                    }}
                  >
                    {" "}
                    <i className="fa-solid fa-pencil"></i> 수정
                  </button>
                  <button
                    className="c_delete"
                    onClick={() => DeleteComment(idx, commentList[idx])}
                  >
                    {" "}
                    <i className="fa-solid fa-trash-can"></i> 삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="comment_write">
          <form method="post" className="comment_form" onSubmit={CreateComment}>
            <div className="writer_thumbnail">
              <span className="writer_thumb_box">
                <img src={user ? user.profile_image_url : ""} />
              </span>
            </div>

            <div className="comment_write_info">
              <div className="comment_write_input">
                <input
                  value={commentText}
                  onChange={(e) => SetcommentText(e.target.value)}
                  type="text"
                  ref={commentInput}
                  spellCheck="false"
                  placeholder="댓글 작성"
                  className="comment_input"
                />
              </div>

              <div className="comment_control_sec">
                <button
                  className="comment_clear"
                  onClick={() => SetcommentText("")}
                >
                  취소
                </button>
                <button
                  className="comment_btn"
                  disabled={!commentText.length}
                  style={{
                    backgroundColor: !commentText.length ? "gray" : "blue",
                  }}
                >
                  댓글
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
