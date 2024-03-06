import { Link } from "react-router-dom";

import "../css/follows.css";

import Bird from "../image/bird.jpg";

export function Follows({ IsmodalOpen, aboutModal, modalControl }) {
  return (
    <div
      className="follows_modal"
      style={{
        display: IsmodalOpen && aboutModal == "follow" ? "flex" : "none",
      }}
    >
      {/* 팔로우 모달 위부분 */}
      <div className="fm_top_section">
        <div className="fm_user_section">
          <span className="fm_user_nick">서진형</span>
        </div>

        <span
          className="fm_modal_close"
          onClick={() => modalControl("hide", "follow")}
        >
          X
        </span>
      </div>

      {/* 팔로우 모달 타입 */}
      <div className="fm_follows_type">
        <div className="fm_type_follower">팔로워</div>
        <div className="fm_type_following">팔로잉</div>
      </div>
      {/* 팔로우 유저 리스트 */}
      <ul className="fm_follows_user_lists">
        {/* <li className="fm_follows_user">
          <Link className="fm_follows_user_link">
            <div className="fm_follows_user_thumb_box">
              <span className="fm_follows_user_thumb_circle">
                <img src={Bird}></img>
              </span>
            </div>
            <div className="fm_follows_user_names">
              <span className="fm_follows_nickname" style={{ fontWeight: 600 }}>
                카비요유
              </span>
              <span className="fm_follows_name">진형서</span>
            </div>
          </Link>
        </li>
        <li className="fm_follows_user">
          <Link className="fm_follows_user_link">
            <div className="fm_follows_user_thumb_box">
              <span className="fm_follows_user_thumb_circle">
                <img src={Bird}></img>
              </span>
            </div>
            <div className="fm_follows_user_names">
              <span className="fm_follows_nickname" style={{ fontWeight: 600 }}>
                카비요유
              </span>
              <span className="fm_follows_name">진형서</span>
            </div>
          </Link>
        </li> */}
      </ul>
    </div>
  );
}
