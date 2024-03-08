import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "../css/navbar.css";
import Logo from "../image/BCS-01.png";

import { useAuth } from "../context/authcontext.js";

export function Navbar() {
  const { user, logout, modalControl } = useAuth();
  const profilego = useRef(null);

  const [userDetailbox, SetuserDetailbox] = useState(false);

  return (
    <section id="navbar">
      {/* 로고부분 */}
      <div className="nav_home_logo_container">
        <Link to="/" className="nav_home_redirect">
          <img src={Logo} alt={""} />
        </Link>
      </div>
      {/* 검색부분 */}
      <div className="nav_search_container">
        <form className="nav_search_form">
          {/* input부분 */}
          <div className="nav_search_input_container">
            <input
              className="nav_search_input"
              type="text"
              placeholder="검색"
            />

            {/* <ul className='nav_search_recommand' style={{display: query != '' ? 'flex' : 'none'}}> */}
            {/* <li className="nav_search_recommand_li">
                                <Link to={`/results?q=${'hi'}`} className='nav_search_recommand_redirect'>
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                    <span className='nav_search_recommand_query'>hi</span>
                                </Link>
                            </li> */}

            {/* </ul> */}
          </div>
          {/* button부분 */}
          <div className="nav_search_btn_container">
            <button className="nav_search_btn">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </form>
      </div>

      {/* 유저 기능 부분 */}
      <div className="nav_user_func_container">
        <div className="nav_bcs_add_box">
          <button
            disabled={!user}
            style={{ color: !user ? "gray" : "black" }}
            className="nav_bcs_add_btn"
            title="커버영상 만들기"
            onClick={() => modalControl("show", "videomake")}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        <div className="nav_user_status_box">
          {!user ? (
            <button className="nav_login_btn">
              <Link to="/login">로그인</Link>
            </button>
          ) : (
            <div className="nav_user_info_container">
              <div className="nav_user_thumbnail_box">
                <button
                  className="nav_user_thumbnail_circle"
                  onFocus={() => SetuserDetailbox(true)}
                  onBlur={() => SetuserDetailbox(false)}
                >
                  <img src={user ? user.profile_image_url : ""} />
                </button>

                <div
                  className="nav_user_detail_condition_box"
                  style={{ display: userDetailbox ? "flex" : "none" }}
                >
                  <li>
                    <div onMouseDown={() => profilego.current.click()}>
                      <Link
                        ref={profilego}
                        to={`/profile/${user ? user.email : undefined}`}
                        className="my_profile_redirect"
                      >
                        <i className="fa-regular fa-user"></i>
                        프로필 보기
                      </Link>{" "}
                    </div>
                  </li>
                  <li>
                    <div className="" onMouseDown={() => logout()}>
                      <i className="fa-solid fa-right-from-bracket"></i>
                      로그아웃
                    </div>
                  </li>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
