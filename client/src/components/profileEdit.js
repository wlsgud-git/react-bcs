import "../css/profileEdit.css";

import Bird from "../image/bird.jpg";

export function ProfileEdit({ IsmodalOpen, aboutModal, modalControl }) {
  return (
    <div
      className="profile_edit_modal"
      style={{
        display: IsmodalOpen && aboutModal == "profile_edit" ? "flex" : "none",
      }}
    >
      <div className="pem_top_section">
        <div className="pem_text_section">
          <span className="pem_text">프로필 편집</span>
        </div>

        <span className="pem_modal_close" onClick={() => modalControl("hide", "profile_edit")}>X</span>
      </div>
      {/* 유저 정보수정 부분 */}
      <div className="pem_profile_modify_container">
        <form method="post" className="pem_form">
          {/* 썸네일 부분 */}
          <div className="pem_thumbnail_container">
            <span className="pem_thumbnail_circle">
              <img src={Bird}></img>
            </span>
          </div>
          {/* 이름 */}
          <div className="pem_editbox">
            <label htmlFor="pem_name" className="pem_edit_label">
              이름
            </label>
            <input type="text" />
          </div>
          {/* 닉네임 */}
          <div className="pem_editbox">
            <label htmlFor="pem_nickname" className="pem_edit_label">
              닉네임
            </label>
            <input type="text" />
          </div>
          {/* 한줄소개 */}
          <div className="pem_editbox">
            <label htmlFor="pem_description" className="pem_edit_label">
              자기소개
            </label>
            <input type="text"></input>
          </div>
        </form>
      </div>

      <div className="pem_bottom">
        <button className="pem_modify_btn">수정하기</button>
      </div>
    </div>
  );
}
