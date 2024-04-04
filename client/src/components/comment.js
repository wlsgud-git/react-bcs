import react, { useEffect, useRef, useState } from "react";

export function BcsComments({ data, index, user }) {
  const [commentHandle, SetcommentHandle] = useState(false);

  async function commentModify() {}

  async function commentDelete() {}

  useEffect(() => {}, []);
  return (
    <li className="c_info_box" key={index}>
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
        <button
          className="c_other_btn"
          onClick={() => SetcommentHandle(true)}
          onBlur={() => SetcommentHandle(false)}
        >
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>

        <div
          className="c_content_control"
          style={{ display: commentHandle ? "block" : "none" }}
        >
          <button className="c_modify" onMouseDown={() => commentModify()}>
            <i className="fa-solid fa-pencil"></i> 수정
          </button>
          <button className="c_delete" onMouseDown={() => commentDelete()}>
            <i className="fa-solid fa-trash-can"></i> 삭제
          </button>
        </div>
      </div>
    </li>
  );
}
