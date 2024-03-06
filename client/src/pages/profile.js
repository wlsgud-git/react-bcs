import react from "react";
import { Link, useParams } from "react-router-dom";

import "../css/profile.css";
import { Navbar } from "../components/navbar.js";
import { SideMenu } from "../components/sidemenu.js";

import Bird from "../image/bird.jpg";

export function Profile() {
  return (
    <div>
      <Navbar />
      <SideMenu />

      <div className="pages">
        {/* 유저 정보 */}
        <div className="profile_user_container">
          <div className="profile_user_thumbnail_container">
            <span className="profile_user_thumb_circle">
              <img src={Bird} />
            </span>
          </div>
          <div className="profile_user_info_container">
            <div className="profile_user_info_one">
              <span className="profile_user_nickname">thisisbillgates</span>
              <button className="profile_edit_btn">
                <i className="fa-solid fa-pencil"></i>프로필 수정
              </button>
            </div>
            <div className="profile_user_info_two">
              <span>billgates</span>
            </div>
            <div className="profile_user_info_three">
              <div>
                <span className="">게시물</span>
                <span className="">3</span>
              </div>
              <div>
                <span className="">팔로우</span>
                <span className="">3</span>
              </div>
              <div>
                <span className="">팔로잉</span>
                <span className="">3</span>
              </div>
            </div>
            <div className="profile_user_info_four">
              <span className="profile_user_description">
                아직 자기소개가 없습니둥
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
