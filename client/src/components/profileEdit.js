import { useRef, useState } from "react";
import "../css/profileEdit.css";
import { authService } from "../index.js";

import Bird from "../image/bird.jpg";

export function ProfileEdit({
  user,
  IsmodalOpen,
  aboutModal,
  modalControl,
  modifyUser,
}) {
  let profile_change_input = useRef(null);
  let timg = useRef(null);

  let [profileImageFile, SetprofileImageFile] = useState(null);

  let [user_infomation, Setuser_infomation] = useState({
    profile_image_url: user ? user.profile_image_url : "",
    name: user ? user.name : "",
    nickname: user ? user.nickname : "",
    description: user ? user.description : "",
  });

  const ModifyInfo = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile_image", profileImageFile);
    formData.append("name", user_infomation.name);
    formData.append("nickname", user_infomation.nickname);
    formData.append("description", user_infomation.description);

    await modifyUser(user.email, formData)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  function thumbnailPreview(e) {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onload = (event) => {
      timg.current.src = event.target.result;
    };
    reader.readAsDataURL(file);
    SetprofileImageFile(file);
  }

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

        <span
          className="pem_modal_close"
          onClick={() => {
            modalControl("hide", "profile_edit");
            Setuser_infomation((c) => ({
              ...c,
              profile_image_url: user.profile_image_url,
              name: "",
              nickname: "",
              description: "",
            }));
            SetprofileImageFile(null);
            timg.current.src = user ? user.profile_image_url : "";
            profile_change_input.current.value = "";
          }}
        >
          X
        </span>
      </div>
      {/* 유저 정보수정 부분 */}
      <div className="pem_profile_modify_container">
        <form method="post" className="pem_form" onSubmit={ModifyInfo}>
          {/* 썸네일 부분 */}
          <div className="pem_thumbnail_container">
            <input
              onChange={thumbnailPreview}
              accept="image/png, image/gif, image/jpeg"
              type="file"
              ref={profile_change_input}
              style={{ display: "none" }}
            ></input>
            <div className="pem_thumbnail_box">
              <span
                className="profile_change_button"
                onClick={() => profile_change_input.current.click()}
              >
                <i
                  className="fa-solid fa-camera"
                  style={{ fontSize: 18, color: "#fff" }}
                ></i>
              </span>
              <span className="pem_thumbnail_circle">
                <img
                  ref={timg}
                  src={user && user.profile_image_url}
                  className="pem_thumbnail_img"
                ></img>
              </span>
            </div>
          </div>
          {/* 이름 */}
          <div className="pem_editbox">
            <label htmlFor="pem_name" className="pem_edit_label">
              이름
            </label>
            <input
              type="text"
              placeholder={user ? user.name : "undefined"}
              value={user_infomation.name}
              onChange={(e) =>
                Setuser_infomation(() => ({
                  ...user_infomation,
                  name: e.target.value,
                }))
              }
            />
          </div>
          {/* 닉네임 */}
          <div className="pem_editbox">
            <label htmlFor="pem_nickname" className="pem_edit_label">
              닉네임
            </label>
            <input
              type="text"
              placeholder={user ? user.nickname : "undefined"}
              value={user_infomation.nickname}
              onChange={(e) =>
                Setuser_infomation(() => ({
                  ...user_infomation,
                  nickname: e.target.value,
                }))
              }
            />
          </div>
          {/* 한줄소개 */}
          <div className="pem_editbox">
            <label htmlFor="pem_description" className="pem_edit_label">
              자기소개
            </label>
            <input
              type="text"
              placeholder={user ? user.description : ""}
              value={user_infomation.description}
              onChange={(e) =>
                Setuser_infomation(() => ({
                  ...user_infomation,
                  description: e.target.value,
                }))
              }
            />
          </div>
        </form>
      </div>

      <div className="pem_bottom">
        <button className="pem_modify_btn" type="submit" onClick={ModifyInfo}>
          수정하기
        </button>
      </div>
    </div>
  );
}
