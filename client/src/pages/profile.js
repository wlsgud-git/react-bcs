import react, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "../css/profile.css";
import { Navbar } from "../components/navbar.js";
import { SideMenu } from "../components/sidemenu.js";
import Bird from "../image/bird.jpg";

import { authService } from "../index.js";

export function Profile({ modalControl }) {
  let { email } = useParams();
  let [user_info, Setuser_info] = useState(undefined);

  useEffect(() => {
    authService
      .detailUser(email)
      .then((data) => {
        Setuser_info(data.user_info);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Navbar />
      <SideMenu />

      <div className="pages">
        {/* 유저 정보 */}
        <div className="profile_user_container">
          <div className="profile_user_thumbnail_container">
            <span className="profile_user_thumb_circle">
              <img src={user_info ? user_info.profile_image_url : ""} />
            </span>
          </div>
          <div className="profile_user_info_container">
            <div className="profile_user_info_one">
              <span className="profile_user_nickname">
                {user_info ? user_info.name : ""}
              </span>
              <button
                className="profile_edit_btn"
                onClick={() => modalControl("show", "profile_edit")}
              >
                <i className="fa-solid fa-pencil"></i>프로필 수정
              </button>
            </div>
            <div className="profile_user_info_two">
              <span>{user_info ? user_info.nickname : ""}</span>
            </div>
            <div className="profile_user_info_three">
              <div>
                <span className="">게시물</span>
                <span className="">
                  {user_info ? user_info.my_video.length : ""}
                </span>
              </div>
              <div>
                <span className="">팔로우</span>
                <span className="">
                  {user_info ? user_info.follower_count : ""}
                </span>
              </div>
              <div>
                <span className="">팔로잉</span>
                <span className="">
                  {user_info ? user_info.following_count : ""}
                </span>
              </div>
            </div>
            <div className="profile_user_info_four">
              <span className="profile_user_description">
                {user_info && user_info.description != ""
                  ? user_info.description
                  : "아직 자기소개가 없습니다"}
              </span>
            </div>
          </div>
        </div>

        {/* 유저 컨텐츠 */}
        <div className="user_content_container">
          <ul className="user_content_type">
            <li className="content_my_video">내 영상</li>
            <li className="content_like_video">좋아요</li>
            <li className="content_playlist_video">플레이리스트</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
